import { getDefaultOwnerOnboardingSeed } from '@/features/owner/data';
import { PAYMENT_METHOD_OPTIONS, TIMEZONE_OPTIONS } from '@/mocks/payments';
import { sanitizeBookingSlug } from '../settings/brandDetailsShared';
import type { OnboardingDraft } from './types';

export function createDefaultOnboardingDraft(): OnboardingDraft {
  const resource = getDefaultOwnerOnboardingSeed();

  if (resource.status !== 'ready') {
    return {
      businessInfo: {
        name: '',
        industry: '',
        about: '',
        phone: '',
        email: '',
        address: '',
        timezone: 'Asia/Manila',
      },
      bookingSlug: '',
      services: [],
      team: [],
      businessHours: [],
      paymentPreferences: {
        collectionMethod: 'hybrid',
        depositType: 'none',
        depositValue: '0',
        requireDepositFor: 'manual-review',
        acceptedMethods: [],
        instructions: '',
      },
    };
  }

  const { business, businessHours, paymentSettings, services, teamMembers } = resource.data;

  return {
    businessInfo: {
      name: business.name,
      industry: business.industry,
      about: business.description,
      phone: business.phone,
      email: business.email,
      address: business.address,
      timezone: business.timezone,
    },
    bookingSlug: sanitizeBookingSlug(business.bookingSlug || business.name),
    services,
    team: teamMembers,
    businessHours,
    paymentPreferences: {
      collectionMethod: paymentSettings.collectionMethod,
      depositType: paymentSettings.depositType,
      depositValue: paymentSettings.depositValue,
      requireDepositFor: paymentSettings.requireDepositFor,
      acceptedMethods: paymentSettings.acceptedMethods,
      instructions: paymentSettings.instructions,
    },
  };
}

export { PAYMENT_METHOD_OPTIONS, TIMEZONE_OPTIONS };
