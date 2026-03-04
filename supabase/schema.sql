-- PRISM Supabase schema
create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  full_name text,
  created_at timestamptz default now()
);

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  answers jsonb not null,
  created_at timestamptz default now()
);

create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  architect numeric not null,
  integrator numeric not null,
  designer numeric not null,
  educator numeric not null,
  consultant numeric not null,
  primary_role text not null,
  secondary_role text not null,
  created_at timestamptz default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  summary text not null,
  strengths text[] not null,
  job_roles text[] not null,
  skill_roadmap text[] not null,
  learning_resources text[] not null,
  created_at timestamptz default now()
);

create table if not exists public.candidates (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text unique not null,
  desired_role text not null,
  status text not null check (status in ('new','review','interview','hired','rejected')),
  score numeric not null default 0,
  owner_id uuid references public.users(id) on delete set null,
  created_at timestamptz default now()
);

alter table public.users enable row level security;
alter table public.assessments enable row level security;
alter table public.scores enable row level security;
alter table public.reports enable row level security;
alter table public.candidates enable row level security;

create policy "Users can read own profile" on public.users
for select using (auth.uid() = id);

create policy "Users manage own assessments" on public.assessments
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users read own reports" on public.reports
for select using (auth.uid() = user_id);

create policy "Users manage owned candidates" on public.candidates
for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
