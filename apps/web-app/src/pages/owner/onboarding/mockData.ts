import { OWNER_SERVICES, TEAM_MEMBERS, type ServiceRecord, type TeamMemberRecord } from '../mockOwnerData';
import { sanitizeBookingSlug } from '../settings/brandDetailsShared';
import type { BusinessHourDraft, OnboardingDraft } from './types';

const DEFAULT_HOURS: BusinessHourDraft[] = [
  { id: 'mon', day: 'Monday', isOpen: false, openTime: '09:00', closeTime: '18:00' },
  { id: 'tue', day: 'Tuesday', isOpen: true, openTime: '10:00', closeTime: '19:00' },
  { id: 'wed', day: 'Wednesday', isOpen: true, openTime: '10:00', closeTime: '19:00' },
  { id: 'thu', day: 'Thursday', isOpen: true, openTime: '10:00', closeTime: '19:00' },
  { id: 'fri', day: 'Friday', isOpen: true, openTime: '10:00', closeTime: '20:00' },
  { id: 'sat', day: 'Saturday', isOpen: true, openTime: '10:00', closeTime: '20:00' },
  { id: 'sun', day: 'Sunday', isOpen: true, openTime: '10:00', closeTime: '18:00' },
];

function cloneServices() {
  return OWNER_SERVICES.map<ServiceRecord>((service) => ({
    ...service,
  }));
}

function cloneTeam() {
  return TEAM_MEMBERS.map<TeamMemberRecord>((member) => ({
    ...member,
    services: [...member.services],
  }));
}

function cloneHours() {
  return DEFAULT_HOURS.map<BusinessHourDraft>((slot) => ({
    ...slot,
  }));
}

export function createDefaultOnboardingDraft(): OnboardingDraft {
  const businessName = "Dheyn's Barbershop";

  return {
    businessInfo: {
      name: businessName,
      industry: 'Hair & Barbering',
      about: 'Premium grooming experience in the heart of Manila. Walk-ins welcome, appointments preferred.',
      phone: '+63 917 555 1200',
      email: 'hello@dheynsbarbershop.com',
      address: 'Poblacion, Makati City',
      timezone: 'Asia/Manila',
    },
    bookingSlug: sanitizeBookingSlug(businessName),
    services: cloneServices(),
    team: cloneTeam(),
    businessHours: cloneHours(),
    paymentPreferences: {
      collectionMethod: 'hybrid',
      depositType: 'percentage',
      depositValue: '30',
      requireDepositFor: 'high-value-only',
      acceptedMethods: ['GCash', 'Maya', 'Bank transfer'],
      instructions: 'Ask customers to send proof of payment before confirming high-ticket bookings.',
    },
  };
}

export const PAYMENT_METHOD_OPTIONS = ['GCash', 'Maya', 'Bank transfer', 'Cash'];

export const TIMEZONE_OPTIONS = ['Asia/Manila', 'Asia/Singapore', 'Asia/Hong_Kong'];
