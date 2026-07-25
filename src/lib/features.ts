import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

export type PlanTier = "crm_only" | "crm_content" | "full_suite";

export type FeatureKey =
  | "contacts"
  | "deals"
  | "inbox"
  | "content_ai"
  | "social_scheduling"
  | "conversation_ai"
  | "voice_ai"
  | "sms_whatsapp"
  | "broadcast_email";

export const FEATURE_LABELS: Record<FeatureKey, string> = {
  contacts: "Contacts",
  deals: "Deals",
  inbox: "Inbox (web chat + email)",
  content_ai: "Content AI",
  social_scheduling: "Social Scheduling",
  conversation_ai: "Conversation AI (auto-reply)",
  voice_ai: "Voice AI (phone)",
  sms_whatsapp: "SMS + WhatsApp",
  broadcast_email: "Broadcast Email Campaigns",
};

// The base feature set per tier. Each tier is additive over the last, per
// Prompt 5's spec. content_ai/social_scheduling have no routes yet in this
// codebase (Prompt 3, "Content AI," was never built here) — they're defined
// now so crm_content is a meaningful tier the moment that feature exists,
// without a schema change later.
const TIER_FEATURES: Record<PlanTier, FeatureKey[]> = {
  crm_only: ["contacts", "deals", "inbox"],
  crm_content: ["contacts", "deals", "inbox", "content_ai", "social_scheduling"],
  full_suite: [
    "contacts",
    "deals",
    "inbox",
    "content_ai",
    "social_scheduling",
    "conversation_ai",
    "voice_ai",
    "sms_whatsapp",
    "broadcast_email",
  ],
};

export function tierFeatures(tier: PlanTier): FeatureKey[] {
  return TIER_FEATURES[tier];
}

type AccountRow = {
  plan_tier: PlanTier;
  features: Record<string, boolean>;
  is_platform_owner: boolean;
};

async function loadAccount(supabase: SupabaseClient, accountId: string): Promise<AccountRow | null> {
  const { data } = await supabase
    .from("accounts")
    .select("plan_tier, features, is_platform_owner")
    .eq("id", accountId)
    .single();
  return (data as AccountRow) ?? null;
}

// Single source of truth, used both to gate a route/API handler server-side
// and to decide what to show in the /app nav. An explicit true/false in
// accounts.features always wins over the tier default, so an individual
// account can get early access to (or be blocked from) something outside
// their base tier.
export async function accountHasFeature(
  supabase: SupabaseClient,
  accountId: string,
  featureKey: FeatureKey
): Promise<boolean> {
  const account = await loadAccount(supabase, accountId);
  if (!account) return false;
  if (account.is_platform_owner) return true;

  const override = account.features?.[featureKey];
  if (typeof override === "boolean") return override;

  return TIER_FEATURES[account.plan_tier].includes(featureKey);
}

export async function getAccountFeatureSet(
  supabase: SupabaseClient,
  accountId: string
): Promise<Set<FeatureKey>> {
  const account = await loadAccount(supabase, accountId);
  if (!account) return new Set();
  if (account.is_platform_owner) return new Set(Object.keys(FEATURE_LABELS) as FeatureKey[]);

  const base = new Set(TIER_FEATURES[account.plan_tier]);
  for (const [key, value] of Object.entries(account.features ?? {})) {
    if (value === true) base.add(key as FeatureKey);
    if (value === false) base.delete(key as FeatureKey);
  }
  return base;
}
