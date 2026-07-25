import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-bg-alt/40 px-6 py-14 text-center">
      {icon && <div className="rounded-full border border-gold/25 bg-gold/10 p-3 text-gold">{icon}</div>}
      <p className="font-display text-lg text-text">{title}</p>
      {description && <p className="max-w-sm text-sm text-text-muted">{description}</p>}
      {action}
    </div>
  );
}
