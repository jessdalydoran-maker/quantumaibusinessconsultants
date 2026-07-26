import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Landing point for the link in Supabase's password-reset email. Supabase's
// PKCE flow puts a one-time `code` in the query string rather than a token in
// the URL fragment; exchanging it here (server-side, via a Route Handler so
// the resulting session cookies can actually be written) is what turns that
// code into a real logged-in session before we send the browser on to
// /app/reset-password.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/app/reset-password";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/app/login?error=reset_link_invalid`);
}
