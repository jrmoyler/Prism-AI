# PRISM AI (Professional Role Identification & Skill Mapping)

Production-grade Next.js 14 platform for AI career assessment, candidate operations, and hiring analytics.

## Modules

1. Assessment Engine (`/assessment`)
2. AI Career Report Generator (`/api/prism-report`, `/reports`)
3. Candidate Database (`/candidates`)
4. Admin Hiring Dashboard (`/dashboard`)
5. Talent Analytics (dashboard metrics + distribution blocks)
6. Viral Profile (`/profile/[username]`)

## File Structure

```txt
app/
  api/
    score/route.ts
    prism-report/route.ts
    auth/magic-link/route.ts
  assessment/page.tsx
  results/page.tsx
  reports/page.tsx
  candidates/page.tsx
  dashboard/page.tsx
  profile/[username]/page.tsx
  login/page.tsx
  auth/callback/route.ts
prism/
  questions.ts
  scoring.ts
lib/
  supabase.ts
  types.ts
supabase/
  schema.sql
middleware.ts
```

## Environment Variables

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
OPENAI_API_KEY=<optional-for-llm-reports>
```

## Supabase Setup

1. Create a Supabase project.
2. Run SQL from `supabase/schema.sql`.
3. In Supabase Auth, enable:
   - Email provider
   - Google OAuth provider
4. Set redirect URL to:
   - `https://<your-domain>/auth/callback`

## Local Development

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Import repo in Vercel.
2. Add all environment variables above in Project Settings.
3. Deploy branch.
4. Verify:
   - `/assessment` saves progress and submits
   - `/results` renders radar chart and top roles
   - `/api/prism-report` returns and stores report
   - `/dashboard` redirects to `/login` if not authenticated

## Notes

- Dashboard route protection is enforced via `middleware.ts`.
- If `OPENAI_API_KEY` is missing, report generation gracefully falls back to deterministic output.
# Prism AI

Prism AI is a Next.js app for talent assessment and hiring operations. It now includes:

- Supabase-ready candidate data integration (with local fallback)
- AI career report generator endpoint and UI
- Candidate pipeline page
- Admin hiring dashboard
- Enterprise analytics summary cards

## Local development

```bash
npm run dev
```

## Production build

```bash
npm run build
```

## Supabase setup

Set the following env vars in `.env.local` and in Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Expected table:

`candidates(id, full_name, role, stage, score, created_at)`
