-- Row Level Security: the real tenant-isolation boundary.
-- Every policy below scopes rows to the requesting user's own account_id,
-- OR allows access when the requesting user is a platform admin.
-- These are checked by Postgres on every query regardless of application code,
-- so an app-layer bug can never leak another tenant's rows.

-- ---------------------------------------------------------------------------
-- Helper functions — security definer so they can read public.users even
-- though RLS is enabled on that table (avoids a chicken-and-egg lockout).
-- Both read only the calling user's own row via auth.uid(), never anyone else's.
-- ---------------------------------------------------------------------------
create or replace function public.current_account_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select account_id from public.users where id = auth.uid();
$$;

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select is_platform_admin from public.users where id = auth.uid()), false);
$$;

revoke all on function public.current_account_id() from public;
revoke all on function public.is_platform_admin() from public;
grant execute on function public.current_account_id() to authenticated;
grant execute on function public.is_platform_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- accounts
-- ---------------------------------------------------------------------------
alter table public.accounts enable row level security;

create policy "accounts_select" on public.accounts
  for select
  using (public.is_platform_admin() or id = public.current_account_id());

create policy "accounts_insert" on public.accounts
  for insert
  with check (public.is_platform_admin());

create policy "accounts_update" on public.accounts
  for update
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
alter table public.users enable row level security;

create policy "users_select" on public.users
  for select
  using (
    public.is_platform_admin()
    or account_id = public.current_account_id()
    or id = auth.uid()
  );

create policy "users_insert" on public.users
  for insert
  with check (public.is_platform_admin());

create policy "users_update" on public.users
  for update
  using (public.is_platform_admin() or id = auth.uid())
  with check (public.is_platform_admin() or id = auth.uid());

-- ---------------------------------------------------------------------------
-- contacts
-- ---------------------------------------------------------------------------
alter table public.contacts enable row level security;

create policy "contacts_select" on public.contacts
  for select
  using (public.is_platform_admin() or account_id = public.current_account_id());

create policy "contacts_insert" on public.contacts
  for insert
  with check (public.is_platform_admin() or account_id = public.current_account_id());

create policy "contacts_update" on public.contacts
  for update
  using (public.is_platform_admin() or account_id = public.current_account_id())
  with check (public.is_platform_admin() or account_id = public.current_account_id());

create policy "contacts_delete" on public.contacts
  for delete
  using (public.is_platform_admin() or account_id = public.current_account_id());

-- ---------------------------------------------------------------------------
-- tags
-- ---------------------------------------------------------------------------
alter table public.tags enable row level security;

create policy "tags_select" on public.tags
  for select
  using (public.is_platform_admin() or account_id = public.current_account_id());

create policy "tags_insert" on public.tags
  for insert
  with check (public.is_platform_admin() or account_id = public.current_account_id());

create policy "tags_update" on public.tags
  for update
  using (public.is_platform_admin() or account_id = public.current_account_id())
  with check (public.is_platform_admin() or account_id = public.current_account_id());

create policy "tags_delete" on public.tags
  for delete
  using (public.is_platform_admin() or account_id = public.current_account_id());

-- ---------------------------------------------------------------------------
-- contact_tags (no account_id column — scope via the parent contact)
-- ---------------------------------------------------------------------------
alter table public.contact_tags enable row level security;

create policy "contact_tags_select" on public.contact_tags
  for select
  using (
    public.is_platform_admin()
    or exists (
      select 1 from public.contacts c
      where c.id = contact_tags.contact_id and c.account_id = public.current_account_id()
    )
  );

create policy "contact_tags_insert" on public.contact_tags
  for insert
  with check (
    public.is_platform_admin()
    or exists (
      select 1 from public.contacts c
      where c.id = contact_tags.contact_id and c.account_id = public.current_account_id()
    )
  );

create policy "contact_tags_delete" on public.contact_tags
  for delete
  using (
    public.is_platform_admin()
    or exists (
      select 1 from public.contacts c
      where c.id = contact_tags.contact_id and c.account_id = public.current_account_id()
    )
  );

-- ---------------------------------------------------------------------------
-- custom_fields
-- ---------------------------------------------------------------------------
alter table public.custom_fields enable row level security;

create policy "custom_fields_select" on public.custom_fields
  for select
  using (public.is_platform_admin() or account_id = public.current_account_id());

create policy "custom_fields_insert" on public.custom_fields
  for insert
  with check (public.is_platform_admin() or account_id = public.current_account_id());

create policy "custom_fields_update" on public.custom_fields
  for update
  using (public.is_platform_admin() or account_id = public.current_account_id())
  with check (public.is_platform_admin() or account_id = public.current_account_id());

create policy "custom_fields_delete" on public.custom_fields
  for delete
  using (public.is_platform_admin() or account_id = public.current_account_id());

-- ---------------------------------------------------------------------------
-- custom_field_values (no account_id column — scope via the parent contact)
-- ---------------------------------------------------------------------------
alter table public.custom_field_values enable row level security;

