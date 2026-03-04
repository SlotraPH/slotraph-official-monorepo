import { OWNER_BUSINESS } from '@/mocks/business';
import { OWNER_BUSINESS_HOURS } from '@/mocks/businessHours';
import { OWNER_PAYMENT_SETTINGS } from '@/mocks/payments';
import { OWNER_SERVICES } from '@/mocks/services';
import { OWNER_TEAM_MEMBERS } from '@/mocks/staff';
import { loadOnboardingSession, saveOnboardingSession } from '@/pages/owner/onboarding/session';
import type { OwnerOnboardingRepository } from './contracts';

export const mockOnboardingRepository: OwnerOnboardingRepository = {
  getSeed() {
    return {
      business: { ...OWNER_BUSINESS },
      services: OWNER_SERVICES.map((service) => ({
        ...service,
        staffIds: [...service.staffIds],
      })),
      teamMembers: OWNER_TEAM_MEMBERS.map((member) => ({
        ...member,
        services: [...member.services],
      })),
      businessHours: OWNER_BUSINESS_HOURS.map((slot) => ({ ...slot })),
      paymentSettings: {
        ...OWNER_PAYMENT_SETTINGS,
        acceptedMethods: [...OWNER_PAYMENT_SETTINGS.acceptedMethods],
      },
    };
  },
  loadSession() {
    return loadOnboardingSession();
  },
  saveSession(state) {
    saveOnboardingSession(state);
  },
};
