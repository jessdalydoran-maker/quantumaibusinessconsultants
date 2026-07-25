import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyRetellSignature } from "@/lib/retell";
import { findOrCreateContactByPhone } from "@/lib/inbox";

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
    .select("id, account_id")
    .eq("provider_agent_id", call.agent_id)
    .maybeSingle();

  if (!voiceAgent) {
    console.error(`No voice_agents row for Retell agent ${call.agent_id} — call event ignored.`);
    return NextResponse.json({ ok: true, unmatched: true });
  }

  let contactId: string | null = null;
  if (call.from_number) {
    const result = await findOrCreateContactByPhone(admin, voiceAgent.account_id, call.from_number);
    contactId = result.id;
  }

  const durationSeconds =
    call.start_timestamp && call.end_timestamp
      ? Math.round((call.end_timestamp - call.start_timestamp) / 1000)
      : null;

  const status =
    call.disconnection_reason === "transfer" ? "transferred_to_human" : call.disconnection_reason === "error" ? "failed" : "completed";

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
      content: `Phone call ${status === "completed" ? "completed" : status.replace("_", " ")}${
        durationSeconds ? ` (${Math.round(durationSeconds / 60)} min)` : ""
      }.`,
    });
  }

  return NextResponse.json({ ok: true });
}
