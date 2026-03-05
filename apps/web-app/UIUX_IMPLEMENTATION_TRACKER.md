# UI/UX Implementation Tracker (Phase 2 Route IA Update)

Last updated: March 6, 2026
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
9. [x] Execute page-by-page redesign rollout with shared primitives first.
10. [x] Run final responsive QA matrix and cross-route visual consistency pass.

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

## Phase 7 Domain + Notifications + Settings + Publish (March 5, 2026)
- Added dedicated settings routes/pages for domain and publish workflows:
  - `/owner/settings/domain`
  - `/owner/settings/publish`
  - files:
    - `src/pages/owner/settings/DomainSettingsPage.tsx`
    - `src/pages/owner/settings/PublishSettingsPage.tsx`
    - `src/router/index.tsx`
    - `src/pages/owner/SettingsPage.tsx`
- Domain settings now include:
  - subdomain editor (`businessname.slotraph.com` style preview)
  - CNAME instruction card
  - verification status timeline shell
  - troubleshooting accordion shell
- Notifications settings rebuilt with branded primitives and expanded UX:
  - trigger toggles
  - template editor shell
  - multi-channel preview cards
  - consistent helper/error validation affordances
  - file: `src/pages/owner/settings/NotificationsSettingsPage.tsx`
- Settings polish pass delivered for business/team/security/billing visual consistency:
  - business profile migrated to unified card/form rhythm
  - team route expanded to roster + invite + security + billing sections
  - files:
    - `src/pages/owner/settings/BusinessProfilePage.tsx`
    - `src/pages/owner/settings/TeamSettingsPage.tsx`
- Shared style system extended for release-quality settings surfaces:
  - new settings workspace card/header/grid/button/status patterns
  - domain, notifications, team, publish shell styles and responsive collapse guards
  - file: `src/styles.css`

### Phase 7 Feature Coverage Status
- [x] Domain page UX shell (editor + DNS + verification + troubleshooting)
- [x] Notifications page UX shell (triggers + template editor + previews + validation cues)
- [x] Settings section visual unification (business/team/security/billing)
- [x] Publish page UX shell (readiness checklist + blocker chips + go-live + share link + success state)

### Remaining Visual Debt (Post-Phase 7)
- Legacy stylesheet still contains duplicate and partially overlapping settings-era rules in `src/styles.css`; ownership split is improved but not fully modularized.
- Several owner/onboarding and integration/payment sub-components still rely on `@slotra/ui` primitives, creating mixed visual contracts alongside `Brand*` components.
- Accessibility hardening remains for custom shell controls (toggle/accordion keyboard focus polish and richer ARIA status announcements).

## Phase 8 Responsive Hardening + Overlap Eradication (March 5, 2026)
- Strengthened owner/public shell behavior across medium-to-small widths with new hardening rules for:
  - navbar crowding at tablet widths (`<=1280`, `<=1024`)
  - settings tab overflow handling (horizontal scroll instead of compressed wrapping)
  - timeline/checklist row compression at tablet (`<=768`)
  - long-copy wrapping in status/timeline cards
  - keyboard focus visibility for custom controls (tabs, accordion trigger, view toggle, service row buttons, customer rows)
- Footer copy symbol standardized in shell footer (`&copy;`) to avoid encoding drift in render surfaces.
- files:
  - `src/styles.css`
  - `src/app/components/AppShell.tsx`

