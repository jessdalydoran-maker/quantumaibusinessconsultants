import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sendConversationEmail } from "@/lib/resend-email";
import { sendSms, sendWhatsApp, isWithinWhatsAppWindow } from "@/lib/twilio";
import { site } from "@/lib/site";
import { accountHasFeature } from "@/lib/features";

const MODEL = process.env.CONVERSATION_AI_MODEL || "claude-sonnet-5";

// Confidence is a real risk area for a client-facing auto-reply feature, and
// Claude's API doesn't expose a numeric confidence score — so "confidence"
// here is a deliberately simple, conservative heuristic, not a model-derived
// figure. Any of these phrases appearing in the AI's OWN drafted reply is
// treated as "not confident enough to auto-send," falling back to a draft
// for a human to review instead. This is a judgment call, flagged as asked:
// erring toward more escalation than strictly necessary is the intended
// failure mode (a bad auto-reply going out is worse than being cautious).
const LOW_CONFIDENCE_PHRASES = [
  "i'm not sure",
  "i don't know",
  "i'm not able to help",
  "i can't help with that",
  "speak to a human",
  "speak with a member of the team",
  "let me check with",
  "i'll need to check",
  "not certain",
];

function containsEscalationKeyword(text: string, keywords: string[]): string | null {
  const lower = text.toLowerCase();
  return keywords.find((kw) => kw.trim() && lower.includes(kw.trim().toLowerCase())) ?? null;
}

function looksLowConfidence(reply: string): boolean {
  const lower = reply.toLowerCase();
  return LOW_CONFIDENCE_PHRASES.some((phrase) => lower.includes(phrase));
}

const bookAppointmentTool: Anthropic.Tool = {
  name: "book_appointment",
  description:
    "Book an appointment for this contact if they've agreed on a specific date and time. Checks for a conflicting appointment first.",
  input_schema: {
    type: "object",
    properties: {
      title: { type: "string", description: "Short title, e.g. 'Consultation call'" },
      starts_at: { type: "string", description: "ISO 8601 start time" },
      ends_at: { type: "string", description: "ISO 8601 end time" },
    },
    required: ["title", "starts_at", "ends_at"],
  },
};

const updateContactTagTool: Anthropic.Tool = {
  name: "update_contact_tag",
  description: "Tag this contact based on how the conversation is going, e.g. 'hot lead', 'not interested'.",
  input_schema: {
    type: "object",
    properties: {
      tag_name: { type: "string" },
    },
    required: ["tag_name"],
  },
};

const createDealTool: Anthropic.Tool = {
  name: "create_deal",
  description: "Start a pipeline entry if this conversation indicates a genuine sales opportunity.",
  input_schema: {
    type: "object",
    properties: {
      title: { type: "string" },
      value: { type: "number", description: "Estimated deal value, 0 if unknown" },
    },
    required: ["title"],
  },
};

async function logAiAction(
  supabase: SupabaseClient,
  accountId: string,
  conversationId: string | null,
  action: "drafted_reply" | "sent_reply" | "escalated" | "booked_appointment" | "tagged_contact" | "created_deal",
  detail: Record<string, unknown>
) {
  await supabase.from("ai_actions_log").insert({ account_id: accountId, conversation_id: conversationId, action, detail });
}

