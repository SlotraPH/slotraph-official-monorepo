# UI/UX Implementation Plan (Web App)

Last updated: March 6, 2026
Scope: `apps/web-app` only

## Non-Conflict Note
No edits to mobile and landing; web-app only.

## Design Principles
- Brand fidelity first: `brand.md` is the visual source of truth.
- UI safety before redesign speed: stabilize shell, tokens, and component contracts.
- Shared primitives before page customization: avoid one-off page styling.
- Responsive determinism: define breakpoints and ownership per layout zone.
- Incremental rollout with route-level verification to avoid broad regressions.

## Information Architecture Target (Without Home)
- Root entry behavior
  - `/` -> redirect to `/owner/onboarding`
- Owner app shell (`/owner/*`)
  - `/owner` -> redirect to `/owner/onboarding`
  - `/owner/onboarding` (default owner landing)
  - `/owner/dashboard`
  - `/owner/calendar`
  - `/owner/services`
  - `/owner/customers`
  - `/owner/payments`
  - `/owner/integrations`
  - `/owner/settings/brand`
  - `/owner/settings/business`
  - `/owner/settings/team`
  - `/owner/settings/notifications`
  - `/owner/settings/booking`
- Public booking surfaces
  - `/book`
  - `/book/confirmation`
- Utility route
  - `/sandbox`

## Final Navigation Map (Phase 2)
- Global shell nav
  - Setup (`/owner/onboarding`)
  - Dashboard (`/owner/dashboard`)
  - Calendar (`/owner/calendar`)
  - Booking (`/book`)
  - Settings (`/owner/settings`)
- Owner sidebar nav
  - Dashboard, Calendar, Services, Customers, Payments, Integrations, Settings
- Explicitly removed
  - `Home` nav item and Home page route/component as an IA destination

## Page-Level Layout Specs
- Global shell
  - Fixed dev banner (`40px` when visible) + fixed navbar (`62px`) with `--banner-h` offset handling.
  - Main content top offset tied to app-shell tokenized offset variable.
  - Max content width `1200px`; horizontal padding scales by breakpoint.
- Owner workspace
  - Desktop: 2-column grid (`sidebar + content`), sticky sidebar.
  - Tablet/mobile: collapse to single column; sticky behavior disabled.
  - Sidebar card treatment, link states, and profile block follow brand gradients/tokens.
- Settings area
  - Keep tab strip and panel spacing unified with shell card tokens.
  - Ensure settings sub-routes share one consistent header/action spacing rhythm.
- Public booking
  - Keep content centered within `1200px` container.
  - Stage cards and side summary should stack predictably at tablet and mobile widths.
  - Preserve legibility and touch target sizing at <=768px and <=640px.

## Shared Component Strategy
- Source of truth
  - `src/ui/tokens.ts` for color/type/spacing/radius/shadow/motion tokens.
- Shared primitives to standardize usage
  - `BrandButton`, `BrandInput`, `BrandSelect`, `BrandTextarea`, `Card`, typography helpers.
- Shell-level components
  - Keep `AppShell` and `SidebarNav` as route-frame primitives.
  - Treat `TopBar` as deprecated/inactive unless reintroduced with a defined IA need.
- CSS ownership
  - Keep `src/styles.css` for global document/shell behavior during transition.
  - Move feature-specific styling toward module ownership over rollout phases.

## Rollout Order
1. Stabilize shell offsets, breakpoint behavior, and container consistency.
2. Remove token drift by consolidating duplicated root token patterns.
3. Standardize interactive primitives across owner and public flows.
4. Normalize owner page templates and settings subpage layout consistency.
5. Normalize public booking stage layout and summary behavior.
6. Decommission or formally reintroduce currently inactive shell artifacts (`TopBar`).
7. Run cross-route responsive QA and visual regression checks.

## Phase 4 Delivery Notes (March 5, 2026)
- Setup route (`/owner/onboarding`) now prioritizes a launchpad-first experience.
- Launchpad includes:
  - progress ring and setup completion summary
  - checklist cards for Branding, Services, Availability, Domain, and Publish
  - status chips (`Not started`, `In progress`, `Done`)
  - primary CTA to continue setup
  - right rail readiness module with blockers and next action
- Step-by-step setup editor remains available behind launchpad actions for continuity.
- Setup progress UX states (loading, empty, success) are implemented with mocked local/session data.
- New reusable onboarding UI modules introduced in `src/pages/owner/onboarding/components/*`.
- Remaining follow-up:
  - capture phase screenshots
  - run full responsive verification matrix and document outcomes in tracker

