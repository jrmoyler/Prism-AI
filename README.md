# PRISM AI

Professional Role Identification & Skill Mapping, by Collective AI. PRISM is a career exploration workspace with a 50-question self-assessment, five role dimensions, career reports, and an administrator-only hiring directory.

Scores describe self-reported interests. They are not validated skills, aptitude measures, or hiring recommendations.

## Run locally

Requires Node.js 20.9+ (Node 22 LTS recommended).

```sh
npm ci
npm run dev
```

Open http://localhost:3000. No keys are required for the local assessment, guided report, sample profile, or read-only hiring demonstration.

```sh
npm test
npm run typecheck
npm run build
npm run test:smoke
npm start
```

## Configure accounts and hiring operations

Copy `.env.example` to `.env.local`, provide your own values, and follow [SECURITY.md](SECURITY.md). Existing Supabase installations require the included migration before using this version. Hiring operators require a verified `app_metadata.role` of `admin`. Production authentication, RLS, and persistence must be checked against the actual Supabase project before deployment.

Optional authenticated AI reports use a server-only OpenAI key. Guests and unavailable model requests receive a labeled, role-specific guided report. Assessment drafts and generated reports are saved to browser storage when available; clearing site data removes these local copies.

## Workspace

| Route | Purpose |
| --- | --- |
| `/` | Interactive role fieldbook and career workflow |
| `/assessment` | Autosaved assessment with keyboard and touch controls |
| `/results` | Role scores, interpretation, and report generation |
| `/reports` | Career report and print view |
| `/profile/demo` | Explicitly illustrative example profile |
| `/candidates` | Search/filter directory; authenticated admin editing in live mode |
| `/dashboard` | Current pipeline counts and role distribution |
| `/login`, `/signin` | Email and Google authentication when configured |

Personal public profile publishing is not implemented; unknown profile URLs return 404. Candidate import remains an operator database task. Demo records are never writable.

## Design and validation

The JR-standard upgrade replaces decorative gradients and generic modules with a dark navy, gold, and teal career fieldbook, Space Grotesk headings, and JetBrains Mono data labels. See [DESIGN.md](DESIGN.md) and [DESIGN-AUDIT.md](DESIGN-AUDIT.md) for the design contract and verification limitations.

Next.js is pinned to the maintained 15.x version checked during this upgrade. PostCSS is overridden to a patched compatible 8.x release; the lockfile pins the resolved dependency graph. Review dependency audits as part of future maintenance.
