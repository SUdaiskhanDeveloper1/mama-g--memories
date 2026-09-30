-- Safdar Khan Memorial — Supabase schema
-- Run once in the Supabase SQL editor (Project → SQL → New query).
-- Principles: visitors can only INSERT pending memories; nothing is public until an admin approves it;
-- only users listed in `admins` can read/modify everything.

create extension if not exists pgcrypto;

-- ── admins ─────────────────────────────────────────────────────────────────
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins for select to authenticated using (user_id = auth.uid());

-- ── memories ───────────────────────────────────────────────────────────────
create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null check (char_length(title) between 1 and 160),
  story text not null check (char_length(story) between 20 and 60000),
  translation text check (translation is null or char_length(translation) <= 60000),
  contributor_name text not null check (char_length(contributor_name) between 1 and 120),
  relationship text not null check (char_length(relationship) between 1 and 60),
  relationship_group text not null default 'others'
    check (relationship_group in ('family','friends','colleagues','students','grandchildren','nephews','others')),
  memory_date text check (memory_date is null or char_length(memory_date) <= 60),
  location text check (location is null or char_length(location) <= 120),
  categories text[] not null default '{}',
  identities text[] not null default '{}',
  language text not null default 'en' check (language in ('en','ur','ps')),
  quote text check (quote is null or char_length(quote) <= 300),
  photos jsonb not null default '[]'::jsonb,
  audio_url text,
  video_url text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  featured boolean not null default false,
  is_private boolean not null default false,
  consent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists memories_status_idx on public.memories (status, is_private, created_at desc);

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists memories_touch on public.memories;
create trigger memories_touch before update on public.memories for each row execute function public.touch_updated_at();

alter table public.memories enable row level security;

drop policy if exists "public reads approved" on public.memories;
create policy "public reads approved" on public.memories for select to anon, authenticated
  using (status = 'approved' and is_private = false);

-- Visitors may only ever create a PENDING, non-featured row with consent given.
drop policy if exists "visitors submit pending" on public.memories;
create policy "visitors submit pending" on public.memories for insert to anon, authenticated
  with check (status = 'pending' and featured = false and consent = true);

drop policy if exists "admins manage memories" on public.memories;
create policy "admins manage memories" on public.memories for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ── gallery photographs (admin-managed) ────────────────────────────────────
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  src text not null,
  thumb text,
  width int,
  height int,
  caption text,
  photo_date text,
  location text,
  people text[] not null default '{}',
  categories text[] not null default '{memories}',
  memory_slug text references public.memories (slug) on delete set null on update cascade,
  created_at timestamptz not null default now()
);
alter table public.photos enable row level security;
drop policy if exists "public reads photos" on public.photos;
create policy "public reads photos" on public.photos for select to anon, authenticated using (true);
drop policy if exists "admins manage photos" on public.photos;
create policy "admins manage photos" on public.photos for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── timeline (additions to the built-in, sourced dates) ────────────────────
create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  date_label text not null,
  sort_key numeric not null,
  title text not null,
  body text,
  memory_slug text,
  kind text not null default 'memory' check (kind in ('life','memory')),
  created_at timestamptz not null default now()
);
alter table public.timeline_events enable row level security;
drop policy if exists "public reads timeline" on public.timeline_events;
create policy "public reads timeline" on public.timeline_events for select to anon, authenticated using (true);
drop policy if exists "admins manage timeline" on public.timeline_events;
create policy "admins manage timeline" on public.timeline_events for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── removal / correction requests ──────────────────────────────────────────
create table if not exists public.removal_requests (
  id uuid primary key default gen_random_uuid(),
  memory_slug text not null,
  memory_title text,
  name text not null check (char_length(name) <= 120),
  contact text not null check (char_length(contact) <= 160),
  message text not null check (char_length(message) <= 2000),
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.removal_requests enable row level security;
drop policy if exists "anyone requests removal" on public.removal_requests;
create policy "anyone requests removal" on public.removal_requests for insert to anon, authenticated with check (resolved = false);
drop policy if exists "admins manage requests" on public.removal_requests;
create policy "admins manage requests" on public.removal_requests for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── storage ────────────────────────────────────────────────────────────────
-- media     : public, web-optimised images / voice / video (served to visitors)
-- originals : private, untouched original photographs (admins only)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('media', 'media', true, 52428800,
   array['image/webp','image/jpeg','image/png','audio/webm','audio/ogg','audio/mp4','audio/mpeg','audio/wav','audio/x-m4a','video/mp4','video/webm','video/quicktime']),
  ('originals', 'originals', false, 62914560, null)
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "visitors upload media" on storage.objects;
create policy "visitors upload media" on storage.objects for insert to anon, authenticated
  with check (bucket_id in ('media','originals'));

drop policy if exists "admins read originals" on storage.objects;
create policy "admins read originals" on storage.objects for select to authenticated
  using (bucket_id = 'originals' and public.is_admin());

drop policy if exists "admins manage storage" on storage.objects;
create policy "admins manage storage" on storage.objects for all to authenticated
  using (bucket_id in ('media','originals') and public.is_admin())
  with check (bucket_id in ('media','originals') and public.is_admin());

-- ── make yourself the first administrator ──────────────────────────────────
-- 1. Authentication → Users → “Add user” (email + password, auto-confirm).
-- 2. Then run, replacing the email:
--   insert into public.admins (user_id) select id from auth.users where email = 'family@example.com';
-- Also disable public sign-ups: Authentication → Providers → Email → “Allow new users to sign up” = off.
