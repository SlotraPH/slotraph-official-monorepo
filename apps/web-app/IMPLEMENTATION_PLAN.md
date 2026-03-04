# Web App Implementation Plan

This plan reflects the current state of `apps/web-app` as of March 4, 2026.

The app is no longer just a scaffold. It already has:

- owner routing and shell layout
- mock owner pages for calendar, services, customers, payments, integrations, and settings
- a brand details settings screen with richer form UI
- public booking and booking confirmation routes
- shared UI primitives in `packages/ui`

The main gap is that the app is still inconsistent and not implementation-ready. Some flows are only placeholders, shared UI usage is uneven, and the current frontend baseline is not yet clean because build and lint are failing.

## Current Status

- [x] Routing exists for owner and public booking flows
- [x] Owner shell exists with sidebar and top bar
- [x] Core owner screens have mock UI
- [x] Shared UI package includes `Button`, `Input`, `Card`, `Badge`, and `PageHeader`
- [ ] `web-app` builds cleanly
- [ ] `web-app` lints cleanly
- [ ] Onboarding flow is implemented
- [ ] Public booking flow is implemented
- [ ] Frontend domain/state layer exists
- [ ] Tests exist for `web-app`

## Phase 0: Stabilize the Frontend Baseline

Goal: make the current `web-app` safe to build on.

- [ ] Fix the TypeScript build error currently coming from `packages/ui/src/components/Navbar.tsx`
- [ ] Fix the current ESLint issues in `apps/web-app`
- [ ] Clean up text encoding/mojibake issues in page copy and comments
- [ ] Standardize page header usage across owner pages
- [ ] Standardize `Button`, `Input`, `Card`, and `Badge` usage instead of mixing shared components with ad hoc markup
- [ ] Verify `pnpm --filter @slotra/web-app build` passes
- [ ] Verify `pnpm --filter @slotra/web-app lint` passes
- [ ] Verify `pnpm --filter @slotra/web-app type-check` passes

## Phase 1: Consolidate Shared UI for the Web Apps

Goal: reduce duplication and make implementation work faster.

- [ ] Audit repeated UI patterns in `apps/web-app`
- [ ] Move reusable primitives into `packages/ui`
- [ ] Add missing shared components:
- [ ] `EmptyState`
- [ ] `SectionCard`
- [ ] `DataTable`
- [ ] `FormField`
- [ ] `Select`
- [ ] `Textarea`
- [ ] Decide whether `SidebarNav` and `TopBar` remain app-local or become shared app-shell components
- [ ] Reduce style duplication between page-level CSS and shared UI components
- [ ] Confirm shared components work for both `apps/web-app` and `apps/landing` where appropriate

## Phase 2: Finish the Core Owner MVP Screens

Goal: turn the current mock screens into usable product flows.

### Dashboard

- [ ] Replace the current placeholder metrics block with real summary cards
- [ ] Add upcoming bookings module
- [ ] Add revenue / activity summary
- [ ] Add quick actions for service creation, customer creation, and availability setup

### Services

- [ ] Convert the mock list into CRUD-ready service management
- [ ] Add create service flow
- [ ] Add edit service flow
- [ ] Add archive / disable state
- [ ] Support duration, pricing, category, and visibility fields

### Customers

- [ ] Replace the empty-state-only screen with a real customer list view
- [ ] Add customer search and filtering
- [ ] Add customer detail drawer or page
- [ ] Define CSV import as MVP or defer it explicitly

### Payments

- [ ] Decide if payments is in MVP scope or post-MVP scope
- [ ] If in scope, convert the current marketing-style screen into settings and status management
- [ ] If not in scope, gate it clearly as upcoming

### Integrations

- [ ] Decide if integrations is in MVP scope or post-MVP scope
- [ ] If deferred, reduce implementation effort and present it as roadmap-only
- [ ] If kept, define which integrations actually matter for MVP

### Settings

- [x] Brand Details screen exists
- [ ] Add business profile settings
- [ ] Add team / staff settings
- [ ] Add notification settings
- [ ] Add booking preferences settings

## Phase 3: Build the Owner Onboarding Flow

