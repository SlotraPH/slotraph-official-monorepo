export type BookingStatus = 'confirmed' | 'deposit due' | 'follow-up';

export interface UpcomingBooking {
  id: string;
  customerName: string;
  serviceName: string;
  staffName: string;
  startTime: string;
  duration: string;
  status: BookingStatus;
}

export interface BookingDateOption {
  value: string;
  weekdayLabel: string;
  dayLabel: string;
  monthLabel: string;
  availabilityLabel: string;
  availableSlotCount: number;
  isAvailable: boolean;
}

export interface BookingSlot {
  id: string;
  startLabel: string;
  endLabel: string;
  available: boolean;
}

export interface BookingCustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  notes: string;
}

export interface BookingCustomerErrors {
  fullName?: string;
  email?: string;
  phone?: string;
}

export interface BookingDraft {
  businessId: string;
  serviceId: string | null;
  staffId: string | null;
  date: string | null;
  slotId: string | null;
  customer: BookingCustomerDetails;
}

export interface BookingConfirmationRecord {
  reference: string;
  createdAt: string;
  statusLabel: string;
  businessName: string;
  businessCity: string;
  serviceName: string;
  serviceDurationLabel: string;
  servicePriceLabel: string;
  staffName: string;
  dateLabel: string;
  timeLabel: string;
  customer: BookingCustomerDetails;
  followUpNote: string;
}
