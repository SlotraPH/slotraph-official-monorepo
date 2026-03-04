import type { OwnerBusinessProfile } from '@/domain/business/types';
import type { BusinessHourDraft } from '@/domain/hours/types';
import type {
  BookingPreferencesSettings,
  PaymentChecklistItem,
  PaymentSettings,
} from '@/domain/payments/types';
import type { TeamMemberRecord } from '@/domain/staff/types';

export interface OwnerSettingsSnapshot {
  business: OwnerBusinessProfile;
  teamMembers: TeamMemberRecord[];
  businessHours: BusinessHourDraft[];
  bookingPreferences: BookingPreferencesSettings;
  paymentSettings: PaymentSettings;
  paymentChecklist: PaymentChecklistItem[];
  timezoneOptions: string[];
  paymentMethodOptions: string[];
}

export interface OwnerSettingsRepository {
  getSnapshot(): OwnerSettingsSnapshot;
  saveBusinessProfile(profile: OwnerBusinessProfile): OwnerBusinessProfile;
  saveBookingPreferences(preferences: BookingPreferencesSettings): BookingPreferencesSettings;
  savePaymentSettings(settings: PaymentSettings): PaymentSettings;
}
