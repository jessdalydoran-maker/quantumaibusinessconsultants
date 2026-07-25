import Link from "next/link";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { NoAccountSelected } from "../../NoAccountSelected";
import { FeatureLocked } from "../../FeatureLocked";
import { accountHasFeature } from "@/lib/features";
import { updateAiSettingsAction } from "./actions";

export const metadata = { robots: { index: false, follow: false } };

export default async function AiSettingsPage() {
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) return <NoAccountSelected />;

  const supabase = await createClient();
  if (!(await accountHasFeature(supabase, accountId, "conversation_ai"))) {
    return <FeatureLocked feature="conversation_ai" />;
  }

  const { data: settings } = await supabase
    .from("ai_settings")
    .select("mode, business_context, escalation_keywords")
    .eq("account_id", accountId)
    .maybeSingle();

  const { data: recentActions } = await supabase
    .from("ai_actions_log")
    .select("action, detail, created_at, conversation_id")
    .eq("account_id", accountId)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div>
      <h1 className="font-display text-3xl text-text">Conversation AI</h1>
      <p className="mt-2 max-w-2xl text-sm text-text-muted">
        Controls whether — and how — an AI reads inbound conversations and replies. In{" "}
        <strong className="text-text">Draft Only</strong>, it writes a suggested reply for a human
        to review; nothing ever sends without someone clicking Send. In{" "}
        <strong className="text-text">Auto-Reply</strong>, straightforward replies send
        immediately, but anything matching an escalation keyword — or where the AI&apos;s own
        reply reads as uncertain — automatically falls back to a draft instead.
      </p>

      <form action={updateAiSettingsAction} className="mt-8 grid max-w-2xl gap-5">
        <div>
          <label className="block text-xs uppercase tracking-wide text-text-muted">Mode</label>
          <select
            name="mode"
            defaultValue={settings?.mode ?? "off"}
            className="mt-1 w-full max-w-xs rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
          >
            <option value="off">Off</option>
            <option value="draft_only">Draft Only (recommended to start)</option>
            <option value="auto_reply">Auto-Reply</option>
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-text-muted">
            Business Context (services, hours, FAQs, booking info)
          </label>
          <textarea
            name="businessContext"
            rows={8}
            defaultValue={settings?.business_context ?? ""}
            placeholder="e.g. We're a plumbing business covering Stoke-on-Trent, open Mon-Fri 8am-6pm. Callout fee is..."
            className="mt-1 w-full rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-text-muted">
            Escalation Keywords (comma-separated — always hand off to a human)
          </label>
          <input
            name="escalationKeywords"
            defaultValue={(settings?.escalation_keywords ?? []).join(", ")}
            placeholder="complaint, refund, speak to a manager, legal"
            className="mt-1 w-full rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="mt-2 w-fit rounded-sm bg-gold px-5 py-2 text-sm font-medium text-bg hover:bg-gold-soft"
        >
          Save
        </button>
      </form>

      <h2 className="mt-12 font-display text-xl text-text">Recent AI Activity</h2>
      <div className="mt-4 space-y-2">
        {(recentActions ?? []).map((a, i) => (
          <div key={i} className="rounded-sm border border-border bg-bg-alt p-3 text-sm">
            <p className="text-text">
              <span className="uppercase text-gold">{a.action.replace("_", " ")}</span>
              {a.conversation_id && (
                <>
                  {" — "}
                  <Link href={`/app/inbox/${a.conversation_id}`} className="text-gold hover:underline">
                    view conversation
                  </Link>
                </>
              )}
            </p>
            <p className="mt-1 text-xs text-text-muted">
              {new Date(a.created_at).toLocaleString("en-GB")}
            </p>
          </div>
        ))}
        {(!recentActions || recentActions.length === 0) && (
          <p className="text-sm text-text-muted">No AI activity yet.</p>
        )}
      </div>
    </div>
  );
}
