-- PRISM AI production schema baseline

create table if not exists users (
  id uuid primary key,
  email text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  answers jsonb not null,
  created_at timestamptz not null default now(),
  constraint assessments_user_id_unique unique (user_id)
);

create table if not exists scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  architect numeric not null,
  integrator numeric not null,
  designer numeric not null,
  educator numeric not null,
  consultant numeric not null,
  created_at timestamptz not null default now()
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  report_text text,
  summary text,
  strengths text[] not null default '{}',
  job_roles text[] not null default '{}',
  skill_roadmap text[] not null default '{}',
  learning_resources text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists candidates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  full_name text,
  email text,
  role text,
  score numeric,
  status text not null default 'new',
  created_at timestamptz not null default now()
);
