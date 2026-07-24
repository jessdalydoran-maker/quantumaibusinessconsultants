import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

// Shared by both unauthenticated entry points into the inbox — the public
// widget API routes and the inbound-email webhook — since both need the same
// "find or create the right contact/conversation" logic. Both callers pass in
// a service-role client (src/lib/supabase/admin.ts) because neither has a
// logged-in user session for RLS to key off; correctness here (never writing
// to the wrong account) is enforced by always requiring accountId explicitly,
// not by these helpers guessing it.

export async function findOrCreateContactByEmail(
  admin: SupabaseClient,
  accountId: string,
  email: string,
  fallbackName?: string
): Promise<{ id: string; isNew: boolean }> {
  const normalizedEmail = email.trim().toLowerCase();

  const { data: existing } = await admin
    .from("contacts")
    .select("id")
    .eq("account_id", accountId)
    .ilike("email", normalizedEmail)
    .limit(1)
    .maybeSingle();

  if (existing) {
    return { id: existing.id, isNew: false };
  }

  const name = fallbackName?.trim() || normalizedEmail.split("@")[0];
  const { data: created, error } = await admin
    .from("contacts")
    .insert({
      account_id: accountId,
      first_name: name,
      email: normalizedEmail,
      source: "email",
    })
    .select("id")
    .single();

  if (error || !created) {
    throw new Error(error?.message || "Could not create contact from inbound email.");
  }

  return { id: created.id, isNew: true };
}

export async function findOrCreateWebChatContact(
  admin: SupabaseClient,
  accountId: string,
  sessionId: string
): Promise<{ id: string; isNew: boolean }> {
  const { data: existingConversation } = await admin
    .from("conversations")
    .select("contact_id")
    .eq("account_id", accountId)
    .eq("channel", "web_chat")
    .eq("channel_metadata->>session_id", sessionId)
    .limit(1)
    .maybeSingle();

  if (existingConversation?.contact_id) {
    return { id: existingConversation.contact_id, isNew: false };
  }

  const { data: created, error } = await admin
    .from("contacts")
    .insert({
      account_id: accountId,
      first_name: "Web Visitor",
      source: "web_chat",
    })
    .select("id")
    .single();

  if (error || !created) {
    throw new Error(error?.message || "Could not create contact from web chat.");
  }

  return { id: created.id, isNew: true };
}

export async function findOrCreateWebChatConversation(
  admin: SupabaseClient,
  accountId: string,
  sessionId: string,
  visitor?: { name?: string; email?: string }
): Promise<{ conversationId: string; contactId: string; isNew: boolean }> {
  const { data: existing } = await admin
    .from("conversations")
    .select("id, contact_id")
    .eq("account_id", accountId)
    .eq("channel", "web_chat")
    .eq("channel_metadata->>session_id", sessionId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    return { conversationId: existing.id, contactId: existing.contact_id, isNew: false };
  }

  // A visitor who typed their email links to (or creates) the same contact
  // record an email conversation would use, rather than a disconnected
  // "Web Visitor" placeholder — same cross-channel contact-linking rule as email.
  const { id: contactId } = visitor?.email
    ? await findOrCreateContactByEmail(admin, accountId, visitor.email, visitor.name)
    : await findOrCreateWebChatContact(admin, accountId, sessionId);

  const { data: conversation, error } = await admin
    .from("conversations")
    .insert({
      account_id: accountId,
      contact_id: contactId,
      channel: "web_chat",
      channel_metadata: { session_id: sessionId },
    })
    .select("id")
    .single();

  if (error || !conversation) {
    throw new Error(error?.message || "Could not start web chat conversation.");
  }

  await logConversationStartActivity(admin, accountId, contactId, "New web chat conversation started.");

  return { conversationId: conversation.id, contactId, isNew: true };
}

export async function findOrCreateEmailConversation(
  admin: SupabaseClient,
  accountId: string,
  contactId: string
): Promise<{ conversationId: string; isNew: boolean }> {
  const { data: existing } = await admin
    .from("conversations")
    .select("id")
    .eq("account_id", accountId)
    .eq("contact_id", contactId)
    .eq("channel", "email")
    .eq("status", "open")
    .order("last_message_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    return { conversationId: existing.id, isNew: false };
  }

  const { data: conversation, error } = await admin
    .from("conversations")
    .insert({ account_id: accountId, contact_id: contactId, channel: "email" })
    .select("id")
    .single();

  if (error || !conversation) {
    throw new Error(error?.message || "Could not start email conversation.");
  }

  await logConversationStartActivity(admin, accountId, contactId, "New email conversation started.");

  return { conversationId: conversation.id, isNew: true };
}

export async function logConversationStartActivity(
  admin: SupabaseClient,
  accountId: string,
  contactId: string,
  content: string
) {
  await admin.from("activities").insert({
    account_id: accountId,
    contact_id: contactId,
    type: "system",
    content,
  });
}

export async function appendMessage(
  admin: SupabaseClient,
  params: {
    conversationId: string;
    accountId: string;
    direction: "inbound" | "outbound";
    senderType: "contact" | "user" | "ai";
    senderUserId?: string | null;
    body: string;
    channelMetadata?: Record<string, unknown>;
  }
) {
  const { error } = await admin.from("messages").insert({
    conversation_id: params.conversationId,
    account_id: params.accountId,
    direction: params.direction,
    sender_type: params.senderType,
    sender_user_id: params.senderUserId ?? null,
    body: params.body,
    channel_metadata: params.channelMetadata ?? {},
  });

  if (error) throw new Error(error.message);

  await admin
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", params.conversationId);
}
