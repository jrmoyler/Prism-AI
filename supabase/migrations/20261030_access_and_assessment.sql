-- Apply after schema.sql to existing installations. No candidate data is removed.
begin;
alter table public.users enable row level security;
alter table public.assessments enable row level security;
alter table public.scores enable row level security;
alter table public.reports enable row level security;
alter table public.candidates enable row level security;

-- These policies intentionally do not grant candidate access to ordinary accounts.
drop policy if exists prism_users_read_self on public.users;
create policy prism_users_read_self on public.users for select to authenticated using (id = (select auth.uid()));
drop policy if exists prism_assessments_read_self on public.assessments;
create policy prism_assessments_read_self on public.assessments for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists prism_scores_read_self on public.scores;
create policy prism_scores_read_self on public.scores for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists prism_reports_read_self on public.reports;
create policy prism_reports_read_self on public.reports for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists prism_reports_insert_self on public.reports;
create policy prism_reports_insert_self on public.reports for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists prism_reports_update_self on public.reports;
create policy prism_reports_update_self on public.reports for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists prism_candidates_admin_read on public.candidates;
create policy prism_candidates_admin_read on public.candidates for select to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
drop policy if exists prism_candidates_admin_update on public.candidates;
create policy prism_candidates_admin_update on public.candidates for update to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Remove broad default API grants. Mutations are restricted by RLS and column grants.
revoke all on public.users, public.assessments, public.scores, public.reports, public.candidates from anon, authenticated;
grant select on public.users, public.assessments, public.scores, public.reports, public.candidates to authenticated;
grant insert, update on public.reports to authenticated;
grant update (status) on public.candidates to authenticated;

-- The scoring transaction is the only client-writable assessment path. Scores are
-- recomputed from canonical 10-question blocks, never accepted from the client.
create or replace function public.save_prism_assessment(responses jsonb)
returns void language plpgsql security definer set search_path = '' as $$
declare
  owner_id uuid := auth.uid();
  calculated numeric[];
begin
  if owner_id is null then raise exception 'Authentication required'; end if;
  if jsonb_typeof(responses) is distinct from 'array' then raise exception 'Invalid responses'; end if;
  if jsonb_array_length(responses) <> 50 then raise exception 'Expected 50 responses'; end if;
  if exists (select 1 from jsonb_array_elements(responses) as entry(value)
    where jsonb_typeof(value) <> 'number' or value::text not in ('1','2','3','4','5')) then
    raise exception 'Responses must be integers from 1 to 5';
  end if;
  select array_agg(score order by role_index) into calculated from (
    select (ordinality - 1) / 10 as role_index, round(sum(value::text::numeric) * 2, 2) as score
    from jsonb_array_elements(responses) with ordinality as answer(value, ordinality)
    group by (ordinality - 1) / 10
  ) grouped;
  insert into public.assessments(user_id, answers) values(owner_id, responses)
    on conflict (user_id) do update set answers = excluded.answers, created_at = now();
  insert into public.scores(user_id, architect, integrator, designer, educator, consultant)
    values(owner_id, calculated[1], calculated[2], calculated[3], calculated[4], calculated[5])
    on conflict (user_id) do update set architect = excluded.architect, integrator = excluded.integrator,
      designer = excluded.designer, educator = excluded.educator, consultant = excluded.consultant, created_at = now();
end;
$$;
revoke all on function public.save_prism_assessment(jsonb) from public, anon;
grant execute on function public.save_prism_assessment(jsonb) to authenticated;
commit;
