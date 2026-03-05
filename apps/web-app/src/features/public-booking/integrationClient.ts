import type { BookingConfirmationRecord } from '@/domain/booking/types';
import type { BookingService } from '@/domain/service/types';
import {
  getBookingDateOptions,
  getBookingSlots,
  loadPublicBookingConfirmation,
  savePublicBookingConfirmation,
} from './data';

export interface PublicBookingIntegrationClient {
  loadDateOptions(service: BookingService, staffId: string | null): Promise<ReturnType<typeof getBookingDateOptions>>;
  loadSlots(service: BookingService, date: string, staffId: string | null): Promise<ReturnType<typeof getBookingSlots>>;
  saveConfirmation(record: BookingConfirmationRecord): Promise<void>;
  loadConfirmation(): Promise<BookingConfirmationRecord | null>;
}

function wait(durationMs: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, durationMs);
  });
}

export const publicBookingIntegrationClient: PublicBookingIntegrationClient = {
  async loadDateOptions(service, staffId) {
    await wait(180);
    return getBookingDateOptions(service, staffId);
  },
  async loadSlots(service, date, staffId) {
    await wait(180);
    return getBookingSlots(service, date, staffId);
  },
  async saveConfirmation(record) {
    await wait(240);
    savePublicBookingConfirmation(record);
  },
  async loadConfirmation() {
    await wait(140);
    return loadPublicBookingConfirmation();
  },
};
