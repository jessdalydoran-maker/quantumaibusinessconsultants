import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { NoAccountSelected } from "../../NoAccountSelected";
import { FeatureLocked } from "../../FeatureLocked";
import { accountHasFeature } from "@/lib/features";
import { resolveSegment } from "@/lib/campaigns";
import {
  updateCampaignAction,
  sendCampaignNowAction,
  scheduleCampaignAction,
  deleteCampaignAction,
} from "../actions";

export const metadata = { robots: { index: false, follow: false } };

export default async function CampaignDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ includeTags?: string; excludeTags?: string }>;
}) {
  const { id } = await params;
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) return <NoAccountSelected />;

  const supabase = await createClient();
  if (!(await accountHasFeature(supabase, accountId, "broadcast_email"))) {
    return <FeatureLocked feature="broadcast_email" />;
  }

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, name, subject, body, segment_definition, status, scheduled_for, sent_at")
    .eq("id", id)
    .eq("account_id", accountId)
    .single();

  if (!campaign) notFound();

  const { data: allTags } = await supabase.from("tags").select("name").eq("account_id", accountId).order("name");

  const sp = await searchParams;
  const storedSegment = (campaign.segment_definition as { tags?: string[]; exclude_tags?: string[] }) ?? {};
  const includeTags = sp.includeTags !== undefined ? sp.includeTags.split(",").filter(Boolean) : storedSegment.tags ?? [];
  const excludeTags = sp.excludeTags !== undefined ? sp.excludeTags.split(",").filter(Boolean) : storedSegment.exclude_tags ?? [];

  const matching = await resolveSegment(supabase, accountId, { tags: includeTags, exclude_tags: excludeTags });

  const isDraft = campaign.status === "draft";

  const { data: recipients } = campaign.status !== "draft"
    ? await supabase
        .from("campaign_recipients")
        .select("status, contacts(first_name, last_name, email)")
        .eq("campaign_id", id)
        .order("status")
    : { data: [] as { status: string; contacts: unknown }[] };

  return (
    <div>
      <Link href="/app/campaigns" className="text-sm text-text-muted hover:text-gold">
        ← Back to Campaigns
      </Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-text">{campaign.name}</h1>
        <span className="rounded-full border border-border px-3 py-1 text-xs uppercase text-text-muted">
          {campaign.status}
        </span>
      </div>

      {isDraft ? (
        <>
          <section className="mt-8">
            <h2 className="font-display text-lg text-text">Audience</h2>
            <form method="get" className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs uppercase tracking-wide text-text-muted">
                  Include contacts tagged
                </label>
                <select
                  name="includeTags"
                  multiple
                  defaultValue={includeTags}
                  className="mt-1 h-24 w-full rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
                >
                  {(allTags ?? []).map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-text-muted">
                  Exclude contacts tagged
                </label>
                <select
                  name="excludeTags"
                  multiple
                  defaultValue={excludeTags}
                  className="mt-1 h-24 w-full rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
                >
                  {(allTags ?? []).map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-text-muted sm:col-span-2">
                Leave &quot;include&quot; empty to target every subscribed contact with an email
                address. Multi-select: cmd/ctrl-click to pick more than one tag.
              </p>
              <button
                type="submit"
                className="w-fit rounded-sm border border-border px-4 py-2 text-sm text-text-muted hover:border-gold hover:text-gold sm:col-span-2"
              >
                Preview Count
              </button>
            </form>
            <p className="mt-3 text-sm text-text">
              <strong className="text-gold">{matching.length}</strong> matching, subscribed
              contact{matching.length === 1 ? "" : "s"} with an email address.
            </p>
          </section>

          <form action={updateCampaignAction} className="mt-8 grid max-w-2xl gap-4">
            <input type="hidden" name="campaignId" value={campaign.id} />
            <input type="hidden" name="includeTags" value={includeTags.join(",")} />
            <input type="hidden" name="excludeTags" value={excludeTags.join(",")} />
            <div>
              <label className="block text-xs uppercase tracking-wide text-text-muted">Subject</label>
              <input
                name="subject"
                required
                defaultValue={campaign.subject}
                className="mt-1 w-full rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-text-muted">
                Body (HTML)
              </label>
              <textarea
                name="body"
                required
                rows={10}
                defaultValue={campaign.body}
                className="mt-1 w-full rounded-sm border border-border bg-bg-alt px-3 py-2 font-mono text-xs text-text focus:border-gold focus:outline-none"
              />
              <p className="mt-1 text-xs text-text-muted">
                An unsubscribe footer is added automatically to every send — don&apos;t include
                your own.
              </p>
            </div>
            <button
              type="submit"
              className="w-fit rounded-sm border border-gold px-5 py-2 text-sm font-medium text-gold hover:bg-gold hover:text-bg"
            >
              Save Draft
            </button>
          </form>

          <div className="mt-8 flex flex-wrap gap-4">
            <form action={sendCampaignNowAction}>
              <input type="hidden" name="campaignId" value={campaign.id} />
              <button
                type="submit"
                className="rounded-sm bg-gold px-5 py-2 text-sm font-medium text-bg hover:bg-gold-soft"
              >
                Send Now
              </button>
            </form>
            <form action={scheduleCampaignAction} className="flex items-end gap-2">
              <input type="hidden" name="campaignId" value={campaign.id} />
              <div>
                <label className="block text-xs uppercase tracking-wide text-text-muted">
                  Schedule for
                </label>
                <input
                  type="datetime-local"
                  name="scheduledFor"
                  className="mt-1 rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="rounded-sm border border-border px-4 py-2 text-sm text-text-muted hover:border-gold hover:text-gold"
              >
                Schedule
              </button>
            </form>
            <form action={deleteCampaignAction}>
              <input type="hidden" name="campaignId" value={campaign.id} />
              <button type="submit" className="text-sm text-text-muted hover:text-red-400">
                Delete Draft
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className="mt-8">
          {campaign.status === "scheduled" && campaign.scheduled_for && (
            <p className="text-sm text-text-muted">
              Scheduled to send {new Date(campaign.scheduled_for).toLocaleString("en-GB")}.
            </p>
          )}
          {campaign.sent_at && (
            <p className="text-sm text-text-muted">
              Sent {new Date(campaign.sent_at).toLocaleString("en-GB")}.
            </p>
          )}
          <h2 className="mt-6 font-display text-lg text-text">Recipients</h2>
          <div className="mt-3 overflow-x-auto rounded-sm border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg-alt text-text-muted">
                <tr>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {(recipients ?? []).map((r, i) => {
                  const contact = r.contacts as unknown as
                    | { first_name: string; last_name: string | null; email: string }
                    | null;
                  return (
                    <tr key={i} className="border-t border-border">
                      <td className="px-4 py-3 text-text">
                        {contact ? `${contact.first_name} ${contact.last_name || ""}`.trim() : "—"}
                      </td>
                      <td className="px-4 py-3 text-text-muted">{contact?.email ?? "—"}</td>
                      <td className="px-4 py-3 capitalize text-text-muted">{r.status}</td>
                    </tr>
                  );
                })}
                {(!recipients || recipients.length === 0) && (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-text-muted">
                      No recipients recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