## Implementation Guardrails
- Do not change backend/data contracts in this phase.
- Do not alter mobile or landing apps.
- Do not alter landing client signup flow.
- Avoid route behavior changes unless required for UI safety/accessibility.
- Every visual change must trace back to `brand.md` tokens/patterns.

## Phase 10 Final Architecture Notes (March 5, 2026)
- Phase status: UI/UX feature-complete and handoff-ready for functional implementation in `apps/web-app`.

### Final Route + Shell Contract
- Root and owner entry remain setup-first:
  - `/` -> `/owner/onboarding`
  - `/owner` -> `/owner/onboarding`
- Owner workspace shell remains the single operational frame for all `/owner/*` routes.
- Home is fully decommissioned as a user destination in owner IA and navigation.

### UI Architecture Baseline for Functional Work
- Routing + layout ownership:
  - `src/router/index.tsx` controls owner/public utility route map and settings sub-route topology.
  - `src/app/components/AppShell.tsx` and `src/app/components/SidebarNav.tsx` define global + owner nav contracts.
  - `src/app/components/PageTemplates.tsx` provides shared page scaffolding to prevent per-page layout drift.
- Primitive ownership:
  - Brand-aligned primitives in `src/ui/*` are the preferred UI foundation (`Brand*`, `Card`, `StatusTag`, `MetricCard`).
- Styling ownership:
  - `src/styles.css` is still the transition-era global style host; stable for handoff but should be split incrementally during functional phases.

### Functional Integration Boundaries
- Treat UI states labeled saved/ready/verified/published as presentation state until backend wiring lands.
- Replace mock repositories/datasets incrementally by route domain (onboarding -> scheduling -> customers/payments -> integrations).
- Preserve current route IA and shell composition while integrating data to avoid UX regressions.

### Post-Handoff Technical Debt Targets
1. Extract remaining global CSS blocks into feature-owned style modules.
2. Remove or formally retire inactive `TopBar` path if no reintroduction plan exists.
3. Expand accessibility hardening for custom toggle/accordion/list controls with richer ARIA live announcements.
4. Add integration and E2E coverage around setup-first navigation and critical owner workflows.

## Phase 1 Architecture Notes (March 6, 2026)
- Added route-level query-state contract boundary for web-app integration work:
  - canonical status set: `idle | loading | success | error`
  - contract files:
    - `src/features/route-query/contracts.ts`
    - `src/features/route-query/adapters.ts`
- Added typed domain route clients to isolate route surfaces from repository wiring details:
  - owner route client:
    - `src/features/owner/routeClient.ts`
    - consumes typed payloads from `src/features/owner/data.ts`
  - public booking route client:
    - `src/features/public-booking/routeClient.ts`
    - consumes typed payloads from `src/features/public-booking/data.ts`
- Route-state rendering conventions for key surfaces:
  - loading: deterministic route loading card with skeleton treatment
  - error: consistent route error card with explicit retry CTA
  - success: route renders only against typed `success.data` contract
- Save-state conventions for form/editor surfaces:
  - shared indicator component for `Saving... | Saved | Failed | Retry`
  - shared primitive:
    - `src/ui/SaveStateIndicator.tsx`
  - integrated in key owner editors/settings pages to reduce copy/behavior drift.

### Phase 1 Boundary Intent for Phase 2
1. Replace mock route client internals with real typed API adapters without changing route component contracts.
2. Introduce request lifecycle controls per client method (abort, stale-response guards, retry/backoff) while preserving route-state API shape.
3. Expand save-state adapter usage to remaining settings/forms so all owner editors share one async feedback contract.

## Phase 2 Persistence UX Architecture Notes (March 6, 2026)
- Added explicit frontend persistence client boundaries for onboarding/settings UX contracts:
  - onboarding client:
    - `src/features/owner/onboarding/persistenceClient.ts`
    - contract: async `load()` and `save(state, { partial })`
    - intent: support launchpad/setup autosave + manual save without changing route component topology
  - settings client:
    - `src/features/owner/settings/persistenceClient.ts`
    - contract: typed section save methods (`brand`, `business`, `team`, `notifications`, `domain`, `booking`, `publish`)
    - intent: isolate section-level persistence semantics from page UI composition
- Persistence state model now shared across onboarding/settings interactions:
  - lifecycle statuses: `idle | saving | saved | failed`
  - UX pattern: inline save indicator + explicit retry callback + toast confirmation/error pairing
- Added browser leave guard for unsaved work:
  - `src/features/forms/useUnsavedChangesGuard.ts`
  - scope: guards page refresh/tab close while form state is `idle` or `failed`.

