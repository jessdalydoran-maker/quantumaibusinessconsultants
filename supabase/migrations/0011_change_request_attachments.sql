-- Storage bucket for screenshots/videos attached to the public change-request
-- form (/request-change). Unauthenticated visitors upload directly from the
-- browser, so this bucket is public and scoped only to itself — it holds no
-- tenant data and isn't reachable by any other RLS policy in this schema.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'change-request-attachments',
  'change-request-attachments',
  true,
  52428800, -- 50MB per file
  array['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm']
)
on conflict (id) do nothing;

create policy "change_request_attachments_insert" on storage.objects
  for insert
  to anon, authenticated
  with check (bucket_id = 'change-request-attachments');

create policy "change_request_attachments_select" on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'change-request-attachments');
