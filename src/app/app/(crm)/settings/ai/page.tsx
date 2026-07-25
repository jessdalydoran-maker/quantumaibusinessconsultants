import Link from "next/link";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { NoAccountSelected } from "../../NoAccountSelected";
import { FeatureLocked } from "../../FeatureLocked";
import { accountHasFeature } from "@/lib/features";
import { updateAiSettingsAction } from "./actions";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/crm/ui/Card";
import { Input, Textarea, Select, Label } from "@/components/crm/ui/Field";
import { Button } from "@/components/crm/ui/Button";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { IconAi } from "@/components/crm/ui/icons";

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
      <PageHeader
        eyebrow="Settings"
        title="Conversation AI"
        description={
          <>
            Controls whether — and how — an AI reads inbound conversations and replies. In{" "}
            <strong className="text-text">Draft Only</strong>, it writes a suggested reply for a human
            to review; nothing ever sends without someone clicking Send. In{" "}
            <strong className="text-text">Auto-Reply</strong>, straightforward replies send
            immediately, but anything matching an escalation keyword — or where the AI&apos;s own
            reply reads as uncertain — automatically falls back to a draft instead.
          </>
        }
      />

      <Card className="mt-6 max-w-2xl">
        <CardBody>
          <form action={updateAiSettingsAction} className="grid gap-5">
            <div>
              <Label htmlFor="mode">Mode</Label>
              <Select id="mode" name="mode" defaultValue={settings?.mode ?? "off"} className="max-w-xs">
                <option value="off">Off</option>
                <option value="draft_only">Draft Only (recommended to start)</option>
                <option value="auto_reply">Auto-Reply</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="businessContext">Business Context (services, hours, FAQs, booking info)</Label>
              <Textarea
                id="businessContext"
                name="businessContext"
                rows={8}
                defaultValue={settings?.business_context ?? ""}
                placeholder="e.g. We're a plumbing business covering Stoke-on-Trent, open Mon-Fri 8am-6pm. Callout fee is..."
              />
            </div>
            <div>
              <Label htmlFor="escalationKeywords">Escalation Keywords (comma-separated — always hand off to a human)</Label>
              <Input
                id="escalationKeywords"
                name="escalationKeywords"
                defaultValue={(settings?.escalation_keywords ?? []).join(", ")}
                placeholder="complaint, refund, speak to a manager, legal"
              />
            </div>
            <Button type="submit" className="mt-2 w-fit">
              Save
            </Button>
          </form>
        </CardBody>
      </Card>

      <Card className="mt-8">
        <CardHeader title="Recent AI Activity" />
        <CardBody className="space-y-2">
          {recentActions && recentActions.length > 0 ? (
            recentActions.map((a, i) => (
              <div key={i} className="rounded-lg border border-border bg-bg/60 p-3 text-sm">
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
            ))
          ) : (
            <EmptyState icon={<IconAi width={20} height={20} />} title="No AI activity yet" />
          )}
        </CardBody>
      </Card>
    </div>
  );
}
