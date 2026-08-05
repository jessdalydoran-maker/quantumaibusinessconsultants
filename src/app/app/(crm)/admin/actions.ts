"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { requirePlatformAdmin, VIEW_AS_ACCOUNT_COOKIE } from "@/lib/supabase/session";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PlanTier, FeatureKey } from "@/lib/features";

export async function createAccountAction(formData: FormData) {
  await requirePlatformAdmin();

  const accountName = String(formData.get("accountName") || "").trim();
  const ownerName = String(formData.get("ownerName") || "").trim();
  const ownerEmail = String(formData.get("ownerEmail") || "")
    .trim()
    .toLowerCase();
  const ownerPassword = String(formData.get("ownerPassword") || "");

  if (!accountName || !ownerName || !ownerEmail || ownerPassword.length < 8) {
    throw new Error(
      "Account name, owner name, owner email, and an 8+ character password are all required."
    );
  }

  const admin = createAdminClient();

  const { data: account, error: accountError } = await admin
    .from("accounts")
    .insert({ name: accountName })
    .select("id")
    .single();

  if (accountError || !account) {
    throw new Error(accountError?.message || "Could not create the account.");
  }

  const { data: authUser, error: authError } = await admin.auth.admin.createUser({
    email: ownerEmail,
    password: ownerPassword,
    email_confirm: true,
  });

  if (authError || !authUser.user) {
    // Roll back the account row if user creation failed, so we don't leave an orphan account.
    await admin.from("accounts").delete().eq("id", account.id);
    throw new Error(authError?.message || "Could not create the owner user.");
  }

  const { error: profileError } = await admin.from("users").insert({
    id: authUser.user.id,
    account_id: account.id,
    role: "owner",
    is_platform_admin: false,
    full_name: ownerName,
    email: ownerEmail,
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(authUser.user.id);
    await admin.from("accounts").delete().eq("id", account.id);
    throw new Error(profileError.message);
  }

  // Give the new account a default pipeline so /app/deals isn't empty on day one.
  const { data: pipeline } = await admin
    .from("pipelines")
    .insert({ account_id: account.id, name: "Sales Pipeline" })
    .select("id")
    .single();

  if (pipeline) {
    await admin.from("pipeline_stages").insert([
      { pipeline_id: pipeline.id, name: "New", sort_order: 0 },
      { pipeline_id: pipeline.id, name: "Contacted", sort_order: 1 },
      { pipeline_id: pipeline.id, name: "Proposal Sent", sort_order: 2 },
      { pipeline_id: pipeline.id, name: "Won", sort_order: 3 },
      { pipeline_id: pipeline.id, name: "Lost", sort_order: 4 },
    ]);
  }

  revalidatePath("/app/admin");
}

export async function addTeamMemberAction(formData: FormData) {
  await requirePlatformAdmin();

  const accountId = String(formData.get("accountId") || "");
  const fullName = String(formData.get("fullName") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "member") as "owner" | "member";
  const isPlatformAdmin = formData.get("isPlatformAdmin") === "on";

  if (!accountId || !fullName || !email || password.length < 8) {
    throw new Error("Account, name, email, and an 8+ character password are all required.");
  }

  const admin = createAdminClient();

  const { data: authUser, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authUser.user) {
    throw new Error(authError?.message || "Could not create the user.");
  }

  const { error: profileError } = await admin.from("users").insert({
    id: authUser.user.id,
    account_id: accountId,
    role,
    is_platform_admin: isPlatformAdmin,
    full_name: fullName,
    email,
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(authUser.user.id);
    throw new Error(profileError.message);
  }

  revalidatePath("/app/admin");
}

export async function removeUserAction(formData: FormData) {
  const profile = await requirePlatformAdmin();
  const userId = String(formData.get("userId") || "");

  if (!userId) throw new Error("Missing user.");
  if (userId === profile.id) throw new Error("You can't remove your own login.");

  const admin = createAdminClient();
  const { error } = await admin.from("users").delete().eq("id", userId);
  if (error) throw new Error(error.message);

  await admin.auth.admin.deleteUser(userId);

  revalidatePath("/app/admin");
}

export async function updatePlanTierAction(formData: FormData) {
  await requirePlatformAdmin();
  const accountId = String(formData.get("accountId") || "");
  const planTier = String(formData.get("planTier") || "") as PlanTier;

  if (!["crm_only", "crm_content", "full_suite"].includes(planTier)) {
    throw new Error("Invalid plan tier.");
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("accounts")
    .update({ plan_tier: planTier })
    .eq("id", accountId)
    .select("id");
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error(
      "Plan tier was not updated — no matching account row. This usually means the admin client isn't authenticating with the service role (check SUPABASE_SERVICE_ROLE_KEY in the deployment's environment variables)."
    );
  }

  revalidatePath("/app/admin");
}

export async function updateFeatureOverrideAction(formData: FormData) {
  await requirePlatformAdmin();
  const accountId = String(formData.get("accountId") || "");
  const featureKey = String(formData.get("featureKey") || "") as FeatureKey;
  const value = String(formData.get("value") || "default");

  const admin = createAdminClient();
  const { data: account } = await admin
    .from("accounts")
    .select("features")
    .eq("id", accountId)
    .single();

  const features = { ...(account?.features as Record<string, boolean> | null) };

  if (value === "default") {
    delete features[featureKey];
  } else {
    features[featureKey] = value === "true";
  }

  const { data, error } = await admin
    .from("accounts")
    .update({ features })
    .eq("id", accountId)
    .select("id");
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error(
      "Feature override was not saved — no matching account row. This usually means the admin client isn't authenticating with the service role (check SUPABASE_SERVICE_ROLE_KEY in the deployment's environment variables)."
    );
  }

  revalidatePath("/app/admin");
}

export async function switchAccountAction(formData: FormData) {
  await requirePlatformAdmin();
  const accountId = String(formData.get("accountId") || "");
  const cookieStore = await cookies();

  if (accountId) {
    cookieStore.set(VIEW_AS_ACCOUNT_COOKIE, accountId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  } else {
    cookieStore.delete(VIEW_AS_ACCOUNT_COOKIE);
  }

  redirect("/app");
}