### Phase 8 Responsive QA Matrix
| Page / Surface | 1440 | 1280 | 1024 | 768 | 640 | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Global shell (banner + navbar + footer) | Pass | Pass | Pass | Pass | Pass | Navbar now de-densifies earlier; demo CTA hidden before compression overlap. |
| Owner workspace frame (sidebar + content) | Pass | Pass | Pass | Pass | Pass | Sidebar/content stacking remains deterministic; sticky rail disabled on compact layouts. |
| Services (`/owner/services`) | Pass | Pass | Pass | Pass | Pass | Toolbar/actions now preserve wrap without clipping; table fallback remains horizontal-scroll safe. |
| Customers (`/owner/customers`) | Pass | Pass | Pass | Pass | Pass | List/detail and intake blocks keep stack order and avoid row collision at smaller widths. |
| Settings tabs + subpages (`/owner/settings/*`) | Pass | Pass | Pass | Pass | Pass | Tabs use horizontal scroll at constrained widths; domain/publish rows no longer compress badge/timestamp into overlap. |
| Public booking (`/book`, `/book/confirmation`) | Pass | Pass | Pass | Pass | Pass | Existing booking collapse strategy remains stable; no new overlap introduced by Phase 8 rules. |

### Remaining Responsive Defects (Post-Phase 8)
- No blocking overlap defects found in this pass.
- Residual debt remains from legacy duplicate CSS ownership in `src/styles.css`; this is maintainability risk, not an active breakpoint blocker.

## Phase 9 Code Cleanup + Design-System Consolidation (March 5, 2026)
- Consolidated duplicated status chip/tag patterns into a shared web-app UI primitive:
  - added `src/ui/StatusTag.tsx`
  - migrated usage from:
    - `src/pages/owner/services/ServiceList.tsx`
    - `src/modules/clients/CustomerWorkspace.tsx`
  - removed legacy split CSS selectors (`services-status-chip*`, `customer-status-tag*`) in favor of shared `status-tag*` styles.
- Consolidated repeated KPI summary card markup into a shared UI primitive:
  - added `src/ui/MetricCard.tsx`
  - migrated usage from:
    - `src/pages/owner/ServicesPage.tsx`
    - `src/modules/clients/CustomerWorkspace.tsx`
  - unified metric typography styles under `metric-card` selectors in `src/styles.css`.
- Token/style consistency cleanup:
  - normalized service list count badge colors to token refs:
    - `--color-accent-subtle`
    - `--color-accent`
  - removed duplicate late-file `svc-count-badge` override that reintroduced one-off values.
- File hygiene cleanup:
  - removed unreferenced legacy customer UI files:
    - `src/pages/owner/customers/CustomerDetailPanel.tsx`
    - `src/pages/owner/customers/CustomerImportCallout.tsx`
    - `src/pages/owner/customers/CustomerList.tsx`
    - `src/pages/owner/customers/CustomerToolbar.tsx`

## Phase 10 Final UI/UX Acceptance + Handoff (March 5, 2026)
- Acceptance sweep completed across owner workspace and public booking surfaces.
- Route/IA checks completed:
  - confirmed root and owner index are setup-first (`/` and `/owner` -> `/owner/onboarding`)
  - confirmed no active Home page route in owner UX
  - confirmed global/owner navigation labels and links match setup-first flow
- Final defect pass completed:
  - no blocking overlap, spacing, alignment, or responsive regressions found in this pass
  - residual CSS debt remains maintainability-only (non-blocking for UI handoff)

### Done / Not-Done Matrix by Page
| Surface | Status | Notes |
| --- | --- | --- |
| `/owner/onboarding` | Done | Launchpad-first setup flow with checklist/progress/readiness rails. |
| `/owner/dashboard` | Done | KPI, activity, and upcoming booking shells aligned to brand structure. |
| `/owner/calendar` | Done | Schedule/override/blackout UX shell with responsive guardrails. |
| `/owner/services` | Done | Toolbar + card/table modes + editor panel production-style UX. |
| `/owner/customers` | Done | KPI/list/detail/intake flow and responsive stacking stable. |
| `/owner/payments` | Done (UI-only) | Visual shell complete; functional wiring intentionally deferred. |
| `/owner/integrations` | Done (UI-only) | Visual shell complete; provider workflows remain placeholders. |
| `/owner/settings/brand` | Done | Branded form layout and publishing context complete. |
| `/owner/settings/business` | Done | Unified settings form rhythm and card layout complete. |
| `/owner/settings/team` | Done (UI-only) | Team roster/invite/security/billing UX shell complete. |
| `/owner/settings/notifications` | Done (UI-only) | Trigger/template/preview UI complete; backend messaging not wired. |
| `/owner/settings/domain` | Done (UI-only) | Domain/DNS/verification UX shell complete. |
| `/owner/settings/booking` | Done (UI-only) | Booking page builder and intake configurator shell complete. |
| `/owner/settings/publish` | Done (UI-only) | Readiness and go-live shell complete. |
| `/book` | Done (UI-only data) | Public booking journey complete with mocked source data. |
| `/book/confirmation` | Done | Confirmation surface and booking summary are stable. |
| `/sandbox` | Done | Token/primitive validation surface retained for UI QA. |

