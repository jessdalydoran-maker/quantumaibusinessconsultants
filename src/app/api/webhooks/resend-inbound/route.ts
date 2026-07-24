import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { findOrCreateEmailConversation, appendMessage } from "@/lib/inbox";

export const runtime = "nodejs";

const REPLY_TAG_PATTERN = /^reply\+([0-9a-f-]{36})@/i;

type ResendReceivedEvent = {
  type: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    message_id: string;
  };
};

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  const apiKey = process.env.RESEND_API_KEY;

  if (!webhookSecret || !apiKey) {
    console.error("RESEND_WEBHOOK_SECRET or RESEND_API_KEY not configured.");
    return NextResponse.json({ error: "Not configured." }, { status: 500 });
  }

  // Signature verification needs the exact raw body — never JSON.parse before this.
  const rawBody = await request.text();
  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing signature headers." }, { status: 401 });
  }

  const resend = new Resend(apiKey);

  try {
    resend.webhooks.verify({
      webhookSecret,
      payload: rawBody,
      headers: { id: svixId, timestamp: svixTimestamp, signature: svixSignature },
    });
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as ResendReceivedEvent;

  if (event.type !== "email.received") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const admin = createAdminClient();
  const { email_id, from, to, subject, message_id } = event.data;

  const taggedAddress = to.find((addr) => REPLY_TAG_PATTERN.test(addr));
  const tagMatch = taggedAddress?.match(REPLY_TAG_PATTERN);
  const conversationId = tagMatch?.[1];

  let resolvedConversationId: string | null = null;
  let resolvedAccountId: string | null = null;

  if (conversationId) {
    const { data: conversation } = await admin
      .from("conversations")
      .select("id, account_id")
      .eq("id", conversationId)
      .maybeSingle();

    if (conversation) {
      resolvedConversationId = conversation.id;
      resolvedAccountId = conversation.account_id;
    }
  }

  if (!resolvedConversationId) {
    // No (or an invalid) reply tag — most likely a first-touch email rather
    // than a reply. Fall back to matching the sender's address to exactly one
    // contact across all accounts; anything ambiguous goes to a manual-triage
    // holding conversation rather than guessing which tenant it belongs to.
    const { data: matches } = await admin
      .from("contacts")
      .select("id, account_id")
      .ilike("email", from.trim().toLowerCase());

    if (matches && matches.length === 1) {
      const matchedAccountId = matches[0].account_id;
      const { conversationId: newConvId } = await findOrCreateEmailConversation(
        admin,
        matchedAccountId,
        matches[0].id
      );
      resolvedAccountId = matchedAccountId;
      resolvedConversationId = newConvId;
    }
  }

  if (!resolvedConversationId || !resolvedAccountId) {
    await logUnmatchedEmail(admin, { from, subject, message_id, email_id });
    return NextResponse.json({ ok: true, unmatched: true });
  }

  const { data: fullEmail } = await resend.emails.receiving.get(email_id);
  const body = fullEmail?.text || fullEmail?.html || "(no readable content)";

  await appendMessage(admin, {
    conversationId: resolvedConversationId,
    accountId: resolvedAccountId,
    direction: "inbound",
    senderType: "contact",
    body,
    channelMetadata: { subject, message_id, resend_email_id: email_id, from },
  });

  return NextResponse.json({ ok: true });
}

async function logUnmatchedEmail(
  admin: ReturnType<typeof createAdminClient>,
  info: { from: string; subject: string; message_id: string; email_id: string }
) {
  const { data: platformAccount } = await admin
    .from("accounts")
    .select("id")
    .eq("is_platform_owner", true)
    .single();

  if (!platformAccount) return;

  const { data: conversation } = await admin
    .from("conversations")
    .insert({
      account_id: platformAccount.id,
      channel: "email",
      channel_metadata: { unmatched: true },
    })
    .select("id")
    .single();

  if (!conversation) return;

  await appendMessage(admin, {
    conversationId: conversation.id,
    accountId: platformAccount.id,
    direction: "inbound",
    senderType: "contact",
    body: `Unmatched inbound email — could not link to a known conversation or a unique contact.\n\nFrom: ${info.from}\nSubject: ${info.subject}\n\nNeeds manual triage.`,
    channelMetadata: info,
  });
}
