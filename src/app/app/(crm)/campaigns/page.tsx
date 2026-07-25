import Link from "next/link";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { NoAccountSelected } from "../NoAccountSelected";
import { FeatureLocked } from "../FeatureLocked";
import { accountHasFeature } from "@/lib/features";
import { createCampaignAction } from "./actions";

export const metadata = { robots: { index: false, follow: false } };

export default async function CampaignsPage() {
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) return <NoAccountSelected />;

  const supabase = await createClient();
  if (!(await accountHasFeature(supabase, accountId, "broadcast_email"))) {
    return <FeatureLocked feature="broadcast_email" />;
  }

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("id, name, status, scheduled_for, sent_at, created_at")
    .eq("account_id", accountId)
    .order("created_at", { ascending: false });

  const campaignIds = (campaigns ?? []).map((c) => c.id);
  const { data: recipientCounts } = campaignIds.length
    ? await supabase.from("campaign_recipients").select("campaign_id, status").in("campaign_id", campaignIds)
    : { data: [] as { campaign_id: string; status: string }[] };

  const sentCountByCampaign = new Map<string, number>();
  (recipientCounts ?? []).forEach((r) => {
    if (r.status === "sent") {
      sentCountByCampaign.set(r.campaign_id, (sentCountByCampaign.get(r.campaign_id) ?? 0) + 1);
    }
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-text">Campaigns</h1>
      </div>

      <details className="mt-6 rounded-sm border border-border bg-bg-alt p-4">
        <summary className="cursor-pointer text-sm text-text-muted">New Campaign</summary>
        <form action={createCampaignAction} className="mt-4 flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs uppercase tracking-wide text-text-muted">
              Campaign Name
            </label>
            <input
              name="name"
              required
              placeholder="July newsletter"
              className="mt-1 w-64 rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-sm bg-gold px-5 py-2 text-sm font-medium text-bg hover:bg-gold-soft"
          >
            Create Draft
          </button>
        </form>
      </details>

      <div className="mt-6 overflow-x-auto rounded-sm border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-alt text-text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Sent</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {(campaigns ?? []).map((c) => (
              <tr key={c.id} className="border-t border-border hover:bg-bg-alt">
                <td className="px-4 py-3">
                  <Link href={`/app/campaigns/${c.id}`} className="text-text hover:text-gold">
                    {c.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-text-muted capitalize">{c.status}</td>
                <td className="px-4 py-3 text-text-muted">{sentCountByCampaign.get(c.id) ?? "—"}</td>
                <td className="px-4 py-3 text-text-muted">
                  {c.sent_at
                    ? new Date(c.sent_at).toLocaleDateString("en-GB")
                    : c.scheduled_for
                      ? `Scheduled: ${new Date(c.scheduled_for).toLocaleString("en-GB")}`
                      : new Date(c.created_at).toLocaleDateString("en-GB")}
                </td>
              </tr>
            ))}
            {(!campaigns || campaigns.length === 0) && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-text-muted">
                  No campaigns yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
