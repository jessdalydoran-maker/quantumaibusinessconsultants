import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { NoAccountSelected } from "../NoAccountSelected";
import { createDealAction } from "./actions";
import { KanbanBoard } from "./KanbanBoard";

export const metadata = { robots: { index: false, follow: false } };

export default async function DealsPage() {
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) return <NoAccountSelected />;

  const supabase = await createClient();

  const { data: pipeline } = await supabase
    .from("pipelines")
    .select("id, name")
    .eq("account_id", accountId)
    .order("id")
    .limit(1)
    .maybeSingle();

  if (!pipeline) {
    return (
      <div>
        <h1 className="font-display text-3xl text-text">Deals</h1>
        <p className="mt-4 text-sm text-text-muted">
          This account has no pipeline set up yet. Pipelines are created automatically when an
          account is onboarded from Admin.
        </p>
      </div>
    );
  }

  const [{ data: stages }, { data: deals }, { data: contacts }] = await Promise.all([
    supabase
      .from("pipeline_stages")
      .select("id, name, sort_order")
      .eq("pipeline_id", pipeline.id)
      .order("sort_order"),
    supabase
      .from("deals")
      .select("id, title, value, currency, status, stage_id, contact_id")
      .eq("account_id", accountId)
      .eq("pipeline_id", pipeline.id)
      .order("created_at", { ascending: false }),
    supabase.from("contacts").select("id, first_name, last_name").eq("account_id", accountId).order("first_name"),
  ]);

  const contactNameById = new Map(
    (contacts ?? []).map((c) => [c.id, `${c.first_name} ${c.last_name || ""}`.trim()])
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-text">{pipeline.name}</h1>
      </div>

      <details className="mt-6 rounded-sm border border-border bg-bg-alt p-4">
        <summary className="cursor-pointer text-sm text-text-muted">New Deal</summary>
        <form action={createDealAction} className="mt-4 grid gap-4 sm:grid-cols-2 sm:items-end">
          <input type="hidden" name="pipelineId" value={pipeline.id} />
          <div>
            <label className="block text-xs uppercase tracking-wide text-text-muted">Title</label>
            <input
              name="title"
              required
              className="mt-1 w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-text-muted">Stage</label>
            <select
              name="stageId"
              required
              className="mt-1 w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
            >
              {(stages ?? []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-text-muted">Value (GBP)</label>
            <input
              name="value"
              type="number"
              step="0.01"
              min="0"
              defaultValue={0}
              className="mt-1 w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-text-muted">Contact</label>
            <select
              name="contactId"
              className="mt-1 w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
            >
              <option value="">No contact</option>
              {(contacts ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.first_name} {c.last_name || ""}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-fit rounded-sm bg-gold px-5 py-2 text-sm font-medium text-bg hover:bg-gold-soft"
          >
            Create Deal
          </button>
        </form>
      </details>

      <div className="mt-8">
        <KanbanBoard
          stages={stages ?? []}
          deals={deals ?? []}
          contactNameById={Object.fromEntries(contactNameById)}
        />
      </div>
    </div>
  );
}