### Validation and Feedback Standardization (Phase 2)
- Shifted validation UX timing toward touched/submit-gated rendering on settings forms to reduce immediate-error noise while typing.
- Save CTA behavior now aligns to persistence lifecycle:
  - disabled during `saving`
  - explicit `failed` + retry state
  - route-level loading/error cards for initial persisted draft load failures.

### Known Tradeoffs (Phase 2)
1. Session-scoped persistence (`sessionStorage`) was selected for safety and frontend-only scope; durability across devices/sessions is intentionally deferred to backend integration.
2. Retry behavior currently retries the same local persistence client operation; no backoff/network-classification yet because there is no remote transport in this phase.
3. Unsaved-change protection is browser-leave focused; in-app route transition blocking remains a follow-up to avoid introducing router-level behavioral risk in this iteration.
4. Centralized cross-route dirty aggregation was deferred to keep per-route contracts explicit and minimize coupling before real API adapters are introduced.

## Phase 3 Architecture Notes (March 6, 2026)
- Added dedicated scheduling integration boundary for owner calendar state flow:
  - `src/features/owner/scheduling/persistenceClient.ts`
  - typed snapshot contract: timezone + weekly hours + overrides + blackout dates
  - async contract: `load()` and `save(snapshot)` with deterministic frontend retry UX
- Scheduling state flow boundaries in `SchedulingWorkspace`:
  - route-level seed contracts still provided by owner route client (`dashboard`, `business settings`)
  - scheduling hydration/persistence now isolated behind scheduling persistence client
  - save lifecycle rendered through shared `SaveStateIndicator` (`saving | saved | failed` + retry)
  - conflict derivation layer now emits actionable guidance (timezone drift, duplicate overrides, blackout overlap)
- Added public booking integration client for availability + confirmation transport boundaries:
  - `src/features/public-booking/integrationClient.ts`
  - async contract methods:
    - `loadDateOptions(service, staffId)`
    - `loadSlots(service, date, staffId)`
    - `saveConfirmation(record)`
    - `loadConfirmation()`
- Booking flow state boundaries in `BookingFlowScreen`:
  - service/staff catalog remains route-query sourced
  - date and slot availability are now isolated async integration states (`idle | loading | success | error`) with explicit retry actions
  - progression guard prevents advancing while integration states are unresolved/errored
  - confirmation submission now has explicit transient-failure recovery path (`Retry confirmation`)
- Booking confirmation page now follows route-style deterministic state rendering (`loading | error | empty | success`) while reading confirmation through integration boundary.

### Phase 3 Integration Tradeoffs
1. Integration clients currently wrap mocked repositories for safe UX wiring; network transport adapters remain Phase 4 work.
2. Persistence remains browser-session scoped (`sessionStorage`) for deterministic frontend behavior while backend write contracts are pending.
3. Retry semantics are immediate and user-driven; network-aware retry policies/backoff are deferred until real API error classes are available.

## Phase 4 Architecture Notes (Customer + Payments Operational Wiring) (March 6, 2026)
- Added dedicated owner persistence clients for customer and payment operation domains:
  - customers:
    - `src/features/owner/customers/persistenceClient.ts`
    - contract: `load()`, `saveIntakeDraft()`, `updateCustomerStatus()`, `restoreDefaults()`
    - snapshot intent: isolate customer list/intake/status transition UX from route shell contracts
  - payments:
    - `src/features/owner/payments/persistenceClient.ts`
    - contract: `load()`, `savePolicy()`, `transitionOperation()`
    - snapshot intent: unify payment policy/checklist/activity states behind one typed async boundary
- Customer interaction architecture updates:
  - deterministic route-safe state rendering for hydration (`loading | error | empty | ready`)
  - status transitions now follow explicit operation contract with previous-status metadata for undo UX
  - intake save lifecycle now aligns to shared save-state language (`saving | saved | failed + retry`)
- Payments interaction architecture updates:
  - payment activity model introduces explicit state machine for operational clarity:
    - `pending -> paid | failed | blocked`
    - `failed -> pending | paid | blocked`
    - `blocked -> pending | failed`
    - `paid -> refunded`
  - invalid transitions return actionable messages to avoid ambiguous failure states
  - policy save and activity transitions remain decoupled, reducing coupling risk between settings and operations lists
- Cross-surface UX consistency decisions:
  - inline success/error alert pattern standardized for action outcomes
  - row action clusters use matching density/wrap semantics on customers and payments surfaces
  - activity/list tables preserve deterministic spacing and horizontal overflow fallback at narrow widths

### Phase 4 Next Dependencies
1. Replace session persistence clients with real API adapters while preserving contract shapes.
2. Introduce network-aware retry classes and error taxonomy (validation vs auth vs transport).
3. Add audit-event timelines for customer and payment status transitions.
4. Add E2E coverage for customer status undo and payment transition gating rules.

