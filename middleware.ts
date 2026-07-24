import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Gate for the entire CRM. The `matcher` below is a positive allowlist —
// "/app/:path*" — so this file is structurally incapable of touching the
// public marketing site (/, /about, /services, /contact, /industries,
// /how-it-works, /case-studies, /resources, /legal/*, /api/chat, /api/contact,
// and every other existing route). Next.js only ever invokes this middleware
// for requests whose path matches the matcher; there is no code path here
// that runs against those routes at all.
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/app/login";

  if (!user && !isLoginRoute) {
    const loginUrl = new URL("/app/login", request.url);
    loginUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && isLoginRoute) {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  return response;
}

export const config = {
  // Positive allowlist only — every CRM route lives under /app, so this is the
  // one and only path prefix the middleware ever runs for. It never matches
  // "/", "/about", "/services", "/contact", "/industries", "/how-it-works",
  // "/case-studies", "/resources", "/legal/privacy", "/legal/terms",
  // "/api/chat", or "/api/contact" — none of those start with "/app".
  matcher: ["/app/:path*"],
};