// Exported so Prompt 9's Retell function-call webhook can book through the
// exact same logic (conflict check, activity log, ai_actions_log entry)
// rather than a second implementation of "book an appointment." conversationId
// is nullable because a phone call (Prompt 9) has no inbox conversation to
// link the ai_actions_log entry to.
export async function executeBookAppointment(
  supabase: SupabaseClient,
  accountId: string,
  conversationId: string | null,
  contactId: string | null,
  input: { title: string; starts_at: string; ends_at: string }
): Promise<string> {
  const { data: conflicts } = await supabase
    .from("appointments")
    .select("id")
    .eq("account_id", accountId)
    .eq("status", "confirmed")
    .lt("starts_at", input.ends_at)
    .gt("ends_at", input.starts_at);

  if (conflicts && conflicts.length > 0) {
    return "That time conflicts with an existing appointment — ask the contact for a different time.";
  }

  const { error } = await supabase.from("appointments").insert({
    account_id: accountId,
    contact_id: contactId,
    title: input.title,
    starts_at: input.starts_at,
    ends_at: input.ends_at,
  });

  if (error) return `Could not book the appointment: ${error.message}`;

  if (contactId) {
    await supabase.from("activities").insert({
      account_id: accountId,
      contact_id: contactId,
      type: "system",
      content: `AI booked an appointment: "${input.title}" at ${input.starts_at}.`,
    });
  }

  await logAiAction(supabase, accountId, conversationId, "booked_appointment", input);
  return `Booked "${input.title}" at ${input.starts_at}.`;
}

async function executeUpdateContactTag(
  supabase: SupabaseClient,
  accountId: string,
  conversationId: string,
  contactId: string | null,
  input: { tag_name: string }
): Promise<string> {
  if (!contactId) return "No contact linked to this conversation yet — cannot tag.";

  let { data: tag } = await supabase
    .from("tags")
    .select("id")
    .eq("account_id", accountId)
    .ilike("name", input.tag_name)
    .maybeSingle();

  if (!tag) {
    const { data: created } = await supabase
      .from("tags")
      .insert({ account_id: accountId, name: input.tag_name })
      .select("id")
      .single();
    tag = created;
  }

  if (!tag) return "Could not create or find that tag.";

  await supabase.from("contact_tags").insert({ contact_id: contactId, tag_id: tag.id }).select().maybeSingle();
  await logAiAction(supabase, accountId, conversationId, "tagged_contact", input);
  return `Tagged contact "${input.tag_name}".`;
}

async function executeCreateDeal(
  supabase: SupabaseClient,
  accountId: string,
  conversationId: string,
  contactId: string | null,
  input: { title: string; value?: number }
): Promise<string> {
  const { data: pipeline } = await supabase
    .from("pipelines")
    .select("id")
    .eq("account_id", accountId)
    .order("id")
    .limit(1)
    .maybeSingle();

  if (!pipeline) return "No pipeline exists for this account yet — cannot create a deal.";

  const { data: stage } = await supabase
    .from("pipeline_stages")
    .select("id")
    .eq("pipeline_id", pipeline.id)
    .order("sort_order")
    .limit(1)
    .maybeSingle();

  if (!stage) return "This pipeline has no stages yet — cannot create a deal.";

  const { error } = await supabase.from("deals").insert({
    account_id: accountId,
    pipeline_id: pipeline.id,
    stage_id: stage.id,
    contact_id: contactId,
    title: input.title,
    value: input.value ?? 0,
  });

  if (error) return `Could not create the deal: ${error.message}`;

  if (contactId) {
    await supabase.from("activities").insert({
      account_id: accountId,
      contact_id: contactId,
      type: "system",
      content: `AI created a deal: "${input.title}".`,
    });
  }

  await logAiAction(supabase, accountId, conversationId, "created_deal", input);
  return `Created deal "${input.title}".`;
}

