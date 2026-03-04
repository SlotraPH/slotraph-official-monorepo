import { describe, expect, it } from 'vitest';
import { PUBLIC_BOOKING_SERVICES } from '@/mocks/services';
import { PUBLIC_BOOKING_STAFF } from '@/mocks/staff';
import type { BookingDraft } from './types';
import {
  getBookingStepValidationError,
  getBookingSteps,
  isBookingStepAccessible,
  isBookingStepComplete,
} from './flowState';

function createDraft(overrides: Partial<BookingDraft> = {}): BookingDraft {
  return {
    businessId: 'biz-1',
    serviceId: null,
    staffId: null,
    date: null,
    slotId: null,
    customer: {
      fullName: '',
      email: '',
      phone: '',
      notes: '',
    },
    ...overrides,
  };
}

describe('booking flow state helpers', () => {
  it('omits the staff step when the service uses next available staff', () => {
    expect(getBookingSteps(PUBLIC_BOOKING_SERVICES[2] ?? null)).toEqual([
      'service',
      'date',
      'time',
      'details',
      'review',
    ]);
  });

  it('requires a staff selection when the chosen service needs it', () => {
    const selectedService = PUBLIC_BOOKING_SERVICES[0] ?? null;

    expect(
      getBookingStepValidationError('staff', {
        draft: createDraft({ serviceId: selectedService?.id ?? null }),
        selectedService,
        selectedStaff: null,
        selectedSlot: null,
      })
    ).toBe('Select a staff member before choosing a date.');
  });

  it('marks the details step complete only after the required fields are valid', () => {
    expect(
      isBookingStepComplete('details', {
        draft: createDraft({
          customer: {
            fullName: 'Mara Dela Cruz',
            email: 'mara@example.com',
            phone: '+63 917 555 0123',
            notes: '',
          },
        }),
        selectedService: PUBLIC_BOOKING_SERVICES[2] ?? null,
        selectedStaff: null,
        selectedSlot: null,
      })
    ).toBe(true);
  });

  it('keeps future steps inaccessible until earlier required state is complete', () => {
    const selectedService = PUBLIC_BOOKING_SERVICES[0] ?? null;
    const stepIds = getBookingSteps(selectedService);

    expect(
      isBookingStepAccessible('time', stepIds, 1, {
        draft: createDraft({ serviceId: selectedService?.id ?? null }),
        selectedService,
        selectedStaff: PUBLIC_BOOKING_STAFF[0] ?? null,
        selectedSlot: null,
      })
    ).toBe(false);
  });
});
