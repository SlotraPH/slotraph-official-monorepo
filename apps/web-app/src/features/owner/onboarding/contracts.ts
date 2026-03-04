import type { OwnerBusinessProfile } from '@/domain/business/types';
import type { BusinessHourDraft } from '@/domain/hours/types';
import type { PaymentSettings } from '@/domain/payments/types';
import type { ServiceRecord } from '@/domain/service/types';
import type { TeamMemberRecord } from '@/domain/staff/types';
import type { OnboardingDraft, OnboardingStepId } from '@/pages/owner/onboarding/types';

export interface OwnerOnboardingSeed {
  business: OwnerBusinessProfile;
  services: ServiceRecord[];
  teamMembers: TeamMemberRecord[];
  businessHours: BusinessHourDraft[];
  paymentSettings: PaymentSettings;
}

export interface PersistedOnboardingState {
  draft: OnboardingDraft;
  currentStepId: OnboardingStepId;
  completedStepIds: OnboardingStepId[];
}

export interface OwnerOnboardingRepository {
  getSeed(): OwnerOnboardingSeed;
  loadSession(): PersistedOnboardingState | null;
  saveSession(state: PersistedOnboardingState): void;
}
