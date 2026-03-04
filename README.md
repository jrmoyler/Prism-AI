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
