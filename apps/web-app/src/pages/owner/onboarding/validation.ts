import { sanitizeBookingSlug } from '../settings/brandDetailsShared';
import type { OnboardingDraft, OnboardingStepId, StepValidationResult } from './types';

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isPhone(value: string) {
  return value.replace(/[^\d]/g, '').length >= 10;
}

function validateBusinessInfo(draft: OnboardingDraft): StepValidationResult {
  const errors: Record<string, string> = {};
  const { businessInfo } = draft;

  if (!businessInfo.name.trim()) {
    errors.name = 'Business name is required.';
  }

  if (!businessInfo.industry.trim()) {
    errors.industry = 'Choose the industry that best fits the business.';
  }

  if (businessInfo.about.trim().length < 20) {
    errors.about = 'Add a short business summary so customers know what you offer.';
  }

  if (!isPhone(businessInfo.phone)) {
    errors.phone = 'Enter a valid contact number.';
  }

  if (!isEmail(businessInfo.email)) {
    errors.email = 'Enter a valid business email.';
  }

  if (!businessInfo.address.trim()) {
    errors.address = 'Add the business location or address.';
  }

  if (!businessInfo.timezone.trim()) {
    errors.timezone = 'Choose the timezone used for bookings.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

function validateBookingSlug(draft: OnboardingDraft): StepValidationResult {
  const errors: Record<string, string> = {};
  const normalized = sanitizeBookingSlug(draft.bookingSlug);

  if (!normalized) {
    errors.bookingSlug = 'Choose a booking slug for the public booking page.';
  } else {
    if (normalized.length < 3) {
      errors.bookingSlug = 'Booking slug must be at least 3 characters.';
    }

    if (normalized !== draft.bookingSlug) {
      errors.bookingSlug = 'Use only lowercase letters, numbers, and hyphens.';
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

function validateServices(draft: OnboardingDraft): StepValidationResult {
  const errors: Record<string, string> = {};
  const activeServices = draft.services.filter((service) => service.status !== 'Archived');

  if (activeServices.length === 0) {
    errors.services = 'Add at least one active or hidden service before continuing.';
  }

  activeServices.forEach((service) => {
    if (!service.name.trim()) {
      errors[`service-name-${service.id}`] = 'Service name is required.';
    }

    if ((service.durationMinutes ?? 0) <= 0) {
      errors[`service-duration-${service.id}`] = 'Duration must be greater than zero.';
    }

    if ((service.price ?? 0) < 0) {
      errors[`service-price-${service.id}`] = 'Price cannot be negative.';
    }
  });

  return { isValid: Object.keys(errors).length === 0, errors };
}

function validateTeam(draft: OnboardingDraft): StepValidationResult {
  const errors: Record<string, string> = {};

  if (draft.team.length === 0) {
    errors.team = 'Add at least one team member or owner profile.';
  }

  draft.team.forEach((member) => {
    if (!member.name.trim()) {
      errors[`team-name-${member.id}`] = 'Name is required.';
    }

    if (!member.role.trim()) {
      errors[`team-role-${member.id}`] = 'Role is required.';
    }

    if (member.services.length === 0) {
      errors[`team-services-${member.id}`] = 'Assign at least one service or responsibility.';
    }
  });

  return { isValid: Object.keys(errors).length === 0, errors };
}

function validateHours(draft: OnboardingDraft): StepValidationResult {
  const errors: Record<string, string> = {};
  const openDays = draft.businessHours.filter((slot) => slot.isOpen);

  if (openDays.length === 0) {
    errors.businessHours = 'Open at least one day so customers can book.';
  }

  openDays.forEach((slot) => {
    if (!slot.openTime || !slot.closeTime) {
      errors[`hours-${slot.id}`] = 'Add opening and closing times.';
      return;
    }

    if (slot.openTime >= slot.closeTime) {
      errors[`hours-${slot.id}`] = 'Closing time must be later than opening time.';
    }
  });

  return { isValid: Object.keys(errors).length === 0, errors };
}

function validatePayments(draft: OnboardingDraft): StepValidationResult {
  const errors: Record<string, string> = {};
  const { paymentPreferences } = draft;

  if (paymentPreferences.depositType !== 'none' && !paymentPreferences.depositValue.trim()) {
    errors.depositValue = 'Set a deposit value or choose no deposit.';
  }

  if (paymentPreferences.depositType === 'percentage') {
    const value = Number(paymentPreferences.depositValue);

    if (!Number.isFinite(value) || value <= 0 || value > 100) {
      errors.depositValue = 'Percentage deposits must be between 1 and 100.';
    }
  }

  if (paymentPreferences.depositType === 'flat') {
    const value = Number(paymentPreferences.depositValue);

    if (!Number.isFinite(value) || value <= 0) {
      errors.depositValue = 'Flat deposits must be greater than zero.';
    }
  }

  if (paymentPreferences.acceptedMethods.length === 0) {
    errors.acceptedMethods = 'Choose at least one payment method.';
  }

  if (!paymentPreferences.instructions.trim()) {
    errors.instructions = 'Add a short note for how the team should confirm payment.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateOnboardingStep(stepId: OnboardingStepId, draft: OnboardingDraft): StepValidationResult {
  switch (stepId) {
    case 'business-info':
      return validateBusinessInfo(draft);
    case 'booking-slug':
      return validateBookingSlug(draft);
    case 'services':
      return validateServices(draft);
    case 'team':
      return validateTeam(draft);
    case 'hours':
      return validateHours(draft);
    case 'payments':
      return validatePayments(draft);
    case 'completion':
      return { isValid: true, errors: {} };
    default:
      return { isValid: true, errors: {} };
  }
}
