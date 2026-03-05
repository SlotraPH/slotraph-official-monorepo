alter table public.demo_bookings
  add constraint demo_bookings_cal_booking_uid_key unique (cal_booking_uid);
