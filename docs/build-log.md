## Marketing site — dark editorial design system + scroll hero (interactive session)

Requested: overhaul the public marketing site to a premium dark-green/gold editorial look, with a
Cerebrium-style scroll-scale hero animation. Checked the actual codebase first rather than
rebuilding from scratch — the colour tokens, Playfair Display/Work Sans typography, eyebrow
labels, two-line gold-accented headline, two-button CTA pattern, and generous section spacing
requested were **already fully implemented** site-wide (`globals.css`, `PageHero.tsx`,
`Button.tsx`, every public page) from an earlier session. No changes made there — redoing already-
correct work would just be busywork with regression risk.

**What was actually missing and built**: the Cerebrium-style scroll-driven hero. `HeroBanner.tsx`
is now a client component using Framer Motion (`useScroll`/`useTransform`) — the hero image scales
1.28x → 1x → 1.28x across a 130dvh (mobile) to 220dvh (desktop) scroll container, staying `sticky`
while the hero copy scrolls with it, then releases into the marquee section below. A continuous
CSS-keyframe diagonal light sweep (independent of scroll, `mix-blend-mode: screen`) loops across
the image every 3.4s. Added a small circular badge (existing `logo-mark.png`) in the hero's corner,
per the "optional nice-to-have" in the brief. `prefers-reduced-motion` disables both the scale
transform and the light sweep, falling back to a static full-size image.

**Bug found and fixed along the way, not part of the ask but blocking it**: `position: sticky`
was silently broken across the *entire site*, including the existing header nav — `overflow-x:
hidden` on both `html` and `body` in `globals.css`, with no `overflow-y` set, triggers a CSS spec
rule that auto-converts the y-axis to `auto`, turning `body` into its own scroll container
detached from `window`/viewport scroll. Confirmed via Playwright: before the fix, `position:
sticky` elements tracked the outer container 1:1 instead of pinning (verified header nav
scrolled away too, not just the new hero). Fixed by switching both to `overflow-x: clip`, which
prevents horizontal scroll without creating a new scrolling box. Verified via real Playwright
scroll-and-screenshot runs (not just visual inspection) at multiple scroll offsets, desktop and
mobile, before and after the fix.

---

# Build Log — Autonomous session, Prompts 4–10

This log records every judgment call made without stopping to ask, per the "Autonomous Build
Mode" ground rules: what was decided, what was chosen, why, and the trade-off accepted. Read this
after the build, not during — nothing here was blocked on confirmation.

---

## Prompt 11 — Live verification fixes

Two real bugs found and fixed by testing against Retell's actual live API and current docs,
exactly the point of this prompt — both were flagged in the Prompt 9 entry above as
unconfirmed, and both turned out to be wrong as originally written:

**Fix 1 — webhook signature verification was checking the wrong thing entirely.**
`src/lib/retell.ts`, `verifyRetellSignature`. The original best-effort version HMAC'd the raw
body alone and compared it directly against the signature header as a bare hex string. Retell's
actual current docs (`docs.retellai.com/features/secure-webhook`, not the stale
`Retell.verify()` SDK-helper example their webhook-overview page still shows — that helper does
not exist in the installed `retell-sdk` 5.48.0, confirmed by grepping the entire package for any
`webhooks`/`verify`/`sign` export) specify: the header format is `v={timestamp},d={hex_digest}`,
the signed payload is `rawBody + timestamp` concatenated (not rawBody alone), and there's a
5-minute replay-protection window to enforce. Every previous call to this webhook would have
been rejected as invalid — a fail-safe outcome (nothing gets through unverified), but nothing
would have worked either. Fixed and self-tested against 5 cases (valid signature, tampered body,
wrong signature, stale timestamp, malformed header) — all 5 behave correctly now.

**Fix 2 — the `transfer_call` tool shape was missing a required field.**
`src/lib/retell.ts`, `createOrUpdateRetellAgent`. Tested live against the real Retell API:
the `custom` tool (`book_appointment`) was accepted as originally written — that part of Prompt
9's guess was correct. The `transfer_call` tool was rejected outright (400) because it was missing
a required `transfer_option` field alongside `transfer_destination` — confirmed against the
SDK's own TypeScript types (`resources/llm.d.ts`) once the live API's error pointed at it. Added
`transfer_option: { type: "cold_transfer" }` (the simplest option — no warm hand-off/introduction
to the human before connecting). Re-tested live after the fix: accepted.

