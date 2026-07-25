"use server";

import { revalidatePath } from "next/cache";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { appendMessage } from "@/lib/inbox";
import { sendConversationEmail } from "@/lib/resend-email";
import { sendSms, sendWhatsApp, isWithinWhatsAppWindow } from "@/lib/twilio";
import { site } from "@/lib/site";
import { accountHasFeature } from "@/lib/features";

async function requireAccountContext() {
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) throw new Error("No account selected.");
  const supabase = await createClient();
  if (!(await accountHasFeature(supabase, accountId, "inbox"))) {
    throw new Error("Inbox isn't available on this account's current plan.");
  }
  return { profile, accountId, supabase };
}

export async function replyToConversationAction(formData: FormData) {
  const { profile, accountId, supabase } = await requireAccountContext();
  const conversationId = String(formData.get("conversationId") || "");
  const body = String(formData.get("body") || "").trim();

  if (!conversationId || !body) {
    throw new Error("A message body is required.");
  }

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, channel, contact_id")
    .eq("id", conversationId)
    .eq("account_id", accountId)
    .single();

  if (!conversation) throw new Error("Conversation not found.");

  let outboundChannelMetadata: Record<string, unknown> = {};

  if (conversation.channel === "sms" || conversation.channel === "whatsapp") {
    if (!(await accountHasFeature(supabase, accountId, "sms_whatsapp"))) {
      throw new Error("SMS/WhatsApp isn't available on this account's current plan.");
    }
    if (!conversation.contact_id) {
      throw new Error("This conversation has no linked contact to reply to.");
    }

    const [{ data: contact }, { data: account }] = await Promise.all([
      supabase.from("contacts").select("phone").eq("id", conversation.contact_id).single(),
      supabase.from("accounts").select("twilio_phone_number").eq("id", accountId).single(),
    ]);

    if (!contact?.phone) throw new Error("This contact has no phone number on file.");
    if (!account?.twilio_phone_number) {
      throw new Error("This account has no Twilio number configured yet (see Settings).");
    }

    if (conversation.channel === "whatsapp") {
      const { data: lastInbound } = await supabase
        .from("messages")
        .select("created_at")
        .eq("conversation_id", conversationId)
        .eq("direction", "inbound")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!isWithinWhatsAppWindow(lastInbound?.created_at ?? null)) {
        throw new Error(
          "It's been more than 24 hours since this contact last messaged — WhatsApp requires an approved template to start a new business-initiated message. Use \"Send Template\" instead of a freeform reply."
        );
      }

      const { sid, status } = await sendWhatsApp({
        from: account.twilio_phone_number,
        to: contact.phone,
        body,
      });
      outboundChannelMetadata = { twilio_message_sid: sid, delivery_status: status };
    } else {
      const { sid, status } = await sendSms({
        from: account.twilio_phone_number,
        to: contact.phone,
        body,
      });
      outboundChannelMetadata = { twilio_message_sid: sid, delivery_status: status };
    }
  }

  if (conversation.channel === "email") {
    if (!conversation.contact_id) {
      throw new Error("This email conversation has no linked contact to reply to.");
    }

    const { data: contact } = await supabase
      .from("contacts")
      .select("email")
      .eq("id", conversation.contact_id)
      .single();

    if (!contact?.email) {
      throw new Error("This contact has no email address on file.");
    }

    const { data: lastInbound } = await supabase
      .from("messages")
      .select("channel_metadata")
      .eq("conversation_id", conversationId)
      .eq("direction", "inbound")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const inboundSubject = (lastInbound?.channel_metadata as { subject?: string } | null)?.subject;
    const subject = inboundSubject
      ? inboundSubject.toLowerCase().startsWith("re:")
        ? inboundSubject
        : `Re: ${inboundSubject}`
      : `Re: Your message to ${site.name}`;

    await sendConversationEmail({
      conversationId,
      to: contact.email,
      subject,
      text: body,
    });
  }

  await appendMessage(supabase, {
    conversationId,
    accountId,
    direction: "outbound",
    senderType: "user",
    senderUserId: profile.id,
    body,
    channelMetadata: outboundChannelMetadata,
  });

  revalidatePath(`/app/inbox/${conversationId}`);
  revalidatePath("/app/inbox");
}

