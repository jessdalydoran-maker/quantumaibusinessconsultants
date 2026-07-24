-- Quantum CRM core schema
-- Multi-tenant: every tenant is a row in `accounts`. Every tenant-owned table
-- carries an `account_id` foreign key. RLS (0002_rls.sql) is the real
-- isolation boundary — this file only defines shape and indexes.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- accounts: one row per tenant (Quantum itself is one row, each client is another)
-- ---------------------------------------------------------------------------
create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  plan text not null default 'starter',
  is_platform_owner boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- users: extends auth.users with a profile row scoped to one account
-- ---------------------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  account_id uuid references public.accounts (id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  is_platform_admin boolean not null default false,
  full_name text,
  email text not null,
  created_at timestamptz not null default now()
);

create index if not exists users_account_id_idx on public.users (account_id);

-- A user must either belong to an account, or be a platform admin (or both).
alter table public.users
  add constraint users_account_or_platform_admin
  check (account_id is not null or is_platform_admin = true);

-- ---------------------------------------------------------------------------
-- contacts
-- ---------------------------------------------------------------------------
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id) on delete cascade,
  first_name text not null,
  last_name text,
  email text,
  phone text,
  company text,
  source text not null default 'manual',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contacts_account_id_idx on public.contacts (account_id);
create index if not exists contacts_account_email_idx on public.contacts (account_id, email);

-- ---------------------------------------------------------------------------
-- tags
-- ---------------------------------------------------------------------------
create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id) on delete cascade,
  name text not null,
  color text not null default '#d5b054'
);

create index if not exists tags_account_id_idx on public.tags (account_id);
create unique index if not exists tags_account_name_unique on public.tags (account_id, name);

-- ---------------------------------------------------------------------------
-- contact_tags (join table)
-- ---------------------------------------------------------------------------
create table if not exists public.contact_tags (
  contact_id uuid not null references public.contacts (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (contact_id, tag_id)
);

create index if not exists contact_tags_contact_id_idx on public.contact_tags (contact_id);
create index if not exists contact_tags_tag_id_idx on public.contact_tags (tag_id);

-- ---------------------------------------------------------------------------
-- custom_fields (account-defined field schema)
-- ---------------------------------------------------------------------------
create table if not exists public.custom_fields (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id) on delete cascade,
  field_name text not null,
  field_type text not null check (field_type in ('text', 'number', 'date', 'boolean', 'select')),
  options jsonb
);

create index if not exists custom_fields_account_id_idx on public.custom_fields (account_id);

-- ---------------------------------------------------------------------------
-- custom_field_values (per-contact values; cast in the UI based on field_type)
-- ---------------------------------------------------------------------------
create table if not exists public.custom_field_values (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts (id) on delete cascade,
  custom_field_id uuid not null references public.custom_fields (id) on delete cascade,
  value text
);

create index if not exists custom_field_values_contact_id_idx on public.custom_field_values (contact_id);
create index if not exists custom_field_values_custom_field_id_idx on public.custom_field_values (custom_field_id);
create unique index if not exists custom_field_values_unique on public.custom_field_values (contact_id, custom_field_id);

-- ---------------------------------------------------------------------------
-- pipelines
-- ---------------------------------------------------------------------------
create table if not exists public.pipelines (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id) on delete cascade,
  name text not null
);

create index if not exists pipelines_account_id_idx on public.pipelines (account_id);

-- ---------------------------------------------------------------------------
-- pipeline_stages
-- ---------------------------------------------------------------------------
create table if not exists public.pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  pipeline_id uuid not null references public.pipelines (id) on delete cascade,
  name text not null,
  sort_order int not null default 0
);

create index if not exists pipeline_stages_pipeline_id_idx on public.pipeline_stages (pipeline_id);

-- ---------------------------------------------------------------------------
-- deals
-- ---------------------------------------------------------------------------
create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id) on delete cascade,
  pipeline_id uuid not null references public.pipelines (id) on delete cascade,
  stage_id uuid not null references public.pipeline_stages (id) on delete cascade,
  contact_id uuid references public.contacts (id) on delete set null,
  title text not null,
  value numeric(12, 2) not null default 0,
  currency text not null default 'GBP',
  status text not null default 'open' check (status in ('open', 'won', 'lost')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists deals_account_id_idx on public.deals (account_id);
create index if not exists deals_pipeline_id_idx on public.deals (pipeline_id);
create index if not exists deals_stage_id_idx on public.deals (stage_id);
create index if not exists deals_contact_id_idx on public.deals (contact_id);

-- ---------------------------------------------------------------------------
-- activities (timeline entries: notes, status changes, system events)
-- ---------------------------------------------------------------------------
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id) on delete cascade,
  contact_id uuid references public.contacts (id) on delete cascade,
  deal_id uuid references public.deals (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  type text not null check (type in ('note', 'status_change', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists activities_account_id_idx on public.activities (account_id);
create index if not exists activities_contact_id_idx on public.activities (contact_id);
create index if not exists activities_deal_id_idx on public.activities (deal_id);

-- ---------------------------------------------------------------------------
-- keep updated_at fresh
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists contacts_set_updated_at on public.contacts;
create trigger contacts_set_updated_at
  before update on public.contacts
  for each row execute function public.set_updated_at();

drop trigger if exists deals_set_updated_at on public.deals;
create trigger deals_set_updated_at
  before update on public.deals
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- seed: the Quantum platform-owner account itself
-- ---------------------------------------------------------------------------
insert into public.accounts (name, plan, is_platform_owner)
select 'Quantum AI Business Consultants', 'internal', true
where not exists (select 1 from public.accounts where is_platform_owner = true);
