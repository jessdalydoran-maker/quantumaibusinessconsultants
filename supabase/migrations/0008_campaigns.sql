-- Broadcast email campaigns — segmented, one-to-many sending. Distinct from
-- the existing 1:1 conversational email in the inbox (Prompt 6/inbox tables);
-- these tables are new and unrelated to `conversations`/`messages`.

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id) on delete cascade,
  name text not null,
  subject text not null,
  body text not null,
  segment_definition jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  scheduled_for timestamptz,
  sent_at timestamptz,
  created_by_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists campaigns_account_id_idx on public.campaigns (account_id);

alter table public.campaigns enable row level security;

create policy "campaigns_select" on public.campaigns
  for select using (public.is_platform_admin() or account_id = public.current_account_id());
create policy "campaigns_insert" on public.campaigns
  for insert with check (public.is_platform_admin() or account_id = public.current_account_id());
create policy "campaigns_update" on public.campaigns
  for update
  using (public.is_platform_admin() or account_id = public.current_account_id())
  with check (public.is_platform_admin() or account_id = public.current_account_id());
create policy "campaigns_delete" on public.campaigns
  for delete using (public.is_platform_admin() or account_id = public.current_account_id());

-- ---------------------------------------------------------------------------
-- campaign_recipients
-- ---------------------------------------------------------------------------
create table if not exists public.campaign_recipients (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  contact_id uuid not null references public.contacts (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed', 'bounced')),
  resend_email_id text,
  sent_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  error text
);

create index if not exists campaign_recipients_campaign_id_idx on public.campaign_recipients (campaign_id);
create index if not exists campaign_recipients_contact_id_idx on public.campaign_recipients (contact_id);
create index if not exists campaign_recipients_resend_email_id_idx on public.campaign_recipients (resend_email_id);

alter table public.campaign_recipients enable row level security;

create policy "campaign_recipients_select" on public.campaign_recipients
  for select using (
    public.is_platform_admin()
    or exists (select 1 from public.campaigns c where c.id = campaign_recipients.campaign_id and c.account_id = public.current_account_id())
  );
create policy "campaign_recipients_insert" on public.campaign_recipients
  for insert with check (
    public.is_platform_admin()
    or exists (select 1 from public.campaigns c where c.id = campaign_recipients.campaign_id and c.account_id = public.current_account_id())
  );
create policy "campaign_recipients_update" on public.campaign_recipients
  for update
  using (
    public.is_platform_admin()
    or exists (select 1 from public.campaigns c where c.id = campaign_recipients.campaign_id and c.account_id = public.current_account_id())
  )
  with check (
    public.is_platform_admin()
    or exists (select 1 from public.campaigns c where c.id = campaign_recipients.campaign_id and c.account_id = public.current_account_id())
  );

-- ---------------------------------------------------------------------------
-- unsubscribes — a contact here is excluded from ALL future campaigns for
-- that account, no exceptions. Legal requirement, not a preference.
-- ---------------------------------------------------------------------------
create table if not exists public.unsubscribes (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id) on delete cascade,
  contact_id uuid not null references public.contacts (id) on delete cascade,
  unsubscribed_at timestamptz not null default now()
);

create unique index if not exists unsubscribes_account_contact_unique on public.unsubscribes (account_id, contact_id);
create index if not exists unsubscribes_account_id_idx on public.unsubscribes (account_id);

alter table public.unsubscribes enable row level security;

create policy "unsubscribes_select" on public.unsubscribes
  for select using (public.is_platform_admin() or account_id = public.current_account_id());
-- No insert/update/delete policy for the authenticated role: unsubscribes are
-- only ever written by the public /unsubscribe page, which uses the
-- service-role client (bypasses RLS) — the same pattern as the inbound email
-- webhook and the widget API, since the visitor has no CRM session at all.
