import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyTwilioSignature } from "@/lib/twilio";

export const runtime = "nodejs";

// Delivery status callback (sent/delivered/failed/undelivered) for outbound
// SMS/WhatsApp messages. Register this as the StatusCallback URL when
// sending (see src/app/app/(crm)/inbox/actions.ts) — status is stored on the
// message's own channel_metadata since `messages` has no dedicated status
// column (matches the existing email pattern, which also uses metadata for
// provider-specific detail rather than new columns per channel).
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const params: Record<string, string> = {};
  formData.forEach((value, key) => {
    params[key] = String(value);
  });

  const signature = request.headers.get("x-twilio-signature");
  if (!verifyTwilioSignature({ signature, url: request.url, body: params })) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  const messageSid = params.MessageSid || params.SmsSid;
  const status = params.MessageStatus || params.SmsStatus;
  if (!messageSid || !status) {
    return NextResponse.json({ ok: true });
  }

  const admin = createAdminClient();
  const { data: message } = await admin
    .from("messages")
    .select("id, channel_metadata")
    .eq("channel_metadata->>twilio_message_sid", messageSid)
    .maybeSingle();

  if (message) {
    await admin
      .from("messages")
      .update({
        channel_metadata: {
          ...(message.channel_metadata as Record<string, unknown>),
          delivery_status: status,
        },
      })
      .eq("id", message.id);
  }

  return NextResponse.json({ ok: true });
}
