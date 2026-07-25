import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { NoAccountSelected } from "../NoAccountSelected";
import { createDealAction } from "./actions";
import { KanbanBoard } from "./KanbanBoard";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { Input, Select, Label } from "@/components/crm/ui/Field";
import { Button } from "@/components/crm/ui/Button";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { IconDeals } from "@/components/crm/ui/icons";

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
        <PageHeader eyebrow="Sales" title="Deals" />
        <EmptyState
          icon={<IconDeals width={20} height={20} />}
          title="No pipeline set up yet"
          description="Pipelines are created automatically when an account is onboarded from Admin."
        />
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
      <PageHeader eyebrow="Sales" title={pipeline.name} description="Drag deals between stages as they progress." />

      <details className="mt-6 rounded-xl border border-border bg-bg-alt/50 p-4">
        <summary className="cursor-pointer text-sm text-text-muted">New Deal</summary>
        <form action={createDealAction} className="mt-4 grid gap-4 sm:grid-cols-2 sm:items-end">
          <input type="hidden" name="pipelineId" value={pipeline.id} />
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required />
          </div>
          <div>
            <Label htmlFor="stageId">Stage</Label>
            <Select id="stageId" name="stageId" required>
              {(stages ?? []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="value">Value (GBP)</Label>
            <Input id="value" name="value" type="number" step="0.01" min="0" defaultValue={0} />
          </div>
          <div>
            <Label htmlFor="contactId">Contact</Label>
            <Select id="contactId" name="contactId">
              <option value="">No contact</option>
              {(contacts ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.first_name} {c.last_name || ""}
                </option>
              ))}
            </Select>
          </div>
          <Button type="submit" className="w-fit">
            Create Deal
          </Button>
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
