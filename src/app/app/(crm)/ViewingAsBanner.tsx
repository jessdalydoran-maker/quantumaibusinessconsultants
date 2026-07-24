import Link from "next/link";

export function ViewingAsBanner({
  accountName,
  hasAccount,
}: {
  accountName: string | null;
  hasAccount: boolean;
}) {
  return (
    <div className="border-b border-gold/40 bg-gold/10 px-4 py-2 text-center text-xs text-gold">
      {hasAccount ? (
        <>
          Platform admin view — viewing as <strong>{accountName ?? "unknown account"}</strong>.{" "}
          <Link href="/app/admin" className="underline hover:no-underline">
            Switch account
          </Link>
        </>
      ) : (
        <>
          Platform admin view — no account selected.{" "}
          <Link href="/app/admin" className="underline hover:no-underline">
            Choose an account
          </Link>{" "}
          to view its contacts and deals.
        </>
      )}
    </div>
  );
}
