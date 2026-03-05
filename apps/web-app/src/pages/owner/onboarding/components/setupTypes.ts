import type { OnboardingStepId } from '../types';

export type SetupChecklistStatus = 'not-started' | 'in-progress' | 'done';

export interface SetupChecklistItem {
  id: 'branding' | 'services' | 'availability' | 'domain' | 'publish';
  title: string;
  description: string;
  status: SetupChecklistStatus;
  blocker: string;
  progressLabel: string;
  targetStepId: OnboardingStepId;
}