**Also confirmed working, unchanged**: `client.llm.create()` / `client.agent.create()` with
`general_prompt`, `voice_id: "11labs-Adrian"`, `response_engine: { type: "retell-llm", llm_id }`
— created a real agent and LLM against the live API on the first attempt, no changes needed.
Tested the full conversation flow via Retell's free `playground.completion()` API (text-based,
no phone number needed): the agent answered from `business_context` with no invented facts, and
correctly called `book_appointment` with well-formed ISO 8601 arguments once the caller confirmed
a specific time — exactly the tool-calling behavior Prompt 7/9 intended. Test agent/LLM deleted
after verification.

**Deployment gap found, and this one WAS a code defect**: while testing the `book_appointment`
webhook end-to-end, the real HTTP call to
`quantumbusinessconsultants.com/api/webhooks/retell-function` returned a genuine Vercel 404
(`X-Matched-Path: /404`), not our route. Every route added across Prompts 5–10 had never
actually gone live. Root cause, confirmed directly in the Vercel UI when attempting a manual
deploy: **every deployment since `vercel.json`'s cron config was added (Prompt 8) had been
rejected outright** — "Hobby accounts are limited to daily cron jobs. This cron expression
(`*/15 * * * *`) would run more than once per day. Upgrade to the Pro plan..." This is the exact
risk flagged in the Prompt 8 log entry above, except worse than described there: I'd only
anticipated the cron itself silently degrading to once-daily on Hobby, not that Vercel would
refuse the entire deployment over it, taking every other route down with it. Fixed by changing
`vercel.json`'s schedule to `0 8 * * *` (once daily, Hobby-compatible) — scheduled campaigns now
send once a day rather than checking every 15 minutes, an accepted degradation until/unless the
Vercel plan is upgraded to Pro. This one thing being wrong is why production had silently been
running code from before Prompt 6 for the entire second half of this session.

**Full end-to-end pass, once the deployment gap was fixed**: re-ran the same
`book_appointment` conversation via `playground.completion()` against the real deployed
`/api/webhooks/retell-function` — the tool call succeeded (`"successful": true`), and a real
`appointments` row plus a real `ai_actions_log` row were created with correct data, confirmed
directly in Supabase. `contact_id` was correctly `null` (Retell's playground test has no real
phone number attached, so no contact to match — expected, not a bug), and `activities` was
correctly NOT logged for the same reason (that log only fires when a contact exists). Both test
resources (agent, LLM, the two DB rows) deleted after verification. **What remains genuinely
unverified**: the `calls` table population from a real `call_ended`/`call_analyzed` webhook, and
contact-matching-by-phone-number during an actual call — both require a real phone call (or at
minimum a real Retell phone number), which wasn't provisioned in this session (see the live chat
transcript for the cost/decision context).

**Part C — Google Places Lead Finder: fully verified, real browser session.** Confirmed
`GOOGLE_PLACES_API_KEY` is valid and "Places API (New)" + billing are active (a real 200 with
real business data, not a billing/auth error). Logged into the actual deployed site with a real
browser, ran a real search ("plumbers" / Belfast) through the genuine `/app/contacts/find` UI —
14 real local plumbing businesses returned with name/address/phone/website/rating. Selected two,
clicked the real "Import Selected" button, confirmed both landed in `/app/contacts` with correct
data. Re-ran the identical search: both previously-imported businesses correctly showed "Added"
with no checkbox — `place_id` dedup confirmed working end-to-end through the real UI, not just
the underlying logic. All test contacts (34 total — some created by parallel testing outside this
session) deleted afterward; `lead_searches` audit log entries left in place, since persisting is
the intended behavior of that table.

**Twilio (Part A) remains blocked**, unrelated to any of this code — the Twilio trial account is
under identity/compliance review, so no phone number could be provisioned to test against. Nothing
found in this session suggests the SMS/WhatsApp code itself has a problem; it simply hasn't been
exercised against a live number yet.

