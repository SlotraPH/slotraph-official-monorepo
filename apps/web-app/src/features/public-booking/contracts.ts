import type { BookingBusinessProfile } from '@/domain/business/types';
import type {
  BookingConfirmationRecord,
  BookingCustomerDetails,
  BookingDateOption,
  BookingDraft,
  BookingSlot,
} from '@/domain/booking/types';
import type { BookingService } from '@/domain/service/types';
import type { BookingStaffMember } from '@/domain/staff/types';

export interface BookingAvailabilityQuery {
  service: BookingService;
  staffId: string | null;
}

export interface BookingSlotsQuery extends BookingAvailabilityQuery {
  date: string;
}

export interface PublicBookingCatalog {
  business: BookingBusinessProfile;
  services: BookingService[];
  staff: BookingStaffMember[];
  bookingEnabled: boolean;
}

export interface PublicBookingRepository {
  getCatalog(): PublicBookingCatalog;
  createDraft(businessId: string): BookingDraft;
  saveConfirmation(record: BookingConfirmationRecord): void;
  loadConfirmation(): BookingConfirmationRecord | null;
}

export interface BookingAvailabilityRepository {
  listDates(query: BookingAvailabilityQuery): BookingDateOption[];
  listSlots(query: BookingSlotsQuery): BookingSlot[];
}

export interface BookingCustomerValidationResult {
  errors: {
    fullName?: string;
    email?: string;
    phone?: string;
  };
}

export interface BookingCustomerValidationService {
  validate(customer: BookingCustomerDetails): BookingCustomerValidationResult;
}