Goal: collect the minimum business data needed before the owner can accept bookings.

- [ ] Replace `OnboardingPage.tsx` placeholder with a real multi-step flow
- [ ] Add business info step
- [ ] Add booking slug step
- [ ] Add services setup step
- [ ] Add staff / team setup step
- [ ] Add business hours step
- [ ] Add payment / deposit preferences step
- [ ] Add progress indicator
- [ ] Add validation per step
- [ ] Add save-and-continue behavior
- [ ] Reuse Brand Details form logic instead of duplicating fields
- [ ] Add onboarding completion state with next actions

## Phase 4: Build the Public Booking Experience

Goal: make the customer-facing route work as a real booking flow.

- [ ] Replace `BookingPage.tsx` placeholder with a real booking UI
- [ ] Add business profile header
- [ ] Add service selection
- [ ] Add staff selection when applicable
- [ ] Add date selection
- [ ] Add time-slot selection
- [ ] Add customer details form
- [ ] Add booking review step
- [ ] Replace confirmation placeholder with a real confirmation state
- [ ] Make the booking flow mobile-first and responsive

## Phase 5: Add a Frontend Domain and State Layer

Goal: stop storing mock data directly inside page files.

- [ ] Define frontend types for business, service, staff, customer, booking, hours, and deposit/payment settings
- [ ] Create centralized mock data and fixtures for development
- [ ] Add a data-access layer for owner and public flows
- [ ] Define loading states for major routes
- [ ] Define empty states for all major entities
- [ ] Define error states for major routes
- [ ] Add feature flags or route guards for unfinished areas

## Phase 6: Backend Integration Readiness

Goal: prepare the `web-app` to connect cleanly to a future API.

- [ ] Define route/data boundaries for owner and public flows
- [ ] Define frontend contract for booking availability
- [ ] Define frontend contract for service CRUD
- [ ] Define frontend contract for customer management
- [ ] Define frontend contract for settings and onboarding save actions
- [ ] Add environment/config handling for API base URLs
- [ ] Prepare auth boundaries for owner routes

## Phase 7: Quality and Release Readiness

Goal: make the `web-app` stable enough for real user testing.

- [ ] Add unit tests for scheduling and booking helpers
- [ ] Add component tests for onboarding steps
- [ ] Add component tests for booking flow states
- [ ] Add end-to-end tests for owner onboarding
- [ ] Add end-to-end tests for public booking
- [ ] Add error boundary handling
- [ ] Add 404 / route-fallback UX
- [ ] Run responsive QA on desktop and mobile breakpoints
- [ ] Add analytics events for onboarding and booking milestones

## Recommended Execution Order

1. [ ] Stabilize the frontend baseline first
2. [ ] Consolidate shared UI primitives
3. [ ] Build the owner onboarding flow
4. [ ] Build the public booking flow
5. [ ] Finish the deeper owner management screens
6. [ ] Add domain/state structure
7. [ ] Prepare backend integration points
8. [ ] Add testing and release hardening

## Notes

- `apps/mobile` should remain out of scope until the `web-app` MVP is usable.
- Payments and integrations should be explicitly scoped, not half-built.
- Booking and onboarding should drive the data model for the rest of the web app.
- The next implementation milestone should be a clean build/lint/type-check baseline before adding more screens.

---

## Phase 1 Audit - March 4, 2026

### Current inventory

#### Route and page map

