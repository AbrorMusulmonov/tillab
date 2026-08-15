-- Enable UUID helpers
create extension if not exists "pgcrypto";

do $$ begin
  create type public.user_role as enum ('user', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.contribution_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  avatar_url text,
  role public.user_role not null default 'user',
  created_at timestamptz not null default now()
);

create table if not exists public.text_contributions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  text text not null,
  category text not null,
  text_type text not null,
  region text not null,
  status public.contribution_status not null default 'pending',
  word_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.audio_prompts (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  category text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.audio_contributions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  prompt_id uuid references public.audio_prompts(id),
  audio_url text not null,
  duration integer not null default 0,
  region text,
  age_range text,
  gender text,
  status public.contribution_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.alternative_words (
  id uuid primary key default gen_random_uuid(),
  foreign_word text not null,
  alternatives jsonb not null default '[]'::jsonb,
  definition text,
  category text,
  examples jsonb default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.alternative_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  word text not null,
  alternative text not null,
  explanation text not null,
  status public.contribution_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.text_checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  original_text text not null,
  corrected_text text not null,
  issues jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.analytics_counters (
  key text primary key,
  value integer not null default 0
);

insert into public.analytics_counters (key, value)
values ('text_checks', 0), ('transliterations', 0)
on conflict (key) do nothing;

alter table public.users enable row level security;
alter table public.text_contributions enable row level security;
alter table public.audio_contributions enable row level security;
alter table public.alternative_suggestions enable row level security;
alter table public.alternative_words enable row level security;
alter table public.audio_prompts enable row level security;
alter table public.text_checks enable row level security;
alter table public.analytics_counters enable row level security;

create policy "public read approved alternatives" on public.alternative_words for select using (true);
create policy "public read prompts" on public.audio_prompts for select using (is_active = true);
