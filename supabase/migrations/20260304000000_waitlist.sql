-- ============================================================
-- Slotra — Waitlist Entries
-- Created: 2026-03-04
-- Description: Stores sign-ups from the landing page waitlist form.
-- ============================================================

create table public.waitlist_entries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null unique,
  created_at timestamptz not null default now()
);

create index waitlist_entries_created_at_idx
  on public.waitlist_entries(created_at desc);

-- ── RLS ──────────────────────────────────────────────────────
alter table public.waitlist_entries enable row level security;

-- Anyone (unauthenticated) can submit their email
create policy "anyone can join waitlist"
  on public.waitlist_entries
  for insert
  with check (true);
