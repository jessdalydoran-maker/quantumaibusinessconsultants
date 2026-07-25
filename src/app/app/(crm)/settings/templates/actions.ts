"use server";

import { revalidatePath } from "next/cache";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { accountHasFeature } from "@/lib/features";

async function requireContext() {
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) throw new Error("No account selected.");
  const supabase = await createClient();
  if (!(await accountHasFeature(supabase, accountId, "sms_whatsapp"))) {
    throw new Error("SMS/WhatsApp isn't available on this account's current plan.");
  }
  return { accountId, supabase };
}

export async function createTemplateAction(formData: FormData) {
  const { accountId, supabase } = await requireContext();

  const name = String(formData.get("name") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const approvedStatus = String(formData.get("approvedStatus") || "pending");
  const providerContentSid = String(formData.get("providerContentSid") || "").trim() || null;

  if (!name || !body) throw new Error("Name and body are required.");

  const { error } = await supabase.from("message_templates").insert({
    account_id: accountId,
    name,
    body,
    approved_status: approvedStatus,
    provider_content_sid: providerContentSid,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/app/settings/templates");
}

export async function deleteTemplateAction(formData: FormData) {
  const { accountId, supabase } = await requireContext();
  const templateId = String(formData.get("templateId") || "");

  await supabase.from("message_templates").delete().eq("id", templateId).eq("account_id", accountId);

  revalidatePath("/app/settings/templates");
}