async function sendOutbound(
  supabase: SupabaseClient,
  accountId: string,
  conversationId: string,
  channel: string,
  contactId: string | null,
  body: string
): Promise<{ sent: boolean; channelMetadata: Record<string, unknown>; reason?: string }> {
  if (!contactId) return { sent: false, channelMetadata: {}, reason: "no_contact" };

  if (channel === "email") {
    const { data: contact } = await supabase.from("contacts").select("email").eq("id", contactId).single();
    if (!contact?.email) return { sent: false, channelMetadata: {}, reason: "no_email" };

    const { data: lastInbound } = await supabase
      .from("messages")
      .select("channel_metadata")
      .eq("conversation_id", conversationId)
      .eq("direction", "inbound")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const subject = (lastInbound?.channel_metadata as { subject?: string } | null)?.subject;

    await sendConversationEmail({
      conversationId,
      to: contact.email,
      subject: subject ? (subject.toLowerCase().startsWith("re:") ? subject : `Re: ${subject}`) : `Re: Your message to ${site.name}`,
      text: body,
    });
    return { sent: true, channelMetadata: {} };
  }

  if (channel === "sms" || channel === "whatsapp") {
    const [{ data: contact }, { data: account }] = await Promise.all([
      supabase.from("contacts").select("phone").eq("id", contactId).single(),
      supabase.from("accounts").select("twilio_phone_number").eq("id", accountId).single(),
    ]);
    if (!contact?.phone || !account?.twilio_phone_number) {
      return { sent: false, channelMetadata: {}, reason: "no_phone_or_number" };
    }

    if (channel === "whatsapp") {
      const { data: lastInbound } = await supabase
        .from("messages")
        .select("created_at")
        .eq("conversation_id", conversationId)
        .eq("direction", "inbound")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!isWithinWhatsAppWindow(lastInbound?.created_at ?? null)) {
        // Outside the window the AI cannot freeform-send (same rule as a human) —
        // fall back to a draft so a person picks/sends an approved template.
        return { sent: false, channelMetadata: {}, reason: "outside_whatsapp_window" };
      }
      const { sid, status } = await sendWhatsApp({ from: account.twilio_phone_number, to: contact.phone, body });
      return { sent: true, channelMetadata: { twilio_message_sid: sid, delivery_status: status } };
    }

    const { sid, status } = await sendSms({ from: account.twilio_phone_number, to: contact.phone, body });
    return { sent: true, channelMetadata: { twilio_message_sid: sid, delivery_status: status } };
  }

  // web_chat — just an outbound row; the widget picks it up via polling.
  return { sent: true, channelMetadata: {} };
}