- `/` -> `src/pages/HomePage.tsx`
- `/owner` -> guarded by `src/app/routes/OwnerRouteGuard.tsx`, rendered inside `src/app/layouts/OwnerLayout.tsx`, redirects to `/owner/calendar`
- `/owner/calendar` -> `src/pages/owner/CalendarPage.tsx`
- `/owner/dashboard` -> `src/pages/owner/DashboardPage.tsx`
- `/owner/services` -> `src/pages/owner/ServicesPage.tsx`
- `/owner/customers` -> `src/pages/owner/CustomersPage.tsx`
- `/owner/payments` -> `src/pages/owner/PaymentsPage.tsx`
- `/owner/integrations` -> `src/pages/owner/IntegrationsPage.tsx`
- `/owner/settings` -> `src/pages/owner/SettingsPage.tsx`, redirects to `/owner/settings/brand`
- `/owner/settings/brand` -> `src/pages/owner/settings/BrandDetailsPage.tsx`
- `/owner/settings/business` -> `src/pages/owner/settings/BusinessProfilePage.tsx`
- `/owner/settings/team` -> `src/pages/owner/settings/TeamSettingsPage.tsx`
- `/owner/settings/notifications` -> `src/pages/owner/settings/NotificationsSettingsPage.tsx`
- `/owner/settings/booking` -> `src/pages/owner/settings/BookingPreferencesPage.tsx`
- `/owner/onboarding` -> `src/pages/owner/OnboardingPage.tsx` -> `src/pages/owner/onboarding/OnboardingFlow.tsx`
- `/book` -> `src/pages/public/BookingPage.tsx` -> `src/pages/public/booking/BookingFlow.tsx`
- `/book/confirmation` -> `src/pages/public/BookingConfirmationPage.tsx`
- `*` -> `src/pages/NotFoundPage.tsx`

#### Layout wrappers and app-shell pieces

- `src/App.tsx` wraps the app in `src/app/components/AppErrorBoundary.tsx`
- `src/app/layouts/OwnerLayout.tsx` composes `SidebarNav`, `TopBar`, and route outlet
- `src/app/components/SidebarNav.tsx` is the owner shell nav, utility links, and profile rail
- `src/app/components/TopBar.tsx` is the owner page title bar and global action cluster
- `src/app/components/RouteStateCard.tsx` is the app-local loading/error/empty wrapper

#### Data, service, and utility modules

- `src/features/auth/*` owns the owner-route session guard
- `src/features/owner/data.ts` is the main owner data aggregator for dashboard, services, customers, team, settings, payments, integrations, and onboarding seed data
- `src/features/owner/services/*`, `src/features/owner/customers/*`, `src/features/owner/settings/*`, and `src/features/owner/onboarding/*` expose mock repositories plus contracts
- `src/features/public-booking/*` owns the public catalog, availability, booking draft, and confirmation persistence
- `src/features/resource.ts` is the only async/resource abstraction today
- `src/domain/*` holds the core business, booking, customer, hours, payments, service, and staff types plus service formatters
- `src/mocks/*` is the current backing data source for nearly every owner and public flow
- Session helpers still live under page folders: `src/pages/owner/onboarding/session.ts` and `src/pages/public/booking/bookingSession.ts`

#### Existing shared UI usage

- Imported from `@slotra/ui`: `Badge`, `Button`, `Card`, `EmptyState`, `FormField`, `Input`, `PageHeader`, `SectionCard`, `Select`, `Textarea`
- App-local primitives still exist in `src/styles.css`: `.btn`, `.input`, `.badge`, `.card`, `.page-header`, `.empty-state`, `.button-link`, plus large owner/onboarding/booking class clusters
- Several forms still render raw `<input>` elements with the app-local `.input` class instead of a single brand input primitive
- Icons are mostly handwritten SVGs in app files instead of the Lucide-only direction from `brand.md`

#### Design tokens currently in use

- `src/styles.css` defines colors, spacing, radii, shadows, typography, sidebar width, and topbar height in one 2862-line file
- The active palette is still scaffold-era indigo/Slate (`#4f46e5`, `#4338ca`, `#111827`, `#1a1f2e`, `#52607a`) instead of Slotra brand indigo/navy (`#2e3192`, `#0f1f2e`, `#4a5668`)
- Buttons, inputs, badges, cards, progress fills, callouts, and booking highlights use local tokens that do not yet match the brand gradients, focus rings, radii, or shadow recipes
- The font family is Inter already, but the type scale, heading color, and button/input specs are not aligned to the March 2026 brand source of truth

### Redesign blockers and tech debt