// For WhatsApp conversations outside the 24-hour customer-service window —
// sends a pre-approved template via its provider content SID rather than
// freeform text, since WhatsApp will reject (or Twilio will refuse to send)
// an unstructured business-initiated message outside that window.
export async function sendWhatsAppTemplateAction(formData: FormData) {
  const { profile, accountId, supabase } = await requireAccountContext();
  if (!(await accountHasFeature(supabase, accountId, "sms_whatsapp"))) {
    throw new Error("SMS/WhatsApp isn't available on this account's current plan.");
  }
  const conversationId = String(formData.get("conversationId") || "");
  const templateId = String(formData.get("templateId") || "");

  const [{ data: conversation }, { data: template }] = await Promise.all([
    supabase
      .from("conversations")
      .select("id, channel, contact_id")
      .eq("id", conversationId)
      .eq("account_id", accountId)
      .single(),
    supabase
      .from("message_templates")
      .select("id, body, approved_status, provider_content_sid")
      .eq("id", templateId)
      .eq("account_id", accountId)
      .single(),
  ]);

  if (!conversation || conversation.channel !== "whatsapp") {
    throw new Error("This isn't a WhatsApp conversation.");
  }
  if (!template || template.approved_status !== "approved" || !template.provider_content_sid) {
    throw new Error("That template isn't approved and ready to send yet.");
  }
  if (!conversation.contact_id) {
    throw new Error("This conversation has no linked contact.");
  }

  const [{ data: contact }, { data: account }] = await Promise.all([
    supabase.from("contacts").select("phone").eq("id", conversation.contact_id).single(),
    supabase.from("accounts").select("twilio_phone_number").eq("id", accountId).single(),
  ]);

  if (!contact?.phone) throw new Error("This contact has no phone number on file.");
  if (!account?.twilio_phone_number) {
    throw new Error("This account has no Twilio number configured yet (see Settings).");
  }

  const { sid, status } = await sendWhatsApp({
    from: account.twilio_phone_number,
    to: contact.phone,
    contentSid: template.provider_content_sid,
  });

  await appendMessage(supabase, {
    conversationId,
    accountId,
    direction: "outbound",
    senderType: "user",
    senderUserId: profile.id,
    body: template.body,
    channelMetadata: { twilio_message_sid: sid, delivery_status: status, template_id: template.id },
  });

  revalidatePath(`/app/inbox/${conversationId}`);
  revalidatePath("/app/inbox");
}

export async function setConversationStatusAction(formData: FormData) {
  const { accountId, supabase } = await requireAccountContext();
  const conversationId = String(formData.get("conversationId") || "");
  const status = String(formData.get("status") || "");

  if (!["open", "closed"].includes(status)) {
    throw new Error("Invalid status.");
  }

  const { error } = await supabase
    .from("conversations")
    .update({ status })
    .eq("id", conversationId)
    .eq("account_id", accountId);

  if (error) throw new Error(error.message);

  revalidatePath(`/app/inbox/${conversationId}`);
  revalidatePath("/app/inbox");
}

// A human clicking Send on an AI-suggested draft (possibly after editing it)
// is exactly the human-in-the-loop guarantee draft_only mode is for — it
// goes out through the same send path a manually-typed reply would, so it's
// recorded as sent by the person who clicked Send, with a note that it
// started life as an AI draft.
export async function sendAiDraftAction(formData: FormData) {
  const conversationId = String(formData.get("conversationId") || "");
  const body = String(formData.get("body") || "").trim();
  if (!conversationId || !body) throw new Error("A message body is required.");

  const replyFormData = new FormData();
  replyFormData.set("conversationId", conversationId);
  replyFormData.set("body", body);
  await replyToConversationAction(replyFormData);

  const { accountId, supabase } = await requireAccountContext();
  await supabase.from("ai_drafts").delete().eq("conversation_id", conversationId).eq("account_id", accountId);
}

export async function discardAiDraftAction(formData: FormData) {
  const { accountId, supabase } = await requireAccountContext();
  const conversationId = String(formData.get("conversationId") || "");
  await supabase.from("ai_drafts").delete().eq("conversation_id", conversationId).eq("account_id", accountId);
  revalidatePath(`/app/inbox/${conversationId}`);
}
