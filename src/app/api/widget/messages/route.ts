import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { findOrCreateWebChatConversation, appendMessage } from "@/lib/inbox";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// Public, unauthenticated endpoints the embeddable widget (public/widget.js)
// calls from any third-party site. No Supabase session exists here — the
// widgetKey is the only credential, and it only ever grants "read/write this
// one account's web-chat messages", nothing else. Every write still goes
// through the service-role client server-side; the browser never gets direct
// database access.

export const runtime = "nodejs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

async function resolveAccountId(widgetKey: string | null) {
  if (!widgetKey) return null;
  const admin = createAdminClient();
  const { data } = await admin.from("accounts").select("id").eq("widget_key", widgetKey).maybeSingle();
  return data?.id ?? null;
}

export async function GET(request: NextRequest) {
  const widgetKey = request.nextUrl.searchParams.get("widgetKey");
  const sessionId = request.nextUrl.searchParams.get("sessionId");

  if (!widgetKey || !sessionId) {
    return NextResponse.json({ error: "widgetKey and sessionId are required." }, { status: 400, headers: CORS_HEADERS });
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(`widget-get:${ip}:${widgetKey}`, 40, 60_000)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429, headers: CORS_HEADERS });
  }

  const accountId = await resolveAccountId(widgetKey);
  if (!accountId) {
    return NextResponse.json({ error: "Invalid widget key." }, { status: 404, headers: CORS_HEADERS });
  }

  const admin = createAdminClient();
  const { data: conversation } = await admin
    .from("conversations")
    .select("id, status")
    .eq("account_id", accountId)
    .eq("channel", "web_chat")
    .eq("channel_metadata->>session_id", sessionId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!conversation) {
    return NextResponse.json({ messages: [], status: null }, { headers: CORS_HEADERS });
  }

  const { data: messages } = await admin
    .from("messages")
    .select("id, direction, sender_type, body, created_at")
    .eq("conversation_id", conversation.id)
    .order("created_at", { ascending: true });

  return NextResponse.json(
    { messages: messages ?? [], status: conversation.status },
    { headers: CORS_HEADERS }
  );
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400, headers: CORS_HEADERS });
  }

  const { widgetKey, sessionId, body: messageBody, name, email } = body as Record<string, unknown>;

  if (
    typeof widgetKey !== "string" ||
    typeof sessionId !== "string" ||
    typeof messageBody !== "string" ||
    !messageBody.trim() ||
    messageBody.length > 4000
  ) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400, headers: CORS_HEADERS });
  }

  if (!checkRateLimit(`widget-post:${ip}:${widgetKey}`, 15, 30_000)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429, headers: CORS_HEADERS });
  }

  const accountId = await resolveAccountId(widgetKey);
  if (!accountId) {
    return NextResponse.json({ error: "Invalid widget key." }, { status: 404, headers: CORS_HEADERS });
  }

  const admin = createAdminClient();

  const { conversationId } = await findOrCreateWebChatConversation(admin, accountId, sessionId, {
    name: typeof name === "string" ? name : undefined,
    email: typeof email === "string" ? email : undefined,
  });

  await appendMessage(admin, {
    conversationId,
    accountId,
    direction: "inbound",
    senderType: "contact",
    body: messageBody.trim(),
  });

  return NextResponse.json({ ok: true }, { headers: CORS_HEADERS });
}
