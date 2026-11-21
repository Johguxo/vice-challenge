create table public.journal_notebooks (
  user_id uuid primary key references auth.users (id) on delete cascade,
  snapshot jsonb not null check (
    jsonb_typeof(snapshot) = 'object'
    and octet_length(snapshot::text) <= 480000
  ),
  revision integer not null default 1 check (revision >= 1),
  created_at timestamptz not null default now()
);

alter table public.journal_notebooks enable row level security;

revoke all on public.journal_notebooks from public, anon, authenticated;
grant select, insert on public.journal_notebooks to authenticated;
grant update (snapshot, revision) on public.journal_notebooks to authenticated;

create policy "Read own journal notebook"
  on public.journal_notebooks for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Create own journal notebook"
  on public.journal_notebooks for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Update own journal notebook"
  on public.journal_notebooks for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('journal-photos', 'journal-photos', false, 786432, array['image/webp', 'image/png']);

create policy "Read own journal photos"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'journal-photos'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "Upload own journal photos"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'journal-photos'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );
