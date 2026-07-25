-- Contacts — Lead Finder: Google Places business search + single-site
-- contact pull. Both are manual, user-triggered actions (no scheduled/
-- recurring search), consistent with Google Places being a paid,
-- per-request API — nothing here runs automatically.

alter table public.contacts
  add column if not exists source_detail text,
  add column if not exists place_id text,
  add column if not exists website text;

create unique index if not exists contacts_account_place_id_unique
  on public.contacts (account_id, place_id)
  where place_id is not null;

-- ---------------------------------------------------------------------------
-- lead_searches — log of searches run, for reference/audit (and so a user
-- can see what's already been searched rather than re-running the same
-- paid query).
-- ---------------------------------------------------------------------------
create table if not exists public.lead_searches (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id) on delete cascade,
  query text not null,
  run_by_user_id uuid references public.users (id) on delete set null,
  result_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists lead_searches_account_id_idx on public.lead_searches (account_id);

alter table public.lead_searches enable row level security;

create policy "lead_searches_select" on public.lead_searches
  for select using (public.is_platform_admin() or account_id = public.current_account_id());
create policy "lead_searches_insert" on public.lead_searches
  for insert with check (public.is_platform_admin() or account_id = public.current_account_id());
