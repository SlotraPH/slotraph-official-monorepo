# UI/UX Implementation Plan (Web App)

Last updated: March 5, 2026
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
