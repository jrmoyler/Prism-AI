# Connected studio edition

## Coverage

The shared WorkspaceFrame and visual system cover `/`, `/assessment`, `/results` (empty and populated), `/reports` (empty and populated), `/candidates`, `/dashboard`, `/profile/demo`, `/login`, `/signin`, error and 404 states. `/admin` retains its redirect to the dashboard. API and auth callback routes remain behaviorally unchanged.

- Persistent studio return links, breadcrumb context and network footer on every page.
- Three-stage reflection/results/report navigation on all career journey screens. These indicate location, not completion.
- Local Space Grotesk and JetBrains Mono fonts remove the remote font dependency.
- Public landing adds a labeled architectural concept study; all inner pages receive editorial mastheads and structured analytical surfaces.
- Candidate records stack into labeled entries below 640px, preserving every field and the single existing stage-update form.
- Reports can be copied as plain text. Copy failure keeps the report available with print/select-text recovery; print styling excludes navigation.

## Asset provenance

`public/img/collective-atrium-*.webp` are the two responsive versions of the architectural image generated for the Collective AI redesign on November 7, 2026 using OpenAI image generation. They are reused from the parent repository and explicitly labeled as a concept. The image depicts a navy stone/brass studio atrium and living courtyard, not an existing facility. Local fonts are copied from the parent repository's existing brand/font assets.

## Validation

TypeScript typecheck and all 10 assessment/backend regression tests pass. Production build passes. HTTP smoke checks pass for all nine exercised page routes (including the 404 response), local fonts/images, guest scoring/report generation, and denial of unauthorized candidate mutation. No real candidate data or live submissions are used by the smoke tests. No rendered desktop/mobile screenshot or measured visual-quality claim is made where a browser is unavailable.
