-- Voice AI (inbound phone) — integration layer between our CRM and Retell AI
-- (see docs/build-log.md, Prompt 9, for why Retell over Vapi). Most of the
-- actual voice pipeline (speech-to-text, LLM, text-to-speech, telephony) is
-- Retell's, not built here — this is schema + webhook glue.

create table if not exists public.voice_agents (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id) on delete cascade,
  phone_number text,
  provider text not null default 'retell' check (provider in ('retell', 'vapi')),
  provider_agent_id text,
  provider_llm_id text,
  business_context text not null default '',
  fallback_phone_number text,
  status text not null default 'inactive' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now()
);

create unique index if not exists voice_agents_account_id_unique on public.voice_agents (account_id);

alter table public.voice_agents enable row level security;

create policy "voice_agents_select" on public.voice_agents
  for select using (public.is_platform_admin() or account_id = public.current_account_id());
create policy "voice_agents_insert" on public.voice_agents
  for insert with check (public.is_platform_admin() or account_id = public.current_account_id());
create policy "voice_agents_update" on public.voice_agents
  for update
  using (public.is_platform_admin() or account_id = public.current_account_id())
  with check (public.is_platform_admin() or account_id = public.current_account_id());

-- ---------------------------------------------------------------------------
-- calls
-- ---------------------------------------------------------------------------
create table if not exists public.calls (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id) on delete cascade,
  voice_agent_id uuid references public.voice_agents (id) on delete set null,
  contact_id uuid references public.contacts (id) on delete set null,
  direction text not null default 'inbound' check (direction in ('inbound', 'outbound')),
  from_number text,
  to_number text,
  duration_seconds integer,
  status text not null default 'completed' check (status in ('completed', 'failed', 'transferred_to_human')),
  transcript text,
  summary text,
  recording_url text,
  provider_call_id text,
  created_at timestamptz not null default now()
);

create index if not exists calls_account_id_idx on public.calls (account_id);
create index if not exists calls_contact_id_idx on public.calls (contact_id);
create index if not exists calls_provider_call_id_idx on public.calls (provider_call_id);

alter table public.calls enable row level security;

create policy "calls_select" on public.calls
  for select using (public.is_platform_admin() or account_id = public.current_account_id());
create policy "calls_insert" on public.calls
  for insert with check (public.is_platform_admin() or account_id = public.current_account_id());
create policy "calls_update" on public.calls
  for update
  using (public.is_platform_admin() or account_id = public.current_account_id())
  with check (public.is_platform_admin() or account_id = public.current_account_id());
