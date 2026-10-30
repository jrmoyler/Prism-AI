# PRISM AI design contract

## Lock and target

- Tier L: existing application upgrade, delivered as a repository pull request.
- Brand lock: Collective AI, applied in response to JR's standard upgrade request.
- Locked tokens: navy `#050A18`, surface `#0D1326`, gold `#D4A843`, teal `#00D9B5`, text `#F5F5F5`, muted `#8B9BAE`; Space Grotesk headings and JetBrains Mono data.
- Audience: people assessing their interests in AI work, and authorized hiring operators reviewing candidates.
- Primary job: complete the 50-question assessment, understand five relative role dimensions, then choose a practical next action. The score is self-reported guidance, not a qualification or hiring verdict.
- Devices: desktop, tablet and small mobile screens. Dark-only brand; operating-system light preference does not change the palette.

## Direction: career fieldbook

A deliberate working document for exploring AI roles. A large editorial entry point leads into an interactive role explorer; subsequent pages favor clear prompts, restrained analytical surfaces and readable records. Navigation, forms and back behavior remain conventional. The product's five named role dimensions supply its visual identity rather than a decorative AI illustration.

## Palette and type

```css
:root {
  color-scheme: dark;
  --prism-bg: #050A18;
  --prism-surface: #0D1326;
  --prism-gold: #D4A843;
  --prism-teal: #00D9B5;
  --prism-text: #F5F5F5;
  --prism-muted: #8B9BAE;
}
```

Navy dominates; surfaces organize the working area; gold identifies primary action and current selection; teal denotes secondary emphasis or actual completion. Accent area remains small. Red is reserved for errors. Color never supplies the only status cue. No gradient substitutes for a palette decision.

Space Grotesk is the heading and interface voice, with readable sans-serif fallbacks. JetBrains Mono is limited to numeric values and compact metadata. Suggested scale: 12 / 14 / 16 / 20 / 28 / 40 / 64 px, with fluid display sizing. Body copy needs comfortable line height and bounded measure. Fonts must remain usable when remote loading fails.

## Spacing, geometry and motion

Use a 4px base unit, 16–24px mobile gutters and a bounded desktop content width. Square data surfaces and restrained 2–4px control radii replace pill-heavy chrome. Group with spacing and rules instead of colored feature-card borders. Numbering is reserved for sequence or a referenceable index, not ornament.

Transitions are brief state feedback (roughly 120–200ms). Assessment changes may move to communicate progression; reduced-motion preference removes translation and decorative timing. No scroll-jacking, ambient orbs, repeating card lifts or entry animation on every section.

## Constraint cards

| Card | Commitment |
| --- | --- |
| Palette | Locked by Collective AI parent system; no default indigo, violet or rainbow roles. |
| Typography | Locked by Collective AI parent system; no Inter-only display system. |
| Layout | No hero → six identical feature cards → repeated counters template. |
| Components | No fabricated social proof, decorative status dots, icon-in-circle grids, dead links or decorative SVGs. |
| Imagery | Code-native controls and actual assessment data; no invented portraits, client logos or generic AI illustrations. |
| Motion | Only meaningful state feedback; reduced motion supported. |
| Content | Sample records and scores labeled at their point of use; connection failures cannot masquerade as live data. |
| Direction | Career fieldbook with interactive five-role index and practical actions. |

## Considered directions

1. **Instrument desk.** A dense dashboard-first composition with a wide summary metric and compact controls. The locked navy palette would carry quiet white numerals, gold current-state emphasis and minimal value transitions. It foregrounds hiring operators but makes first-time assessment users feel like administrators.
2. **Career fieldbook — selected.** An asymmetrical editorial opening pairs a direct assessment invitation with a role explorer. Space Grotesk carries a strong heading hierarchy; mono is limited to data. Gold selection, ruled records and simple state transitions make exploring roles feel intentional. It explains the actual product before asking visitors to navigate its modules.
3. **Guided interview.** One centered conversational prompt at a time, with almost no secondary navigation. Large plain-language type and a mostly navy canvas would make the assessment approachable, but hide reports and hiring workflows. Color would be limited to the current answer and motion to question changes.

The instrument desk loses because the public entry point must orient an individual before presenting operator metrics. The interview direction loses because PRISM also contains a multi-page reporting and hiring workspace.

## Reference research and decision ledger

Research uses the bundled craft catalog and Refero methodology; no live Refero connector is available. These are design-pattern references, not claims that the catalog entries are external products or screenshots personally inspected. The separate design-inspiration-library skill is not present in the available named skill set; the bundled catalog supplies the concrete research fallback.

| Decision | Source | Bounded adaptation |
| --- | --- | --- |
| Resume progress and current step | Catalog `app-124`, Onboarding Resume Point | Preserve prior effort and make position in the 50 questions explicit. |
| Quiet analytical hierarchy | Catalog `app-133`, Mission Control Dashboard | Give metrics clear labels and primary emphasis; reject its fixed no-scroll grid and decorative gauges where data needs explanation. |
| Referenceable index with useful notes | Catalog `web-189`, Shopping Index | Adapt compact item names and opinionated notes into role explanations; do not copy commerce imagery or price structure. |
| Palette and fonts | JR's locked brand standard | Brand tokens override generic warnings about dark navy and Space Grotesk. |
| Meaningful empty/error states | JR Craft Standard and pre-delivery audit | Missing data gets recovery guidance; sample data remains explicit. |

## Signature and originality

Signature: an interactive five-role fieldbook that connects each role to concrete work rather than fabricated fit percentages. The layout gesture is an editorial entry paired with a role index, followed by task-oriented working pages. Rules and mono data serve this product's assessment records, not an unrelated broadsheet imitation.

No previous repository design ledger existed. The initial ledger therefore records this build without claiming cross-project uniqueness has been established. See `DESIGN-LEDGER.md`.

## Validation contract

Build and type checks, backend regression tests and a static design scan precede delivery. Verify desktop 1440×900, mobile 390×844, reduced motion, keyboard focus, mobile navigation and the assessment→results→report path when a browser is available. Record unavailable checks honestly in `DESIGN-AUDIT.md`. No screenshot-fidelity claim applies: the user supplied a repository, not a target design image.
