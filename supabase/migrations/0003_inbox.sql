-- Unified inbox: conversations + messages, plus a public widget key per account.
-- Channel enum already includes 'sms' and 'whatsapp' so those can be added later
-- as new senders/webhooks without any schema change.

-- ---------------------------------------------------------------------------
-- accounts.widget_key — public, non-secret identifier baked into the embed
-- script so the widget API routes know which tenant a message belongs to.
-- It is NOT a secret: it only ever grants "send/read messages for this one
-- account's conversations", nothing else, and every write still goes through
-- our own rate-limited API routes rather than a direct Supabase connection.
-- ---------------------------------------------------------------------------
alter table public.accounts
  add column if not exists widget_key uuid not null default gen_random_uuid();

create unique index if not exists accounts_widget_key_unique on public.accounts (widget_key);

-- Lets an account owner rotate their own widget_key without granting them
-- (or RLS) broader update access to the accounts row in general — the
-- existing accounts_update policy is platform-admin-only on purpose, since
-- account name/plan changes should stay admin-controlled.
create or replace function public.regenerate_widget_key(p_account_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_key uuid;
begin
  if not (
    public.is_platform_admin()
    or (p_account_id = public.current_account_id() and
        (select role from public.users where id = auth.uid()) = 'owner')
  ) then
    raise exception 'Not authorized to regenerate this account''s widget key.';
  end if;

  new_key := gen_random_uuid();
  update public.accounts set widget_key = new_key where id = p_account_id;
  return new_key;
end;
$$;

revoke all on function public.regenerate_widget_key(uuid) from public;
grant execute on function public.regenerate_widget_key(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- conversations
-- ---------------------------------------------------------------------------
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id) on delete cascade,
  contact_id uuid references public.contacts (id) on delete set null,
  channel text not null check (channel in ('web_chat', 'email', 'sms', 'whatsapp')),
  status text not null default 'open' check (status in ('open', 'closed')),
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists conversations_account_id_idx on public.conversations (account_id);
create index if not exists conversations_contact_id_idx on public.conversations (contact_id);
create index if not exists conversations_last_message_at_idx on public.conversations (last_message_at desc);

-- ---------------------------------------------------------------------------
-- messages
-- ---------------------------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  account_id uuid not null references public.accounts (id) on delete cascade,
  direction text not null check (direction in ('inbound', 'outbound')),
  sender_type text not null check (sender_type in ('contact', 'user', 'ai')),
  sender_user_id uuid references public.users (id) on delete set null,
  body text not null,
  channel_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists messages_account_id_idx on public.messages (account_id);
create index if not exists messages_conversation_id_idx on public.messages (conversation_id);
create index if not exists messages_created_at_idx on public.messages (created_at);

-- ---------------------------------------------------------------------------
-- RLS — same pattern as every other tenant table: account_id match, or platform admin.
-- Note: the public widget API and the inbound-email webhook are unauthenticated
-- by nature, so they use the service-role client (src/lib/supabase/admin.ts),
-- which bypasses RLS entirely — these policies protect the authenticated /app
-- inbox UI, which is the only place these tables are read via the user's own
-- session.
-- ---------------------------------------------------------------------------
alter table public.conversations enable row level security;

create policy "conversations_select" on public.conversations
  for select
  using (public.is_platform_admin() or account_id = public.current_account_id());

create policy "conversations_insert" on public.conversations
  for insert
  with check (public.is_platform_admin() or account_id = public.current_account_id());

create policy "conversations_update" on public.conversations
  for update
  using (public.is_platform_admin() or account_id = public.current_account_id())
  with check (public.is_platform_admin() or account_id = public.current_account_id());

create policy "conversations_delete" on public.conversations
  for delete
  using (public.is_platform_admin() or account_id = public.current_account_id());

alter table public.messages enable row level security;

create policy "messages_select" on public.messages
  for select
  using (public.is_platform_admin() or account_id = public.current_account_id());

create policy "messages_insert" on public.messages
  for insert
  with check (public.is_platform_admin() or account_id = public.current_account_id());

create policy "messages_update" on public.messages
  for update
  using (public.is_platform_admin() or account_id = public.current_account_id())
  with check (public.is_platform_admin() or account_id = public.current_account_id());

create policy "messages_delete" on public.messages
  for delete
  using (public.is_platform_admin() or account_id = public.current_account_id());
