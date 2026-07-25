import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { NoAccountSelected } from "./NoAccountSelected";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { StatCard } from "@/components/crm/ui/StatCard";
import { Card, CardHeader, CardBody } from "@/components/crm/ui/Card";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { IconContacts, IconDeals, IconDashboard } from "@/components/crm/ui/icons";

export const metadata = { robots: { index: false, follow: false } };

export default async function DashboardPage() {
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);

  if (!accountId) {
    return <NoAccountSelected />;
  }

  const supabase = await createClient();

  const [{ count: contactCount }, { count: openDealCount }, { data: recentActivity }] =
    await Promise.all([
      supabase
        .from("contacts")
        .select("id", { count: "exact", head: true })
        .eq("account_id", accountId),
      supabase
        .from("deals")
        .select("id", { count: "exact", head: true })
        .eq("account_id", accountId)
        .eq("status", "open"),
      supabase
        .from("activities")
        .select("id, type, content, created_at")
        .eq("account_id", accountId)
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

  return (
    <div>
      <PageHeader eyebrow="Overview" title="Dashboard" description="A snapshot of your pipeline and recent activity." />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <StatCard label="Contacts" value={contactCount ?? 0} icon={<IconContacts width={18} height={18} />} href="/app/contacts" />
        <StatCard label="Open Deals" value={openDealCount ?? 0} icon={<IconDeals width={18} height={18} />} href="/app/deals" />
      </div>

      <Card className="mt-8">
        <CardHeader title="Recent Activity" subtitle="Last 8 events across your account" />
        <CardBody className="space-y-3">
          {recentActivity && recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className="rounded-lg border border-border bg-bg/60 p-4 text-sm">
                <p className="text-text">{activity.content}</p>
                <p className="mt-1 text-xs text-text-muted">
                  {new Date(activity.created_at).toLocaleString("en-GB")}
                </p>
              </div>
            ))
          ) : (
            <EmptyState icon={<IconDashboard width={20} height={20} />} title="No activity yet" description="Activity from contacts, deals, and messages will show up here." />
          )}
        </CardBody>
      </Card>
    </div>
  );
}
