-- =======================================================
-- BathalaFlix — Supabase Schema & RLS
-- Run this in your Supabase SQL Editor
-- =======================================================

-- -------------------------
-- PROFILES
-- -------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  created_at timestamptz default now()
);

-- -------------------------
-- WATCHLIST
-- -------------------------
create table if not exists public.watchlist (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  media_type text check (media_type in ('movie','tv')) not null,
  tmdb_id bigint not null,
  title text not null,
  poster_path text,
  backdrop_path text,
  created_at timestamptz default now(),
  unique(user_id, media_type, tmdb_id)
);

-- -------------------------
-- WATCH PROGRESS
-- -------------------------
create table if not exists public.watch_progress (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  media_type text check (media_type in ('movie','tv')) not null,
  tmdb_id bigint not null,
  season int,
  episode int,
  duration_seconds int,
  current_seconds int,
  progress_percent numeric(5,2),
  last_event text,
  last_seen_at timestamptz default now()
);

-- Create unique index instead of constraint
create unique index if not exists watch_progress_unique_idx 
  on public.watch_progress (user_id, media_type, tmdb_id, coalesce(season, 0), coalesce(episode, 0));

-- -------------------------
-- ENABLE RLS
-- -------------------------
alter table public.profiles enable row level security;
alter table public.watchlist enable row level security;
alter table public.watch_progress enable row level security;

-- -------------------------
-- PROFILES POLICIES
-- -------------------------
create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- -------------------------
-- WATCHLIST POLICIES
-- -------------------------
create policy "Watchlist readable by owner"
  on public.watchlist for select
  using (auth.uid() = user_id);

create policy "Watchlist insert by owner"
  on public.watchlist for insert
  with check (auth.uid() = user_id);

create policy "Watchlist update by owner"
  on public.watchlist for update
  using (auth.uid() = user_id);

create policy "Watchlist delete by owner"
  on public.watchlist for delete
  using (auth.uid() = user_id);

-- -------------------------
-- WATCH PROGRESS POLICIES
-- -------------------------
create policy "Progress readable by owner"
  on public.watch_progress for select
  using (auth.uid() = user_id);

create policy "Progress insert by owner"
  on public.watch_progress for insert
  with check (auth.uid() = user_id);

create policy "Progress update by owner"
  on public.watch_progress for update
  using (auth.uid() = user_id);

create policy "Progress delete by owner"
  on public.watch_progress for delete
  using (auth.uid() = user_id);

-- -------------------------
-- OPTIONAL: Trigger to auto-create profile on signup
-- -------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
