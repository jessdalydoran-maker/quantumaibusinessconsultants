"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { accountHasFeature } from "@/lib/features";
import { executeCampaignSend } from "@/lib/campaigns";

async function requireContext() {
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) throw new Error("No account selected.");
  const supabase = await createClient();
  if (!(await accountHasFeature(supabase, accountId, "broadcast_email"))) {
    throw new Error("Broadcast Email isn't available on this account's current plan.");
  }
  return { profile, accountId, supabase };
}

export async function createCampaignAction(formData: FormData) {
  const { profile, accountId, supabase } = await requireContext();
  const name = String(formData.get("name") || "").trim();
  if (!name) throw new Error("Campaign name is required.");

  const { data: campaign, error } = await supabase
    .from("campaigns")
    .insert({
      account_id: accountId,
      name,
      subject: "",
      body: "",
      created_by_user_id: profile.id,
    })
    .select("id")
    .single();

  if (error || !campaign) throw new Error(error?.message || "Could not create campaign.");

  revalidatePath("/app/campaigns");
  redirect(`/app/campaigns/${campaign.id}`);
}

export async function updateCampaignAction(formData: FormData) {
  const { accountId, supabase } = await requireContext();
  const campaignId = String(formData.get("campaignId") || "");
  const subject = String(formData.get("subject") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const includeTagsRaw = String(formData.get("includeTags") || "");
  const excludeTagsRaw = String(formData.get("excludeTags") || "");

  const segment = {
    tags: includeTagsRaw.split(",").map((t) => t.trim()).filter(Boolean),
    exclude_tags: excludeTagsRaw.split(",").map((t) => t.trim()).filter(Boolean),
  };

  const { error } = await supabase
    .from("campaigns")
    .update({ subject, body, segment_definition: segment })
    .eq("id", campaignId)
    .eq("account_id", accountId)
    .eq("status", "draft");

  if (error) throw new Error(error.message);

  revalidatePath(`/app/campaigns/${campaignId}`);
}

export async function sendCampaignNowAction(formData: FormData) {
  const { accountId, supabase } = await requireContext();
  const campaignId = String(formData.get("campaignId") || "");

  const result = await executeCampaignSend(supabase, accountId, campaignId);
  if (!result.ok) throw new Error(result.error || "Could not send campaign.");

  revalidatePath(`/app/campaigns/${campaignId}`);
  revalidatePath("/app/campaigns");
}

export async function scheduleCampaignAction(formData: FormData) {
  const { accountId, supabase } = await requireContext();
  const campaignId = String(formData.get("campaignId") || "");
  const scheduledFor = String(formData.get("scheduledFor") || "");

  if (!scheduledFor) throw new Error("Pick a date/time to schedule for.");

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("subject, body")
    .eq("id", campaignId)
    .eq("account_id", accountId)
    .single();

  if (!campaign?.subject || !campaign?.body) {
    throw new Error("Add a subject and body before scheduling.");
  }

  const { error } = await supabase
    .from("campaigns")
    .update({ status: "scheduled", scheduled_for: new Date(scheduledFor).toISOString() })
    .eq("id", campaignId)
    .eq("account_id", accountId)
    .eq("status", "draft");

  if (error) throw new Error(error.message);

  revalidatePath(`/app/campaigns/${campaignId}`);
  revalidatePath("/app/campaigns");
}

export async function deleteCampaignAction(formData: FormData) {
  const { accountId, supabase } = await requireContext();
  const campaignId = String(formData.get("campaignId") || "");

  await supabase
    .from("campaigns")
    .delete()
    .eq("id", campaignId)
    .eq("account_id", accountId)
    .in("status", ["draft", "scheduled"]);

  revalidatePath("/app/campaigns");
  redirect("/app/campaigns");
}
