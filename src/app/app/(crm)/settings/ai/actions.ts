"use server";

import { revalidatePath } from "next/cache";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { accountHasFeature } from "@/lib/features";

export async function updateAiSettingsAction(formData: FormData) {
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) throw new Error("No account selected.");

  const supabase = await createClient();
  if (!(await accountHasFeature(supabase, accountId, "conversation_ai"))) {
    throw new Error("Conversation AI isn't available on this account's current plan.");
  }

  const mode = String(formData.get("mode") || "off");
  const businessContext = String(formData.get("businessContext") || "").trim();
  const escalationKeywordsRaw = String(formData.get("escalationKeywords") || "");
  const escalationKeywords = escalationKeywordsRaw
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  if (!["off", "draft_only", "auto_reply"].includes(mode)) {
    throw new Error("Invalid mode.");
  }

  const { error } = await supabase.from("ai_settings").upsert(
    {
      account_id: accountId,
      mode,
      business_context: businessContext,
      escalation_keywords: escalationKeywords,
    },
    { onConflict: "account_id" }
  );

  if (error) throw new Error(error.message);

  revalidatePath("/app/settings/ai");
}
