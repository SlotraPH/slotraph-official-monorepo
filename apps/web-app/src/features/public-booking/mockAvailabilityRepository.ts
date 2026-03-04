import type { BookingAvailabilityRepository } from './contracts';
import { getDateOptions, getSlotsForDate } from '@/pages/public/booking/availability';

export const mockAvailabilityRepository: BookingAvailabilityRepository = {
  listDates(query) {
    return getDateOptions(query.service, query.staffId);
  },
  listSlots(query) {
    return getSlotsForDate(query.service, query.date, query.staffId);
  },
};
