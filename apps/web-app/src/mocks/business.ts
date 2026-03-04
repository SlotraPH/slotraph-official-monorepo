import type { BookingBusinessProfile, OwnerBusinessProfile } from '@/domain/business/types';

export const OWNER_BUSINESS: OwnerBusinessProfile = {
  id: 'business-dheyns-barbershop',
  name: "Dheyn's Barbershop",
  industry: 'Hair & Barbering',
  category: 'Barbershop',
  city: 'Makati City',
  address: 'Poblacion, Makati City',
  description: 'Premium grooming experience in the heart of Manila. Walk-ins welcome, appointments preferred.',
  phone: '+63 917 555 1200',
  email: 'hello@dheynsbarbershop.com',
  timezone: 'Asia/Manila',
  bookingSlug: 'dheyns-barbershop',
  arrivalNotes: 'Street parking is limited after 5 PM.',
};

export const PUBLIC_BOOKING_BUSINESS: BookingBusinessProfile = {
  id: 'business-serene-studio',
  name: 'Serene Studio Makati',
  category: 'Beauty Studio',
  city: 'Makati City',
  description: 'A calm appointment-based studio for cuts, color maintenance, and restorative treatments.',
  responseTime: 'Replies within 15 minutes during studio hours',
  rating: 4.9,
  reviewCount: 187,
  bookingSlug: 'serene-studio-makati',
};
