import type { UpcomingBooking } from '@/domain/booking/types';

export const OWNER_UPCOMING_BOOKINGS: UpcomingBooking[] = [
  {
    id: 'bk-101',
    customerName: 'Anna Mercado',
    serviceName: 'Color Retouch',
    staffName: 'Dheyn',
    startTime: 'Today, 1:30 PM',
    duration: '90 min',
    status: 'confirmed',
  },
  {
    id: 'bk-102',
    customerName: 'Marco Santos',
    serviceName: 'Haircut & Beard Trim',
    staffName: 'Kai',
    startTime: 'Today, 4:00 PM',
    duration: '60 min',
    status: 'deposit due',
  },
  {
    id: 'bk-103',
    customerName: 'Rhea Tolentino',
    serviceName: 'Brazilian Blowout',
    staffName: 'Dheyn',
    startTime: 'Tomorrow, 10:00 AM',
    duration: '2 hrs',
    status: 'follow-up',
  },
];
