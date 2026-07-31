import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { NoAccountSelected } from "../NoAccountSelected";
import { FeatureLocked } from "../FeatureLocked";
import { accountHasFeature } from "@/lib/features";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { Badge } from "@/components/crm/ui/Badge";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { IconCalls } from "@/components/crm/ui/icons";

export const metadata = { robots: { index: false, follow: false } };

const STATUS_TONE: Record<string, "green" | "red" | "gold" | "neutral"> = {
  completed: "green",
  failed: "red",
  in_progress: "gold",
};

export default async function CallsPage() {
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) return <NoAccountSelected />;

  const supabase = await createClient();
  if (!(await accountHasFeature(supabase, accountId, "voice_ai"))) {
    return <FeatureLocked feature="voice_ai" />;
  }

  const { data: callsData } = await supabase
    .from("calls")
    .select("id, contact_id, contacts(first_name, last_name), from_number, duration_seconds, status, resolved, transcript, summary, recording_url, created_at")
    .eq("account_id", accountId)
    .order("created_at", { ascending: false })
    .limit(100);

  // Unresolved calls (the AI couldn't fully help) are the ones that need a
  // human to follow up, so they float to the top regardless of recency.
  const calls = [...(callsData ?? [])].sort((a, b) => {
    const aPriority = a.resolved === false ? 0 : 1;
    const bPriority = b.resolved === false ? 0 : 1;
    return aPriority - bPriority;
  });

  return (
    <div>
      <PageHeader eyebrow="Voice AI" title="Calls" description="Inbound phone calls handled by your voice agent." />

      <div className="mt-6">
        {calls && calls.length > 0 ? (
          <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-bg-alt/50">
            {calls.map((call) => {
              const contact = call.contacts as unknown as { first_name: string; last_name: string | null } | null;
              return (
                <details key={call.id} className="group p-4">
                  <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="font-medium text-text">
                      {contact ? `${contact.first_name} ${contact.last_name || ""}`.trim() : call.from_number || "Unknown caller"}
                    </span>
                    <span className="flex items-center gap-3 text-xs text-text-muted">
                      {call.resolved === false && <Badge tone="red">Needs follow-up</Badge>}
                      <Badge tone={STATUS_TONE[call.status] ?? "neutral"}>{call.status.replace("_", " ")}</Badge>
                      <span>{call.duration_seconds ? `${Math.round(call.duration_seconds / 60)} min` : "—"}</span>
                      <span>{new Date(call.created_at).toLocaleString("en-GB")}</span>
                    </span>
                  </summary>
                  <div className="mt-4 space-y-3 border-t border-border pt-4 text-sm">
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
          </div>
        ) : (
          <EmptyState icon={<IconCalls width={20} height={20} />} title="No calls yet" description="Inbound calls to your voice agent's number will show up here." />
        )}
      </div>
    </div>
  );
}
