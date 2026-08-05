import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyRetellSignature } from "@/lib/retell";
import { findOrCreateContactByPhone } from "@/lib/inbox";
import { sendCallSummaryEmail } from "@/lib/resend-email";

export const runtime = "nodejs";

type RetellCallEvent = {
  event: "call_started" | "call_ended" | "call_analyzed";
  call: {
    call_id: string;
    agent_id: string;
    from_number?: string;
    to_number?: string;
    direction?: "inbound" | "outbound";
    start_timestamp?: number;
    end_timestamp?: number;
    disconnection_reason?: string;
    transcript?: string;
    recording_url?: string;
    call_analysis?: { call_summary?: string; call_successful?: boolean };
  };
};

// Handles both call_ended (transcript, duration, disconnection reason) and
// call_analyzed (adds the summary — Retell sends this as a separate, later
// event) by upserting the same `calls` row keyed on provider_call_id.
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-retell-signature");

  if (!verifyRetellSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as RetellCallEvent;
  const { call } = event;
  const admin = createAdminClient();

  const { data: voiceAgent } = await admin
    .from("voice_agents")
    .select("id, account_id, notification_email")
    .eq("provider_agent_id", call.agent_id)
    .maybeSingle();

  if (!voiceAgent) {
    console.error(`No voice_agents row for Retell agent ${call.agent_id} — call event ignored.`);
    return NextResponse.json({ ok: true, unmatched: true });
  }

  let contactId: string | null = null;
  let contactName: string | null = null;
  if (call.from_number) {
    const result = await findOrCreateContactByPhone(admin, voiceAgent.account_id, call.from_number);
    contactId = result.id;
  }

  const durationSeconds =
    call.start_timestamp && call.end_timestamp
      ? Math.round((call.end_timestamp - call.start_timestamp) / 1000)
      : null;

  const status = call.disconnection_reason === "error" ? "failed" : "completed";
  const resolved = call.call_analysis?.call_successful ?? null;

  const { data: existing } = await admin
    .from("calls")
    .select("id")
    .eq("provider_call_id", call.call_id)
    .maybeSingle();

  const row = {
    account_id: voiceAgent.account_id,
    voice_agent_id: voiceAgent.id,
    contact_id: contactId,
    direction: (call.direction as "inbound" | "outbound") ?? "inbound",
    from_number: call.from_number ?? null,
    to_number: call.to_number ?? null,
    duration_seconds: durationSeconds,
    status,
    resolved,
    transcript: call.transcript ?? null,
    summary: call.call_analysis?.call_summary ?? null,
    recording_url: call.recording_url ?? null,
    provider_call_id: call.call_id,
  };

  if (existing) {
    await admin.from("calls").update(row).eq("id", existing.id);
  } else {
    await admin.from("calls").insert(row);
  }

  if (contactId && event.event !== "call_started") {
    await admin.from("activities").insert({
      account_id: voiceAgent.account_id,
      contact_id: contactId,
      type: "system",
      content: `Phone call ${status}${durationSeconds ? ` (${Math.round(durationSeconds / 60)} min)` : ""}.`,
    });
  }

  // call_analyzed is Retell's final event for a call — it's the first point
  // the summary and call_successful (used for the "needs follow-up" flag)
  // are available, so that's when the one notification email per call goes
  // out, not on call_ended. A missing/misconfigured notification_email
  // shouldn't fail the webhook ack (Retell would retry the whole event).
  if (event.event === "call_analyzed" && voiceAgent.notification_email) {
    const recipients = voiceAgent.notification_email
      .split(",")
      .map((e: string) => e.trim())
      .filter(Boolean);

    if (recipients.length > 0) {
      try {
        const { data: account } = await admin
          .from("accounts")
          .select("name")
          .eq("id", voiceAgent.account_id)
          .single();

        if (contactId) {
          const { data: contact } = await admin
            .from("contacts")
            .select("first_name, last_name")
            .eq("id", contactId)
            .maybeSingle();
          contactName = contact ? `${contact.first_name} ${contact.last_name || ""}`.trim() : null;
        }

        await sendCallSummaryEmail({
          to: recipients,
          accountName: account?.name ?? "Your business",
          callerName: contactName,
          fromNumber: call.from_number ?? null,
          durationSeconds,
          summary: call.call_analysis?.call_summary ?? null,
          transcript: call.transcript ?? null,
          resolved,
        });
      } catch (error) {
        console.error("Failed to send call summary email", error);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
