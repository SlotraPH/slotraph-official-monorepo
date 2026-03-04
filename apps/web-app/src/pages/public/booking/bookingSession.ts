import type { BookingConfirmationRecord } from './types';

const BOOKING_CONFIRMATION_STORAGE_KEY = 'slotra.web.booking-confirmation.v1';

export function loadBookingConfirmation() {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = window.sessionStorage.getItem(BOOKING_CONFIRMATION_STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as BookingConfirmationRecord;
  } catch {
    window.sessionStorage.removeItem(BOOKING_CONFIRMATION_STORAGE_KEY);
    return null;
  }
}

export function saveBookingConfirmation(record: BookingConfirmationRecord) {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(BOOKING_CONFIRMATION_STORAGE_KEY, JSON.stringify(record));
}
