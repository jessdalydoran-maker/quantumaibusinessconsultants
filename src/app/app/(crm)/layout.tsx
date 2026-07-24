import Link from "next/link";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "@/lib/supabase/auth-actions";
import { ViewingAsBanner } from "./ViewingAsBanner";

// Every page under this route group is server-rendered behind requireProfile(),
// which re-checks the Supabase session itself (defense in depth behind the
// middleware) and redirects to /app/login if there is no valid user.
export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile();
  const effectiveAccountId = await getEffectiveAccountId(profile);

  let accountName: string | null = null;
  if (effectiveAccountId) {
    const supabase = await createClient();
    const { data: account } = await supabase
      .from("accounts")
      .select("name")
      .eq("id", effectiveAccountId)
      .single();
    accountName = account?.name ?? null;
  }

  const navItems = [
    { href: "/app", label: "Dashboard" },
    { href: "/app/contacts", label: "Contacts" },
    { href: "/app/deals", label: "Deals" },
    ...(profile.is_platform_admin ? [{ href: "/app/admin", label: "Admin" }] : []),
  ];

  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="border-b border-border bg-bg-alt">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-8">
            <Link href="/app" className="font-display text-lg text-gold">
              Quantum CRM
            </Link>
            <nav className="hidden items-center gap-6 sm:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-text-muted hover:text-gold"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-text-muted sm:inline">
              {profile.full_name || profile.email}
              {profile.is_platform_admin ? " · Platform Admin" : ""}
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-sm border border-border px-3 py-1.5 text-xs text-text-muted hover:border-gold hover:text-gold"
              >
                Log Out
              </button>
            </form>
          </div>
        </div>
        <nav className="flex items-center gap-4 overflow-x-auto border-t border-border px-4 py-2 sm:hidden">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-text-muted hover:text-gold">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      {profile.is_platform_admin && (
        <ViewingAsBanner accountName={accountName} hasAccount={!!effectiveAccountId} />
      )}

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