---

## Prompt 4 — Fix stale site.url

**Status: already completed in an earlier session**, verified again at the start of this run —
`site.ts`'s `url` field correctly reads `https://www.quantumbusinessconsultants.com` with no
trailing slash, and no other file references the old `aibusinessconsultants.co.uk` domain outside
the intentionally-kept `legacyDomain` field (used only for an outbound email From: header, a
separate deliberate decision from an earlier session). No action needed.

---

## Prompt 5 — Account plans & feature flags

**Decision: added `plan_tier` and `features` directly to the existing `accounts` table**, not a
new linked table. Why: it's a strict 1:1 relationship with account, there's no need to query it
independently of the account row, and every other account-level setting (`plan`, `widget_key`)
already lives there — a separate table would just add a join for no benefit. Trade-off: none
significant at this scale; would reconsider only if per-account settings grow large enough to
warrant their own versioned/audited table.

**Decision: kept the pre-existing `accounts.plan` text column as-is, untouched, alongside the new
`plan_tier`.** `plan` was already there (free-text, default `'starter'`, cosmetic — nothing reads
it for access control) from the original CRM build. Renaming or removing it wasn't asked for and
risked touching a column some other part of the app might reference; simplest and safest was to
leave it exactly alone and add the new, actually-enforced `plan_tier` alongside it. Trade-off: the
admin UI now shows two "plan-shaped" fields with different purposes, which is mildly confusing —
worth a follow-up cleanup later to fold `plan` into `plan_tier` or drop it, but out of scope here.

**Decision: only added the `accountHasFeature` gate to the Inbox routes among existing features**
(`/app/inbox`, `/app/inbox/[id]`, the inbox server actions, `/app/settings/widget`) — not to
Contacts or Deals. Why: every plan tier includes `contacts`, `deals`, and `inbox` as baseline, so
a gate on Contacts/Deals today would always evaluate true — pure inert code with no behavioral
effect, but non-zero risk of a typo breaking an already-working, already-tested page for no
benefit. Inbox got the gate anyway because the prompt explicitly named it as the reference
example. The nav array in `/app/(crm)/layout.tsx` already has gated entries reserved for Calls
(`voice_ai`) and Campaigns (`broadcast_email`), ready for Prompts 8 and 9 to fill in.

