"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VIEW_AS_ACCOUNT_COOKIE } from "@/lib/supabase/session";
import { cookies } from "next/headers";

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const cookieStore = await cookies();
  cookieStore.delete(VIEW_AS_ACCOUNT_COOKIE);
  redirect("/app/login");
}
