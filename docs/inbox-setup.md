# Unified Inbox setup (web chat + email)

One-time setup for the `/app/inbox` feature: the web chat widget and 1:1 email conversations.

## 1. Run the migration

In Supabase → **SQL Editor**, run `supabase/migrations/0003_inbox.sql` (adds `conversations`,
`messages`, a `widget_key` column on `accounts`, RLS policies, and a `regenerate_widget_key()`
function). It'll likely show the same "creates tables without RLS" warning as before — click
**Run without RLS**, since the same file enables RLS a few statements later.

## 2. Web chat widget — nothing else to configure

The widget key is generated automatically per account (`accounts.widget_key`, a random UUID) —
no env vars needed for this half. Once the migration has run, go to **Settings** in `/app` for any
account and you'll see the install snippet. It works on literally any website, not just this one.

## 3. Email — domain + webhook setup (needs your action in Resend + DNS)

**Design decision, restated plainly**: rather than a dedicated sending domain per client (real
DNS work per client, forever), every account's email conversations share **one subdomain**, and
the actual routing key is a unique reply-to address per conversation:
`reply+<conversation-id>@inbound.quantumbusinessconsultants.com`. Trade-off: client-facing "from"
addresses look like `reply+a1b2c3@inbound...` rather than a branded address — functionally
correct, zero ongoing DNS maintenance. If you'd rather have branded per-client sender addresses
later, that's a bigger follow-up (per-client subdomain + DNS verification each time you onboard
someone) — flag it if you want that traded in.

Steps:

1. In Resend → **Domains**, either verify a new subdomain (recommended: something like
   `inbound.quantumbusinessconsultants.com`) or enable **receiving** on a domain you've already
   verified for sending.
2. Resend will show you an **MX record** to add at your DNS provider — copy it exactly as shown
   (the value is generated per-domain, so I can't hand you a fixed one). Add it, then wait for
   Resend to confirm the domain as verified for receiving (DNS propagation can take a few minutes
   to a few hours).
3. In Resend → **Webhooks**, create a new webhook:
   - **Endpoint URL**: `https://www.quantumbusinessconsultants.com/api/webhooks/resend-inbound`
   - **Event**: `email.received`
   - Resend will show you a **signing secret** (starts `whsec_...`) — that's your
     `RESEND_WEBHOOK_SECRET`.
4. **I could not confirm from Resend's public docs which plan tier inbound receiving requires** —
   please check your current plan/pricing page in the Resend dashboard before relying on this;
   if your plan doesn't include it, Resend's dashboard will tell you when you try to enable
   receiving.

## 4. New environment variables (local `.env.local` + Vercel)

```
INBOUND_EMAIL_DOMAIN=inbound.quantumbusinessconsultants.com
RESEND_WEBHOOK_SECRET=whsec_...
INBOX_RESEND_API_KEY=re_...
```

**`INBOX_RESEND_API_KEY` is deliberately a separate key from `RESEND_API_KEY`** — the inbound
domain was verified on a different Resend account than the one already sending the AI
receptionist's lead-capture and contact-form emails, and there was no reason to force both onto
one paid account. `RESEND_API_KEY` is untouched and keeps doing exactly what it did before; the
inbox (outbound replies in `src/lib/resend-email.ts` and the inbound webhook's
`emails.receiving.get()` call) uses `INBOX_RESEND_API_KEY` only.

## How inbound routing actually decides where a message goes

1. **Reply-to tag match** (the normal case): the webhook looks at the email's `to` addresses for
   `reply+<uuid>@...`. If the UUID matches a real `conversations.id`, the message is appended
   straight to that conversation — account is already known from the conversation row.
2. **No tag match** (a first-touch email, or a mail client that stripped the plus-tag): falls back
   to matching the sender's address against `contacts.email` **across every account**. If exactly
   one contact matches, the message joins (or starts) an email conversation for that contact.
3. **Still ambiguous** (zero or multiple contacts share that email across different accounts):
   the message is **not guessed into a tenant** — it's logged into a holding conversation under
   the Quantum platform account, visible only to platform admins, for manual triage. This is
   deliberate: silently guessing the wrong account would be a real tenant-isolation bug, so an
   unresolvable case surfaces for a human instead.

## Known limitation: rate limiting on the public widget API

`src/lib/rate-limit.ts` is an in-memory sliding window — it resets on every cold start and isn't
shared across serverless instances/regions. It stops a single runaway client but is not a hard
guarantee under real distributed abuse. If that becomes a problem in practice, swap it for Upstash
Redis (same function signature, so call sites don't change).
