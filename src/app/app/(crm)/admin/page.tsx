import { Fragment } from "react";
import { requirePlatformAdmin, getEffectiveAccountId } from "@/lib/supabase/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { createAccountAction, switchAccountAction, updatePlanTierAction, updateFeatureOverrideAction } from "./actions";
import { FEATURE_LABELS, tierFeatures, type FeatureKey, type PlanTier } from "@/lib/features";

export const metadata = { robots: { index: false, follow: false } };

const PLAN_TIERS: PlanTier[] = ["crm_only", "crm_content", "full_suite"];
const ALL_FEATURES = Object.keys(FEATURE_LABELS) as FeatureKey[];

export default async function AdminPage() {
  const profile = await requirePlatformAdmin();
  const currentAccountId = await getEffectiveAccountId(profile);

  const admin = createAdminClient();
  const { data: accounts } = await admin
    .from("accounts")
    .select("id, name, plan, plan_tier, features, is_platform_owner, created_at")
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
                <th className="px-4 py-3">Plan Tier</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {(accounts ?? []).map((account) => {
                const overrides = (account.features as Record<string, boolean> | null) ?? {};
                const baseFeatures = tierFeatures(account.plan_tier as PlanTier);
                const currentAccess = ALL_FEATURES.filter((f) => {
                  if (typeof overrides[f] === "boolean") return overrides[f];
                  return baseFeatures.includes(f);
                });

                return (
                  <Fragment key={account.id}>
                    <tr className="border-t border-border">
                      <td className="px-4 py-3 text-text">
                        {account.name}
                        {account.is_platform_owner && (
                          <span className="ml-2 text-xs text-gold">(platform)</span>
                        )}
                        {account.id === currentAccountId && (
                          <span className="ml-2 text-xs text-gold">(viewing)</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-text-muted">
                        {account.is_platform_owner ? (
                          "full_suite (always)"
                        ) : (
                          <form action={updatePlanTierAction} className="flex items-center gap-2">
                            <input type="hidden" name="accountId" value={account.id} />
                            <select
                              name="planTier"
                              defaultValue={account.plan_tier}
                              className="rounded-sm border border-border bg-bg px-2 py-1 text-xs text-text focus:border-gold focus:outline-none"
                            >
                              {PLAN_TIERS.map((tier) => (
                                <option key={tier} value={tier}>
                                  {tier}
                                </option>
                              ))}
                            </select>
                            <button
                              type="submit"
                              className="rounded-sm border border-border px-2 py-1 text-xs text-text-muted hover:border-gold hover:text-gold"
                            >
                              Save
                            </button>
                          </form>
                        )}
                      </td>
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
                    {!account.is_platform_owner && (
                      <tr className="border-t border-border bg-bg">
                        <td colSpan={4} className="px-4 py-3">
                          <details>
                            <summary className="cursor-pointer text-xs text-text-muted">
                              Current access:{" "}
                              {currentAccess.map((f) => FEATURE_LABELS[f]).join(", ") || "none"} ·
                              manage feature overrides
                            </summary>
                            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                              {ALL_FEATURES.map((feature) => {
                                const overrideValue =
                                  typeof overrides[feature] === "boolean"
                                    ? String(overrides[feature])
                                    : "default";
                                return (
                                  <form
                                    key={feature}
                                    action={updateFeatureOverrideAction}
                                    className="flex items-center justify-between gap-2 rounded-sm border border-border p-2"
                                  >
                                    <input type="hidden" name="accountId" value={account.id} />
                                    <input type="hidden" name="featureKey" value={feature} />
                                    <span className="text-xs text-text-muted">
                                      {FEATURE_LABELS[feature]}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <select
                                        name="value"
                                        defaultValue={overrideValue}
                                        className="rounded-sm border border-border bg-bg-alt px-1 py-0.5 text-xs text-text focus:border-gold focus:outline-none"
                                      >
                                        <option value="default">Default</option>
                                        <option value="true">On</option>
                                        <option value="false">Off</option>
                                      </select>
                                      <button
                                        type="submit"
                                        className="rounded-sm border border-border px-1.5 py-0.5 text-xs text-text-muted hover:border-gold hover:text-gold"
                                      >
                                        Save
                                      </button>
                                    </span>
                                  </form>
                                );
                              })}
                            </div>
                          </details>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
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
