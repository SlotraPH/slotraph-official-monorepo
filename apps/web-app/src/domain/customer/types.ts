export type CustomerStatus = 'VIP' | 'Active' | 'New' | 'Needs follow-up';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  lastVisit: string;
  totalVisits: number;
  totalSpend: number;
  upcomingBooking: string;
  source: string;
  notes: string;
  tags: string[];
}

export type CustomerRecord = Customer;