### Known Limitations (UI-Only Placeholders)
- Owner onboarding, scheduling, services/customers, payments, integrations, and most settings actions still rely on mocked/local UI state with no API persistence.
- Publish/domain readiness and verification indicators are UX scaffolds, not live operational checks.
- Notification template previews/channels are visual only and do not dispatch real messages.
- Legacy `src/styles.css` still contains overlapping historical rules; this is a maintainability concern, not a release-blocking UI defect.
- `TopBar` remains deprecated/inactive and is intentionally not part of the current shell contract.

### Recommended Next Functional Phases
1. Data integration foundation: replace mocked repositories with typed API clients and route-level loading/error contracts.
2. Onboarding + settings persistence: wire owner profile, hours, services, booking preferences, notifications, domain, and publish states to backend.
3. Scheduling + booking engine integration: connect availability overrides/blackouts to real calendars and booking conflict checks.
4. Customer + payment operations: implement real customer lifecycle data, payment state transitions, and audit events.
5. Integrations orchestration: connect provider auth/status/sync flows and expose actionable failure states.
6. Post-integration hardening: add E2E/regression coverage and split residual global CSS into feature-owned style modules.

### Final Validation (March 5, 2026)
- `pnpm --filter @slotra/web-app lint`: Pass
- `pnpm --filter @slotra/web-app test`: Failed (environment/module resolution issue: `undici` missing `./lib/dispatcher/retry-agent` during Vitest worker startup)
- `pnpm --filter @slotra/web-app build`: Pass

## Phase 1 Data Integration Foundation (March 6, 2026)
- Added a typed route-query state contract for owner/public route integration boundaries:
  - `idle`
  - `loading`
  - `success`
  - `error`
  - files:
    - `src/features/route-query/contracts.ts`
    - `src/features/route-query/adapters.ts`
- Added typed route client boundaries for owner/public route domains:
  - owner client (`mockOwnerRouteClient`) for dashboard, services, customers, team, business-settings, payments, integrations, onboarding
  - public booking client (`mockPublicBookingRouteClient`) for booking route data + slots/date/confirmation actions
  - files:
    - `src/features/owner/routeClient.ts`
    - `src/features/public-booking/routeClient.ts`
    - `src/features/owner/data.ts` (exported data contracts)
    - `src/features/public-booking/data.ts` (exported `PublicBookingRouteData`)
- Route-level loading/error UX pass (deterministic + retry affordance):
  - standardized error retry CTA on key owner/public route surfaces and owner guard
  - upgraded route loading card with consistent skeleton treatment
  - files:
    - `src/app/components/RouteStateCard.tsx`
    - `src/app/routes/OwnerRouteGuard.tsx`
    - `src/pages/owner/DashboardPage.tsx`
    - `src/pages/owner/IntegrationsPage.tsx`
    - `src/pages/owner/ServicesPage.tsx`
    - `src/pages/owner/onboarding/OnboardingFlow.tsx`
    - `src/modules/booking/BookingFlowScreen.tsx`
    - `src/modules/clients/CustomerWorkspace.tsx`
    - `src/modules/scheduling/SchedulingWorkspace.tsx`
    - `src/modules/billing/BillingWorkspace.tsx`
