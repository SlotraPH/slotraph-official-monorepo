import type { OnboardingStepId } from './types';

export const ONBOARDING_STEPS: Array<{
  id: OnboardingStepId;
  title: string;
  description: string;
}> = [
  { id: 'business-info', title: 'Business info', description: 'Profile, contact details, and industry' },
  { id: 'booking-slug', title: 'Booking slug', description: 'Public URL and identity preview' },
  { id: 'services', title: 'Services', description: 'Core offerings, price, and visibility' },
  { id: 'team', title: 'Staff', description: 'Roster and service assignments' },
  { id: 'hours', title: 'Hours', description: 'Availability defaults by day' },
  { id: 'payments', title: 'Payments', description: 'Deposit and collection preferences' },
  { id: 'completion', title: 'Complete', description: 'Review and handoff' },
];

export function getOnboardingStepIndex(stepId: OnboardingStepId) {
  const index = ONBOARDING_STEPS.findIndex((step) => step.id === stepId);
  return index >= 0 ? index : 0;
}

export function getOnboardingProgressPercent(stepId: OnboardingStepId) {
  return Math.round((getOnboardingStepIndex(stepId) / (ONBOARDING_STEPS.length - 1)) * 100);
}

export function getFurthestOnboardingStepIndex(
  currentStepId: OnboardingStepId,
  completedStepIds: OnboardingStepId[]
) {
  return Math.max(
    getOnboardingStepIndex(currentStepId),
    ...completedStepIds.map((stepId) => getOnboardingStepIndex(stepId))
  );
}

export function canAccessOnboardingStep(
  targetStepId: OnboardingStepId,
  currentStepId: OnboardingStepId,
  completedStepIds: OnboardingStepId[]
) {
  return getOnboardingStepIndex(targetStepId) <= getFurthestOnboardingStepIndex(currentStepId, completedStepIds) + 1;
}
