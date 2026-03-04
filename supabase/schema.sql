-- PRISM Supabase schema
-- Run this once against your Supabase project via the SQL editor.

create extension if not exists "pgcrypto";

-- ── users ─────────────────────────────────────────────────────────────────────

create table if not exists public.users (
  id         uuid primary key references auth.users(id) on delete cascade,
  username   text unique,
  full_name  text,
  created_at timestamptz default now()
);

-- ── assessments ───────────────────────────────────────────────────────────────

create table if not exists public.assessments (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  answers    jsonb not null,
  created_at timestamptz default now()
);

-- Unique constraint: one active assessment per user (upsert target)
create unique index if not exists assessments_user_id_unique
  on public.assessments(user_id);

-- ── scores ────────────────────────────────────────────────────────────────────

create table if not exists public.scores (
  id             uuid primary key default gen_random_uuid(),
  assessment_id  uuid not null references public.assessments(id) on delete cascade,
  architect      numeric not null check (architect  >= 0 and architect  <= 100),
  integrator     numeric not null check (integrator >= 0 and integrator <= 100),
  designer       numeric not null check (designer   >= 0 and designer   <= 100),
  educator       numeric not null check (educator   >= 0 and educator   <= 100),
  consultant     numeric not null check (consultant >= 0 and consultant <= 100),
  primary_role   text not null check (primary_role   in ('architect','integrator','designer','educator','consultant')),
  secondary_role text not null check (secondary_role in ('architect','integrator','designer','educator','consultant')),
  created_at     timestamptz default now()
);

-- One score row per assessment
create unique index if not exists scores_assessment_id_unique
  on public.scores(assessment_id);

-- ── reports ───────────────────────────────────────────────────────────────────

create table if not exists public.reports (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.users(id) on delete cascade,
  summary            text not null,
  strengths          text[] not null default '{}',
  job_roles          text[] not null default '{}',
  skill_roadmap      text[] not null default '{}',
  learning_resources text[] not null default '{}',
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

-- One report per user; subsequent saves update the row
create unique index if not exists reports_user_id_unique
  on public.reports(user_id);

-- Auto-update updated_at on every row update
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reports_updated_at on public.reports;
create trigger reports_updated_at
  before update on public.reports
  for each row execute procedure public.touch_updated_at();

-- ── candidates ────────────────────────────────────────────────────────────────

create table if not exists public.candidates (
  id           uuid primary key default gen_random_uuid(),
  full_name    text not null,
  email        text unique not null,
  desired_role text not null check (desired_role in ('architect','integrator','designer','educator','consultant')),
  status       text not null default 'new'
               check (status in ('new','review','interview','hired','rejected')),
  score        numeric not null default 0 check (score >= 0 and score <= 100),
  owner_id     uuid references public.users(id) on delete set null,
  created_at   timestamptz default now()
);

-- ── Row Level Security ────────────────────────────────────────────────────────

alter table public.users       enable row level security;
alter table public.assessments enable row level security;
alter table public.scores      enable row level security;
alter table public.reports     enable row level security;
alter table public.candidates  enable row level security;

-- Users: read own profile
create policy "Users can read own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can insert own profile" on public.users
  for insert with check (auth.uid() = id);

create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Assessments: full access to own rows
create policy "Users manage own assessments" on public.assessments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Scores: read own scores (via assessment join)
create policy "Users read own scores" on public.scores
  for select using (
    exists (
      select 1 from public.assessments a
      where a.id = scores.assessment_id
        and a.user_id = auth.uid()
    )
  );

-- Reports: read and upsert own reports
create policy "Users read own reports" on public.reports
  for select using (auth.uid() = user_id);

create policy "Users insert own reports" on public.reports
  for insert with check (auth.uid() = user_id);

create policy "Users update own reports" on public.reports
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Candidates: full access to own candidates
create policy "Users manage owned candidates" on public.candidates
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
