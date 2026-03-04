import type { BookingConfirmationRecord, BookingDraft } from '@/domain/booking/types';
import type { BookingService } from '@/domain/service/types';
import { createReadyResource } from '@/features/resource';
import { mockAvailabilityRepository } from './mockAvailabilityRepository';
import { mockPublicBookingRepository } from './mockPublicBookingRepository';

export function getPublicBookingResource() {
  const catalog = mockPublicBookingRepository.getCatalog();

  return createReadyResource({
    business: catalog.business,
    services: catalog.services,
    servicesById: Object.fromEntries(catalog.services.map((service) => [service.id, service])),
    staff: catalog.staff,
    staffById: Object.fromEntries(catalog.staff.map((member) => [member.id, member])),
    bookingEnabled: catalog.bookingEnabled,
  });
}

export function createInitialBookingDraft(businessId: string): BookingDraft {
  return mockPublicBookingRepository.createDraft(businessId);
}

export function getBookingDateOptions(service: BookingService, staffId: string | null) {
  return mockAvailabilityRepository.listDates({ service, staffId });
}

export function getBookingSlots(service: BookingService, date: string, staffId: string | null) {
  return mockAvailabilityRepository.listSlots({ service, date, staffId });
}

export function savePublicBookingConfirmation(record: BookingConfirmationRecord) {
  mockPublicBookingRepository.saveConfirmation(record);
}

export function loadPublicBookingConfirmation() {
  return mockPublicBookingRepository.loadConfirmation();
}
