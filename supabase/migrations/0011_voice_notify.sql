-- Voice AI: drop the human-transfer fallback in favour of an unconditional
-- "email the client care team after every call" notification. See
-- docs/build-log.md for the reasoning.

alter table public.voice_agents drop column if exists fallback_phone_number;
alter table public.voice_agents add column if not exists notification_email text not null default '';

-- `status` used to include 'transferred_to_human', which no longer applies
-- now that there's no transfer tool. Whether the AI actually resolved the
-- caller's need is now tracked separately via `resolved` (populated from
-- Retell's call_successful analysis, null until that analysis arrives).
alter table public.calls drop constraint if exists calls_status_check;
alter table public.calls add constraint calls_status_check check (status in ('completed', 'failed'));
update public.calls set status = 'completed' where status = 'transferred_to_human';

alter table public.calls add column if not exists resolved boolean;