**Decision: platform-admin feature-override toggles use an explicit "Save" button per row, not
auto-submit-on-change.** Auto-submit-on-select-change needs an `onChange` handler, which requires
a Client Component — the whole admin page is a Server Component today (simpler, no client-side
Supabase calls needed for this page). Added one extra click per change rather than pull in a
Client Component wrapper just for this. Trade-off: marginally more clicks for the platform admin,
never for client account users (who don't see this UI at all).

**Note, not a decision**: Prompt 8 says "reuse the Content AI generation flow from Prompt 3 if it
exists," and Prompt 9 says "reuse Prompt 7's book_appointment action if it exists." Content AI
(Prompt 3) was never built against this repo — confirmed by grepping for `brand_profile`,
`content_ai`, `social_post` before starting, all empty. Prompt 7 (Conversation AI) IS being built
later in this same session, so by the time Prompt 9 runs, `book_appointment` will genuinely exist
and get reused as intended. The `content_ai` / `social_scheduling` feature keys are defined in
`src/lib/features.ts` now (so `crm_content` is a meaningful tier the moment that feature exists)
but have no routes to gate yet — this is expected, not a gap.

---

## Prompt 6 — SMS + WhatsApp via Twilio

**Decision: each account gets its own dedicated Twilio phone number, not a shared pool number.**
The prompt asked me to propose whichever is simpler and explain the trade-off. Email's per-
conversation `reply+<id>@domain` trick works because email addresses support arbitrary local-part
encoding (plus-addressing); phone numbers have no equivalent — there's no way to embed a
conversation or account ID into an SMS/WhatsApp address. A shared number would need an artificial
workaround (e.g. asking every contact to text a keyword first), which is more fragile and a worse
experience than just giving each account its own number. Twilio's inbound webhook already tells
you which of your numbers received the message (`To` field), so a dedicated number turns routing
into a direct, unambiguous lookup — this is the simpler design, not just the safer one. Trade-off:
real ongoing cost (~$1/month per Twilio number) and one number to provision per client, accepted
as the cost of correct multi-tenant routing.

**Decision: WhatsApp via Twilio's WhatsApp Business API, not Meta's Cloud API directly.** The
prompt asked me to pick whichever has a clearer path. Since SMS already goes through Twilio, using
Twilio's WhatsApp product means one account, one API, one webhook shape, one billing relationship
— Twilio handles the underlying Meta relationship. Going direct to Meta's Cloud API would mean a
second, unrelated developer platform (Meta for Developers), a separate access-token/app-review
lifecycle, and a differently-shaped webhook payload, for a large business already going through
Twilio for SMS. Clearer path, not just simpler — same reasoning as the prompt's own hint.

**Decision: number provisioning is manual, not automated.** I did not call Twilio's
buy-a-number API programmatically — purchasing a phone number is a real financial commitment
(small, recurring), and taking that action autonomously isn't something I'll do without your
explicit say-so per purchase. `/app/settings/sms` instead asks you to buy/reserve the number in
the Twilio Console yourself, then paste the E.164 number in — same manual-handoff pattern already
used for Cal.com and the Resend inbound domain earlier in this project.

**Decision: WhatsApp template send uses the stored `provider_content_sid` directly, not a
template-authoring/submission flow.** Per the prompt's explicit scope ("no template
creation/submission UI yet — assume templates are set up manually via Meta Business Manager").
`/app/settings/templates` is just a record-keeping form: paste in the name/body/approval status
and the real Content SID once Meta/Twilio have approved it elsewhere. Sending with a `contentSid`
outside the 24-hour window will only actually succeed once that SID is genuinely approved in
Twilio/Meta — that's expected provider-side behavior, not a bug in this code.

**Decision: delivery status (sent/delivered/failed) is stored in `messages.channel_metadata`,
not a new column.** Matches the pattern already used for email (`subject`, `message_id`, etc. also
live in `channel_metadata`) rather than adding channel-specific columns to a shared table.

**Flag (compliance, not a code decision) — restating from the prompt**: WhatsApp requires Meta
Business verification and WhatsApp Business Account approval before this can go live for a real
client, entirely separate from the Twilio account itself. See the final consolidated summary for
the concrete account-setup checklist and order of operations.

---

## Prompt 7 — Conversation AI (inbox auto-reply)

**Flagging the confidence-threshold judgment call, exactly as the prompt asked me to.** Claude's
API does not expose a numeric confidence score — there is no real "is this reply confident enough"
signal to read. What I built instead (`src/lib/conversation-ai.ts`, `LOW_CONFIDENCE_PHRASES`) is a
plain keyword check against the AI's *own drafted reply* — if it contains a hedge like "I'm not
sure" / "speak to a human" / "let me check with", that's treated as low-confidence and the message
falls back to a draft rather than auto-sending, even in `auto_reply` mode. This is a heuristic, not
a measurement, and it will occasionally over-escalate (a confident reply that happens to contain
one of these phrases gets held back unnecessarily) — deliberately, per the prompt's own steer:
"I'd rather you default to draft_only behaviour when in doubt." It will almost never
under-escalate in a way that matters, since escalation keywords (configured per account) are
checked independently and unconditionally regardless of this heuristic.

**Decision: AI drafts live in their own `ai_drafts` table (one row per conversation, upserted),
not a "draft" flag on `messages`.** This was a deliberate risk-reduction choice: the existing
`messages` table and every UI/query that reads it (inbox list, thread view, contact activity)
already assumes every row is a real, sent message. Adding a draft state there would have meant
auditing and changing that assumption everywhere it's read, with real risk of a draft leaking
into a "sent" view somewhere. A separate table can never be misread as a sent message, at the cost
of one small extra query on the thread page.

**Decision: a human clicking "Approve & Send" on an AI draft records the message as sent by that
human (`sender_type: 'user'`), not as `sender_type: 'ai'`.** Reasoning: the prompt's actual
guarantee for `draft_only` mode is "never sent without a human clicking send" — once a person has
reviewed (and had the chance to edit) the text and deliberately sent it, that's a human action,
distinct from `auto_reply` mode's genuinely unattended sends (which correctly get
`sender_type: 'ai'` and a visible "AI-sent" badge in the thread UI, per the prompt's explicit
requirement not to disguise those). This only affects who gets attributed for an approved draft —
it doesn't change when anything is allowed to send.

