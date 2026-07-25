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
import { Card, CardHeader, CardBody } from "@/components/crm/ui/Card";
import { Input, Textarea, Select, Label } from "@/components/crm/ui/Field";
import { Button } from "@/components/crm/ui/Button";
import { Badge } from "@/components/crm/ui/Badge";
import { Table, THead, Th, TBody, Tr, Td } from "@/components/crm/ui/Table";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { IconCampaigns } from "@/components/crm/ui/icons";

export const metadata = { robots: { index: false, follow: false } };

const STATUS_TONE: Record<string, "green" | "gold" | "neutral"> = {
  sent: "green",
  scheduled: "gold",
  draft: "neutral",
};

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
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <h1 className="font-display text-2xl text-text sm:text-3xl">{campaign.name}</h1>
        <Badge tone={STATUS_TONE[campaign.status] ?? "neutral"}>{campaign.status}</Badge>
      </div>

      {isDraft ? (
        <>
          <Card className="mt-8">
            <CardHeader title="Audience" />
            <CardBody>
              <form method="get" className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Include contacts tagged</Label>
                  <Select name="includeTags" multiple defaultValue={includeTags} className="h-24">
                    {(allTags ?? []).map((t) => (
                      <option key={t.name} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label>Exclude contacts tagged</Label>
                  <Select name="excludeTags" multiple defaultValue={excludeTags} className="h-24">
                    {(allTags ?? []).map((t) => (
                      <option key={t.name} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <p className="text-xs text-text-muted sm:col-span-2">
                  Leave &quot;include&quot; empty to target every subscribed contact with an email
                  address. Multi-select: cmd/ctrl-click to pick more than one tag.
                </p>
                <Button type="submit" variant="secondary" className="w-fit sm:col-span-2">
                  Preview Count
                </Button>
              </form>
              <p className="mt-3 text-sm text-text">
                <strong className="text-gold">{matching.length}</strong> matching, subscribed
                contact{matching.length === 1 ? "" : "s"} with an email address.
              </p>
            </CardBody>
          </Card>

          <Card className="mt-6 max-w-2xl">
            <CardBody>
              <form action={updateCampaignAction} className="grid gap-4">
                <input type="hidden" name="campaignId" value={campaign.id} />
                <input type="hidden" name="includeTags" value={includeTags.join(",")} />
                <input type="hidden" name="excludeTags" value={excludeTags.join(",")} />
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" name="subject" required defaultValue={campaign.subject} />
                </div>
                <div>
                  <Label htmlFor="body">Body (HTML)</Label>
                  <Textarea id="body" name="body" required rows={10} defaultValue={campaign.body} className="font-mono text-xs" />
                  <p className="mt-1 text-xs text-text-muted">
                    An unsubscribe footer is added automatically to every send — don&apos;t include
                    your own.
                  </p>
                </div>
                <Button type="submit" variant="outline" className="w-fit">
                  Save Draft
                </Button>
              </form>
            </CardBody>
          </Card>

          <div className="mt-6 flex flex-wrap gap-4">
            <form action={sendCampaignNowAction}>
              <input type="hidden" name="campaignId" value={campaign.id} />
              <Button type="submit">Send Now</Button>
            </form>
            <form action={scheduleCampaignAction} className="flex items-end gap-2">
              <input type="hidden" name="campaignId" value={campaign.id} />
              <div>
                <Label htmlFor="scheduledFor">Schedule for</Label>
                <Input id="scheduledFor" type="datetime-local" name="scheduledFor" />
              </div>
              <Button type="submit" variant="secondary">
                Schedule
              </Button>
            </form>
            <form action={deleteCampaignAction} className="flex items-end">
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
          <div className="mt-3">
            {recipients && recipients.length > 0 ? (
              <Table>
                <THead>
                  <Th>Contact</Th>
                  <Th>Email</Th>
                  <Th>Status</Th>
                </THead>
                <TBody>
                  {recipients.map((r, i) => {
                    const contact = r.contacts as unknown as
                      | { first_name: string; last_name: string | null; email: string }
                      | null;
                    return (
                      <Tr key={i}>
                        <Td className="text-text">
                          {contact ? `${contact.first_name} ${contact.last_name || ""}`.trim() : "—"}
                        </Td>
                        <Td>{contact?.email ?? "—"}</Td>
                        <Td className="capitalize">{r.status}</Td>
                      </Tr>
                    );
                  })}
                </TBody>
              </Table>
            ) : (
              <EmptyState icon={<IconCampaigns width={20} height={20} />} title="No recipients recorded" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
