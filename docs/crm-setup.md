# Quantum CRM setup

This is a one-time setup guide for getting `/app` working, both locally and in Vercel.

## 1. Create the Supabase project

1. Go to https://supabase.com/dashboard and create a new project (any region; EU is fine since
   the rest of this stack is UK/EU-based).
2. Once it's provisioned, go to **Project Settings → API** and note down:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ this key bypasses all Row-Level
     Security — never expose it in a `NEXT_PUBLIC_*` variable or client-side code)

## 2. Run the migrations

In the Supabase dashboard, go to **SQL Editor** and run, in order:

1. `supabase/migrations/0001_schema.sql` — creates all tables, indexes, and triggers, and seeds
   the Quantum "platform owner" account row.
2. `supabase/migrations/0002_rls.sql` — enables Row-Level Security on every tenant table and adds
   the `current_account_id()` / `is_platform_admin()` helper functions the policies depend on.

(If you prefer the Supabase CLI: `supabase db push` with these files in `supabase/migrations/`
works the same way, once the CLI is linked to your project.)

## 3. Set environment variables

**Locally** — add to `.env.local` (already gitignored):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

**In Vercel** — Project Settings → Environment Variables — add the same three, scoped to
Production (and Preview if you want CRM testing on preview deployments too). Redeploy after
adding them.

## 4. Create the first user — yourself

There's no public sign-up route, and the `/app/admin` create-account form itself requires you to
already be logged in as a platform admin — so the very first account has to be created directly
in Supabase:

1. In the Supabase dashboard, go to **Authentication → Users → Add user**, create yourself
   (or Mark) with an email + password, and tick "Auto confirm user".
2. In **SQL Editor**, link that auth user to a profile row as a platform admin:

   ```sql
   insert into public.users (id, account_id, role, is_platform_admin, full_name, email)
   values (
     '<the auth user's UUID, from the Users list>',
     (select id from public.accounts where is_platform_owner = true),
     'owner',
     true,
     'Jess',
     'you@example.com'
   );
   ```

3. Log in at `/app/login` with that email/password. You should land on the CRM dashboard with an
   **Admin** link in the nav.

From here on, onboarding a new client account is just filling in the form at `/app/admin` — no
more direct SQL needed.

## What's protected, and how

- `middleware.ts` at the repo root has `matcher: ["/app/:path*"]` — a positive allowlist, so it
  is structurally impossible for it to run against `/`, `/about`, `/services`, `/contact`,
  `/industries`, `/how-it-works`, `/case-studies`, `/resources`, `/legal/*`, `/api/chat`, or
  `/api/contact`. Unauthenticated requests to anything under `/app` are redirected to
  `/app/login`.
- Every server component under `/app/(crm)/**` also calls `requireProfile()` itself
  (`src/lib/supabase/session.ts`), which re-checks the session server-side. This is deliberate
  defense in depth: even if the middleware were ever misconfigured or bypassed, no page would
  render CRM data without a valid session.
- Underneath both of those, every tenant table has Row-Level Security enabled
  (`supabase/migrations/0002_rls.sql`). Every policy checks `account_id = current_account_id()`
  (or `is_platform_admin()`). This is enforced by Postgres itself on every query — it's the layer
  that holds even if there were a bug in the application code above it.
