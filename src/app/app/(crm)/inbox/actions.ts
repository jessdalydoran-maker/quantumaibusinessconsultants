"use server";

import { revalidatePath } from "next/cache";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { appendMessage } from "@/lib/inbox";
import { sendConversationEmail } from "@/lib/resend-email";
import { site } from "@/lib/site";

async function requireAccountContext() {
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) throw new Error("No account selected.");
  const supabase = await createClient();
  return { profile, accountId, supabase };
}

export async function replyToConversationAction(formData: FormData) {
  const { profile, accountId, supabase } = await requireAccountContext();
  const conversationId = String(formData.get("conversationId") || "");
  const body = String(formData.get("body") || "").trim();

  if (!conversationId || !body) {
    throw new Error("A message body is required.");
  }

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, channel, contact_id")
    .eq("id", conversationId)
    .eq("account_id", accountId)
    .single();

  if (!conversation) throw new Error("Conversation not found.");

  if (conversation.channel === "email") {
    if (!conversation.contact_id) {
      throw new Error("This email conversation has no linked contact to reply to.");
    }

    const { data: contact } = await supabase
      .from("contacts")
      .select("email")
      .eq("id", conversation.contact_id)
      .single();

    if (!contact?.email) {
      throw new Error("This contact has no email address on file.");
    }

    const { data: lastInbound } = await supabase
      .from("messages")
      .select("channel_metadata")
      .eq("conversation_id", conversationId)
      .eq("direction", "inbound")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const inboundSubject = (lastInbound?.channel_metadata as { subject?: string } | null)?.subject;
    const subject = inboundSubject
      ? inboundSubject.toLowerCase().startsWith("re:")
        ? inboundSubject
        : `Re: ${inboundSubject}`
      : `Re: Your message to ${site.name}`;

    await sendConversationEmail({
      conversationId,
      to: contact.email,
      subject,
      text: body,
    });
  }

  await appendMessage(supabase, {
    conversationId,
    accountId,
    direction: "outbound",
    senderType: "user",
    senderUserId: profile.id,
    body,
    channelMetadata: {},
  });

  revalidatePath(`/app/inbox/${conversationId}`);
  revalidatePath("/app/inbox");
}

export async function setConversationStatusAction(formData: FormData) {
  const { accountId, supabase } = await requireAccountContext();
  const conversationId = String(formData.get("conversationId") || "");
  const status = String(formData.get("status") || "");

  if (!["open", "closed"].includes(status)) {
    throw new Error("Invalid status.");
  }

  const { error } = await supabase
    .from("conversations")
    .update({ status })
    .eq("id", conversationId)
    .eq("account_id", accountId);

  if (error) throw new Error(error.message);

  revalidatePath(`/app/inbox/${conversationId}`);
  revalidatePath("/app/inbox");
}
