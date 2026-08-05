"use server";

import { revalidatePath } from "next/cache";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { accountHasFeature } from "@/lib/features";
import { createOrUpdateRetellAgent } from "@/lib/retell";
import { site } from "@/lib/site";

export async function updateVoiceSettingsAction(formData: FormData) {
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) throw new Error("No account selected.");

  const supabase = await createClient();
  if (!(await accountHasFeature(supabase, accountId, "voice_ai"))) {
    throw new Error("Voice AI isn't available on this account's current plan.");
  }

  const businessContext = String(formData.get("businessContext") || "").trim();
  const notificationEmail = String(formData.get("notificationEmail") || "").trim();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const notificationEmails = notificationEmail
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  if (notificationEmails.length === 0 || !notificationEmails.every((e) => emailPattern.test(e))) {
    throw new Error("Enter at least one valid client care team email address.");
  }

  const { data: existing } = await supabase
    .from("voice_agents")
    .select("id, provider_agent_id, provider_llm_id")
    .eq("account_id", accountId)
    .maybeSingle();

  let agentId = existing?.provider_agent_id ?? null;
  let llmId = existing?.provider_llm_id ?? null;
  let status: "active" | "inactive" = "inactive";

  if (process.env.RETELL_API_KEY) {
    try {
      const result = await createOrUpdateRetellAgent({
        existingAgentId: existing?.provider_agent_id,
        existingLlmId: existing?.provider_llm_id,
        businessContext,
        functionWebhookUrl: `${site.url}/api/webhooks/retell-function`,
      });
      agentId = result.agentId;
      llmId = result.llmId;
      status = "active";
    } catch (error) {
      console.error("Retell agent sync failed", error);
      throw new Error(
        error instanceof Error
          ? `Could not sync with Retell: ${error.message}`
          : "Could not sync with Retell."
      );
    }
  }

  const { error } = await supabase.from("voice_agents").upsert(
    {
      account_id: accountId,
      business_context: businessContext,
      notification_email: notificationEmail,
      provider_agent_id: agentId,
      provider_llm_id: llmId,
      status,
    },
    { onConflict: "account_id" }
  );

  if (error) throw new Error(error.message);

  revalidatePath("/app/settings/voice");
}
