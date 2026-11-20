create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9_]{3,32}$'),
  display_name text not null check (char_length(display_name) between 1 and 80),
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'mod', 'admin')),
  created_at timestamptz not null default now()
);

create table public.challenges (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references public.profiles (id) on delete set null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 80),
  description text not null check (btrim(description) <> ''),
  rules text[] not null check (cardinality(rules) > 0 and array_position(rules, null) is null),
  mode text not null check (mode in ('speed', 'impossible', 'community')),
  difficulty integer not null check (difficulty between 1 and 5),
  verification_level text not null check (verification_level in ('community', 'verified', 'featured')),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  is_weekly boolean not null default false,
  is_example boolean not null default false,
  created_at timestamptz not null default now()
);

create index challenges_creator_idx on public.challenges (creator_id);
create index challenges_published_created_idx on public.challenges (created_at desc, id)
  where status = 'published';
create index challenges_published_mode_idx on public.challenges (mode, created_at desc, id)
  where status = 'published';
create unique index challenges_published_weekly_idx on public.challenges (is_weekly)
  where is_weekly and status = 'published';

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  evidence_url text not null check (btrim(evidence_url) <> ''),
  claimed_time_ms integer check (claimed_time_ms > 0),
  notes text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index submissions_challenge_idx on public.submissions (challenge_id, status, claimed_time_ms, id);
create index submissions_user_idx on public.submissions (user_id);

alter table public.profiles enable row level security;
alter table public.challenges enable row level security;
alter table public.submissions enable row level security;

revoke all on public.profiles, public.challenges, public.submissions from public, anon, authenticated;
grant select (id, username, display_name, avatar_url) on public.profiles to anon, authenticated;
grant select on public.challenges to anon, authenticated;
grant select (id, challenge_id, user_id, claimed_time_ms, status) on public.submissions to anon, authenticated;

create policy "Public profiles are readable"
  on public.profiles for select to anon, authenticated
  using (true);

create policy "Published challenges are readable"
  on public.challenges for select to anon, authenticated
  using (status = 'published');

create policy "Approved times on published challenges are readable"
  on public.submissions for select to anon, authenticated
  using (
    status = 'approved'
    and claimed_time_ms is not null
    and exists (
      select 1 from public.challenges
      where challenges.id = submissions.challenge_id
        and challenges.status = 'published'
        and challenges.verification_level <> 'community'
    )
  );
