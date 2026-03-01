# Slotra MVP Implementation Plan

This document is the working plan for turning the current monorepo scaffold into the first web MVP.

## Very First Step

Build the `apps/web-app` product shell first.

Why this is first:
- It gives the MVP a real structure instead of isolated screens.
- It establishes the routes for owner workflows and the public booking flow.
- It reveals what shared UI components actually need to exist.

Definition of done for the first step:
- [x] Add routing to `apps/web-app`
- [x] Create an owner app layout with sidebar, top bar, and page content area
- [x] Create placeholder pages for Dashboard, Services, Customers, Settings, and Onboarding
- [x] Create a public booking page route separate from the owner area
- [x] Confirm all routes render correctly in the browser

## Phase 1: Product Skeleton

Goal: make the web app feel like a real product before backend integration.

### Web App Structure

- [x] Install and configure routing in `apps/web-app`
- [x] Create route groups for owner pages and public booking pages
- [x] Add a shared app layout for authenticated owner pages
- [ ] Add a reusable page header component
- [ ] Add empty states and loading placeholders

### Initial Screens

- [x] Dashboard page
- [x] Services page
- [x] Customers page
- [x] Settings page
- [x] Onboarding overview page
- [x] Public booking page
- [x] Booking confirmation page

### Shared UI Boilerplate

- [ ] `Button`
- [ ] `Input`
- [ ] `Select`
- [ ] `Card`
- [ ] `PageHeader`
- [ ] `SidebarNav`
- [ ] `EmptyState`
- [ ] `StatusBadge`

## Phase 2: Onboarding Flow

Goal: let a business owner set up the minimum data needed to accept bookings.

### Screens

- [ ] Business details form
- [ ] Business slug setup
- [ ] Services setup
- [ ] Staff setup
- [ ] Business hours setup
- [ ] Onboarding completion screen

### Data Requirements

- [ ] Define frontend types for business, service, staff, and schedule
- [ ] Create fake/mock data for development
- [ ] Decide required vs optional fields for onboarding

### UX Requirements

- [ ] Multi-step form navigation
- [ ] Form validation messages
- [ ] Save and continue behavior
- [ ] Progress indicator

## Phase 3: Booking Experience

Goal: prove the public booking flow end to end at the UI level.

### Public Booking UI

- [ ] Business profile header
- [ ] Service selection
- [ ] Staff selection, if applicable
- [ ] Date picker
- [ ] Time slot picker
- [ ] Customer information form
- [ ] Booking review step
- [ ] Confirmation state

### Booking Rules in Frontend

- [ ] Represent available vs unavailable slots
- [ ] Prevent obviously invalid submissions
- [ ] Show deposit requirement messaging when enabled

## Phase 4: Backend Foundation

Goal: add the first real backend for the MVP.

### API App

- [ ] Create `apps/api`
- [ ] Choose backend framework
- [ ] Add environment variable handling
- [ ] Add basic health route
- [ ] Add shared error handling

### Database

- [ ] Choose ORM
- [ ] Add PostgreSQL setup
- [ ] Define initial schema
- [ ] Add migrations
- [ ] Add seed data

### Core Models

- [ ] Business
- [ ] Owner user
- [ ] Service
- [ ] Staff
- [ ] Customer
- [ ] Booking
- [ ] Business hours
- [ ] Deposit settings

## Phase 5: Real Business Logic

Goal: move from static UI to a usable booking system.

### Owner Features

- [ ] Owner authentication
- [ ] Create and edit services
- [ ] Create and edit staff
- [ ] Configure business hours
- [ ] View booking list
- [ ] View customer history

### Booking Engine

- [ ] Generate available slots from service duration and schedule
- [ ] Prevent double booking
- [ ] Validate booking creation on the server
- [ ] Handle booking status changes

### Deposit Workflow

- [ ] Add deposit-required setting
- [ ] Show deposit instructions on booking flow
- [ ] Mark deposit as pending or received

## Phase 6: Quality and Release Readiness

Goal: make the MVP stable enough to test with real users.

### Testing

- [ ] Add unit tests for booking logic
- [ ] Add integration tests for booking creation
- [ ] Add integration tests for availability lookup
- [ ] Add basic end-to-end tests for onboarding and booking

### Operational Readiness

- [ ] Add logging
- [ ] Add error boundaries in the web app
- [ ] Add API request validation
- [ ] Add production environment configs
- [ ] Add deployment plan for landing, web app, API, and database

## Immediate Execution Order

Work these in order:

1. [ ] Add routing to `apps/web-app`
2. [ ] Build the owner app shell layout
3. [ ] Add placeholder owner pages
4. [ ] Add the public booking route and page
5. [ ] Create the first shared UI components in `packages/ui`
6. [ ] Build the onboarding screens with mock data
7. [ ] Build the booking flow with mock data
8. [ ] Create the backend app and database schema

## Notes

- Ignore `apps/mobile` until the web MVP is usable.
- Do not overbuild the shared UI package before the real screens exist.
- Keep booking rules out of page components once backend work starts.

## Progress Log

- 2026-02-28: Completed the web-app product shell first step. Added routes for `/`, `/owner/dashboard`, `/owner/services`, `/owner/customers`, `/owner/settings`, `/owner/onboarding`, `/book`, and `/book/confirmation`.
