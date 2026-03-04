import type { BookingConfirmationRecord, BookingDraft } from '@/domain/booking/types';
import { PUBLIC_BOOKING_BUSINESS } from '@/mocks/business';
import { PUBLIC_BOOKING_SERVICES } from '@/mocks/services';
import { PUBLIC_BOOKING_STAFF } from '@/mocks/staff';
import { loadBookingConfirmation, saveBookingConfirmation } from '@/pages/public/booking/bookingSession';
import type { PublicBookingRepository } from './contracts';

const EMPTY_BOOKING_CUSTOMER = {
  fullName: '',
  email: '',
  phone: '',
  notes: '',
};

function cloneDraft(businessId: string): BookingDraft {
  return {
    businessId,
    serviceId: null,
    staffId: null,
    date: null,
    slotId: null,
    customer: { ...EMPTY_BOOKING_CUSTOMER },
  };
}

export const mockPublicBookingRepository: PublicBookingRepository = {
  getCatalog() {
    return {
      business: { ...PUBLIC_BOOKING_BUSINESS },
      services: PUBLIC_BOOKING_SERVICES.map((service) => ({
        ...service,
        staffIds: [...service.staffIds],
      })),
      staff: PUBLIC_BOOKING_STAFF.map((member) => ({
        ...member,
        services: [...member.services],
      })),
      bookingEnabled: true,
    };
  },
  createDraft(businessId) {
    return cloneDraft(businessId);
  },
  saveConfirmation(record: BookingConfirmationRecord) {
    saveBookingConfirmation(record);
  },
  loadConfirmation() {
    return loadBookingConfirmation();
  },
};
