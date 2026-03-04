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
