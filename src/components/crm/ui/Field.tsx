import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";

const FIELD_BASE =
  "w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted/60 transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20";

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-text-muted">
      {children}
    </label>
  );
}

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={[FIELD_BASE, className].filter(Boolean).join(" ")} {...rest} />;
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={[FIELD_BASE, className].filter(Boolean).join(" ")} {...rest} />;
}

export function Select({ className, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={[FIELD_BASE, className].filter(Boolean).join(" ")} {...rest} />;
}

export function FieldGroup({ label, htmlFor, hint, children }: { label: string; htmlFor?: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && <p className="mt-1 text-xs text-text-muted">{hint}</p>}
    </div>
  );
}
