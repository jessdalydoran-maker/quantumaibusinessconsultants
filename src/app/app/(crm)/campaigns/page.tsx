import Link from "next/link";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { NoAccountSelected } from "../NoAccountSelected";
import { FeatureLocked } from "../FeatureLocked";
import { accountHasFeature } from "@/lib/features";
import { createCampaignAction } from "./actions";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { Input, Label } from "@/components/crm/ui/Field";
import { Button } from "@/components/crm/ui/Button";
import { Table, THead, Th, TBody, Tr, Td } from "@/components/crm/ui/Table";
import { Badge } from "@/components/crm/ui/Badge";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { IconCampaigns } from "@/components/crm/ui/icons";

export const metadata = { robots: { index: false, follow: false } };

const STATUS_TONE: Record<string, "green" | "gold" | "neutral"> = {
  sent: "green",
  scheduled: "gold",
  draft: "neutral",
};

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
      <PageHeader eyebrow="Email" title="Campaigns" description="Broadcast emails sent to segments of your contacts." />

      <details className="mt-6 rounded-xl border border-border bg-bg-alt/50 p-4">
        <summary className="cursor-pointer text-sm text-text-muted">New Campaign</summary>
        <form action={createCampaignAction} className="mt-4 flex flex-wrap items-end gap-3">
          <div>
            <Label htmlFor="name">Campaign Name</Label>
            <Input id="name" name="name" required placeholder="July newsletter" className="w-64" />
          </div>
          <Button type="submit">Create Draft</Button>
        </form>
      </details>

      <div className="mt-6">
        {campaigns && campaigns.length > 0 ? (
          <Table>
            <THead>
              <Th>Name</Th>
              <Th>Status</Th>
              <Th>Sent</Th>
              <Th>Date</Th>
            </THead>
            <TBody>
              {campaigns.map((c) => (
                <Tr key={c.id}>
                  <Td>
                    <Link href={`/app/campaigns/${c.id}`} className="font-medium text-text hover:text-gold">
                      {c.name}
                    </Link>
                  </Td>
                  <Td>
                    <Badge tone={STATUS_TONE[c.status] ?? "neutral"}>{c.status}</Badge>
                  </Td>
                  <Td>{sentCountByCampaign.get(c.id) ?? "—"}</Td>
                  <Td>
                    {c.sent_at
                      ? new Date(c.sent_at).toLocaleDateString("en-GB")
                      : c.scheduled_for
                        ? `Scheduled: ${new Date(c.scheduled_for).toLocaleString("en-GB")}`
                        : new Date(c.created_at).toLocaleDateString("en-GB")}
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        ) : (
          <EmptyState icon={<IconCampaigns width={20} height={20} />} title="No campaigns yet" description="Create a draft above to start your first broadcast." />
        )}
      </div>
    </div>
  );
}
