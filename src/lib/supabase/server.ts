import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Use inside Server Components, Server Actions, and Route Handlers under /app.
// Reads/writes the session via the request's cookies, so RLS policies see the
// real logged-in user on every query — this is the second layer of defense
// behind the middleware (see middleware.ts at the repo root).
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component with no way to set cookies —
            // safe to ignore as long as the middleware also refreshes the session.
          }
        },
      },
    }
  );
}
