import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
      <div>
        {eyebrow && (
          <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.14em] text-gold/80">{eyebrow}</p>
        )}
        <h1 className="font-display text-2xl text-text sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-text-muted">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-3">{action}</div>}
    </div>
  );
}
