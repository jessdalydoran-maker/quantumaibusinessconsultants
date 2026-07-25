import { Fragment } from "react";
import { requirePlatformAdmin, getEffectiveAccountId } from "@/lib/supabase/session";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createAccountAction,
  switchAccountAction,
  updatePlanTierAction,
  updateFeatureOverrideAction,
  addTeamMemberAction,
  removeUserAction,
} from "./actions";
import { FEATURE_LABELS, tierFeatures, type FeatureKey, type PlanTier } from "@/lib/features";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/crm/ui/Card";
import { Table, THead, Th, TBody, Tr, Td } from "@/components/crm/ui/Table";
import { Input, Select, Label } from "@/components/crm/ui/Field";
import { Button } from "@/components/crm/ui/Button";
import { Badge } from "@/components/crm/ui/Badge";

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

  const { data: users } = await admin
    .from("users")
    .select("id, full_name, email, role, is_platform_admin, account_id, created_at")
    .order("created_at", { ascending: false });

  const accountNameById = new Map((accounts ?? []).map((a) => [a.id, a.name]));

  return (
    <div>
      <PageHeader
        eyebrow="Platform"
        title="Admin"
        description="Onboard new client accounts and switch into any account's view for support."
      />

      <section className="mt-8">
        <h2 className="font-display text-lg text-text">Accounts</h2>
        <div className="mt-4">
          <Table>
            <THead>
              <Th>Name</Th>
              <Th>Plan Tier</Th>
              <Th>Created</Th>
              <Th></Th>
            </THead>
            <TBody>
              {(accounts ?? []).map((account) => {
                const overrides = (account.features as Record<string, boolean> | null) ?? {};
                const baseFeatures = tierFeatures(account.plan_tier as PlanTier);
                const currentAccess = ALL_FEATURES.filter((f) => {
                  if (typeof overrides[f] === "boolean") return overrides[f];
                  return baseFeatures.includes(f);
                });

                return (
                  <Fragment key={account.id}>
                    <Tr>
                      <Td className="text-text">
                        {account.name}
                        {account.is_platform_owner && <Badge tone="gold" className="ml-2">Platform</Badge>}
                        {account.id === currentAccountId && <Badge tone="green" className="ml-2">Viewing</Badge>}
                      </Td>
                      <Td>
                        {account.is_platform_owner ? (
                          "full_suite (always)"
                        ) : (
                          <form action={updatePlanTierAction} className="flex items-center gap-2">
                            <input type="hidden" name="accountId" value={account.id} />
                            <Select name="planTier" defaultValue={account.plan_tier} className="w-auto py-1.5 text-xs">
                              {PLAN_TIERS.map((tier) => (
                                <option key={tier} value={tier}>
                                  {tier}
                                </option>
                              ))}
                            </Select>
                            <Button type="submit" variant="secondary" size="sm">
                              Save
                            </Button>
                          </form>
                        )}
                      </Td>
                      <Td>{new Date(account.created_at).toLocaleDateString("en-GB")}</Td>
                      <Td>
                        <form action={switchAccountAction}>
                          <input type="hidden" name="accountId" value={account.id} />
                          <Button type="submit" variant="secondary" size="sm">
                            Switch into view
                          </Button>
                        </form>
                      </Td>
                    </Tr>
                    {!account.is_platform_owner && (
                      <tr className="border-t border-border bg-bg/40">
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
                                    className="flex items-center justify-between gap-2 rounded-lg border border-border bg-bg-alt/40 p-2"
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
                                        className="rounded-md border border-border bg-bg px-1 py-0.5 text-xs text-text focus:border-gold focus:outline-none"
                                      >
                                        <option value="default">Default</option>
                                        <option value="true">On</option>
                                        <option value="false">Off</option>
                                      </select>
                                      <button
                                        type="submit"
                                        className="rounded-md border border-border px-1.5 py-0.5 text-xs text-text-muted hover:border-gold hover:text-gold"
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
            </TBody>
          </Table>
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

      <section className="mt-10">
        <h2 className="font-display text-lg text-text">Users</h2>
        <div className="mt-4">
          <Table>
            <THead>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Account</Th>
              <Th>Role</Th>
              <Th></Th>
            </THead>
            <TBody>
              {(users ?? []).map((u) => (
                <Tr key={u.id}>
                  <Td className="text-text">
                    {u.full_name}
                    {u.id === profile.id && <Badge tone="green" className="ml-2">You</Badge>}
                  </Td>
                  <Td>{u.email}</Td>
                  <Td>{accountNameById.get(u.account_id) ?? "—"}</Td>
                  <Td>
                    <span className="capitalize">{u.role}</span>
                    {u.is_platform_admin && <Badge tone="gold" className="ml-2">Platform Admin</Badge>}
                  </Td>
                  <Td>
                    {u.id !== profile.id && (
                      <form action={removeUserAction}>
                        <input type="hidden" name="userId" value={u.id} />
                        <button type="submit" className="text-xs text-text-muted hover:text-red-400">
                          Remove
                        </button>
                      </form>
                    )}
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </div>
      </section>

      <Card className="mt-10 max-w-lg">
        <CardHeader title="Add Team Member" subtitle="Add another login to an existing account (e.g. a colleague at your own business) — this doesn't create a new tenant account, just a new user on one that already exists." />
        <CardBody>
          <form action={addTeamMemberAction} className="grid gap-4">
            <div>
              <Label htmlFor="tmAccountId">Account</Label>
              <Select id="tmAccountId" name="accountId" required defaultValue={(accounts ?? []).find((a) => a.is_platform_owner)?.id ?? ""}>
                {(accounts ?? []).map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="tmFullName">Full Name</Label>
              <Input id="tmFullName" name="fullName" required />
            </div>
            <div>
              <Label htmlFor="tmEmail">Email</Label>
              <Input id="tmEmail" name="email" type="email" required />
            </div>
            <div>
              <Label htmlFor="tmPassword">Initial Password</Label>
              <Input id="tmPassword" name="password" type="text" required minLength={8} />
              <p className="mt-1 text-xs text-text-muted">At least 8 characters.</p>
            </div>
            <div>
              <Label htmlFor="tmRole">Role</Label>
              <Select id="tmRole" name="role" defaultValue="owner" className="max-w-xs">
                <option value="owner">Owner</option>
                <option value="member">Member</option>
              </Select>
            </div>
            <label className="flex items-center gap-2 text-sm text-text-muted">
              <input type="checkbox" name="isPlatformAdmin" className="h-4 w-4 rounded border-border accent-[var(--color-gold)]" />
              Platform admin (full access to every account, including this Admin console)
            </label>
            <Button type="submit" className="mt-2 w-fit">
              Create Login
            </Button>
          </form>
        </CardBody>
      </Card>

      <Card className="mt-6 max-w-lg">
        <CardHeader title="Create Account + Owner" subtitle="This is how a new client is onboarded. There is no public sign-up — you set the owner's initial password directly here, then share it with them securely." />
        <CardBody>
          <form action={createAccountAction} className="grid gap-4">
            <div>
              <Label htmlFor="accountName">Account / Business Name</Label>
              <Input id="accountName" name="accountName" required />
            </div>
            <div>
              <Label htmlFor="ownerName">Owner Full Name</Label>
              <Input id="ownerName" name="ownerName" required />
            </div>
            <div>
              <Label htmlFor="ownerEmail">Owner Email</Label>
              <Input id="ownerEmail" name="ownerEmail" type="email" required />
            </div>
            <div>
              <Label htmlFor="ownerPassword">Owner Initial Password</Label>
              <Input id="ownerPassword" name="ownerPassword" type="text" required minLength={8} />
              <p className="mt-1 text-xs text-text-muted">At least 8 characters.</p>
            </div>
            <Button type="submit" className="mt-2 w-fit">
              Create Account
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
