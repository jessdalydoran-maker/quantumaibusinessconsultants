import "server-only";
import crypto from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { site } from "@/lib/site";

export type SegmentDefinition = {
  tags?: string[];
  exclude_tags?: string[];
};

const CAMPAIGN_FROM_DOMAIN = process.env.INBOUND_EMAIL_DOMAIN;

// Signed so a visitor can't unsubscribe an arbitrary contact by guessing IDs
// in the URL — only a link that was actually generated for that contact
// (i.e. one they were actually sent) will verify.
function getUnsubscribeSecret(): string {
  const secret = process.env.UNSUBSCRIBE_SECRET;
  if (!secret) throw new Error("UNSUBSCRIBE_SECRET is not configured.");
  return secret;
}

export function unsubscribeToken(accountId: string, contactId: string): string {
  return crypto
    .createHmac("sha256", getUnsubscribeSecret())
    .update(`${accountId}:${contactId}`)
    .digest("hex")
    .slice(0, 32);
}

export function verifyUnsubscribeToken(accountId: string, contactId: string, token: string): boolean {
  const expected = unsubscribeToken(accountId, contactId);
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token.padEnd(32, "0").slice(0, 32)));
}

export function unsubscribeUrl(accountId: string, contactId: string): string {
  const token = unsubscribeToken(accountId, contactId);
  return `${site.url}/unsubscribe?account=${accountId}&contact=${contactId}&token=${token}`;
}

// Resolves a segment_definition (tag include/exclude) into the list of
// contacts that should receive a campaign — always excluding anyone in
// `unsubscribes` for this account, no exceptions.
export async function resolveSegment(
  supabase: SupabaseClient,
  accountId: string,
  segment: SegmentDefinition
): Promise<{ id: string; first_name: string; email: string }[]> {
  const { data: unsubscribed } = await supabase
    .from("unsubscribes")
    .select("contact_id")
    .eq("account_id", accountId);
  const unsubscribedIds = new Set((unsubscribed ?? []).map((u) => u.contact_id));

  let includeIds: Set<string> | null = null;

  if (segment.tags && segment.tags.length > 0) {
    const { data: tagRows } = await supabase
      .from("tags")
      .select("id")
      .eq("account_id", accountId)
      .in("name", segment.tags);
    const tagIds = (tagRows ?? []).map((t) => t.id);

    const { data: taggedContacts } = tagIds.length
      ? await supabase.from("contact_tags").select("contact_id").in("tag_id", tagIds)
      : { data: [] as { contact_id: string }[] };
    includeIds = new Set((taggedContacts ?? []).map((c) => c.contact_id));
  }

  let excludeIds = new Set<string>();
  if (segment.exclude_tags && segment.exclude_tags.length > 0) {
    const { data: tagRows } = await supabase
      .from("tags")
      .select("id")
      .eq("account_id", accountId)
      .in("name", segment.exclude_tags);
    const tagIds = (tagRows ?? []).map((t) => t.id);

    const { data: excludedContacts } = tagIds.length
      ? await supabase.from("contact_tags").select("contact_id").in("tag_id", tagIds)
      : { data: [] as { contact_id: string }[] };
    excludeIds = new Set((excludedContacts ?? []).map((c) => c.contact_id));
  }

  const { data: contacts } = await supabase
    .from("contacts")
    .select("id, first_name, email")
    .eq("account_id", accountId)
    .not("email", "is", null);

  return (contacts ?? []).filter(
    (c) =>
      !!c.email &&
      !unsubscribedIds.has(c.id) &&
      !excludeIds.has(c.id) &&
      (includeIds === null || includeIds.has(c.id))
  );
}

