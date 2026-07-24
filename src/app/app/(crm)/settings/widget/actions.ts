"use server";

import { revalidatePath } from "next/cache";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";

export async function regenerateWidgetKeyAction() {
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) throw new Error("No account selected.");

  // Only an account owner (or platform admin viewing the account) can rotate
  // the widget key — a member shouldn't be able to invalidate every client
  // site's embed in one click.
  if (profile.role !== "owner" && !profile.is_platform_admin) {
    throw new Error("Only an account owner can regenerate the widget key.");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("regenerate_widget_key" as never, {
    p_account_id: accountId,
  } as never);

  if (error) throw new Error(error.message);

  revalidatePath("/app/settings/widget");
}