- `src/styles.css` is the main god file; shell styles, page primitives, onboarding, booking, calendar, and settings all share one stylesheet, making safe redesign work slow and brittle
- Brand drift is widespread: current accent and status colors are mostly Tailwind defaults, while `brand.md` requires Slotra-specific indigo gradients, navy text, brand rings, and a tighter neutral scale
- UI composition is inconsistent: some screens use `@slotra/ui`, others use local `.btn` / `.input` / `.button-link`, and some mix both in the same page
- Data boundaries leak upward into page folders: owner/public repositories depend on page-level session helpers and booking availability helpers, so domain logic is not cleanly reusable
- `src/features/owner/data.ts` is already becoming a catch-all facade instead of thin domain entrypoints
- `src/pages/public/booking/BookingFlow.tsx` (430 LOC) and `src/pages/owner/onboarding/OnboardingFlow.tsx` (387 LOC) are close to the size ceiling and already mix orchestration, local state, navigation rules, analytics, and save behavior
- `src/app/components/SidebarNav.tsx` and `src/app/components/TopBar.tsx` are visually off-brand today: custom SVG icons, placeholder logo block, and dark shell colors that do not follow `brand.md`
- Calendar events use hard-coded ad hoc colors in `src/pages/owner/CalendarPage.tsx`, which blocks a consistent semantic token story
- Motion, iconography, scrollbar, navbar, and toast guidance from `brand.md` are not represented in the current web-app token surface

### Target structure for Phase 2+

Use thin route files that compose domain modules and keep feature state close to each domain. Prefer barrel exports per folder.

```text
apps/web-app/src/
  app/
    providers/
    router/
    shell/
      owner/
        OwnerLayout.tsx
        OwnerSidebar.tsx
        OwnerTopbar.tsx
        index.ts
  design-system/
    tokens/
      colors.ts
      spacing.ts
      typography.ts
      motion.ts
      shadows.ts
      radii.ts
      index.ts
    primitives/
      BrandButton.tsx
      BrandInput.tsx
      BrandSelect.tsx
      BrandTextarea.tsx
      BrandBadge.tsx
      BrandCard.tsx
      StatePanel.tsx
      SelectionCard.tsx
      index.ts
    composites/
      PageHeader.tsx
      SectionCard.tsx
      FormField.tsx
      Stepper.tsx
      EmptyState.tsx
      index.ts
  domains/
    scheduling/
      components/
      services/
      hooks/
      types.ts
      index.ts
    customers/
      components/
      services/
      hooks/
      types.ts
      index.ts
    staff/
      components/
      services/
      hooks/
      types.ts
      index.ts
    billing/
      components/
      services/
      hooks/
      types.ts
      index.ts
    settings/
      brand/
      business/
      team/
      notifications/
      booking/
      index.ts
    onboarding/
      components/
      hooks/
      services/
      index.ts
    public-booking/
      components/
      hooks/
      services/
      index.ts
  shared/
    analytics/
    config/
    storage/
    utils/
  routes/
    owner/
    public/
```

#### Structure rules

- Route files stay thin and only compose loaders/hooks plus presentational blocks
- Repositories move out of `pages/**` dependencies and into `domains/*/services`
- Session/local-storage helpers move into `shared/storage`
- Each domain gets its own `index.ts` barrel for import stability
- `styles.css` should shrink to reset/global-document rules only; feature and shell styling should live beside the owning domain/module

### Design-system surface area required before redesign

#### Tokens

- Colors: brand, brand-hover, brand-light, navy, page, secondary, muted, border, input-border, semantic states, focus rings
- Typography: hero, section, sub-heading, body, small body, label, overline, nav, button
- Spacing: 8pt scale through `24`
- Radii: `sm`, `md`, `lg`, `xl`, `full`
- Shadows: card, elevated, brand glow (`sm`, `md`, `lg`), inset highlight
- Motion: default interactive `150ms`, page `300ms`, decorative float, draw-in, tilt
- Layout: max content width `1200px`, content paddings, banner/nav offsets, shell heights

#### Primitives and composites

