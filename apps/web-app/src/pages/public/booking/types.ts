export type BookingStepId = 'service' | 'staff' | 'date' | 'time' | 'details' | 'review';

export type StaffSelectionMode = 'required' | 'none';

export interface BookingBusinessProfile {
  id: string;
  name: string;
  category: string;
  city: string;
  description: string;
  responseTime: string;
  rating: number;
  reviewCount: number;
  bookingSlug: string;
}

export interface BookingService {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  category: string;
  staffSelectionMode: StaffSelectionMode;
  staffIds: string[];
  leadNote: string;
}

export interface BookingStaffMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  badge: string;
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
