import { describe, expect, it } from 'vitest';
import { createDefaultOnboardingDraft } from './mockData';
import { validateOnboardingStep } from './validation';

describe('validateOnboardingStep', () => {
  it('rejects invalid booking slugs', () => {
    const draft = createDefaultOnboardingDraft();
    draft.bookingSlug = 'Bad Slug';

    expect(validateOnboardingStep('booking-slug', draft)).toEqual({
      isValid: false,
      errors: {
        bookingSlug: 'Use only lowercase letters, numbers, and hyphens.',
      },
    });
  });

  it('requires at least one active onboarding service', () => {
    const draft = createDefaultOnboardingDraft();
    draft.services = draft.services.map((service) => ({ ...service, status: 'Archived' }));

    expect(validateOnboardingStep('services', draft)).toEqual({
      isValid: false,
      errors: {
        services: 'Add at least one active or hidden service before continuing.',
      },
    });
  });

  it('requires valid deposit details when deposits are enabled', () => {
    const draft = createDefaultOnboardingDraft();
    draft.paymentPreferences = {
      ...draft.paymentPreferences,
      depositType: 'percentage',
      depositValue: '150',
    };

    expect(validateOnboardingStep('payments', draft)).toEqual({
      isValid: false,
      errors: {
        depositValue: 'Percentage deposits must be between 1 and 100.',
      },
    });
  });

  it('accepts the seeded onboarding draft for the business-info step', () => {
    expect(validateOnboardingStep('business-info', createDefaultOnboardingDraft()).isValid).toBe(true);
  });
});
