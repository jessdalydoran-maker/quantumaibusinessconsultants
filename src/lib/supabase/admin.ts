import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client — bypasses RLS entirely. NEVER import this from a
// Client Component or expose SUPABASE_SERVICE_ROLE_KEY to the browser.
// Only used for platform-admin operations that must act across all tenants:
// onboarding a new client account and its first (owner) user.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
