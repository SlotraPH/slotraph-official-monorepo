# Authentication Blueprint

## Objectives
- Provide a secure, multi-tenant login surface for salon owners and their staff.
- Keep session handling resilient to scale (refresh tokens, rotation, revocation, rate limits).
- Align with the existing Slotra stack (web-app, planned api, Supabase infra) so rollout stays incremental.

## Architecture overview

### Identity core
- **Primary provider:** Supabase Auth (already configured in `supabase/config.toml`). Supabase handles JWT issuance, refresh-token rotation, and email/password flows while keeping the user pool centralized.
- **Custom claims:** Extend each auth user with `business_id`, `role`, and `is_first_owner` via Postgres functions/hooks. These claims feed RLS policies, API guards, and UI roles.
- **Email delivery:** Use Resend for outbound authentication emails (confirmations, magic links, password resets). The backend (`apps/api`) will call the Resend API using a service key, apply templated content that references Supabase action links, and track delivery/suppression metadata in `notifications.history`.
- **Refresh tokens:** Store Supabase refresh tokens in secure HttpOnly cookies served by `apps/api` or a reverse proxy so the SPA rotates them without exposing secrets to JavaScript.

### Backend responsibilities (`apps/api`)
- Serve as the business-facing API layer that verifies Supabase JWTs and enforces RLS via Postgres policies.
- Mediate onboarding (create business, slug, default staff) and session management (refresh, revoke, impersonate for support).
- Call Supabase Admin APIs for sensitive actions (revoking tokens, creating staff accounts) and Resend for templated email delivery.
- Emit structured events/logs for logins, suspicious attempts, or session revocations (hook into logging/metrics stack later).

### Front-end integration (`apps/web-app`)
- Add `@supabase/supabase-js` client configured with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Wrap owner routes with an `AuthProvider` exposing `user`, `claims`, `signIn`, `signOut`, and `refresh` helpers.
- Guard `/owner/*` routes using the provider and redirect unauthorized users to `/auth/login`. Public booking flows remain stateless but may surface business metadata from the same API.
- Persist session state in `localStorage`/`sessionStorage` and auto-refresh tokens before expiry using `api` client interceptors. Keep metadata in `@slotra/utils` types for consistency.

## Auth implementation plan

### Phase 1 – Secure foundations (1-2 work days)
1. Document required environment variables: Supabase (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`) and Resend (`RESEND_API_KEY`, `RESEND_DEFAULT_FROM`).
2. Install `@supabase/supabase-js` in `apps/web-app` and `apps/api`; add Resend SDK or lightweight HTTP wrapper to `apps/api`.
3. Define shared interfaces in `packages/utils` for `Business`, `OwnerUser`, `Session`, and `AuthEmailTemplate` so both API and UI rely on the same shapes.
4. Harden Supabase Auth settings: enforce `minimum_password_length`, enable email confirmations for owners, configure `token_refresh_rate_limit`, and define custom claims hooks.

### Phase 2 – Data & policies (2-3 work days)
1. Create Supabase migrations for `businesses`, `owners`, `staff_members`, `business_roles`, and `auth_email_templates`. Reference Supabase UID and business metadata.
2. Write RLS policies that ensure users only see rows tied to their `business_id` and role. Surface `business_id` in JWT claims via Postgres triggers.
3. Add audit helpers (e.g., `last_login_at`, `last_session_id`) and store Resend email statuses for invites/password resets.

### Phase 3 – API surface (3-4 work days)
1. Scaffold `apps/api` (Fastify/Prisma or similar) with middleware that validates Supabase JWTs, extracts claims, and enriches `req.context` with `business_id` + `role`.
2. Add endpoints: `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me`, `POST /auth/invite-staff`, and `POST /onboarding/business`. Use Supabase Admin client for refresh/revoke actions.
3. Implement Resend-powered mailer service for authentication emails—confirmation, invite, password reset. Templates call Supabase action links generated from service API.
4. Build shared `api.fetcher` in `packages/utils` so the React app sends bearer tokens, retries via refresh on 401s, and surfaces auth errors uniformly.

### Phase 4 – Front-end flows (2-3 work days)
1. Build `/owner/auth/LoginPage`, `/owner/auth/SetupBusiness`, and `/owner/auth/InviteStaff` using shared UI from `@slotra/ui`. Keep forms minimal: email, password, slug as needed.
2. Implement `AuthProvider` + `useAuth` to manage the Supabase client, session refresh, and synchronization to `localStorage`. Provide helpers like `signInWithPassword`, `refreshSession`, `sendInvite`, and `signOut`.
3. Protect owner routes by checking `business_id`, `role`, and `slug`. Redirect missing owners to onboarding and show inline messaging when waiting for email verification.
4. Connect login flows to the API Resend email events so the UI can show statuses (sent/failed) and allow resending invites.

### Phase 5 – Scaling & observability (ongoing)
1. Integrate login/session events with telemetry (Supabase logs + API metrics). Set up Supabase webhooks or Residual functions to alert on refresh token revocations.
2. Enforce rate limits per IP and owner account in `apps/api`; ensure Supabase handles backend concurrency.
3. Support multi-business and staff roles by allowing owners to invite staff with scoped claims (e.g., `role: 'staff'`, `scope: ['bookings.read']`). Implement revocation flows that can invalidate single staff sessions without affecting the entire business.

## Next steps for rollout
1. Merge this doc so every contributor understands the auth vision, including Supabase + Resend integration.
2. Execute Supabase migrations and seeds so the API and web app share stable contracts.
3. Block `/owner` routes behind the AuthProvider before shipping business-aware UI (Dashboard, Services, Customers, Settings).
4. Schedule a security review once refresh/rotation logic, Resend email workflows, and RLS policies are enforced.
