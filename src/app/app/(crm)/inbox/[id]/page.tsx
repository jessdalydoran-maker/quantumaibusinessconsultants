import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { NoAccountSelected } from "../../NoAccountSelected";
import { FeatureLocked } from "../../FeatureLocked";
import { accountHasFeature } from "@/lib/features";
import {
  replyToConversationAction,
  setConversationStatusAction,
  sendWhatsAppTemplateAction,
  sendAiDraftAction,
  discardAiDraftAction,
} from "../actions";
import { isWithinWhatsAppWindow } from "@/lib/twilio";
import { ThreadAutoRefresh } from "./ThreadAutoRefresh";
import { Card } from "@/components/crm/ui/Card";
import { Button } from "@/components/crm/ui/Button";
import { Textarea, Select } from "@/components/crm/ui/Field";
import { Badge } from "@/components/crm/ui/Badge";

export const metadata = { robots: { index: false, follow: false } };

const CHANNEL_LABEL: Record<string, string> = {
  web_chat: "Web Chat",
  email: "Email",
  sms: "SMS",
  whatsapp: "WhatsApp",
};

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) return <NoAccountSelected />;

  const supabase = await createClient();

  if (!(await accountHasFeature(supabase, accountId, "inbox"))) {
    return <FeatureLocked feature="inbox" />;
  }

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, channel, status, contact_id, contacts(id, first_name, last_name, email)")
    .eq("id", id)
    .eq("account_id", accountId)
    .single();

  if (!conversation) notFound();

  const contact = conversation.contacts as unknown as
    | { id: string; first_name: string; last_name: string | null; email: string | null }
    | null;

  const { data: messages } = await supabase
    .from("messages")
    .select("id, direction, sender_type, body, created_at, channel_metadata")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true });

  const { data: draft } = await supabase
    .from("ai_drafts")
    .select("id, body, reason")
    .eq("conversation_id", id)
    .maybeSingle();

  let outsideWhatsAppWindow = false;
  let approvedTemplates: { id: string; name: string }[] = [];

  if (conversation.channel === "whatsapp") {
    const lastInbound = [...(messages ?? [])].reverse().find((m) => m.direction === "inbound");
    outsideWhatsAppWindow = !isWithinWhatsAppWindow(lastInbound?.created_at ?? null);

    if (outsideWhatsAppWindow) {
      const { data: templates } = await supabase
        .from("message_templates")
        .select("id, name")
        .eq("account_id", accountId)
        .eq("approved_status", "approved")
        .not("provider_content_sid", "is", null);
      approvedTemplates = templates ?? [];
    }
  }

  return (
    <div>
      <ThreadAutoRefresh />
      <Link href="/app/inbox" className="text-sm text-text-muted hover:text-gold">
        ← Back to Inbox
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="font-display text-2xl text-text">
            {contact ? `${contact.first_name} ${contact.last_name || ""}`.trim() : "Unknown contact"}
          </h1>
          <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-text-muted">
            <Badge tone="gold">{CHANNEL_LABEL[conversation.channel] ?? conversation.channel}</Badge>
            {contact?.email ? <span>{contact.email}</span> : null}
            {contact?.id && (
              <>
                <span>·</span>
                <Link href={`/app/contacts/${contact.id}`} className="text-gold hover:underline">
                  View contact
                </Link>
              </>
            )}
          </p>
        </div>
        <form action={setConversationStatusAction}>
          <input type="hidden" name="conversationId" value={conversation.id} />
          <input type="hidden" name="status" value={conversation.status === "open" ? "closed" : "open"} />
          <Button type="submit" variant="secondary" size="sm">
            {conversation.status === "open" ? "Close Conversation" : "Reopen Conversation"}
          </Button>
        </form>
      </div>

      <Card className="mt-6 space-y-3 p-4">
        {(messages ?? []).map((message) => (
          <div
            key={message.id}
            className={`max-w-[80%] rounded-xl p-3 text-sm shadow-sm ${
              message.direction === "inbound"
                ? "ml-auto bg-gradient-to-b from-gold-soft to-gold text-bg"
                : "bg-bg-raised/70 text-text"
            }`}
          >
            {message.sender_type === "ai" && (
              <span className="mb-1 inline-block rounded-full bg-bg/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                AI-sent
              </span>
            )}
            <p className="whitespace-pre-wrap">{message.body}</p>
            <p
              className={`mt-1 text-[10px] uppercase tracking-wide ${
                message.direction === "inbound" ? "text-bg/70" : "text-text-muted"
              }`}
            >
              {message.sender_type} · {new Date(message.created_at).toLocaleString("en-GB")}
              {(message.channel_metadata as { delivery_status?: string } | null)?.delivery_status &&
                ` · ${(message.channel_metadata as { delivery_status?: string }).delivery_status}`}
            </p>
          </div>
        ))}
        {(!messages || messages.length === 0) && (
          <p className="text-center text-sm text-text-muted">No messages yet.</p>
        )}
      </Card>

      {draft && (
        <Card className="mt-4 border-gold/30 bg-gold/[0.06] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold">
            AI Draft {draft.reason === "escalated" ? "(escalated — review before sending)" : ""}
          </p>
          <form action={sendAiDraftAction} className="mt-3">
            <input type="hidden" name="conversationId" value={conversation.id} />
            <Textarea name="body" required rows={4} defaultValue={draft.body} />
            <div className="mt-2 flex gap-3">
              <Button type="submit">Approve &amp; Send</Button>
            </div>
          </form>
          <form action={discardAiDraftAction} className="mt-2">
            <input type="hidden" name="conversationId" value={conversation.id} />
            <button type="submit" className="text-xs text-text-muted hover:text-red-400">
              Discard draft
            </button>
          </form>
        </Card>
      )}

      {outsideWhatsAppWindow ? (
        <Card className="mt-4 border-gold/30 bg-gold/[0.06] p-4">
          <p className="text-sm text-gold">
            It&apos;s been more than 24 hours since this contact last messaged. WhatsApp requires
            an approved template to start a new business-initiated message.
          </p>
          {approvedTemplates.length > 0 ? (
            <form action={sendWhatsAppTemplateAction} className="mt-3 flex flex-wrap gap-3">
              <input type="hidden" name="conversationId" value={conversation.id} />
              <Select name="templateId" required className="w-auto">
                {approvedTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </Select>
              <Button type="submit">Send Template</Button>
            </form>
          ) : (
            <p className="mt-2 text-sm text-text-muted">
              No approved templates yet — add one at{" "}
              <Link href="/app/settings/templates" className="text-gold hover:underline">
                Settings → Templates
              </Link>
              .
            </p>
          )}
        </Card>
      ) : (
        <form action={replyToConversationAction} className="mt-4">
          <input type="hidden" name="conversationId" value={conversation.id} />
          <Textarea
            name="body"
            required
            rows={3}
            placeholder={conversation.channel === "email" ? "Write your reply email…" : "Write a reply…"}
          />
          <Button type="submit" className="mt-2">
            {conversation.channel === "email" ? "Send Email" : "Send Reply"}
          </Button>
        </form>
      )}
    </div>
  );
}
