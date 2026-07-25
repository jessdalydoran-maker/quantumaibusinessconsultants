import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

const VARIANTS = {
  primary:
    "bg-gradient-to-b from-gold-soft to-gold text-bg shadow-[0_1px_0_rgba(255,255,255,0.35)_inset,0_8px_20px_-8px_rgba(213,176,84,0.55)] hover:brightness-105 active:brightness-95",
  outline:
    "border border-gold/50 text-gold hover:bg-gold/10 hover:border-gold",
  secondary:
    "border border-border bg-bg-raised text-text hover:border-border-strong hover:bg-bg-alt",
  ghost: "text-text-muted hover:text-text hover:bg-bg-alt",
  danger:
    "border border-red-500/40 text-red-300 hover:bg-red-500/10 hover:border-red-500/70",
} as const;

const SIZES = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-5 py-2.5 text-sm gap-2",
} as const;

export type ButtonVariant = keyof typeof VARIANTS;
export type ButtonSize = keyof typeof SIZES;

const BASE =
  "inline-flex items-center justify-center rounded-lg font-medium tracking-wide transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40 whitespace-nowrap";

function classes(variant: ButtonVariant, size: ButtonSize, className?: string) {
  return [BASE, VARIANTS[variant], SIZES[size], className].filter(Boolean).join(" ");
}

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  className,
  children,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={classes(variant, size, className)} {...rest}>
      {icon}
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  icon,
  className,
  href,
  children,
  ...rest
}: CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={classes(variant, size, className)} {...rest}>
      {icon}
      {children}
    </Link>
  );
}
