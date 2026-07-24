import { requirePlatformAdmin, getEffectiveAccountId } from "@/lib/supabase/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { createAccountAction, switchAccountAction } from "./actions";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminPage() {
  const profile = await requirePlatformAdmin();
  const currentAccountId = await getEffectiveAccountId(profile);

  const admin = createAdminClient();
  const { data: accounts } = await admin
    .from("accounts")
    .select("id, name, plan, is_platform_owner, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-3xl text-text">Platform Admin</h1>
      <p className="mt-2 text-sm text-text-muted">
        Onboard new client accounts and switch into any account&apos;s view for support.
      </p>

      <section className="mt-10">
        <h2 className="font-display text-xl text-text">Accounts</h2>
        <div className="mt-4 overflow-x-auto rounded-sm border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-alt text-text-muted">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {(accounts ?? []).map((account) => (
                <tr key={account.id} className="border-t border-border">
                  <td className="px-4 py-3 text-text">
                    {account.name}
                    {account.is_platform_owner && (
                      <span className="ml-2 text-xs text-gold">(platform)</span>
                    )}
                    {account.id === currentAccountId && (
                      <span className="ml-2 text-xs text-gold">(viewing)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-muted">{account.plan}</td>
                  <td className="px-4 py-3 text-text-muted">
                    {new Date(account.created_at).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-3">
                    <form action={switchAccountAction}>
                      <input type="hidden" name="accountId" value={account.id} />
                      <button
                        type="submit"
                        className="rounded-sm border border-border px-3 py-1 text-xs text-text-muted hover:border-gold hover:text-gold"
                      >
                        Switch into view
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {currentAccountId && (
          <form action={switchAccountAction} className="mt-3">
            <input type="hidden" name="accountId" value="" />
            <button type="submit" className="text-xs text-text-muted underline hover:text-gold">
              Clear account view
            </button>
          </form>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl text-text">Create Account + Owner</h2>
        <p className="mt-2 text-sm text-text-muted">
          This is how a new client is onboarded. There is no public sign-up — you set the owner&apos;s
          initial password directly here, then share it with them securely.
        </p>
        <form action={createAccountAction} className="mt-6 grid max-w-lg gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wide text-text-muted">
              Account / Business Name
            </label>
            <input
              name="accountName"
              required
              className="mt-1 w-full rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-text-muted">
              Owner Full Name
            </label>
            <input
              name="ownerName"
              required
              className="mt-1 w-full rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-text-muted">
              Owner Email
            </label>
            <input
              name="ownerEmail"
              type="email"
              required
              className="mt-1 w-full rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-text-muted">
              Owner Initial Password
            </label>
            <input
              name="ownerPassword"
              type="text"
              required
              minLength={8}
              className="mt-1 w-full rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
            />
            <p className="mt-1 text-xs text-text-muted">At least 8 characters.</p>
          </div>
          <button
            type="submit"
            className="mt-2 w-fit rounded-sm bg-gold px-5 py-2 text-sm font-medium text-bg hover:bg-gold-soft"
          >
            Create Account
          </button>
        </form>
      </section>
    </div>
  );
}
