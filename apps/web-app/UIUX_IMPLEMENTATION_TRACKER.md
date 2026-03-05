# UI/UX Implementation Tracker (Phase 1 Baseline)

Last updated: March 5, 2026
Scope: `apps/web-app` only

## Non-Conflict Note
No edits to mobile and landing; web-app only.

## Objectives
- Establish a stable UI/UX baseline before redesign implementation.
- Align web-app visuals and interaction patterns to `brand.md`.
- Identify high-risk overlap and responsive defects early.
- Standardize route framing and shared primitives before page-level redesign.

## Constraints
- Web-app only: do not touch `apps/mobile/**` or `apps/landing/**`.
- UI-first phase: no backend logic changes.
- Keep owner/public route behavior unchanged in this phase.
- Use Slotra brand tokens and patterns from `brand.md` as source of truth.

## Current Route IA (Observed)
- `/` Home (marketing-style shell entry)
- `/owner/*` owner workspace routes (guarded)
- `/book` public booking flow
- `/book/confirmation` booking confirmation
- `/sandbox` UI token/surface validation

## Route IA Target (UI Program)
- Primary operational surfaces:
  - `/owner/dashboard`
  - `/owner/calendar`
  - `/owner/services`
  - `/owner/customers`
  - `/owner/payments`
  - `/owner/integrations`
  - `/owner/settings/*`
- Public surface:
  - `/book`
  - `/book/confirmation`
- Utility surface:
  - `/sandbox`
- Home (`/`) is not part of the target IA decision center for redesign sequencing.

## Component Inventory (Baseline)
- Shell and layout:
  - `src/app/components/AppShell.tsx`
  - `src/app/layouts/OwnerLayout.tsx`
  - `src/app/components/SidebarNav.tsx`
  - `src/app/components/PageTemplates.tsx`
- Routing:
  - `src/router/index.tsx`
- UI primitives and tokens:
  - `src/ui/tokens.ts`
  - `src/ui/BrandButton.tsx`
  - `src/ui/BrandInput.tsx`
  - `src/ui/BrandSelect.tsx`
  - `src/ui/BrandTextarea.tsx`
  - `src/ui/Card.tsx`
  - `src/ui/theme.css`
- Global styling:
  - `src/styles.css` (legacy + shell overrides co-located)

## Responsive Breakpoints (In Use)
- `1100px`: owner layout and multi-column shell collapses.
- `1080px`: booking layout stack fallback.
- `900px`: navbar links hidden; container widths tightened.
- `768px`: booking section stacks.
- `640px`: action clusters and shell sections collapse to single-column controls.

## Phase Checklist (1-10)
1. [x] Audit routes and shell architecture.
2. [x] Audit token and primitive usage versus `brand.md`.
3. [x] Identify overlap/responsive risk points with file references.
4. [x] Create tracker document with IA, inventory, breakpoints, and risks.
5. [x] Create implementation plan document with redesign strategy.
6. [x] Add strict non-conflict note to both docs.
7. [x] Fix obvious UI copy/encoding issue found during audit (`AppShell` footer symbol).
8. [ ] Convert duplicated legacy/global CSS into scoped ownership layers.
9. [ ] Execute page-by-page redesign rollout with shared primitives first.
10. [ ] Run final responsive QA matrix and cross-route visual consistency pass.

## Known UI Bugs / Risks (Overlap + Responsive)
- Token drift risk from duplicate root token blocks in one stylesheet.
  - `src/styles.css:10`
  - `src/styles.css:3342`
- Potential fixed-header collision risk from stacked fixed banner/navbar + content offset dependency.
  - `src/styles.css:3356`
  - `src/styles.css:3469`
  - `src/styles.css:3537`
- Owner sidebar overlap risk in medium widths due sticky rail + two-column grid + large horizontal padding before collapse.
  - `src/styles.css:3796`
  - `src/styles.css:3805`
  - `src/styles.css:4047`
- Container width inconsistency risk across shell wrappers and CTA container variants, can produce visual jump across breakpoints.
  - `src/styles.css:3409`
  - `src/styles.css:3732`
  - `src/styles.css:4065`
  - `src/styles.css:4092`
- Owner utility action compression risk at <=900px where nav hides but CTA cluster remains in header.
  - `src/styles.css:4074`
  - `src/styles.css:4078`
- Booking shell padding + width strategy can produce cramped content bands on narrow devices before 640px rules take effect.
  - `src/styles.css:4039`
  - `src/styles.css:4043`
  - `src/styles.css:4092`
- Unused owner topbar component/style path creates maintenance drift and possible future conflicting shell patterns.
  - `src/app/components/TopBar.tsx:43`
  - `src/styles.css:441`
  - `src/app/layouts/OwnerLayout.tsx:5`