- `BrandButton` with primary gradient and secondary gradient-outline variants
- `BrandInput`, `BrandSelect`, `BrandTextarea`, `BrandField` with brand focus/error rings and Lucide icon slots
- `BrandBadge` for accent, neutral, success, warning, and danger states
- `BrandCard` / `BrandSection` for card chrome and padded sections
- `StatePanel` for loading, error, empty, and guard states
- `PageHeader` and `OwnerTopbar` with the same title hierarchy and action spacing
- `Stepper` shared by onboarding and public booking
- `SelectionCard` shared by service/staff/date/time choice states
- `DataList` / `SplitPanel` patterns for services and customers
- `OwnerSidebar` and `SettingsTabs` aligned to brand iconography and navigation states
- `BookingPagePreviewCard` and `BrandAssetDropzone` for brand/settings workflows

### Migration checklist

| Current | To be |
| --- | --- |
| local `.btn`, `.button-link`, mixed `Button` usage | `BrandButton` |
| local `.input` plus raw `<input>` fields | `BrandInput` + `BrandField` |
| current `Select`, app-local select wrappers | `BrandSelect` |
| current `Textarea` plus local footer/count styles | `BrandTextarea` |
| local `.card` and current `Card` wrappers | `BrandCard` |
| current `SectionCard` usage | `BrandSection` |
| current `Badge` variants | `BrandBadge` |
| `RouteStateCard` + local empty-state classes | `StatePanel` |
| onboarding and booking progress UIs | shared `Stepper` |
| booking choice/date/time card classes | `SelectionCard` |
| `SidebarNav` | `OwnerSidebar` |
| `TopBar` | `OwnerTopbar` |
| `SettingsPage` tab strip | `SettingsTabs` |
| brand preview block in `BrandDetailsPage` and onboarding slug step | `BookingPagePreviewCard` |
| banner/logo upload zones in `BrandDetailsPage` | `BrandAssetDropzone` |
| service/customer split-view page scaffolds | `SplitPanel` + domain list/detail modules |
| page-folder session helpers | `shared/storage` adapters |

### Recommended order for the redesign phase

1. Freeze brand tokens in a dedicated web-app design-system layer that mirrors `brand.md`
2. Split `styles.css` into shell, design-system, owner-domain, and public-booking ownership boundaries
3. Extract `StatePanel`, `Stepper`, `SelectionCard`, and branded form controls first because both onboarding and booking need them
4. Move page-coupled repository/session code into `domains/*/services` and `shared/storage`
5. Rebuild owner shell (`SidebarNav`, `TopBar`, settings tabs) on top of the brand token layer before deeper page redesign

### Phase 2 adoption notes

- Use `src/ui/tokens.ts` as the source of truth for Slotra colors, spacing, radii, shadows, motion, and typography values in `apps/web-app`.
- Prefer `BrandButton`, `BrandInput`, `Card`, `FormLabel`, `SectionHeading`, and `Typography` from `src/ui` for new screens before touching app-local `.btn`, `.input`, `.card`, and freehand heading styles.
- Keep gradients, focus rings, and brand glows in inline `style` props through these primitives; reserve CSS for layout and document-wide rules.
- Keep toast usage on `useBrandToast()` so Sileo stays aligned with the bottom-left navy configuration from `brand.md`.
- Use `/sandbox` as the visual verification route before migrating existing owner or public screens to the new primitives.

## Phase 3 notes - March 4, 2026

Implemented in this phase:

- Added an app-level shell with dev-banner offset handling, fixed navbar, shared footer, and branded home/public framing
- Rebuilt the owner workspace rail with Slotra branding assets and aligned navigation states
- Added reusable layout templates for hero, feature-grid, steps, metrics, and owner page intros
- Migrated the top-level owner routes and public routes onto the new shell without changing the current route/data contracts
- Overrode legacy global tokens so older modules inherit the March 2026 brand palette, input styling, and button treatment more consistently

Remaining off-brand or Phase 4 follow-up areas:

- Several nested owner modules still render `@slotra/ui` primitives and app-local classes that predate the Phase 2 token layer
- Settings subpages still use raw `.input` fields and custom preview/upload blocks instead of fully branded local primitives
- Public booking and onboarding internals still rely on older card/progress/detail compositions even though they now sit inside the new shell
- `src/styles.css` still carries legacy page-specific CSS; Phase 4 should continue moving feature styling beside owning modules and shrinking global scope
- `TopBar.tsx` is now effectively superseded by page-intro templates and should either be removed or reintroduced only if a real product need appears
