import Link from "next/link";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { NoAccountSelected } from "./NoAccountSelected";

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
      <h1 className="font-display text-3xl text-text">Dashboard</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/app/contacts"
          className="rounded-sm border border-border bg-bg-alt p-6 hover:border-gold"
        >
          <p className="text-sm text-text-muted">Contacts</p>
          <p className="mt-2 font-display text-3xl text-gold">{contactCount ?? 0}</p>
        </Link>
        <Link
          href="/app/deals"
          className="rounded-sm border border-border bg-bg-alt p-6 hover:border-gold"
        >
          <p className="text-sm text-text-muted">Open Deals</p>
          <p className="mt-2 font-display text-3xl text-gold">{openDealCount ?? 0}</p>
        </Link>
      </div>

      <h2 className="mt-10 font-display text-xl text-text">Recent Activity</h2>
      <div className="mt-4 space-y-3">
        {recentActivity && recentActivity.length > 0 ? (
          recentActivity.map((activity) => (
            <div key={activity.id} className="rounded-sm border border-border bg-bg-alt p-4 text-sm">
              <p className="text-text">{activity.content}</p>
              <p className="mt-1 text-xs text-text-muted">
                {new Date(activity.created_at).toLocaleString("en-GB")}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-text-muted">No activity yet.</p>
        )}
      </div>
    </div>
  );
}
