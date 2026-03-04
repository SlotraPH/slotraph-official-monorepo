import type { ServiceRecord, TeamMemberRecord } from '../mockOwnerData';

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

export interface BusinessHourDraft {
  id: string;
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface PaymentPreferencesDraft {
  collectionMethod: 'manual-transfer' | 'pay-on-site' | 'hybrid';
  depositType: 'none' | 'flat' | 'percentage';
  depositValue: string;
  requireDepositFor: 'all-bookings' | 'high-value-only' | 'manual-review';
  acceptedMethods: string[];
  instructions: string;
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
