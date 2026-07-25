-- SMS + WhatsApp channels for the unified inbox.
-- Design decision (see docs/build-log.md, Prompt 6): each account gets its
-- OWN dedicated Twilio phone number, not a shared pool number. Twilio's
-- inbound webhook always tells you which of your numbers received a message
-- (the `To` field), so a dedicated number per account makes routing a direct
-- 1:1 lookup — a shared number would need an artificial encoding trick (SMS
-- has no equivalent of email's plus-addressing), which is more fragile and
-- harder to operate, not simpler. Same number is used for both SMS and
-- WhatsApp (Twilio distinguishes them via a "whatsapp:" prefix on send/receive).

alter table public.accounts
  add column if not exists twilio_phone_number text;

create unique index if not exists accounts_twilio_phone_number_unique
  on public.accounts (twilio_phone_number)
  where twilio_phone_number is not null;

-- Same pattern as regenerate_widget_key: accounts_update RLS is platform-
-- admin-only by design, so an account owner needs a narrow security-definer
-- function to set just their own Twilio number, not broader accounts UPDATE access.
create or replace function public.update_twilio_number(p_account_id uuid, p_number text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not (
    public.is_platform_admin()
    or (p_account_id = public.current_account_id() and
        (select role from public.users where id = auth.uid()) = 'owner')
  ) then
    raise exception 'Not authorized to update this account''s Twilio number.';
  end if;

  update public.accounts set twilio_phone_number = p_number where id = p_account_id;
end;
$$;

revoke all on function public.update_twilio_number(uuid, text) from public;
grant execute on function public.update_twilio_number(uuid, text) to authenticated;

-- ---------------------------------------------------------------------------
-- message_templates — WhatsApp requires a pre-approved template for any
-- business-initiated message outside the 24-hour customer-service window.
-- Template creation/submission to Meta is NOT built here (per spec) — rows
-- are entered manually once approved via Meta Business Manager / Twilio
-- Content Editor, referencing the real provider content SID needed to
-- actually send it.
-- ---------------------------------------------------------------------------
create table if not exists public.message_templates (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id) on delete cascade,
  name text not null,
  approved_status text not null default 'pending' check (approved_status in ('pending', 'approved', 'rejected')),
  body text not null,
  provider_content_sid text,
  created_at timestamptz not null default now()
);

create index if not exists message_templates_account_id_idx on public.message_templates (account_id);

alter table public.message_templates enable row level security;

create policy "message_templates_select" on public.message_templates
  for select
  using (public.is_platform_admin() or account_id = public.current_account_id());

create policy "message_templates_insert" on public.message_templates
  for insert
  with check (public.is_platform_admin() or account_id = public.current_account_id());

create policy "message_templates_update" on public.message_templates
  for update
  using (public.is_platform_admin() or account_id = public.current_account_id())
  with check (public.is_platform_admin() or account_id = public.current_account_id());

create policy "message_templates_delete" on public.message_templates
  for delete
  using (public.is_platform_admin() or account_id = public.current_account_id());