**Decision: the AI trigger hooks into `appendMessage()` in `src/lib/inbox.ts`**, the one function
already shared by all three inbound entry points (widget, Resend inbound webhook, Twilio inbound
webhook), rather than adding a call in each of the three webhook routes separately. Guarded to only
fire on `direction: 'inbound'` + `sender_type: 'contact'`, and wrapped in try/catch so a Conversation
AI failure (bad API response, Anthropic outage, etc.) can never break the actual message-ingestion
path those three webhooks depend on. None of the three existing webhook routes needed to change.

**Decision: built a new, minimal `appointments` table for `book_appointment` rather than touching
the existing Cal.com discovery-call booking system.** They serve different purposes — Cal.com
books discovery calls for Quantum's own marketing site; `appointments` is a per-client-account CRM
record for whatever the AI books on that client's behalf (e.g. a plumber's callout slot). Conflating
them would have coupled two systems that have no reason to know about each other. The `book_appointment`
tool does a simple overlap check against existing `appointments` rows before booking and asks the
model to offer a different time if one conflicts — genuine "checks availability," just against
this CRM's own record rather than an external calendar.

**Decision: reused `ANTHROPIC_API_KEY`, not a separate key.** Unlike the two Resend accounts
(a real, pre-existing split), there's no indication of more than one Anthropic account in this
project — the AI receptionist on the marketing site and this Conversation AI feature are the same
underlying service, so one key is simplest. Added a distinct `CONVERSATION_AI_MODEL` env var
(defaults to `claude-sonnet-5`) so the model choice for this feature isn't hard-coupled to the
marketing site's chat widget's model choice, in case they ever need to diverge.

---

## Prompt 8 — Broadcast email campaigns

**Decision: campaign body is a plain HTML textarea, not a reused Content AI generation flow.**
The prompt said to reuse Prompt 3's Content AI "if it exists" — confirmed again it doesn't exist
in this repo (see Prompt 5's note above). Building a real content-generation feature was
explicitly out of scope for this prompt, so the campaign builder is just a subject + raw HTML body
field for now — a real gap to fill later if/when Content AI gets built, not a corner cut within
this prompt's own scope.

**Decision: campaign sends reuse `INBOX_RESEND_API_KEY` and `INBOUND_EMAIL_DOMAIN`** (from
`campaigns@<that domain>`), not a third Resend setup. This is still "sending email," on the
account whose domain is already correctly verified for sending — no reason to introduce a third
key/domain pair for what is functionally the same capability (verified outbound send) already
solved in Prompt 6.

**Decision: unsubscribe links are HMAC-signed**, not a bare `?account=X&contact=Y` URL. Without a
signature, anyone could unsubscribe an arbitrary contact from an arbitrary account just by
guessing/enumerating UUIDs in the URL — a real (if low-severity) tenant-integrity issue for a
public, unauthenticated endpoint. `UNSUBSCRIBE_SECRET` signs `account_id:contact_id`, verified with
a constant-time comparison on the public `/unsubscribe` page before it writes anything.

**Decision: sends are batched via Resend's actual batch endpoint** (`resend.batch.send`, up to 100
emails per call), not a loop of 100+ individual `emails.send` calls — this is a real API feature
built for exactly this case, not homemade throttling. Added a flat 500ms pause between chunks as a
simple, conservative rate-limit backstop; I don't know this account's actual per-second send limit
so this isn't tuned to it, just a sane default.

