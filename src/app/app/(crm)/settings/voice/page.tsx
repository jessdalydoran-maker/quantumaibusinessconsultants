import Link from "next/link";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { NoAccountSelected } from "../../NoAccountSelected";
import { FeatureLocked } from "../../FeatureLocked";
import { accountHasFeature } from "@/lib/features";
import { updateVoiceSettingsAction } from "./actions";

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
      <h1 className="font-display text-3xl text-text">Voice AI (Phone)</h1>
      <p className="mt-2 max-w-2xl text-sm text-text-muted">
        An inbound phone agent that answers calls, handles common questions, books appointments,
        and transfers to a human when it can&apos;t help. Powered by Retell AI — most of the actual
        voice pipeline (speech-to-text, LLM, text-to-speech, telephony) is theirs, not built here.
      </p>

      <div className="mt-4 flex items-center gap-3 rounded-sm border border-border bg-bg-alt p-4 text-sm">
        <span
          className={`h-2 w-2 rounded-full ${voiceAgent?.status === "active" ? "bg-green-500" : "bg-text-muted"}`}
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

      <form action={updateVoiceSettingsAction} className="mt-6 grid max-w-2xl gap-5">
        <div>
          <label className="block text-xs uppercase tracking-wide text-text-muted">
            Business Context (services, hours, FAQs, booking info)
          </label>
          <textarea
            name="businessContext"
            rows={8}
            defaultValue={voiceAgent?.business_context || aiSettings?.business_context || ""}
            className="mt-1 w-full rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-text-muted">
            Fallback / Forwarding Number (transferred to when the agent can&apos;t help)
          </label>
          <input
            name="fallbackPhoneNumber"
            placeholder="+15551234567"
            defaultValue={voiceAgent?.fallback_phone_number ?? ""}
            className="mt-1 w-full max-w-xs rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="mt-2 w-fit rounded-sm bg-gold px-5 py-2 text-sm font-medium text-bg hover:bg-gold-soft"
        >
          Save &amp; Sync with Retell
        </button>
      </form>

      <p className="mt-6 text-xs text-text-muted">
        A phone number still needs to be provisioned and assigned to this agent in the Retell
        dashboard — see the setup checklist for exact steps.
      </p>
    </div>
  );
}
