"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  IconDashboard,
  IconInbox,
  IconContacts,
  IconDeals,
  IconCalls,
  IconCampaigns,
  IconSettings,
  IconSms,
  IconAi,
  IconVoice,
  IconTemplates,
  IconAdmin,
  IconMenu,
  IconClose,
  IconLogout,
  IconSparkle,
} from "@/components/crm/ui/icons";

export type NavItem = { href: string; label: string; icon: keyof typeof ICONS };

const ICONS = {
  dashboard: IconDashboard,
  inbox: IconInbox,
  contacts: IconContacts,
  deals: IconDeals,
  calls: IconCalls,
  campaigns: IconCampaigns,
  settings: IconSettings,
  sms: IconSms,
  ai: IconAi,
  voice: IconVoice,
  templates: IconTemplates,
  admin: IconAdmin,
};

function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(href + "/");
}

function NavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const pathname = usePathname();
  const active = isActive(pathname, item.href);
  const Icon = ICONS[item.icon];
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={[
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
        active
          ? "bg-gold/12 text-gold shadow-[inset_0_0_0_1px_rgba(213,176,84,0.25)]"
          : "text-text-muted hover:bg-bg-raised hover:text-text",
      ].join(" ")}
    >
      <Icon
        width={18}
        height={18}
        className={active ? "text-gold" : "text-text-muted group-hover:text-gold"}
      />
      {item.label}
    </Link>
  );
}

function SidebarNav({ workspace, settings, admin, onNavigate }: { workspace: NavItem[]; settings: NavItem[]; admin: NavItem[]; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-5">
      <div className="flex flex-col gap-1">
        <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted/70">Workspace</p>
        {workspace.map((item) => (
          <NavLink key={item.href} item={item} onClick={onNavigate} />
        ))}
      </div>
      {settings.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted/70">Settings</p>
          {settings.map((item) => (
            <NavLink key={item.href} item={item} onClick={onNavigate} />
          ))}
        </div>
      )}
      {admin.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted/70">Platform</p>
          {admin.map((item) => (
            <NavLink key={item.href} item={item} onClick={onNavigate} />
          ))}
        </div>
      )}
    </nav>
  );
}

export function CrmShell({
  workspaceNav,
  settingsNav,
  adminNav,
  userLabel,
  isPlatformAdmin,
  logoutSlot,
  banner,
  children,
}: {
  workspaceNav: NavItem[];
  settingsNav: NavItem[];
  adminNav: NavItem[];
  userLabel: string;
  isPlatformAdmin: boolean;
  logoutSlot: ReactNode;
  banner: ReactNode;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-text">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(60rem 30rem at 15% -10%, rgba(213,176,84,0.08), transparent), radial-gradient(40rem 24rem at 100% 0%, rgba(213,176,84,0.05), transparent)",
        }}
      />

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-bg-alt/80 backdrop-blur-sm lg:flex">
        <Link href="/app" className="flex items-center gap-2 border-b border-border px-5 py-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold">
            <IconSparkle width={16} height={16} />
          </span>
          <span className="font-display text-lg text-text">
            Quantum <span className="text-gold">CRM</span>
          </span>
        </Link>
        <SidebarNav workspace={workspaceNav} settings={settingsNav} admin={adminNav} />
        <div className="border-t border-border p-3">
          <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-bg-raised/60 px-3 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-text">{userLabel}</p>
              {isPlatformAdmin && <p className="text-[11px] text-gold">Platform Admin</p>}
            </div>
            {logoutSlot}
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-bg-alt/90 px-4 py-3 backdrop-blur-sm lg:hidden">
        <Link href="/app" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold">
            <IconSparkle width={14} height={14} />
          </span>
          <span className="font-display text-base text-text">
            Quantum <span className="text-gold">CRM</span>
          </span>
        </Link>
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg border border-border p-2 text-text-muted hover:border-gold hover:text-gold"
        >
          <IconMenu width={18} height={18} />
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-border bg-bg-alt">
            <div className="flex items-center justify-between border-b border-border px-5 py-5">
              <span className="font-display text-lg text-text">
                Quantum <span className="text-gold">CRM</span>
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg border border-border p-1.5 text-text-muted hover:border-gold hover:text-gold"
              >
                <IconClose width={16} height={16} />
              </button>
            </div>
            <SidebarNav
              workspace={workspaceNav}
              settings={settingsNav}
              admin={adminNav}
              onNavigate={() => setMobileOpen(false)}
            />
            <div className="border-t border-border p-3">
              <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-bg-raised/60 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-text">{userLabel}</p>
                  {isPlatformAdmin && <p className="text-[11px] text-gold">Platform Admin</p>}
                </div>
                {logoutSlot}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        {banner}
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}

export { IconLogout };
