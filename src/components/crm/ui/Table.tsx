import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";

export function Table({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={["overflow-x-auto rounded-xl border border-border bg-bg-alt/50", className].filter(Boolean).join(" ")}>
      <table className="w-full min-w-[36rem] text-left text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead className="border-b border-border bg-bg-raised/60 text-[11px] uppercase tracking-wide text-text-muted">
      <tr>{children}</tr>
    </thead>
  );
}

export function Th({ className, ...rest }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={["px-4 py-3 font-medium", className].filter(Boolean).join(" ")} {...rest} />;
}

export function TBody({ className, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={className} {...rest} />;
}

export function Tr({ className, ...rest }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={["border-t border-border transition-colors hover:bg-bg-raised/40", className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
}

export function Td({ className, ...rest }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={["px-4 py-3 align-middle text-text-muted", className].filter(Boolean).join(" ")} {...rest} />;
}