export async function maybeTriggerAiReply(
  supabase: SupabaseClient,
  accountId: string,
  conversationId: string
) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return;

  // Defense in depth: the settings page and its save action already gate on
  // this, but check again here too, since this is the one place that could
  // spend real API cost / send a real message on the account's behalf.
  if (!(await accountHasFeature(supabase, accountId, "conversation_ai"))) return;

  const { data: settings } = await supabase
    .from("ai_settings")
    .select("mode, business_context, escalation_keywords")
    .eq("account_id", accountId)
    .maybeSingle();

  if (!settings || settings.mode === "off") return;

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, channel, contact_id")
    .eq("id", conversationId)
    .single();
  if (!conversation) return;

  const { data: messages } = await supabase
    .from("messages")
    .select("direction, sender_type, body, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(30);
  if (!messages || messages.length === 0) return;

  const lastInbound = [...messages].reverse().find((m) => m.direction === "inbound");
  if (!lastInbound) return;

  const escalationHit = containsEscalationKeyword(lastInbound.body, settings.escalation_keywords ?? []);

  let contactContext = "";
  if (conversation.contact_id) {
    const [{ data: contact }, { data: contactTags }, { data: deals }] = await Promise.all([
      supabase.from("contacts").select("first_name, last_name, company").eq("id", conversation.contact_id).single(),
      supabase
        .from("contact_tags")
        .select("tags(name)")
        .eq("contact_id", conversation.contact_id),
      supabase.from("deals").select("title, status").eq("contact_id", conversation.contact_id),
    ]);
    const tagNames = (contactTags ?? [])
      .map((t) => (t.tags as unknown as { name: string } | null)?.name)
      .filter(Boolean);
    contactContext = `Contact: ${contact?.first_name ?? "Unknown"} ${contact?.last_name ?? ""} ${contact?.company ? `(${contact.company})` : ""}. Tags: ${tagNames.join(", ") || "none"}. Deals: ${(deals ?? []).map((d) => `${d.title} (${d.status})`).join(", ") || "none"}.`;
  }

  const systemPrompt = `You are an AI assistant replying to inbound messages on behalf of ${site.name} for one of its clients. Reply as that business, in a plain, helpful, on-brand tone — never mention that you are an AI unless directly asked.

## What this business does / FAQs / booking info
${settings.business_context || "(no business context configured yet)"}

## This contact
${contactContext || "No contact record linked yet."}

## Hard rules
- Never invent facts, prices, or capabilities not in the context above.
- If you can't help confidently, say so plainly and offer to have a human follow up — do not guess.
- Use the tools available when the conversation genuinely calls for them (booking a clearly agreed time, tagging a clear signal, starting a deal for a clear sales opportunity) — do not overuse them.`;

  const anthropic = new Anthropic({ apiKey });
  const tools = [bookAppointmentTool, updateContactTagTool, createDealTool];
  const conversationMessages: Anthropic.MessageParam[] = messages.map((m) => ({
    role: m.direction === "inbound" ? "user" : "assistant",
    content: m.body,
  }));

  let response;
  try {
    response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 700,
      system: systemPrompt,
      tools,
      messages: conversationMessages,
    });
  } catch (error) {
    console.error("Conversation AI call failed", error);
    return;
  }

  let guard = 0;
  while (response.stop_reason === "tool_use" && guard < 4) {
    guard += 1;
    conversationMessages.push({ role: "assistant", content: response.content });
    const toolResults: Anthropic.ToolResultBlockParam[] = [];

    for (const block of response.content) {
      if (block.type !== "tool_use") continue;
      let result = "Unknown tool.";
      if (block.name === "book_appointment") {
        result = await executeBookAppointment(
          supabase,
          accountId,
          conversationId,
          conversation.contact_id,
          block.input as never
        );
      } else if (block.name === "update_contact_tag") {
        result = await executeUpdateContactTag(
          supabase,
          accountId,
          conversationId,
          conversation.contact_id,
          block.input as never
        );
      } else if (block.name === "create_deal") {
        result = await executeCreateDeal(
          supabase,
          accountId,
          conversationId,
          conversation.contact_id,
          block.input as never
        );
      }
      toolResults.push({ type: "tool_result", tool_use_id: block.id, content: result });
    }

    conversationMessages.push({ role: "user", content: toolResults });
    response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 700,
      system: systemPrompt,
      tools,
      messages: conversationMessages,
    });
  }

  const textBlock = response.content.find((b) => b.type === "text");
  const replyText = textBlock && textBlock.type === "text" ? textBlock.text : "";
  if (!replyText.trim()) return;

  const shouldEscalate = !!escalationHit || looksLowConfidence(replyText);
  const wantsAutoSend = settings.mode === "auto_reply" && !shouldEscalate;

  if (wantsAutoSend) {
    const result = await sendOutbound(supabase, accountId, conversationId, conversation.channel, conversation.contact_id, replyText);
    if (result.sent) {
      await supabase.from("messages").insert({
        conversation_id: conversationId,
        account_id: accountId,
        direction: "outbound",
        sender_type: "ai",
        body: replyText,
        channel_metadata: result.channelMetadata,
      });
      await supabase.from("conversations").update({ last_message_at: new Date().toISOString() }).eq("id", conversationId);
      await logAiAction(supabase, accountId, conversationId, "sent_reply", { body: replyText });
      return;
    }
    // Sending failed for a structural reason (no contact email/phone, outside
    // WhatsApp window, etc.) — fall through to drafting instead of losing the reply.
  }

  await supabase.from("ai_drafts").upsert(
    {
      account_id: accountId,
      conversation_id: conversationId,
      body: replyText,
      reason: shouldEscalate ? "escalated" : "draft_only",
    },
    { onConflict: "conversation_id" }
  );

  await logAiAction(
    supabase,
    accountId,
    conversationId,
    shouldEscalate ? "escalated" : "drafted_reply",
    { body: replyText, escalation_keyword: escalationHit }
  );
}
