export interface Business {
  id: string;
  name: string;
  industry: string;
  category: string;
  city: string;
  address: string;
  description: string;
  phone: string;
  email: string;
  timezone: string;
  bookingSlug: string;
  responseTime?: string;
  rating?: number;
  reviewCount?: number;
  arrivalNotes?: string;
}

export type OwnerBusinessProfile = Business;

export type BookingBusinessProfile = Pick<
  Business,
  'id' | 'name' | 'category' | 'city' | 'description' | 'responseTime' | 'rating' | 'reviewCount' | 'bookingSlug'
>;
