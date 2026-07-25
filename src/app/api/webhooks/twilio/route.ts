import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyTwilioSignature } from "@/lib/twilio";
import { findOrCreateContactByPhone, findOrCreateChannelConversation, appendMessage } from "@/lib/inbox";

export const runtime = "nodejs";

// Single shared inbound webhook for every account's SMS and WhatsApp — one
// dedicated Twilio number per account (see docs/build-log.md, Prompt 6)
// means Twilio's own `To` field is a direct, unambiguous routing key, so no
// per-account webhook URL is needed. Register this same URL on every
// account's Twilio number (SMS) and WhatsApp sender.
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const params: Record<string, string> = {};
  formData.forEach((value, key) => {
    params[key] = String(value);
  });

  const signature = request.headers.get("x-twilio-signature");
  const isValid = verifyTwilioSignature({ signature, url: request.url, body: params });

  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  const rawFrom = params.From || "";
  const rawTo = params.To || "";
  const body = params.Body || "";
  const messageSid = params.MessageSid || "";
  const numMedia = Number(params.NumMedia || "0");

  const isWhatsApp = rawFrom.startsWith("whatsapp:");
  const channel = isWhatsApp ? "whatsapp" : "sms";
  const fromNumber = rawFrom.replace("whatsapp:", "");
  const toNumber = rawTo.replace("whatsapp:", "");

  const admin = createAdminClient();

  const { data: account } = await admin
    .from("accounts")
    .select("id")
    .eq("twilio_phone_number", toNumber)
    .maybeSingle();

  if (!account) {
    console.error(`No account found for Twilio number ${toNumber} — message ignored.`);
    // 200 so Twilio doesn't retry; there's no tenant to route this to.
    return new NextResponse("<Response></Response>", {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  }

  const { id: contactId } = await findOrCreateContactByPhone(admin, account.id, fromNumber);
  const { conversationId } = await findOrCreateChannelConversation(admin, account.id, contactId, channel);

  await appendMessage(admin, {
    conversationId,
    accountId: account.id,
    direction: "inbound",
    senderType: "contact",
    body: body || (numMedia > 0 ? "(media message)" : ""),
    channelMetadata: { twilio_message_sid: messageSid, from: rawFrom, to: rawTo },
  });

  return new NextResponse("<Response></Response>", {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
