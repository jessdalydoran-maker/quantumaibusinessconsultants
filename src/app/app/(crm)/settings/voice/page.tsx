import Link from "next/link";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { NoAccountSelected } from "../../NoAccountSelected";
import { FeatureLocked } from "../../FeatureLocked";
import { accountHasFeature } from "@/lib/features";
import { updateVoiceSettingsAction } from "./actions";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { Card, CardBody } from "@/components/crm/ui/Card";
import { Textarea, Input, Label } from "@/components/crm/ui/Field";
import { Button } from "@/components/crm/ui/Button";

export const metadata = { robots: { index: false, follow: false } };

export default async function VoiceSettingsPage() {
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) return <NoAccountSelected />;

  const supabase = await createClient();
  if (!(await accountHasFeature(supabase, accountId, "voice_ai"))) {
    return <FeatureLocked feature="voice_ai" />;
  }

  const [{ data: voiceAgent }, { data: aiSettings }] = await Promise.all([
    supabase
      .from("voice_agents")
      .select("phone_number, business_context, fallback_phone_number, status")
      .eq("account_id", accountId)
      .maybeSingle(),
    supabase.from("ai_settings").select("business_context").eq("account_id", accountId).maybeSingle(),
  ]);

  return (
    <div>
      <PageHeader
        eyebrow="Settings"
        title="Voice AI (Phone)"
        description="An inbound phone agent that answers calls, handles common questions, books appointments, and transfers to a human when it can't help. Powered by Retell AI — most of the actual voice pipeline (speech-to-text, LLM, text-to-speech, telephony) is theirs, not built here."
      />

      <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-bg-alt/50 p-4 text-sm">
        <span
          className={`h-2.5 w-2.5 rounded-full ${voiceAgent?.status === "active" ? "bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.2)]" : "bg-text-muted"}`}
        />
        <span className="text-text-muted">
          {voiceAgent?.status === "active" ? "Agent is active" : "Agent not yet configured"}
          {voiceAgent?.phone_number && ` — ${voiceAgent.phone_number}`}
        </span>
      </div>

      {aiSettings?.business_context && (
        <p className="mt-4 text-xs text-text-muted">
          You already have business context saved for Conversation AI —{" "}
          <Link href="/app/settings/ai" className="text-gold hover:underline">
            reuse or edit it there
          </Link>
          , then paste the relevant parts below (the phone agent has its own copy so you can
          tailor it for voice specifically, e.g. shorter answers).
        </p>
      )}

      <Card className="mt-6 max-w-2xl">
        <CardBody>
          <form action={updateVoiceSettingsAction} className="grid gap-5">
            <div>
              <Label htmlFor="businessContext">Business Context (services, hours, FAQs, booking info)</Label>
              <Textarea
                id="businessContext"
                name="businessContext"
                rows={8}
                defaultValue={voiceAgent?.business_context || aiSettings?.business_context || ""}
              />
            </div>
            <div>
              <Label htmlFor="fallbackPhoneNumber">Fallback / Forwarding Number (transferred to when the agent can&apos;t help)</Label>
              <Input id="fallbackPhoneNumber" name="fallbackPhoneNumber" placeholder="+15551234567" defaultValue={voiceAgent?.fallback_phone_number ?? ""} className="max-w-xs" />
            </div>
            <Button type="submit" className="mt-2 w-fit">
              Save &amp; Sync with Retell
            </Button>
          </form>
        </CardBody>
      </Card>

      <p className="mt-6 text-xs text-text-muted">
        A phone number still needs to be provisioned and assigned to this agent in the Retell
        dashboard — see the setup checklist for exact steps.
      </p>
    </div>
  );
}
