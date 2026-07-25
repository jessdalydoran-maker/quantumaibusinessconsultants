import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { NoAccountSelected } from "../NoAccountSelected";
import { FeatureLocked } from "../FeatureLocked";
import { accountHasFeature } from "@/lib/features";

export const metadata = { robots: { index: false, follow: false } };

export default async function CallsPage() {
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) return <NoAccountSelected />;

  const supabase = await createClient();
  if (!(await accountHasFeature(supabase, accountId, "voice_ai"))) {
    return <FeatureLocked feature="voice_ai" />;
  }

  const { data: calls } = await supabase
    .from("calls")
    .select("id, contact_id, contacts(first_name, last_name), from_number, duration_seconds, status, transcript, summary, recording_url, created_at")
    .eq("account_id", accountId)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <h1 className="font-display text-3xl text-text">Calls</h1>

      <div className="mt-6 divide-y divide-border rounded-sm border border-border">
        {(calls ?? []).map((call) => {
          const contact = call.contacts as unknown as { first_name: string; last_name: string | null } | null;
          return (
            <details key={call.id} className="p-4">
              <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2 text-sm">
                <span className="text-text">
                  {contact ? `${contact.first_name} ${contact.last_name || ""}`.trim() : call.from_number || "Unknown caller"}
                </span>
                <span className="flex items-center gap-3 text-xs text-text-muted">
                  <span className="capitalize">{call.status.replace("_", " ")}</span>
                  <span>{call.duration_seconds ? `${Math.round(call.duration_seconds / 60)} min` : "—"}</span>
                  <span>{new Date(call.created_at).toLocaleString("en-GB")}</span>
                </span>
              </summary>
              <div className="mt-3 space-y-3 text-sm">
                {call.summary && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-text-muted">Summary</p>
                    <p className="mt-1 text-text">{call.summary}</p>
                  </div>
                )}
                {call.transcript && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-text-muted">Transcript</p>
                    <p className="mt-1 whitespace-pre-wrap text-text-muted">{call.transcript}</p>
                  </div>
                )}
                {call.recording_url && (
                  <audio controls src={call.recording_url} className="w-full max-w-md" />
                )}
                {!call.summary && !call.transcript && !call.recording_url && (
                  <p className="text-text-muted">No further detail recorded for this call.</p>
                )}
              </div>
            </details>
          );
        })}
        {(!calls || calls.length === 0) && (
          <p className="p-6 text-center text-sm text-text-muted">No calls yet.</p>
        )}
      </div>
    </div>
  );
}
