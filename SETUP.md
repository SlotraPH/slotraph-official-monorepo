# Slotra Monorepo — Developer Setup

## Prerequisites

Make sure you have the following installed before anything else:

| Tool | Version | Install |
|---|---|---|
| Node.js | >= 20 | https://nodejs.org |
| pnpm | >= 9 | `npm install -g corepack && corepack enable` |
| Git | any | https://git-scm.com |

For mobile development, you'll also need:
- **Expo Go** app on your phone (iOS/Android), or
- Android Studio / Xcode for emulator/simulator

---

## Getting Started

```bash
# 1. Clone the repository
git clone <repo-url>
cd slotra-monorepo

# 2. Install all dependencies for every app and package
pnpm install

# 3. Run everything at once
pnpm dev
```

That's it. All apps start in parallel.

---

## Running Apps Individually

```bash
pnpm dev:landing   # Landing page  → http://localhost:4321
pnpm dev:web       # Web app       → http://localhost:5173
pnpm dev:mobile    # Mobile app    → Expo Dev Client
```

---

## Project Structure

```
slotra-monorepo/
├── apps/
│   ├── landing/        # Public-facing marketing site (Astro)
│   ├── web-app/        # Main web application (React + Vite)
│   └── mobile/         # Mobile application (Expo / React Native)
│
└── packages/
    ├── ui/             # Shared React components (used by landing + web-app)
    ├── utils/          # Shared types, constants, and helpers (used by all apps)
    ├── eslint-config/  # Shared ESLint rules
    └── tsconfig/       # Shared TypeScript configurations
```

### Apps

#### `apps/landing` — Astro
The public marketing/landing page. Uses Astro for static site generation and SSR, which gives it excellent SEO out of the box. Can use React components via the `@astrojs/react` integration.

```
apps/landing/
├── src/
│   ├── layouts/        # Page shell templates (HTML head, body wrappers)
│   ├── pages/          # File-based routing — each file is a route
│   └── env.d.ts        # Astro type declarations
├── public/             # Static assets served as-is (favicon, images)
└── astro.config.mjs    # Astro configuration
```

#### `apps/web-app` — React + Vite
The main authenticated web application. A client-side SPA — ideal for dashboards and app-like experiences.

```
apps/web-app/
├── src/
│   ├── App.tsx         # Root component
│   └── main.tsx        # Entry point — mounts React into index.html
├── public/             # Static assets
├── index.html          # SPA shell
└── vite.config.ts      # Vite configuration (includes @ path alias)
```

> **Path alias:** Use `@/` instead of long relative imports.
> `import { Button } from '@/components/Button'` → resolves to `src/components/Button`

#### `apps/mobile` — Expo (React Native)
The mobile application for iOS and Android. Uses Expo Router for file-based navigation, same concept as Next.js/Astro pages.

```
apps/mobile/
├── app/
│   ├── _layout.tsx       # Root layout (Stack navigator)
│   ├── +not-found.tsx    # 404 screen
│   └── (tabs)/           # Tab group
│       ├── _layout.tsx   # Tab bar definition
│       └── index.tsx     # Home tab screen
├── app.json              # Expo app configuration (name, icons, bundle ID)
└── metro.config.js       # Metro bundler config — DO NOT remove, required for monorepo
```

---

### Shared Packages

These live in `packages/` and are referenced as workspace dependencies (`workspace:*`) — no publishing required.

#### `@slotra/utils`
Shared logic safe to use in **all apps** including mobile. No DOM or React Native dependencies — pure TypeScript only.

```
packages/utils/src/
├── types/      # Shared TypeScript types (e.g. User, ApiResponse)
├── constants/  # App-wide constants (e.g. APP_NAME, API endpoints)
└── helpers/    # Pure utility functions (e.g. formatDate, slugify)
```

Usage in any app:
```ts
import { APP_NAME } from '@slotra/utils';
```

#### `@slotra/ui`
Shared React components for **web apps only** (landing + web-app). Do not import this in mobile — React Native uses different primitives.

```
packages/ui/src/
└── components/   # Add shared components here and export from index.ts
```

Usage:
```ts
import { Button } from '@slotra/ui';
```

#### `@slotra/eslint-config`
Shared ESLint rules. Apps consume it via their local `eslint.config.js`:
```js
import reactConfig from '@slotra/eslint-config/react';
export default reactConfig;
```

#### `@slotra/tsconfig`
Shared TypeScript configurations. Each app extends the right preset:

| File | Used by |
|---|---|
| `base.json` | `@slotra/utils`, any plain TS package |
| `react.json` | `apps/web-app`, `@slotra/ui` |
| `astro.json` | `apps/landing` |
| `expo.json` | `apps/mobile` |

---

## Common Commands

```bash
# Development
pnpm dev                  # Start all apps
pnpm dev:landing          # Start landing only
pnpm dev:web              # Start web-app only
pnpm dev:mobile           # Start mobile only

# Building
pnpm build                # Build all apps (respects dependency order)

# Code quality
pnpm lint                 # Lint all packages and apps
pnpm type-check           # Type-check all packages and apps

# Cleanup
pnpm clean                # Remove all Turbo cache and build outputs
```

---

## Adding a New Shared Utility

1. Add your function/type to the appropriate file under `packages/utils/src/`
2. Make sure it is exported from the relevant `index.ts`
3. Import it in any app using `@slotra/utils`

```ts
// packages/utils/src/helpers/index.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString();
}
```

```ts
// apps/web-app/src/App.tsx
import { formatDate } from '@slotra/utils';
```

No rebuild or publish step needed — changes are picked up immediately.

---

## Adding a New Shared UI Component

1. Create your component under `packages/ui/src/components/`
2. Export it from `packages/ui/src/components/index.ts`
3. Import it in `apps/landing` or `apps/web-app`

```ts
// packages/ui/src/components/Button.tsx
export function Button({ label }: { label: string }) {
  return <button>{label}</button>;
}

// packages/ui/src/components/index.ts
export { Button } from './Button';
```

```ts
// apps/web-app/src/App.tsx
import { Button } from '@slotra/ui';
```

---

## Tech Stack Reference

| Layer | Technology | Docs |
|---|---|---|
| Monorepo tooling | Turborepo | https://turbo.build |
| Package manager | pnpm | https://pnpm.io |
| Landing page | Astro | https://astro.build |
| Web app | React + Vite | https://vite.dev |
| Mobile app | Expo + React Native | https://expo.dev |
| Language | TypeScript | https://typescriptlang.org |
| Linting | ESLint v9 | https://eslint.org |
