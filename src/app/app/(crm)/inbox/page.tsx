import Link from "next/link";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { NoAccountSelected } from "../NoAccountSelected";
import { FeatureLocked } from "../FeatureLocked";
import { accountHasFeature } from "@/lib/features";
import { isWithinWhatsAppWindow } from "@/lib/twilio";

export const metadata = { robots: { index: false, follow: false } };

const CHANNEL_ICON: Record<string, string> = {
  web_chat: "💬",
  email: "✉️",
  sms: "📱",
  whatsapp: "🟢",
};

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ channel?: string; status?: string }>;
}) {
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) return <NoAccountSelected />;

  const { channel, status } = await searchParams;
  const supabase = await createClient();

  if (!(await accountHasFeature(supabase, accountId, "inbox"))) {
    return <FeatureLocked feature="inbox" />;
  }

  let query = supabase
    .from("conversations")
    .select("id, channel, status, last_message_at, contact_id, contacts(first_name, last_name)")
    .eq("account_id", accountId)
    .order("last_message_at", { ascending: false })
    .limit(100);

  if (channel) query = query.eq("channel", channel);
  if (status) query = query.eq("status", status);

  const { data: conversations } = await query;
  const conversationIds = (conversations ?? []).map((c) => c.id);

  const { data: recentMessages } = conversationIds.length
    ? await supabase
        .from("messages")
        .select("conversation_id, body, direction, created_at")
        .in("conversation_id", conversationIds)
        .order("created_at", { ascending: false })
    : { data: [] as { conversation_id: string; body: string; direction: string; created_at: string }[] };

  const lastMessageByConversation = new Map<
    string,
    { body: string; direction: string }
  >();
  const lastInboundAtByConversation = new Map<string, string>();
  (recentMessages ?? []).forEach((m) => {
    if (!lastMessageByConversation.has(m.conversation_id)) {
      lastMessageByConversation.set(m.conversation_id, { body: m.body, direction: m.direction });
    }
    if (m.direction === "inbound" && !lastInboundAtByConversation.has(m.conversation_id)) {
      lastInboundAtByConversation.set(m.conversation_id, m.created_at);
    }
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-text">Inbox</h1>

      <form method="get" className="mt-6 flex flex-wrap gap-3">
        <select
          name="channel"
          defaultValue={channel || ""}
          className="rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
        >
          <option value="">All channels</option>
          <option value="web_chat">Web Chat</option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
        <select
          name="status"
          defaultValue={status || ""}
          className="rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
        >
          <option value="">Open + Closed</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
        <button
          type="submit"
          className="rounded-sm border border-border px-4 py-2 text-sm text-text-muted hover:border-gold hover:text-gold"
        >
          Filter
        </button>
      </form>

      <div className="mt-6 divide-y divide-border rounded-sm border border-border">
        {(conversations ?? []).map((conversation) => {
          const contact = conversation.contacts as unknown as
            | { first_name: string; last_name: string | null }
            | null;
          const last = lastMessageByConversation.get(conversation.id);
          const isUnread = last?.direction === "inbound";
          const templateRequired =
            conversation.channel === "whatsapp" &&
            !isWithinWhatsAppWindow(lastInboundAtByConversation.get(conversation.id) ?? null);

          return (
            <Link
              key={conversation.id}
              href={`/app/inbox/${conversation.id}`}
              className="flex items-center gap-4 p-4 hover:bg-bg-alt"
            >
              <span className="text-xl">{CHANNEL_ICON[conversation.channel] ?? "💬"}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={`truncate text-sm ${isUnread ? "font-semibold text-text" : "text-text"}`}>
                    {contact ? `${contact.first_name} ${contact.last_name || ""}`.trim() : "Unknown contact"}
                  </p>
                  {isUnread && <span className="h-2 w-2 flex-shrink-0 rounded-full bg-gold" />}
                  {conversation.status === "closed" && (
                    <span className="flex-shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] uppercase text-text-muted">
                      Closed
                    </span>
                  )}
                  {templateRequired && (
                    <span className="flex-shrink-0 rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] uppercase text-gold">
                      Template required
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-text-muted">{last?.body ?? "No messages yet"}</p>
              </div>
              <span className="flex-shrink-0 text-xs text-text-muted">
                {new Date(conversation.last_message_at).toLocaleString("en-GB", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </Link>
          );
        })}
        {(!conversations || conversations.length === 0) && (
          <p className="p-6 text-center text-sm text-text-muted">No conversations yet.</p>
        )}
      </div>
    </div>
  );
}