// Batches sends (Resend's batch endpoint, up to 100 emails/call) rather than
// firing every recipient as a separate request — respects Resend's rate
// limits and is dramatically fewer round trips for a large segment.
export async function sendCampaignBatch(
  recipients: { contactId: string; email: string; firstName: string }[],
  params: { accountId: string; subject: string; htmlBody: string }
): Promise<Map<string, { resendId?: string; error?: string }>> {
  const apiKey = process.env.INBOX_RESEND_API_KEY;
  if (!apiKey) throw new Error("INBOX_RESEND_API_KEY is not configured.");
  if (!CAMPAIGN_FROM_DOMAIN) throw new Error("INBOUND_EMAIL_DOMAIN is not configured.");

  const resend = new Resend(apiKey);
  const results = new Map<string, { resendId?: string; error?: string }>();

  const CHUNK_SIZE = 100;
  for (let i = 0; i < recipients.length; i += CHUNK_SIZE) {
    const chunk = recipients.slice(i, i + CHUNK_SIZE);

    const emails = chunk.map((r) => ({
      from: `${site.name} <campaigns@${CAMPAIGN_FROM_DOMAIN}>`,
      to: [r.email],
      subject: params.subject,
      html: `${params.htmlBody}<hr/><p style="font-size:12px;color:#888;">You're receiving this because you're a contact of ${site.name}. <a href="${unsubscribeUrl(params.accountId, r.contactId)}">Unsubscribe</a>.</p>`,
    }));

    try {
      const { data, error } = await resend.batch.send(emails);
      if (error || !data) {
        chunk.forEach((r) => results.set(r.contactId, { error: error?.message || "Batch send failed." }));
      } else {
        chunk.forEach((r, idx) => results.set(r.contactId, { resendId: data.data[idx]?.id }));
      }
    } catch (error) {
      chunk.forEach((r) =>
        results.set(r.contactId, { error: error instanceof Error ? error.message : "Batch send failed." })
      );
    }

    // Small pause between chunks — a simple, conservative rate-limit
    // backstop rather than tuned to this account's exact per-second limit.
    if (i + CHUNK_SIZE < recipients.length) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return results;
}

// Shared by the manual "Send Now" action and the scheduled-campaigns cron —
// same send path either way, just a different trigger.
export async function executeCampaignSend(
  supabase: SupabaseClient,
  accountId: string,
  campaignId: string
): Promise<{ ok: boolean; error?: string }> {
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, subject, body, segment_definition, status")
    .eq("id", campaignId)
    .eq("account_id", accountId)
    .single();

  if (!campaign) return { ok: false, error: "Campaign not found." };
  if (campaign.status === "sent" || campaign.status === "sending") {
    return { ok: false, error: "Campaign already sent or sending." };
  }
  if (!campaign.subject || !campaign.body) {
    return { ok: false, error: "Campaign has no subject/body." };
  }

  await supabase.from("campaigns").update({ status: "sending" }).eq("id", campaignId);

  const recipients = await resolveSegment(supabase, accountId, campaign.segment_definition);

  if (recipients.length === 0) {
    await supabase.from("campaigns").update({ status: "failed" }).eq("id", campaignId);
    return { ok: false, error: "No matching, subscribed contacts to send to." };
  }

  const { data: recipientRows, error: insertError } = await supabase
    .from("campaign_recipients")
    .insert(recipients.map((r) => ({ campaign_id: campaignId, contact_id: r.id })))
    .select("id, contact_id");

  if (insertError || !recipientRows) {
    await supabase.from("campaigns").update({ status: "failed" }).eq("id", campaignId);
    return { ok: false, error: insertError?.message || "Could not create recipient rows." };
  }

  const results = await sendCampaignBatch(
    recipients.map((r) => ({ contactId: r.id, email: r.email, firstName: r.first_name })),
    { accountId, subject: campaign.subject, htmlBody: campaign.body }
  );

  await Promise.all(
    recipientRows.map((row) => {
      const result = results.get(row.contact_id);
      return supabase
        .from("campaign_recipients")
        .update(
          result?.resendId
            ? { status: "sent", resend_email_id: result.resendId, sent_at: new Date().toISOString() }
            : { status: "failed", error: result?.error || "Unknown error" }
        )
        .eq("id", row.id);
    })
  );

  await supabase
    .from("campaigns")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", campaignId);

  return { ok: true };
}
