-- Plan tiers + per-account feature overrides. Enforcement lives in
-- src/lib/features.ts (accountHasFeature), called server-side on every
-- gated route — this column alone isn't the enforcement, just the data.

alter table public.accounts
  add column if not exists plan_tier text not null default 'crm_only'
    check (plan_tier in ('crm_only', 'crm_content', 'full_suite'));

alter table public.accounts
  add column if not exists features jsonb not null default '{}'::jsonb;

-- The Quantum platform-owner account always has every feature regardless of
-- tier (accountHasFeature() also special-cases is_platform_owner, but set
-- the tier explicitly too so the accounts admin list reads correctly).
update public.accounts set plan_tier = 'full_suite' where is_platform_owner = true;