create policy "custom_field_values_select" on public.custom_field_values
  for select
  using (
    public.is_platform_admin()
    or exists (
      select 1 from public.contacts c
      where c.id = custom_field_values.contact_id and c.account_id = public.current_account_id()
    )
  );

create policy "custom_field_values_insert" on public.custom_field_values
  for insert
  with check (
    public.is_platform_admin()
    or exists (
      select 1 from public.contacts c
      where c.id = custom_field_values.contact_id and c.account_id = public.current_account_id()
    )
  );

create policy "custom_field_values_update" on public.custom_field_values
  for update
  using (
    public.is_platform_admin()
    or exists (
      select 1 from public.contacts c
      where c.id = custom_field_values.contact_id and c.account_id = public.current_account_id()
    )
  )
  with check (
    public.is_platform_admin()
    or exists (
      select 1 from public.contacts c
      where c.id = custom_field_values.contact_id and c.account_id = public.current_account_id()
    )
  );

create policy "custom_field_values_delete" on public.custom_field_values
  for delete
  using (
    public.is_platform_admin()
    or exists (
      select 1 from public.contacts c
      where c.id = custom_field_values.contact_id and c.account_id = public.current_account_id()
    )
  );

-- ---------------------------------------------------------------------------
-- pipelines
-- ---------------------------------------------------------------------------
alter table public.pipelines enable row level security;

create policy "pipelines_select" on public.pipelines
  for select
  using (public.is_platform_admin() or account_id = public.current_account_id());

create policy "pipelines_insert" on public.pipelines
  for insert
  with check (public.is_platform_admin() or account_id = public.current_account_id());

create policy "pipelines_update" on public.pipelines
  for update
  using (public.is_platform_admin() or account_id = public.current_account_id())
  with check (public.is_platform_admin() or account_id = public.current_account_id());

create policy "pipelines_delete" on public.pipelines
  for delete
  using (public.is_platform_admin() or account_id = public.current_account_id());

-- ---------------------------------------------------------------------------
-- pipeline_stages (no account_id column — scope via the parent pipeline)
-- ---------------------------------------------------------------------------
alter table public.pipeline_stages enable row level security;

create policy "pipeline_stages_select" on public.pipeline_stages
  for select
  using (
    public.is_platform_admin()
    or exists (
      select 1 from public.pipelines p
      where p.id = pipeline_stages.pipeline_id and p.account_id = public.current_account_id()
    )
  );

create policy "pipeline_stages_insert" on public.pipeline_stages
  for insert
  with check (
    public.is_platform_admin()
    or exists (
      select 1 from public.pipelines p
      where p.id = pipeline_stages.pipeline_id and p.account_id = public.current_account_id()
    )
  );

create policy "pipeline_stages_update" on public.pipeline_stages
  for update
  using (
    public.is_platform_admin()
    or exists (
      select 1 from public.pipelines p
      where p.id = pipeline_stages.pipeline_id and p.account_id = public.current_account_id()
    )
  )
  with check (
    public.is_platform_admin()
    or exists (
      select 1 from public.pipelines p
      where p.id = pipeline_stages.pipeline_id and p.account_id = public.current_account_id()
    )
  );

create policy "pipeline_stages_delete" on public.pipeline_stages
  for delete
  using (
    public.is_platform_admin()
    or exists (
      select 1 from public.pipelines p
      where p.id = pipeline_stages.pipeline_id and p.account_id = public.current_account_id()
    )
  );

-- ---------------------------------------------------------------------------
-- deals
-- ---------------------------------------------------------------------------
alter table public.deals enable row level security;

create policy "deals_select" on public.deals
  for select
  using (public.is_platform_admin() or account_id = public.current_account_id());

create policy "deals_insert" on public.deals
  for insert
  with check (public.is_platform_admin() or account_id = public.current_account_id());

create policy "deals_update" on public.deals
  for update
  using (public.is_platform_admin() or account_id = public.current_account_id())
  with check (public.is_platform_admin() or account_id = public.current_account_id());

create policy "deals_delete" on public.deals
  for delete
  using (public.is_platform_admin() or account_id = public.current_account_id());

-- ---------------------------------------------------------------------------
-- activities
-- ---------------------------------------------------------------------------
alter table public.activities enable row level security;

create policy "activities_select" on public.activities
  for select
  using (public.is_platform_admin() or account_id = public.current_account_id());

create policy "activities_insert" on public.activities
  for insert
  with check (public.is_platform_admin() or account_id = public.current_account_id());

create policy "activities_update" on public.activities
  for update
  using (public.is_platform_admin() or account_id = public.current_account_id())
  with check (public.is_platform_admin() or account_id = public.current_account_id());

create policy "activities_delete" on public.activities
  for delete
  using (public.is_platform_admin() or account_id = public.current_account_id());
