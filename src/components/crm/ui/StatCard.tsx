import Link from "next/link";
import type { ReactNode } from "react";
import { IconArrowRight } from "./icons";

export function StatCard({
  label,
  value,
  icon,
  href,
  tone = "gold",
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  href?: string;
  tone?: "gold" | "neutral";
}) {
  const content = (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-bg-alt/70 p-5 transition-colors hover:border-gold/40">
      <div
        className={
          "pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl transition-opacity " +
          (tone === "gold" ? "bg-gold/20 opacity-70 group-hover:opacity-100" : "bg-bg-raised opacity-0")
        }
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</p>
          <p className="mt-2 font-display text-3xl text-text">{value}</p>
        </div>
        {icon && (
          <div className="rounded-lg border border-gold/25 bg-gold/10 p-2 text-gold">{icon}</div>
        )}
      </div>
      {href && (
        <div className="relative mt-4 flex items-center gap-1 text-xs font-medium text-gold opacity-0 transition-opacity group-hover:opacity-100">
          View <IconArrowRight width={14} height={14} />
        </div>
      )}
    </div>
  );

  return href ? (
    <Link href={href} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}
