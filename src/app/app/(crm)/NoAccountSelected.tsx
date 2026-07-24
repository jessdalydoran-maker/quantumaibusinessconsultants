import Link from "next/link";

export function NoAccountSelected() {
  return (
    <div className="rounded-sm border border-border bg-bg-alt p-6 text-sm text-text-muted">
      You&apos;re viewing as a platform admin with no account selected. Go to{" "}
      <Link href="/app/admin" className="text-gold hover:underline">
        Admin
      </Link>{" "}
      and choose an account to view its data.
    </div>
  );
}
