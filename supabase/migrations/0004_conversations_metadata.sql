-- Fix: findOrCreateWebChatConversation looks up an existing web-chat
-- conversation by the visitor's localStorage session id, stored as
-- channel_metadata->>'session_id' on the conversation row — but 0003 only
-- added channel_metadata to `messages`, not `conversations`. This adds the
-- missing column. No RLS policy changes needed; the existing conversations_*
-- policies already cover the whole row.

alter table public.conversations
  add column if not exists channel_metadata jsonb not null default '{}'::jsonb;
