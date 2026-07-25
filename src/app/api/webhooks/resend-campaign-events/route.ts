import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

// Separate webhook + signing secret from the inbox's resend-inbound webhook
// (Prompt 6) — same Resend account, but a distinct webhook subscription in
// the Resend dashboard, since this one is subscribed to delivery/open/click/
// bounce events for campaign sends specifically, not inbound mail.
// NOT auto-created via the API this time (unlike the inbound one earlier in
// this project) — creating a new webhook against a live account is a real
// side-effecting action, so it's listed as a manual step in the final
// summary rather than done automatically inside this autonomous batch run.
export async function POST(request: NextRequest) {
  const webhookSecret = process.env.RESEND_CAMPAIGN_WEBHOOK_SECRET;
  const apiKey = process.env.INBOX_RESEND_API_KEY;
  if (!webhookSecret || !apiKey) {
    return NextResponse.json({ error: "Not configured." }, { status: 500 });
  }

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

  const event = JSON.parse(rawBody) as { type: string; data: { email_id: string } };
  const admin = createAdminClient();

  const { data: recipient } = await admin
    .from("campaign_recipients")
    .select("id, status")
    .eq("resend_email_id", event.data.email_id)
    .maybeSingle();

  if (!recipient) return NextResponse.json({ ok: true, unmatched: true });

  if (event.type === "email.bounced") {
    await admin.from("campaign_recipients").update({ status: "bounced" }).eq("id", recipient.id);
  } else if (event.type === "email.opened") {
    await admin
      .from("campaign_recipients")
      .update({ opened_at: new Date().toISOString() })
      .eq("id", recipient.id);
  } else if (event.type === "email.clicked") {
    await admin
      .from("campaign_recipients")
      .update({ clicked_at: new Date().toISOString() })
      .eq("id", recipient.id);
  }

  return NextResponse.json({ ok: true });
}