**Decision: scheduled sends run via a new Vercel Cron** (`vercel.json`, every 15 minutes hitting
`/api/cron/send-scheduled-campaigns`), protected by a `CRON_SECRET` bearer token (Vercel's own
documented pattern for securing cron routes) — not by reusing an existing cron, since Prompt 3's
"content posting cron" the spec referenced doesn't exist in this repo. **Flag: Vercel Cron Jobs
run at most once per day on the Hobby plan** — a 15-minute schedule needs a Pro plan (or higher)
to actually fire that often; on Hobby it will silently only run once/day. Check the current Vercel
plan before relying on this for real time-sensitive scheduled sends.

**Decision: did NOT auto-create the second Resend webhook (`email.bounced`/`opened`/`clicked` →
`/api/webhooks/resend-campaign-events`) via the API**, unlike the inbound-email webhook created
automatically in an earlier interactive session. Creating a webhook subscription is a real,
side-effecting action against a live third-party account — reasonable to do with the user
actively present and asking for it step-by-step (as happened earlier), not reasonable to do
autonomously in a batch run with nobody watching. This is listed as a manual step in the final
summary instead.

**Flag (compliance, not a code decision) — restating from the prompt**: this is real email
marketing law territory (UK PECR/GDPR, and CAN-SPAM if any contacts are US-based). A working
unsubscribe link is necessary but not sufficient — a proper consent basis for marketing email is a
business-side requirement on you per client, not something this code can verify or enforce.

---

## Prompt 9 — Voice AI (Retell vs Vapi)

