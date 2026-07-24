import "server-only";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export const VIEW_AS_ACCOUNT_COOKIE = "qcrm_view_account_id";

export type Profile = {
  id: string;
  account_id: string | null;
  role: "owner" | "member";
  is_platform_admin: boolean;
  full_name: string | null;
  email: string;
};

// Second layer of defense behind the middleware: every /app server component
// or server action that touches CRM data should call this first. It re-checks
// the session server-side and loads the profile row that RLS keys off of.
export async function requireProfile(): Promise<Profile> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/app/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id, account_id, role, is_platform_admin, full_name, email")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/app/login");
  }

  return profile as Profile;
}

export async function requirePlatformAdmin(): Promise<Profile> {
  const profile = await requireProfile();
  if (!profile.is_platform_admin) {
    redirect("/app");
  }
  return profile;
}

// Platform admins aren't tied to one account, so RLS alone would let them see
// every tenant's rows mixed together. This resolves which single account the
// CRM pages should scope to: the account the admin has "switched into" via the
// cookie set in /app/admin, or the user's own account_id for normal tenant users.
// This is a UX/view-scoping filter, not the security boundary — RLS already
// guarantees a non-admin can never read past their own account_id regardless
// of what this function returns.
export async function getEffectiveAccountId(profile: Profile): Promise<string | null> {
  if (!profile.is_platform_admin) {
    return profile.account_id;
  }
  const cookieStore = await cookies();
  return cookieStore.get(VIEW_AS_ACCOUNT_COOKIE)?.value ?? null;
}
