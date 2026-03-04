import type { OwnerBusinessProfile } from '@/domain/business/types';
import type { BusinessHourDraft } from '@/domain/hours/types';
import type {
  BookingPreferencesSettings,
  PaymentChecklistItem,
  PaymentSettings,
} from '@/domain/payments/types';
import type { TeamMemberRecord } from '@/domain/staff/types';
import { OWNER_BUSINESS } from '@/mocks/business';
import { OWNER_BUSINESS_HOURS } from '@/mocks/businessHours';
import {
  OWNER_BOOKING_PREFERENCES,
  OWNER_PAYMENT_CHECKLIST,
  OWNER_PAYMENT_SETTINGS,
  PAYMENT_METHOD_OPTIONS,
  TIMEZONE_OPTIONS,
} from '@/mocks/payments';
import { OWNER_TEAM_MEMBERS } from '@/mocks/staff';
import type { OwnerSettingsRepository } from './contracts';

export const mockSettingsRepository: OwnerSettingsRepository = {
  getSnapshot() {
    return {
      business: { ...OWNER_BUSINESS } as OwnerBusinessProfile,
      teamMembers: OWNER_TEAM_MEMBERS.map<TeamMemberRecord>((member) => ({
        ...member,
        services: [...member.services],
      })),
      businessHours: OWNER_BUSINESS_HOURS.map<BusinessHourDraft>((slot) => ({ ...slot })),
      bookingPreferences: { ...OWNER_BOOKING_PREFERENCES } as BookingPreferencesSettings,
      paymentSettings: {
        ...OWNER_PAYMENT_SETTINGS,
        acceptedMethods: [...OWNER_PAYMENT_SETTINGS.acceptedMethods],
      } as PaymentSettings,
      paymentChecklist: [...OWNER_PAYMENT_CHECKLIST] as PaymentChecklistItem[],
      timezoneOptions: [...TIMEZONE_OPTIONS],
      paymentMethodOptions: [...PAYMENT_METHOD_OPTIONS],
    };
  },
  saveBusinessProfile(profile) {
    return { ...profile };
  },
  saveBookingPreferences(preferences) {
    return { ...preferences };
  },
  savePaymentSettings(settings) {
    return {
      ...settings,
      acceptedMethods: [...settings.acceptedMethods],
    };
  },
};
