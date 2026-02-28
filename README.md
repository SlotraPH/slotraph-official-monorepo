# Slotra

> A web-based booking system built for Philippine salons and barbershops.

Slotra gives salon and barbershop owners a simple, localized alternative to managing appointments through Messenger or handwritten notebooks. Each business gets a dedicated public booking page where customers can book directly — no app download, no customer account required.

---

## Why Slotra

Salons and barbershops in the Philippines commonly manage bookings through Facebook Messenger or paper logs. This leads to:

- Double bookings and scheduling conflicts
- Slow manual confirmations
- No-shows with no accountability
- Revenue loss from unpaid reservations

Existing global platforms are too complex, too expensive, or not aligned with local payment workflows like **GCash** and **Maya**.

Slotra is built specifically for this market — simple to onboard, easy to use, and priced for small Philippine businesses.

---

## Who It's For

| User | Description |
|---|---|
| **Business Owner** | Salon or barbershop owner managing 1–5 staff |
| **Customer** | End-user booking a service online |

---

## Core Features (MVP)

### For Business Owners
- **Dashboard** — calendar view of all appointments by day/week
- **Services Management** — define services, durations, and pricing
- **Customer Management** — view booking history per customer
- **Deposit Toggle** — require optional manual deposits via GCash or Maya to reduce no-shows
- **Onboarding Flow** — guided first-time setup to get live fast

### For Customers
- **Public Booking Page** — every business gets a dedicated URL:
  ```
  business.slotra.ph
  ```
- **No account required** — customers book directly with just their name and contact
- **Real-time availability** — only open slots are shown
- **Double booking prevention** — enforced at the system level

---

## Product Scope

**In scope for MVP:**
- Web application (landing + owner dashboard + public booking page)
- Manual deposit workflow (GCash / Maya)
- Business authentication and onboarding
- Booking logic with conflict prevention

**Out of scope (post-MVP):**
- Mobile app
- SMS notifications
- Automatic payment gateway
- Multi-branch support
- Advanced analytics
- Staff roles & permissions
- Third-party integrations

---

## Monorepo Structure

This repository is a **pnpm + Turborepo monorepo** containing all Slotra applications and shared packages.

```
slotra-monorepo/
├── apps/
│   ├── landing/        # Public marketing site (Astro)
│   ├── web-app/        # Owner dashboard + booking pages (React + Vite)
│   └── mobile/         # Mobile app — post-MVP (Expo)
│
└── packages/
    ├── ui/             # Shared React components
    ├── utils/          # Shared types, constants, helpers
    ├── eslint-config/  # Shared ESLint rules
    └── tsconfig/       # Shared TypeScript configurations
```

| App | Framework | Purpose |
|---|---|---|
| `landing` | Astro | SEO-optimized marketing and waitlist page |
| `web-app` | React + Vite | Business dashboard and public booking pages |
| `mobile` | Expo | Mobile client (planned post-MVP) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Monorepo | Turborepo + pnpm workspaces |
| Landing | Astro |
| Web App | React + Vite |
| Mobile | Expo (React Native) |
| Language | TypeScript |
| Linting | ESLint v9 |

---

## Developer Setup

See **[SETUP.md](./SETUP.md)** for the full guide — prerequisites, running apps locally, project navigation, and how to work with shared packages.

**Quick start:**

```bash
pnpm install
pnpm dev
```

---

## MVP Timeline

Target: **production-ready web MVP in 4–6 weeks** to validate:

- Business adoption
- Booking activity
- Willingness to pay

Mobile development will follow only after traction is proven.

---

## Status

> 🚧 Active development — MVP in progress.
