import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyRetellSignature } from "@/lib/retell";
import { executeBookAppointment } from "@/lib/conversation-ai";
import { findOrCreateContactByPhone } from "@/lib/inbox";

export const runtime = "nodejs";

// Retell calls this mid-call when the agent invokes the book_appointment
// custom function (configured in src/lib/retell.ts). FLAGGED alongside the
// rest of the Retell integration: the exact shape Retell posts for a custom
// function call (field names below) follows their documented convention but
// is not confirmed against a live call in this session — verify against a
// real test call once an account exists, and adjust field names if Retell's
// actual payload differs.
type RetellFunctionCallPayload = {
  call: { call_id: string; agent_id: string; from_number?: string };
  name: string;
  args: { title: string; starts_at: string; ends_at: string };
};

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-retell-signature");

  if (!verifyRetellSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as RetellFunctionCallPayload;
  const admin = createAdminClient();

  const { data: voiceAgent } = await admin
    .from("voice_agents")
    .select("account_id")
    .eq("provider_agent_id", payload.call.agent_id)
    .maybeSingle();

  if (!voiceAgent) {
    return NextResponse.json({ result: "This agent isn't linked to an account." }, { status: 200 });
  }

  if (payload.name !== "book_appointment") {
    return NextResponse.json({ result: "Unknown function." });
  }

  let contactId: string | null = null;
  if (payload.call.from_number) {
    const result = await findOrCreateContactByPhone(admin, voiceAgent.account_id, payload.call.from_number);
    contactId = result.id;
  }

  // ai_actions_log.conversation_id is a real FK to `conversations` — a phone
  // call is not one, so this must stay null (a Retell call_id would violate
  // the foreign key and fail the insert silently swallowed by executeBookAppointment).
  const result = await executeBookAppointment(admin, voiceAgent.account_id, null, contactId, payload.args);

  return NextResponse.json({ result });
}
