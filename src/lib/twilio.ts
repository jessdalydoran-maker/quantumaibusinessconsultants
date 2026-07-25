import "server-only";
import twilio from "twilio";
import { site } from "@/lib/site";

const STATUS_CALLBACK_URL = `${site.url}/api/webhooks/twilio-status`;

function getClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) {
    throw new Error("TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN are not configured.");
  }
  return twilio(accountSid, authToken);
}

export function verifyTwilioSignature(params: {
  signature: string | null;
  url: string;
  body: Record<string, string>;
}): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken || !params.signature) return false;
  return twilio.validateRequest(authToken, params.signature, params.url, params.body);
}

export async function sendSms(params: { from: string; to: string; body: string }) {
  const client = getClient();
  const message = await client.messages.create({
    from: params.from,
    to: params.to,
    body: params.body,
    statusCallback: STATUS_CALLBACK_URL,
  });
  return { sid: message.sid, status: message.status };
}

// WhatsApp uses the same Twilio number as SMS, addressed with a "whatsapp:"
// prefix on both from/to. `contentSid` sends a pre-approved template (required
// outside the 24-hour customer-service window); omit it for freeform replies
// inside the window.
export async function sendWhatsApp(params: {
  from: string;
  to: string;
  body?: string;
  contentSid?: string;
}) {
  const client = getClient();
  const message = await client.messages.create({
    from: `whatsapp:${params.from}`,
    to: `whatsapp:${params.to}`,
    statusCallback: STATUS_CALLBACK_URL,
    ...(params.contentSid ? { contentSid: params.contentSid } : { body: params.body || "" }),
  });
  return { sid: message.sid, status: message.status };
}

// WhatsApp's 24-hour customer-service window: a business can only send
// freeform replies within 24h of the customer's last inbound message;
// outside that, an approved template is required.
export function isWithinWhatsAppWindow(lastInboundAt: string | null): boolean {
  if (!lastInboundAt) return false;
  const elapsedMs = Date.now() - new Date(lastInboundAt).getTime();
  return elapsedMs < 24 * 60 * 60 * 1000;
}
