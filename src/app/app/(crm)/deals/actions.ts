"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";

async function requireAccountContext() {
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) {
    throw new Error("No account selected.");
  }
  const supabase = await createClient();
  return { profile, accountId, supabase };
}

async function logActivity(
  supabase: Awaited<ReturnType<typeof createClient>>,
  accountId: string,
  userId: string,
  dealId: string,
  content: string,
  type: "note" | "status_change" | "system" = "system"
) {
  await supabase.from("activities").insert({
    account_id: accountId,
    deal_id: dealId,
    user_id: userId,
    type,
    content,
  });
}

export async function createDealAction(formData: FormData) {
  const { profile, accountId, supabase } = await requireAccountContext();

  const pipelineId = String(formData.get("pipelineId") || "");
  const stageId = String(formData.get("stageId") || "");
  const title = String(formData.get("title") || "").trim();
  const value = Number(formData.get("value") || 0);
  const contactId = String(formData.get("contactId") || "") || null;

  if (!pipelineId || !stageId || !title) {
    throw new Error("Title, pipeline, and stage are required.");
  }

  const { data: deal, error } = await supabase
    .from("deals")
    .insert({
      account_id: accountId,
      pipeline_id: pipelineId,
      stage_id: stageId,
      contact_id: contactId,
      title,
      value: Number.isFinite(value) ? value : 0,
    })
    .select("id")
    .single();

  if (error || !deal) throw new Error(error?.message || "Could not create the deal.");

  await logActivity(
    supabase,
    accountId,
    profile.id,
    deal.id,
    `${profile.full_name || profile.email} created this deal.`
  );

  revalidatePath("/app/deals");
  redirect("/app/deals");
}

export async function moveDealAction(dealId: string, stageId: string) {
  const { profile, accountId, supabase } = await requireAccountContext();

  const { data: stage } = await supabase.from("pipeline_stages").select("name").eq("id", stageId).single();

  const { error } = await supabase
    .from("deals")
    .update({ stage_id: stageId })
    .eq("id", dealId)
    .eq("account_id", accountId);

  if (error) throw new Error(error.message);

  await logActivity(
    supabase,
    accountId,
    profile.id,
    dealId,
    `${profile.full_name || profile.email} moved this deal to "${stage?.name ?? "a new stage"}".`,
    "status_change"
  );

  revalidatePath("/app/deals");
}

export async function markDealStatusAction(formData: FormData) {
  const { profile, accountId, supabase } = await requireAccountContext();
  const dealId = String(formData.get("dealId") || "");
  const status = String(formData.get("status") || "");

  if (!["won", "lost", "open"].includes(status)) {
    throw new Error("Invalid status.");
  }

  const { error } = await supabase
    .from("deals")
    .update({ status })
    .eq("id", dealId)
    .eq("account_id", accountId);

  if (error) throw new Error(error.message);

  await logActivity(
    supabase,
    accountId,
    profile.id,
    dealId,
    `${profile.full_name || profile.email} marked this deal as ${status}.`,
    "status_change"
  );

  revalidatePath("/app/deals");
}
