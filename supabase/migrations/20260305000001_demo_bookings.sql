create table public.demo_bookings (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  email           text not null,
  message         text,
  cal_booking_uid text,
  scheduled_at    timestamptz not null,
  timezone        text not null,
  meet_url        text,
  status          text not null default 'confirmed',
  created_at      timestamptz not null default now()
);

create index demo_bookings_email_idx
  on public.demo_bookings (email);
create index demo_bookings_scheduled_at_idx
  on public.demo_bookings (scheduled_at desc);

-- No public read/write access — admin only via service role
alter table public.demo_bookings enable row level security;
