import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "@/lib/supabase/auth-actions";
import { getAccountFeatureSet, type FeatureKey } from "@/lib/features";
import { ViewingAsBanner } from "./ViewingAsBanner";
import { CrmShell, IconLogout, type NavItem } from "./CrmShell";

// Every page under this route group is server-rendered behind requireProfile(),
// which re-checks the Supabase session itself (defense in depth behind the
// middleware) and redirects to /app/login if there is no valid user.
export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile();
  const effectiveAccountId = await getEffectiveAccountId(profile);

  let accountName: string | null = null;
  let features = new Set<FeatureKey>();
  if (effectiveAccountId) {
    const supabase = await createClient();
    const { data: account } = await supabase
      .from("accounts")
      .select("name")
      .eq("id", effectiveAccountId)
      .single();
    accountName = account?.name ?? null;
    features = await getAccountFeatureSet(supabase, effectiveAccountId);
  }

  // Nav items are gated by the same accountHasFeature source of truth used
  // server-side on the routes themselves — this hides sections the account
  // can't use, but is a convenience, not the enforcement (each route/action
  // re-checks itself, since a hidden link is not a security boundary).
  type RawNavItem = NavItem & { feature?: FeatureKey };

  const workspaceRaw: RawNavItem[] = [
    { href: "/app", label: "Dashboard", icon: "dashboard" },
    { href: "/app/inbox", label: "Inbox", icon: "inbox", feature: "inbox" },
    { href: "/app/contacts", label: "Contacts", icon: "contacts", feature: "contacts" },
    { href: "/app/deals", label: "Deals", icon: "deals", feature: "deals" },
    { href: "/app/calls", label: "Calls", icon: "calls", feature: "voice_ai" },
    { href: "/app/campaigns", label: "Campaigns", icon: "campaigns", feature: "broadcast_email" },
  ];

  const settingsRaw: RawNavItem[] = [
    { href: "/app/settings/widget", label: "Widget", icon: "settings" },
    { href: "/app/settings/sms", label: "SMS/WhatsApp", icon: "sms", feature: "sms_whatsapp" },
    { href: "/app/settings/templates", label: "Templates", icon: "templates", feature: "sms_whatsapp" },
    { href: "/app/settings/ai", label: "AI Settings", icon: "ai", feature: "conversation_ai" },
    { href: "/app/settings/voice", label: "Voice Settings", icon: "voice", feature: "voice_ai" },
  ];

  const adminRaw: RawNavItem[] = profile.is_platform_admin
    ? [{ href: "/app/admin", label: "Admin", icon: "admin" }]
    : [];

  const filterByFeature = (items: RawNavItem[]) =>
    items.filter((item) => !item.feature || features.has(item.feature));

  return (
    <CrmShell
      workspaceNav={filterByFeature(workspaceRaw)}
      settingsNav={filterByFeature(settingsRaw)}
      adminNav={adminRaw}
      userLabel={profile.full_name || profile.email}
      isPlatformAdmin={profile.is_platform_admin}
      logoutSlot={
        <form action={logoutAction}>
          <button
            type="submit"
            aria-label="Log out"
            className="rounded-md p-1.5 text-text-muted hover:text-gold"
          >
            <IconLogout width={16} height={16} />
          </button>
        </form>
      }
      banner={
        profile.is_platform_admin && (
          <ViewingAsBanner accountName={accountName} hasAccount={!!effectiveAccountId} />
        )
      }
    >
      {children}
    </CrmShell>
  );
}
