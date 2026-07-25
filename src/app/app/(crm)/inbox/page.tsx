import Link from "next/link";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { NoAccountSelected } from "../NoAccountSelected";
import { FeatureLocked } from "../FeatureLocked";
import { accountHasFeature } from "@/lib/features";
import { isWithinWhatsAppWindow } from "@/lib/twilio";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { Select } from "@/components/crm/ui/Field";
import { Button } from "@/components/crm/ui/Button";
import { Badge } from "@/components/crm/ui/Badge";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { IconInbox } from "@/components/crm/ui/icons";

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
      <PageHeader eyebrow="Messaging" title="Inbox" description="Every conversation across web chat, email, SMS, and WhatsApp in one place." />

      <form method="get" className="mt-6 flex flex-wrap gap-3">
        <Select name="channel" defaultValue={channel || ""} className="w-auto">
          <option value="">All channels</option>
          <option value="web_chat">Web Chat</option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="whatsapp">WhatsApp</option>
        </Select>
        <Select name="status" defaultValue={status || ""} className="w-auto">
          <option value="">Open + Closed</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </Select>
        <Button type="submit" variant="secondary">Filter</Button>
      </form>

      <div className="mt-6 divide-y divide-border overflow-hidden rounded-xl border border-border bg-bg-alt/50">
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
              className="flex items-center gap-4 p-4 transition-colors hover:bg-bg-raised/50"
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-border bg-bg text-lg">
                {CHANNEL_ICON[conversation.channel] ?? "💬"}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={`truncate text-sm ${isUnread ? "font-semibold text-text" : "text-text"}`}>
                    {contact ? `${contact.first_name} ${contact.last_name || ""}`.trim() : "Unknown contact"}
                  </p>
                  {isUnread && <span className="h-2 w-2 flex-shrink-0 rounded-full bg-gold" />}
                  {conversation.status === "closed" && <Badge tone="neutral">Closed</Badge>}
                  {templateRequired && <Badge tone="gold">Template required</Badge>}
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
          <div className="p-2">
            <EmptyState icon={<IconInbox width={20} height={20} />} title="No conversations yet" description="New messages from your website widget, email, SMS, or WhatsApp will land here." />
          </div>
        )}
      </div>
    </div>
  );
}
