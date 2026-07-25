-- Conversation AI: inbox auto-reply / draft-and-approve, plus a minimal
-- appointments table (book_appointment tool needs somewhere to book into —
-- none existed yet) and an audit log for every AI action.

create table if not exists public.ai_settings (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id) on delete cascade,
  mode text not null default 'off' check (mode in ('off', 'draft_only', 'auto_reply')),
  business_context text not null default '',
  escalation_keywords text[] not null default '{}',
  created_at timestamptz not null default now()
);

create unique index if not exists ai_settings_account_id_unique on public.ai_settings (account_id);

alter table public.ai_settings enable row level security;

create policy "ai_settings_select" on public.ai_settings
  for select using (public.is_platform_admin() or account_id = public.current_account_id());
create policy "ai_settings_insert" on public.ai_settings
  for insert with check (public.is_platform_admin() or account_id = public.current_account_id());
create policy "ai_settings_update" on public.ai_settings
  for update
  using (public.is_platform_admin() or account_id = public.current_account_id())
  with check (public.is_platform_admin() or account_id = public.current_account_id());

-- ---------------------------------------------------------------------------
-- ai_actions_log — audit trail of every AI action, client-facing feature so
-- this matters more than a normal internal log.
-- ---------------------------------------------------------------------------
create table if not exists public.ai_actions_log (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id) on delete cascade,
  conversation_id uuid references public.conversations (id) on delete cascade,
  action text not null check (action in ('drafted_reply', 'sent_reply', 'escalated', 'booked_appointment', 'tagged_contact', 'created_deal')),
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists ai_actions_log_account_id_idx on public.ai_actions_log (account_id);
create index if not exists ai_actions_log_conversation_id_idx on public.ai_actions_log (conversation_id);
create index if not exists ai_actions_log_created_at_idx on public.ai_actions_log (created_at);

alter table public.ai_actions_log enable row level security;

create policy "ai_actions_log_select" on public.ai_actions_log
  for select using (public.is_platform_admin() or account_id = public.current_account_id());
create policy "ai_actions_log_insert" on public.ai_actions_log
  for insert with check (public.is_platform_admin() or account_id = public.current_account_id());

-- ---------------------------------------------------------------------------
-- ai_drafts — at most one pending AI-suggested reply per conversation,
-- surfaced in the inbox UI for a human to edit/send/discard. Kept as its own
-- table rather than a "draft" flag on `messages`, so a draft can never be
-- accidentally rendered or counted as a real sent message.
-- ---------------------------------------------------------------------------
create table if not exists public.ai_drafts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id) on delete cascade,
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  body text not null,
  reason text not null default 'draft_only' check (reason in ('draft_only', 'escalated')),
  created_at timestamptz not null default now()
);

create unique index if not exists ai_drafts_conversation_id_unique on public.ai_drafts (conversation_id);

alter table public.ai_drafts enable row level security;

create policy "ai_drafts_select" on public.ai_drafts
  for select using (public.is_platform_admin() or account_id = public.current_account_id());
create policy "ai_drafts_insert" on public.ai_drafts
  for insert with check (public.is_platform_admin() or account_id = public.current_account_id());
create policy "ai_drafts_update" on public.ai_drafts
  for update
  using (public.is_platform_admin() or account_id = public.current_account_id())
  with check (public.is_platform_admin() or account_id = public.current_account_id());
create policy "ai_drafts_delete" on public.ai_drafts
  for delete using (public.is_platform_admin() or account_id = public.current_account_id());

-- ---------------------------------------------------------------------------
-- appointments — minimal calendar the book_appointment tool books into.
-- Deliberately simple (no external calendar sync) — this is a CRM-internal
-- record, not a replacement for the existing Cal.com discovery-call booking
-- used on the public marketing site, which is a separate, unrelated system.
-- ---------------------------------------------------------------------------
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id) on delete cascade,
  contact_id uuid references public.contacts (id) on delete set null,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists appointments_account_id_idx on public.appointments (account_id);
create index if not exists appointments_contact_id_idx on public.appointments (contact_id);
create index if not exists appointments_starts_at_idx on public.appointments (starts_at);

alter table public.appointments enable row level security;

create policy "appointments_select" on public.appointments
  for select using (public.is_platform_admin() or account_id = public.current_account_id());
create policy "appointments_insert" on public.appointments
  for insert with check (public.is_platform_admin() or account_id = public.current_account_id());
create policy "appointments_update" on public.appointments
  for update
  using (public.is_platform_admin() or account_id = public.current_account_id())
  with check (public.is_platform_admin() or account_id = public.current_account_id());
create policy "appointments_delete" on public.appointments
  for delete using (public.is_platform_admin() or account_id = public.current_account_id());
