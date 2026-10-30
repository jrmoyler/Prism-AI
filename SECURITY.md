# Access and deployment notes

The app can run without Supabase. Assessments and guided reports work locally; hiring screens show clearly labeled, read-only sample records. It does not claim that this mode stores results in an account.

## Existing Supabase installations

1. Back up the database and inspect any custom policies. Apply `supabase/schema.sql`, then `supabase/migrations/20261030_access_and_assessment.sql` in the SQL editor. The migration enables RLS on all five app tables, restricts API grants, and adds an atomic assessment/score function. It does not delete candidate records. Existing custom policies should be reviewed because permissive PostgreSQL policies combine with OR.
2. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_APP_URL` to the deployed origin. The app no longer needs a service-role key. Never expose one in a public environment variable.
3. Enable email/Google sign-in as needed. Add `https://<your-domain>/auth/callback` to allowed redirect URLs. Authentication now uses the installed Supabase SSR SDK for PKCE exchange, cookie refresh, and logout. Old `prism-auth` cookies no longer grant access.
4. Give hiring operators `app_metadata.role = "admin"` using a trusted Supabase Admin operation. Do not use `user_metadata`; users can edit it. Refresh their session after changing claims. Ordinary candidates can complete assessments but cannot read or update the hiring directory. Candidate creation/import remains an operator database task; this PR does not invent a public enrollment flow.
5. Optionally configure `OPENAI_API_KEY`. Only signed-in report requests use the LLM; guests receive role-specific guided reports. Failed model requests fall back to guided content and are labeled accordingly.

## Release checks requiring a live project

- Verify anonymous direct REST access to all five tables is denied.
- Verify a normal account can read only its own assessments, scores, and reports and cannot update candidate status.
- Verify an admin can read candidates and update only `status`.
- Test a fresh magic-link/Google sign-in, token refresh, sign-out, and reassessment persistence.
- Verify `save_prism_assessment` writes both rows or rolls back both. It computes the five scores from the canonical five blocks of ten answers and upserts on `user_id`, so retrying is safe.

No live Supabase credentials were supplied during this upgrade. Database migration, production OAuth, and live persistence have not been exercised against your deployment. Automated application tests cover validation, guest output, and mocked server-verified authorization; they do not substitute for these checks.

## Request limits

Score, report, magic-link, and status endpoints have bounded per-process request windows. For multiple instances or a public launch, configure trusted edge rate limits; process-local memory is not a distributed abuse control, and forwarded client addresses must be set by the trusted proxy. Supabase Auth also requires its provider rate limits. Paid reports should have a per-account quota at the gateway before broad release.

## Assessment meaning

Scores preserve the original scale: 1/5 maps to 20 and 5/5 maps to 100. They summarize self-reported preferences. They are not validated aptitude measures, qualification checks, or hiring recommendations. Reports and stored profiles must be interpreted in that context.