**Decision: Retell AI, not Vapi.** Researched both live rather than relying on possibly-stale
knowledge (per the prompt's own instruction, since "this space moves fast"). Retell's pricing page
explicitly and clearly confirmed every capability this integration needs in one place: call
transfer, webhooks/API access in the base plan, straightforward per-minute pricing
($0.07–$0.31/min), $2/month numbers, and flexible telephony (own numbers or Twilio/Telnyx). Vapi is
comparably priced ($0.05/min) and does support custom tool-calling (confirmed via their docs), but
the specific pages I could fetch didn't confirm human call-transfer or end-of-call webhook/
transcript delivery — not necessarily absent, just not confirmed from what I could check without
an account. Given both are close on capability and price, I went with the one I could actually
verify meets every requirement from public docs alone. This is a fast-moving space — worth a quick
re-check against both platforms' current docs before actually onboarding the first real client, in
case pricing or features have shifted.

**Flag — this integration has more unverified surface area than any other prompt in this session,
and I want that stated plainly rather than buried:**
1. **Webhook signature verification** (`src/lib/retell.ts`, `verifyRetellSignature`): Retell's docs
   describe using a bundled SDK helper (`Retell.verify(...)`) to check the `x-retell-signature`
   header, but the currently-published `retell-sdk` npm package (5.48.0) has no such export in its
   type definitions — it's a modern auto-generated API client with agent/call/LLM resources, no
   webhook helper. What's implemented is a best-effort HMAC-SHA256 of the raw body using the API
   key as the secret, matching Retell's documented *description* but not confirmed against a real
   webhook delivery. **Test this against an actual Retell account's webhook before trusting it in
   production** — if it's wrong, every inbound call-ended/function-call webhook will be silently
   rejected (safe failure — nothing gets through unverified — but also nothing works until fixed).
2. **Agent/LLM configuration shape** (`createOrUpdateRetellAgent`): the `general_tools` array shape
   (custom function + transfer_call types), the `response_engine` shape, and the placeholder
   `voice_id` (`"11labs-Adrian"`) are Retell's documented conventions at time of writing. The build
   compiled cleanly against the SDK's actual TypeScript types, which is a good sign the shape is at
   least plausible, but I have no live account to actually provision an agent and confirm it works
   end-to-end. Expect to adjust field names/values against the real Retell dashboard when
   provisioning the first client.
3. **Custom function-call payload shape** (`/api/webhooks/retell-function`): the fields I read off
   the incoming request (`call.call_id`, `call.from_number`, `name`, `args`) follow Retell's
   documented convention for custom tool calls but are likewise unconfirmed against a live call.

None of this blocked building the integration layer itself, which is what this prompt asked for —
it's flagged because getting a signature-verification algorithm wrong is exactly the kind of thing
that should never be quietly assumed correct.

**Decision: reused `executeBookAppointment` from Prompt 7 directly**, exactly as the prompt asked
("reuse the same booking logic as the book_appointment action from Prompt 7's tool-calling") —
same conflict check, same `appointments` table, same activity log. Only change needed was widening
`conversationId` to accept `null`, since a phone call has no inbox conversation to link the
`ai_actions_log` entry to (the column is a real foreign key to `conversations`, so passing a
Retell call ID there instead of `null` would have violated it and silently failed every voice
booking's audit-log entry).

**Decision: business_context on `voice_agents` is a separate copy, not a live foreign reference
to `ai_settings.business_context`.** The prompt said to reuse the inbox AI's context "where
sensible" — the voice settings page pre-fills the textarea from `ai_settings.business_context` if
it exists (so there's no duplicate data entry for the common case), but saves its own copy. Reason:
phone answers often need to be shorter/differently-phrased than chat/email replies, and account
owners should be able to tailor one without silently changing the other. A live shared reference
would mean editing chat AI behavior accidentally changes what the phone agent says, which isn't
obviously the right default.

**Decision: phone number provisioning is manual**, same reasoning as Twilio numbers in Prompt 6 —
buying/assigning a number is a real financial commitment I won't take autonomously. The settings
page displays whatever number is on file but doesn't call Retell's number-purchase API. See the
final summary for the exact manual steps.

---

## Prompt 10 — Contacts Lead Finder (Google Places + single-site pull)

**Decision: Places API (New)`places:searchText`, not the legacy Text Search JSON endpoint.**
Checked Google's current docs rather than assume — they no longer clearly document the legacy
endpoint's status and actively steer toward "Places API (New)" for anything current, so building
against the one they're actively documenting is the safer bet for something meant to keep working.

**Flag — real cost implication worth knowing, not a code decision**: Google's own docs confirm that
requesting phone number and website fields (both of which this feature explicitly needs) moves
the request onto the higher "Enterprise" SKU pricing tier, not the base Places API tier. A search
returning only name/address would be cheaper but far less useful for lead-gen — I built it
requesting the full useful field set, which is the right call for this feature, but it means the
cost-per-search is the Enterprise rate. Check current Google Cloud pricing for that SKU before
running large volumes of searches.

**Decision: added a dedicated `website` column to `contacts`**, not a custom field. The prompt
explicitly offered either option. A dedicated column is simpler to query/display/dedupe against
consistently across every contact regardless of whether an account has bothered to define a
"Website" custom field for itself — custom fields are account-defined and optional by design
(Prompt-era CRM feature), which would make "does this contact have a website on file" an
inconsistent question to ask across accounts.

**Decision: single-site pull prioritizes `mailto:`/`tel:` links over free-text regex** for
email/phone, only falling back to scanning visible text if no structured link exists. Reasoning:
a `mailto:` link is the site owner's own explicit, structured statement of their contact email —
far more reliable than pattern-matching arbitrary page text, which can pick up an unrelated email
address (a copyright footer, a third-party badge, etc.). Address extraction is a plain UK-postcode
regex heuristic only, explicitly best-effort — there's no reliable general way to extract a
structured address from arbitrary HTML without a much heavier parsing approach, which the brief
explicitly ruled out ("straightforward text/pattern extraction, not a general-purpose crawler").

**Decision: "Preview Count" / search results render via GET query-param reloads**, not client-side
JS state — consistent with every other filter/preview pattern already used elsewhere in this CRM
(contacts tag filter, campaign audience preview). Keeps the whole feature server-rendered with no
new client-side state management, at the cost of a full page reload per search rather than an
in-place update.

**Restating the compliance note, exactly as the prompt required it stated plainly**: importing
business contact details this way is generally fine for B2B outreach under UK GDPR/PECR's
legitimate interest basis — this is business context, a business's own published contact details,
not an individual's personal information. But the person using this feature is responsible for:
(1) always including a working opt-out/unsubscribe option in any outreach sent to these contacts
(the existing broadcast email feature from Prompt 8 already provides this), and (2) not importing
or contacting personal/individual (non-business) email addresses found incidentally on a site —
e.g. a named individual's personal Gmail address that happens to appear on a page, as opposed to
a business's own general enquiries address.
