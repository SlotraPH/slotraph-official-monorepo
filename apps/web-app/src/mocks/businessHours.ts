import type { BusinessHourDraft } from '@/domain/hours/types';

export const OWNER_BUSINESS_HOURS: BusinessHourDraft[] = [
  { id: 'mon', day: 'Monday', isOpen: false, openTime: '09:00', closeTime: '18:00' },
  { id: 'tue', day: 'Tuesday', isOpen: true, openTime: '10:00', closeTime: '19:00' },
  { id: 'wed', day: 'Wednesday', isOpen: true, openTime: '10:00', closeTime: '19:00' },
  { id: 'thu', day: 'Thursday', isOpen: true, openTime: '10:00', closeTime: '19:00' },
  { id: 'fri', day: 'Friday', isOpen: true, openTime: '10:00', closeTime: '20:00' },
  { id: 'sat', day: 'Saturday', isOpen: true, openTime: '10:00', closeTime: '20:00' },
  { id: 'sun', day: 'Sunday', isOpen: true, openTime: '10:00', closeTime: '18:00' },
];