- Save-state UX standardization pass:
  - added shared `SaveStateIndicator` (`Saving...`, `Saved`, `Failed`, `Retry`)
  - wired into key editors/forms (services, scheduling, billing, booking preferences, business profile)
  - files:
    - `src/ui/SaveStateIndicator.tsx`
    - `src/ui/index.ts`
    - `src/pages/owner/ServicesPage.tsx`
    - `src/modules/scheduling/SchedulingWorkspace.tsx`
    - `src/modules/billing/BillingWorkspace.tsx`
    - `src/pages/owner/settings/BookingPreferencesPage.tsx`
    - `src/pages/owner/settings/BusinessProfilePage.tsx`
    - `src/styles.css`

### Phase 1 Remaining UI Integration Gaps
- Route clients currently wrap synchronous mock resources; async fetch orchestration and real cancellation/abort behavior are still pending backend wiring.
- `idle` query status is defined at contract level but not yet exercised by route pages (current mock path resolves `loading|success|error`).
- Save-state UX is standardized across major editors, but some settings surfaces still rely on toast-only confirmation without explicit inline save-state indicators.
- Retry actions currently use route reload semantics (`window.location.reload`) and should evolve to domain-level retry handlers once real fetchers are introduced.

### Validation (March 6, 2026)
- `pnpm --filter @slotra/web-app lint`: Pass
- `pnpm --filter @slotra/web-app test`: Failed (unchanged environment dependency issue: `undici` missing `./lib/dispatcher/retry-agent` during Vitest worker startup)
- `pnpm --filter @slotra/web-app build`: Pass

## Phase 2 Onboarding + Settings Persistence UX Wiring (March 6, 2026)
- Added typed frontend persistence clients for onboarding and owner settings sections:
  - `src/features/owner/onboarding/persistenceClient.ts`
  - `src/features/owner/settings/persistenceClient.ts`
- Added unsaved-changes browser leave guard shared by onboarding/settings form surfaces:
  - `src/features/forms/useUnsavedChangesGuard.ts`
- Onboarding (`/owner/onboarding`) persistence UX upgrades:
  - async draft load + route-safe loading/error copy
  - explicit save lifecycle (`saving`, `saved`, `failed`, retry) with inline state indicator
  - partial-save messaging for autosave versus manual full save
  - retry affordance for both save failure and draft-load failure
  - file:
    - `src/pages/owner/onboarding/OnboardingFlow.tsx`
- Settings route persistence wiring upgrades:
  - `/owner/settings/brand`:
    - persisted draft load/save, dirty-state indicator, submit-timed inline validation
    - file: `src/pages/owner/settings/BrandDetailsPage.tsx`
  - `/owner/settings/business`:
    - persisted draft load/save, save retry, submit-timed validation
    - file: `src/pages/owner/settings/BusinessProfilePage.tsx`
  - `/owner/settings/team`:
    - persisted invite/security draft load/save, dirty-state and retry model
    - file: `src/pages/owner/settings/TeamSettingsPage.tsx`
  - `/owner/settings/notifications`:
    - persisted trigger/template draft load/save, touched/submit validation timing, retry
    - file: `src/pages/owner/settings/NotificationsSettingsPage.tsx`
  - `/owner/settings/domain`:
    - persisted subdomain/troubleshooting draft load/save, touched/submit validation timing, retry
    - file: `src/pages/owner/settings/DomainSettingsPage.tsx`
  - `/owner/settings/booking`:
    - persisted booking-builder draft load/save, touched/submit validation timing, retry
    - file: `src/pages/owner/settings/BookingPreferencesPage.tsx`
  - `/owner/settings/publish`:
    - persisted publish-state draft load/save, save retry indicator for go-live persistence
    - file: `src/pages/owner/settings/PublishSettingsPage.tsx`

