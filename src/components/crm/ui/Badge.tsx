import type { ReactNode } from "react";

const TONES = {
  neutral: "bg-bg-raised text-text-muted border-border",
  gold: "bg-gold/12 text-gold border-gold/30",
  green: "bg-emerald-500/12 text-emerald-300 border-emerald-500/30",
  red: "bg-red-500/12 text-red-300 border-red-500/30",
  blue: "bg-sky-500/12 text-sky-300 border-sky-500/30",
} as const;

export type BadgeTone = keyof typeof TONES;

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        TONES[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
