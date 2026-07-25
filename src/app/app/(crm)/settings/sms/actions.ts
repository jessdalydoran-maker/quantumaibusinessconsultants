"use server";

import { revalidatePath } from "next/cache";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { accountHasFeature } from "@/lib/features";

export async function updateTwilioNumberAction(formData: FormData) {
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) throw new Error("No account selected.");

  const supabase = await createClient();
  if (!(await accountHasFeature(supabase, accountId, "sms_whatsapp"))) {
    throw new Error("SMS/WhatsApp isn't available on this account's current plan.");
  }
  if (profile.role !== "owner" && !profile.is_platform_admin) {
    throw new Error("Only an account owner can change the Twilio number.");
  }

  const twilioPhoneNumber = String(formData.get("twilioPhoneNumber") || "").trim();
  if (!/^\+[1-9]\d{6,14}$/.test(twilioPhoneNumber)) {
    throw new Error("Enter the number in E.164 format, e.g. +15551234567.");
  }

  const { error } = await supabase.rpc("update_twilio_number" as never, {
    p_account_id: accountId,
    p_number: twilioPhoneNumber,
  } as never);

  if (error) throw new Error(error.message);

  revalidatePath("/app/settings/sms");
}
