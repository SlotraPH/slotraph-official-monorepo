import type { BusinessHourDraft } from '@/domain/hours/types';
import type { PaymentPreferencesDraft } from '@/domain/payments/types';
import type { ServiceRecord } from '@/domain/service/types';
import type { TeamMemberRecord } from '@/domain/staff/types';

export type { BusinessHourDraft } from '@/domain/hours/types';
export type { PaymentPreferencesDraft } from '@/domain/payments/types';

export type OnboardingStepId =
  | 'business-info'
  | 'booking-slug'
  | 'services'
  | 'team'
  | 'hours'
  | 'payments'
  | 'completion';

export interface BusinessInfoDraft {
  name: string;
  industry: string;
  about: string;
  phone: string;
  email: string;
  address: string;
  timezone: string;
}

export interface OnboardingDraft {
  businessInfo: BusinessInfoDraft;
  bookingSlug: string;
  services: ServiceRecord[];
  team: TeamMemberRecord[];
  businessHours: BusinessHourDraft[];
  paymentPreferences: PaymentPreferencesDraft;
}

export interface StepValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}
