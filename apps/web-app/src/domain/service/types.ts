export type ServiceVisibility = 'Public' | 'Private';
export type ServiceStatus = 'Active' | 'Hidden' | 'Archived';
export type StaffSelectionMode = 'required' | 'none';

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  durationMinutes: number;
  price: number;
  visibility: ServiceVisibility;
  status: ServiceStatus;
  bookings: number;
  staffSelectionMode: StaffSelectionMode;
  staffIds: string[];
  leadNote: string;
}

export type ServiceRecord = Service;
export type BookingService = Service;
