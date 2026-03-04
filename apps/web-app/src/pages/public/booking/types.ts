export type { BookingBusinessProfile } from '@/domain/business/types';
export type {
  BookingConfirmationRecord,
  BookingCustomerDetails,
  BookingCustomerErrors,
  BookingDateOption,
  BookingDraft,
  BookingSlot,
} from '@/domain/booking/types';
export type { BookingService, StaffSelectionMode } from '@/domain/service/types';
export type { BookingStaffMember } from '@/domain/staff/types';

export type BookingStepId = 'service' | 'staff' | 'date' | 'time' | 'details' | 'review';
