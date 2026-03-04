import type { OnboardingDraft, OnboardingStepId } from './types';

const ONBOARDING_SESSION_KEY = 'slotra.owner.onboarding.v1';

interface PersistedOnboardingState {
  draft: OnboardingDraft;
  currentStepId: OnboardingStepId;
  completedStepIds: OnboardingStepId[];
}

export function loadOnboardingSession() {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.sessionStorage.getItem(ONBOARDING_SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PersistedOnboardingState;
  } catch {
    return null;
  }
}

export function saveOnboardingSession(state: PersistedOnboardingState) {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(ONBOARDING_SESSION_KEY, JSON.stringify(state));
}
