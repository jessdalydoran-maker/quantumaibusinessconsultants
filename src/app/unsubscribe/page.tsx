import { createAdminClient } from "@/lib/supabase/admin";
import { verifyUnsubscribeToken } from "@/lib/campaigns";

export const metadata = { robots: { index: false, follow: false } };

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ account?: string; contact?: string; token?: string }>;
}) {
  const { account, contact, token } = await searchParams;

  const invalid = !account || !contact || !token || !verifyUnsubscribeToken(account, contact, token);

  if (!invalid) {
    const admin = createAdminClient();
    await admin.from("unsubscribes").upsert(
      { account_id: account, contact_id: contact },
      { onConflict: "account_id,contact_id" }
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 text-text">
      <div className="w-full max-w-sm rounded-sm border border-border bg-bg-alt p-8 text-center">
        {invalid ? (
          <>
            <h1 className="font-display text-xl text-text">Link not recognised</h1>
            <p className="mt-2 text-sm text-text-muted">
              This unsubscribe link looks invalid or incomplete. If you&apos;d like to stop
              receiving emails, please reply to the email you received and let us know.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-display text-xl text-gold">You&apos;ve been unsubscribed</h1>
            <p className="mt-2 text-sm text-text-muted">
              You won&apos;t receive any further marketing emails from this business. If this was a
              mistake, contact them directly to be re-added.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
