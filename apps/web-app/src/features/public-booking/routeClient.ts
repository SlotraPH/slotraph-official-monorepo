import type { BookingConfirmationRecord, BookingDraft } from '@/domain/booking/types';
import type { BookingService } from '@/domain/service/types';
import { toRouteQueryState } from '@/features/route-query/adapters';
import type { ResolvedRouteQueryState } from '@/features/route-query/contracts';
import {
  createInitialBookingDraft,
  getBookingDateOptions,
  getBookingSlots,
  getPublicBookingResource,
  loadPublicBookingConfirmation,
  savePublicBookingConfirmation,
  type PublicBookingRouteData,
} from './data';

export interface PublicBookingRouteClient {
  getBookingRouteQuery(): ResolvedRouteQueryState<PublicBookingRouteData>;
  createDraft(businessId: string): BookingDraft;
  getDateOptions(service: BookingService, staffId: string | null): ReturnType<typeof getBookingDateOptions>;
  getSlots(service: BookingService, date: string, staffId: string | null): ReturnType<typeof getBookingSlots>;
  saveConfirmation(record: BookingConfirmationRecord): void;
  loadConfirmation(): BookingConfirmationRecord | null;
}

export const mockPublicBookingRouteClient: PublicBookingRouteClient = {
  getBookingRouteQuery() {
    return toRouteQueryState(getPublicBookingResource());
  },
  createDraft(businessId: string) {
    return createInitialBookingDraft(businessId);
  },
  getDateOptions(service, staffId) {
    return getBookingDateOptions(service, staffId);
  },
  getSlots(service, date, staffId) {
    return getBookingSlots(service, date, staffId);
  },
  saveConfirmation(record) {
    savePublicBookingConfirmation(record);
  },
  loadConfirmation() {
    return loadPublicBookingConfirmation();
  },
};