## Phase 5 Architecture Notes (Integrations Provider Lifecycle UX) (March 6, 2026)
- Added dedicated owner integrations persistence boundary for provider lifecycle operations:
  - `src/features/owner/integrations/persistenceClient.ts`
  - typed provider state contract:
    - `disconnected | connecting | connected | degraded | error | reauth-required`
  - typed operational methods:
    - `load()`
    - `connect(providerId)`
    - `disconnect(providerId)`
    - `reauthenticate(providerId)`
    - `runSync(providerId)`
- Integrations route architecture updated from static roadmap rendering to operational lifecycle workspace:
  - file:
    - `src/pages/owner/IntegrationsPage.tsx`
  - interaction model:
    - explicit next-action mapping per provider lifecycle state
    - sync-health + last-sync metadata rendered as first-class status surfaces
    - backoff-aware retry cues (countdown + disabled retry controls) without route lock
    - action feedback surfaced via inline status surfaces + non-blocking toasts
- Observability and troubleshooting architecture added to integrations route:
  - incident/event log stream persisted in integration snapshot and rendered newest-first
  - incident model includes severity and error class taxonomy:
    - auth failure
    - rate limit
    - config issue
    - network issue
  - critical provider failures surfaced via route banner while preserving unrelated workflow continuity
- Styling and responsive architecture:
  - new integrations workspace classes added in `src/styles.css`
  - provider card and incident log layouts collapse predictably at compact breakpoints
  - focus-visible affordances added for keyboard interaction parity.

### Phase 5 Sequencing Into Hardening
1. Replace session-scoped integrations persistence with real API adapters while preserving lifecycle contract shape.
2. Move retry/backoff authority to backend scheduler metadata and expose provider-specific retry reasons.
3. Add provider incident drill-down route(s) with filtering by provider, severity, and error class.
4. Add integration-focused unit + E2E coverage for lifecycle transitions, backoff gating, and log rendering order.

## Phase 6 Post-Integration Hardening Architecture Notes (March 6, 2026)
- Hardening objective was completed without changing route IA or setup-first entry behavior:
  - `/` and `/owner` remain setup-first redirects.
  - owner/public route topology unchanged.

### Regression Coverage Expansion
- Added high-value integration-style route flow coverage focused on behavior gates and recovery affordances:
  - booking: availability-loading continue gate
  - customers: status transition + undo
  - onboarding: launchpad -> step editor path
  - scheduling: timezone drift conflict cue
  - payments: status transition + undo
  - integrations: disconnected -> connect -> sync-action state progression
- New/updated test files:
  - `src/pages/public/booking/BookingFlow.test.tsx`
  - `src/modules/clients/CustomerWorkspace.test.tsx`
  - `src/pages/owner/Phase6Hardening.test.tsx`

### Accessibility Hardening Decisions
- Shared flow section contract now supports explicit heading focus handoff:
  - `FlowSection` accepts optional `headingRef` and `headingTabIndex`.
  - booking flow focuses active step heading whenever step changes.
- Booking flow now emits polite live-region status messaging for:
  - active stage changes
  - availability loading/error/success counts
  - confirmation submission/retry state
- Brand settings upload zones now provide keyboard activation parity (`Enter`/`Space`) with explicit feedback rather than silent no-op interactions.

### CSS Ownership Boundaries (Phase 6 Split)
- New feature-owned stylesheet:
  - `src/pages/owner/integrations.css`
- Ownership moved from global `src/styles.css` to integrations module:
  - integrations critical banner
  - provider card/state/detail/action styles
  - incident list/taxonomy styles
  - integrations-specific focus-visible and compact-breakpoint rules
- Updated rule-of-thumb after split:
  - `src/styles.css`: global document/shell + cross-feature shared patterns only
  - feature styles with route-local selectors should live beside route modules and be imported by that route entry

### Recommended Long-Term Cleanup Order (Post-Phase 6)
1. Resolve test-environment blocker (`undici` worker startup module resolution) so regression suites can run in CI/local deterministically.
2. Continue CSS extraction in this order to reduce global drift risk:
   - scheduling (`schedule-*`)
   - onboarding launchpad/editor (`setup-*`, `onboarding-*`)
   - settings pages (`settings-*`, `brand-*`, `publish-*`, `domain-*`)
3. Standardize remaining legacy `@slotra/ui` form/control usage onto shared `Brand*` primitives where contracts overlap.
4. Expand a11y hardening for complex controls with:
   - deterministic focus-return patterns after async mutations
   - richer contextual live announcements for status transitions and retry outcomes
