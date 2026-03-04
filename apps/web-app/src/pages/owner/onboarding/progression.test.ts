import { describe, expect, it } from 'vitest';
import {
  ONBOARDING_STEPS,
  canAccessOnboardingStep,
  getFurthestOnboardingStepIndex,
  getOnboardingProgressPercent,
} from './progression';

describe('onboarding progression helpers', () => {
  it('reports progress based on the active step', () => {
    expect(getOnboardingProgressPercent('hours')).toBe(67);
  });

  it('uses the furthest completed step to keep revisit navigation open', () => {
    expect(getFurthestOnboardingStepIndex('services', ['business-info', 'booking-slug'])).toBe(2);
  });

  it('allows navigating only to previously reached steps and the immediate next step', () => {
    expect(canAccessOnboardingStep('team', 'services', ['business-info', 'booking-slug'])).toBe(true);
    expect(canAccessOnboardingStep('payments', 'services', ['business-info', 'booking-slug'])).toBe(false);
  });

  it('keeps the exported step order stable for the flow component', () => {
    expect(ONBOARDING_STEPS.map((step) => step.id)).toEqual([
      'business-info',
      'booking-slug',
      'services',
      'team',
      'hours',
      'payments',
      'completion',
    ]);
  });
});
