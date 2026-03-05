import type { OnboardingDraft, OnboardingStepId } from '@/pages/owner/onboarding/types';
import type { PersistedOnboardingState } from './contracts';
import { mockOnboardingRepository } from './mockOnboardingRepository';

interface SaveOnboardingOptions {
  partial: boolean;
}

interface SaveOnboardingResult {
  partial: boolean;
  savedAt: string;
}

export interface OwnerOnboardingPersistenceClient {
  load(): Promise<PersistedOnboardingState | null>;
  save(state: PersistedOnboardingState, options: SaveOnboardingOptions): Promise<SaveOnboardingResult>;
}

function toSafePersistedState(state: PersistedOnboardingState): PersistedOnboardingState {
  return {
    draft: {
      ...state.draft,
      businessInfo: { ...state.draft.businessInfo },
      services: state.draft.services.map((service) => ({ ...service, staffIds: [...service.staffIds] })),
      team: state.draft.team.map((member) => ({ ...member, services: [...member.services] })),
      businessHours: state.draft.businessHours.map((slot) => ({ ...slot })),
      paymentPreferences: {
        ...state.draft.paymentPreferences,
        acceptedMethods: [...state.draft.paymentPreferences.acceptedMethods],
      },
    } as OnboardingDraft,
    currentStepId: state.currentStepId as OnboardingStepId,
    completedStepIds: [...state.completedStepIds],
  };
}

function wait(durationMs: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, durationMs);
  });
}

export const ownerOnboardingPersistenceClient: OwnerOnboardingPersistenceClient = {
  async load() {
    await wait(180);

    const persisted = mockOnboardingRepository.loadSession();
    return persisted ? toSafePersistedState(persisted) : null;
  },
  async save(state, options) {
    await wait(200);
    mockOnboardingRepository.saveSession(toSafePersistedState(state));
    return {
      partial: options.partial,
      savedAt: new Date().toISOString(),
    };
  },
};
