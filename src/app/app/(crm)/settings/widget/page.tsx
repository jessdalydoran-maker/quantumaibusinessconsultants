import Link from "next/link";
import { headers } from "next/headers";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { NoAccountSelected } from "../../NoAccountSelected";
import { FeatureLocked } from "../../FeatureLocked";
import { accountHasFeature } from "@/lib/features";
import { regenerateWidgetKeyAction } from "./actions";

export const metadata = { robots: { index: false, follow: false } };

export default async function WidgetSettingsPage() {
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) return <NoAccountSelected />;

  const supabase = await createClient();

  if (!(await accountHasFeature(supabase, accountId, "inbox"))) {
    return <FeatureLocked feature="inbox" />;
  }

  const { data: account } = await supabase
    .from("accounts")
    .select("name, widget_key")
    .eq("id", accountId)
    .single();

  const headerList = await headers();
  const host = headerList.get("host") || "quantumbusinessconsultants.com";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  const snippet = `<script src="${origin}/widget.js" data-widget-key="${account?.widget_key}" data-label="Chat with us" async></script>`;

  return (
    <div>
      <h1 className="font-display text-3xl text-text">Install Web Chat Widget</h1>
      <p className="mt-2 max-w-2xl text-sm text-text-muted">
        Paste this snippet before the closing <code>&lt;/body&gt;</code> tag on {account?.name}&apos;s
        website. It works on any site — it doesn&apos;t need to be built with Next.js or hosted here.
        Messages sent through it land in this account&apos;s{" "}
        <Link href="/app/inbox" className="text-gold hover:underline">
          Inbox
        </Link>
        .
      </p>

      <pre className="mt-6 max-w-2xl overflow-x-auto rounded-sm border border-border bg-bg-alt p-4 text-xs text-text">
        <code>{snippet}</code>
      </pre>

      <form action={regenerateWidgetKeyAction} className="mt-6">
        <p className="text-sm text-text-muted">
          Rotating the key immediately breaks any already-installed script tag using the old one —
          only do this if the key may have leaked somewhere it shouldn&apos;t have.
        </p>
        <button
          type="submit"
          className="mt-3 rounded-sm border border-border px-4 py-2 text-sm text-text-muted hover:border-red-400 hover:text-red-400"
        >
          Regenerate Widget Key
        </button>
      </form>
    </div>
  );
}
