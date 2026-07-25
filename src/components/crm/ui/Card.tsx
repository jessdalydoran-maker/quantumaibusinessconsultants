import type { HTMLAttributes, ReactNode } from "react";

export function Card({
  className,
  glow = false,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { glow?: boolean }) {
  return (
    <div
      className={[
        "rounded-xl border border-border bg-bg-alt/70 backdrop-blur-sm shadow-[0_1px_0_rgba(255,255,255,0.03)_inset,0_12px_28px_-16px_rgba(0,0,0,0.6)]",
        glow ? "shadow-[0_0_0_1px_rgba(213,176,84,0.15),0_16px_36px_-18px_rgba(213,176,84,0.25)]" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    />
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={["flex items-start justify-between gap-4 border-b border-border px-5 py-4", className].filter(Boolean).join(" ")}>
      <div>
        <h3 className="font-display text-base text-text">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={["p-5", className].filter(Boolean).join(" ")} {...rest} />;
}
