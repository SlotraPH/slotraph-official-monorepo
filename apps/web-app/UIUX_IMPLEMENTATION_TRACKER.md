# UI/UX Implementation Tracker (Phase 2 Route IA Update)

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
- Keep public booking routes intact while updating owner entry IA.
- Use Slotra brand tokens and patterns from `brand.md` as source of truth.

## Current Route IA (Observed)
- `/` redirects to `/owner/onboarding`
- `/owner/*` owner workspace routes (guarded)
  - `/owner` redirects to `/owner/onboarding`
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
- Home (`/`) is decommissioned as a page and retained only as a redirect entrypoint.

## Phase 2 Migration Notes
- Removed Home page route/component usage from `src/router/index.tsx`.
- Default authenticated workspace entry is setup-first: `/owner/onboarding`.
- Global shell navigation removed the `Home` item and now uses `Setup`.
- Owner shell brand/footer links no longer point to a Home route.
- Fallback CTAs (`NotFound`, `AppErrorBoundary`, `Sandbox`) were retargeted away from Home.

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

## Phase 3 Resolved Overlap / Shell Stability (March 5, 2026)
- Unified shell container width + gutter math so navbar/banner/footer and page containers no longer shift across breakpoints.
  - `src/styles.css`
  - `src/app/components/AppShell.tsx`
- Fixed fixed-header collision risk by making owner/public content offset deterministic from `--app-shell-offset`.
  - `src/styles.css`
- Fixed mobile navbar overlap bug where actions stacked vertically at `<=640px` while offset still assumed `62px`.
  - `src/styles.css`
  - `src/app/components/AppShell.tsx`
- Reduced medium-width owner shell collision risk by tightening sidebar column sizing and sticky offset behavior.
  - `src/styles.css`
- Standardized owner page scaffolds (stack + two-column grid variants) through reusable primitives to remove per-page wrapper drift.
  - `src/app/components/PageTemplates.tsx`
  - `src/pages/owner/DashboardPage.tsx`
  - `src/pages/owner/ServicesPage.tsx`
  - `src/pages/owner/SettingsPage.tsx`
  - `src/pages/owner/IntegrationsPage.tsx`
  - `src/modules/scheduling/SchedulingWorkspace.tsx`
  - `src/modules/clients/CustomerWorkspace.tsx`
  - `src/modules/billing/BillingWorkspace.tsx`
  - `src/pages/owner/onboarding/OnboardingFlow.tsx`

## Phase 4 Setup Launchpad Build (March 5, 2026)
- Replaced setup page behavior with a launchpad-first workspace surface (progress ring, setup summary, and setup CTA).
  - `src/pages/owner/onboarding/OnboardingFlow.tsx`
  - `src/styles.css`
- Added reusable setup primitives for checklist/status/readiness UI.
  - `src/pages/owner/onboarding/components/setupTypes.ts`
  - `src/pages/owner/onboarding/components/SetupStatusChip.tsx`
  - `src/pages/owner/onboarding/components/SetupChecklistCard.tsx`
  - `src/pages/owner/onboarding/components/SetupProgressRing.tsx`
  - `src/pages/owner/onboarding/components/SetupReadinessPanel.tsx`
- Added setup progress UX states with mocked data path:
  - `loading` placeholder (pre-hydration state)
  - `empty` placeholder (no checklist progress)
  - `success` placeholder (all launch checks complete)
- Right rail readiness block added with blocker list and next-action CTA.
- Existing step editor retained and now opened from launchpad CTAs/checklist actions.

## Phase 4 Screenshot / Notes Placeholders
- [ ] Desktop: setup launchpad (checklist + readiness rail)
- [ ] Tablet: launchpad stacked layout
- [ ] Mobile: launchpad + step editor controls
- [ ] Step editor opened from launchpad CTA
- [ ] Loading placeholder state capture
- [ ] Empty placeholder state capture
- [ ] Success placeholder state capture
- Notes:
  - Add final screenshots after responsive QA pass.
  - Verify visual parity against `brand.md` gradients and button treatment in each capture.

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

## Phase 5 Services + Customers Upgrade (March 5, 2026)
- Services workspace upgraded to a production-like layout with:
  - KPI summary row
  - high-fidelity toolbar (search, status filter, view toggle, clear action, create CTA)
  - dual data presentations (card view + table view)
  - improved empty and loading states
  - polished sticky editor panel with grouped controls and guidance
  - Files:
    - `src/pages/owner/ServicesPage.tsx`
    - `src/pages/owner/services/ServiceToolbar.tsx`
    - `src/pages/owner/services/ServiceList.tsx`
    - `src/pages/owner/services/ServiceEditor.tsx`
    - `src/styles.css`
- Customers workspace upgraded with:
  - KPI summary row
  - stronger filter/search header and segmented status controls
  - improved customer list readability (clear hierarchy + metrics + tag chips)
  - refined customer profile panel for handoff context
  - intake draft form preserved with existing validation behavior
  - responsive grid guards so list/detail panels stack before overlap risk
  - Files:
    - `src/modules/clients/CustomerWorkspace.tsx`
    - `src/styles.css`

### Resolved UI Issues (Phase 5)
- Reduced medium-width overlap risk between list/content and detail side panel on customers route by replacing ad-hoc nested flow layout with explicit responsive grid breakpoints.
- Removed mixed primitive styling drift on services route by migrating key controls from legacy `@slotra/ui` usage to branded `Brand*` primitives.
- Added deterministic empty/loading states for services list interactions to avoid sparse/unstyled fallback moments.

### Component Reuse Opportunities
- Convert repeated status chip/tag patterns (`services-status-chip`, `customer-status-tag`) into a shared `StatusTag` UI primitive.
- Extract KPI card pattern used by Services and Customers into a shared owner KPI row component.
- Promote current services toolbar layout pattern as a reusable owner filter/action header component for Payments and Integrations tables.

## Phase 6 Availability + Booking Builder Upgrade (March 5, 2026)
- Availability workspace (`/owner/calendar`) upgraded with:
  - weekly schedule operations grid with explicit day status/time columns
  - date override editor shell (closed/custom/extended) with local draft listing
  - blackout-date shell for hard booking blocks
  - timezone selector + conflict warning panel for override/blackout overlap and timezone drift
  - consistent save-state indicators (saved/unsaved) and toasts for scheduling actions
  - files:
    - `src/modules/scheduling/SchedulingWorkspace.tsx`
    - `src/styles.css`
- Booking settings route (`/owner/settings/booking`) rebuilt into booking page builder workspace with:
  - section toggles and ordering controls (hero/services/policies/FAQ/staff)
  - customer intake form field configuration (label, placeholder, visible/required)
  - booking copy + policy controls with unified save-state and toast behavior
  - preview shell with desktop/mobile mode toggle
  - files:
    - `src/pages/owner/settings/BookingPreferencesPage.tsx`
    - `src/styles.css`

### Phase 6 Resolved UI Risks
- Reduced side-panel clipping risk by introducing bounded list containers and explicit overflow handling in override/preview areas.
- Reduced sticky panel overlap risk in builder view by collapsing preview column at `<=1100px`.
- Improved small-width survivability for schedule grid and booking editor rows by switching complex multi-column rows to stacked layouts at `<=720px`.

### Phase 6 Open Issues
- Availability overrides and blackout entries are local UI drafts only; no persistence wiring yet.
- Scheduling conflict checks are UX heuristics and do not yet evaluate real appointment overlap against backend calendars.