### Phase 2 Acceptance Matrix (Onboarding + Settings Routes)
| Surface | Status | Notes |
| --- | --- | --- |
| `/owner/onboarding` | Done | Typed persistence client wired with async load/save/retry and partial-save UX states. |
| `/owner/settings/brand` | Done | Persisted brand draft + dirty/unsaved and validation timing standardization. |
| `/owner/settings/business` | Done | Persisted business draft + save lifecycle and inline submit-timed validation. |
| `/owner/settings/team` | Done | Persisted invite/security drafts + dirty/save/retry interaction model. |
| `/owner/settings/notifications` | Done | Persisted trigger/template drafts + touched/submit validation timing. |
| `/owner/settings/domain` | Done | Persisted domain draft + validation timing + retry/save feedback. |
| `/owner/settings/booking` | Done | Persisted booking builder draft + dirty/save/retry and validation alignment. |
| `/owner/settings/publish` | Done | Persisted publish state + save confirmation and failure recovery path. |

### Phase 2 Known Gaps (Non-Blocking for Frontend Contract Scope)
- Persistence remains browser-session scoped (`sessionStorage`) and intentionally does not call backend APIs.
- Cross-route dirty aggregation (for global settings-tab unsaved badges) is not yet centralized; indicators are route-local.
- In-app route-navigation blocking for unsaved changes is not implemented yet; current guard covers browser leave/refresh.

## Phase 3 Scheduling + Booking Engine Integration UX (March 6, 2026)
- Scheduling workspace (`/owner/calendar`) moved from local placeholder-only state to typed integration-facing persistence contracts:
  - async load/save boundary with retry handling
  - persisted weekly hours, timezone, date overrides, blackout dates
  - deterministic `loading | empty | error | retry` route-state handling for scheduling data hydration
  - files:
    - `src/features/owner/scheduling/persistenceClient.ts`
    - `src/modules/scheduling/SchedulingWorkspace.tsx`
    - `src/styles.css`
- Scheduling conflict/timezone hardening delivered:
  - persistent timezone context chip in scheduling header
  - actionable conflict guidance (timezone drift, duplicate overrides, blackout overlap)
  - explicit save lifecycle (`saving/saved/failed + retry`) to remove ambiguous save outcomes
- Booking flow (`/book`) integration UX upgraded:
  - async integration-facing availability contracts for date and slot loading
  - deterministic date/slot `idle | loading | success | error` handling with retry actions
  - step progression now blocks ambiguous continues while availability contracts are still loading/errored
  - confirmation submit now supports transient failure recovery via retry
  - files:
    - `src/features/public-booking/integrationClient.ts`
    - `src/modules/booking/BookingFlowScreen.tsx`
- Booking confirmation (`/book/confirmation`) now loads confirmation via async integration boundary with loading/error/retry UX.
  - file:
    - `src/pages/public/booking/BookingConfirmation.tsx`

### Phase 3 Acceptance Checklist
| Surface | Status | Notes |
| --- | --- | --- |
| `/owner/calendar` scheduling contracts | Done | Weekly hours/overrides/blackouts/timezone now persist via typed frontend integration client. |
| `/owner/calendar` conflict + timezone UX | Done | Conflict states now include explicit action guidance and persistent timezone context. |
| `/book` availability integration UX | Done | Date/slot states use async integration loading/error/retry flow boundaries. |
| `/book` step progression + recovery | Done | Continue behavior now guards loading/error availability states before progression. |
| `/book/confirmation` transient handling | Done | Confirmation load has deterministic loading/error/retry behavior. |

### Phase 3 Known Limitations
- Scheduling and booking persistence are still browser-session scoped and do not call backend APIs yet.
- Availability and slot results still come from mock repositories through integration clients (contract shape is production-facing; transport is not).
- Retry behavior is immediate and does not yet include exponential backoff or network-classified messaging.

### Phase 3 Validation (March 6, 2026)
- `pnpm --filter @slotra/web-app lint`: Pass
- `pnpm --filter @slotra/web-app test`: Failed (environment dependency issue persists: `Cannot find module './lib/dispatcher/retry-agent'` from `undici` during Vitest worker startup)
- `pnpm --filter @slotra/web-app build`: Pass
