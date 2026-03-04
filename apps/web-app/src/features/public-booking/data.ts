import type { BookingBusinessProfile } from '@/domain/business/types';
import type { BookingCustomerDetails, BookingDraft } from '@/domain/booking/types';
import type { BookingService } from '@/domain/service/types';
import type { BookingStaffMember } from '@/domain/staff/types';
import { PUBLIC_BOOKING_BUSINESS } from '@/mocks/business';
import { PUBLIC_BOOKING_SERVICES } from '@/mocks/services';
import { PUBLIC_BOOKING_STAFF } from '@/mocks/staff';
import { createReadyResource } from '@/features/resource';

interface PublicBookingData {
  business: BookingBusinessProfile;
  services: BookingService[];
  servicesById: Record<string, BookingService>;
  staff: BookingStaffMember[];
  staffById: Record<string, BookingStaffMember>;
  bookingEnabled: boolean;
}

export const EMPTY_BOOKING_CUSTOMER: BookingCustomerDetails = {
  fullName: '',
  email: '',
  phone: '',
  notes: '',
};

function cloneServices(services: BookingService[]) {
  return services.map<BookingService>((service) => ({
    ...service,
    staffIds: [...service.staffIds],
  }));
}

function cloneStaff(staff: BookingStaffMember[]) {
  return staff.map<BookingStaffMember>((member) => ({
    ...member,
    services: [...member.services],
  }));
}

export function getPublicBookingResource() {
  const services = cloneServices(PUBLIC_BOOKING_SERVICES);
  const staff = cloneStaff(PUBLIC_BOOKING_STAFF);

  return createReadyResource<PublicBookingData>({
    business: { ...PUBLIC_BOOKING_BUSINESS },
    services,
    servicesById: Object.fromEntries(services.map((service) => [service.id, service])),
    staff,
    staffById: Object.fromEntries(staff.map((member) => [member.id, member])),
    bookingEnabled: true,
  });
}

export function createInitialBookingDraft(businessId: string): BookingDraft {
  return {
    businessId,
    serviceId: null,
    staffId: null,
    date: null,
    slotId: null,
    customer: { ...EMPTY_BOOKING_CUSTOMER },
  };
}
