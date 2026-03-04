import type { BookingCustomerDetails, BookingDraft, BookingSlot } from '@/domain/booking/types';
import type { BookingService } from '@/domain/service/types';
import type { BookingStaffMember } from '@/domain/staff/types';
import { validateBookingCustomerDetails } from '@/features/public-booking/validation';
import type { BookingStepId } from './types';

export interface BookingFlowStateContext {
  draft: BookingDraft;
  selectedService: BookingService | null;
  selectedStaff: BookingStaffMember | null;
  selectedSlot: BookingSlot | null;
}

export function getBookingCustomerErrors(customer: BookingCustomerDetails) {
  return validateBookingCustomerDetails(customer).errors;
}

export function getBookingSteps(selectedService: BookingService | null): BookingStepId[] {
  return [
    'service',
    ...(selectedService?.staffSelectionMode === 'required' ? (['staff'] satisfies BookingStepId[]) : []),
    'date',
    'time',
    'details',
    'review',
  ];
}

export function isBookingStepComplete(stepId: BookingStepId, context: BookingFlowStateContext) {
  const { draft, selectedService, selectedStaff, selectedSlot } = context;
  const staffRequired = selectedService?.staffSelectionMode === 'required';

  switch (stepId) {
    case 'service':
      return Boolean(selectedService);
    case 'staff':
      return !staffRequired || Boolean(selectedStaff);
    case 'date':
      return Boolean(draft.date);
    case 'time':
      return Boolean(selectedSlot);
    case 'details':
      return Object.keys(getBookingCustomerErrors(draft.customer)).length === 0
        && Boolean(draft.customer.fullName || draft.customer.email || draft.customer.phone);
    case 'review':
      return false;
    default:
      return false;
  }
}

export function getBookingStepValidationError(stepId: BookingStepId, context: BookingFlowStateContext) {
  const { draft, selectedService, selectedStaff, selectedSlot } = context;
  const staffRequired = selectedService?.staffSelectionMode === 'required';

  switch (stepId) {
    case 'service':
      return selectedService ? null : 'Choose a service before continuing.';
    case 'staff':
      return !staffRequired || selectedStaff
        ? null
        : 'Select a staff member before choosing a date.';
    case 'date':
      return draft.date ? null : 'Choose an available date before continuing.';
    case 'time':
      return selectedSlot ? null : 'Choose an available time slot before continuing.';
    case 'details':
      return Object.keys(getBookingCustomerErrors(draft.customer)).length === 0
        ? null
        : 'Complete the customer details before reviewing the booking.';
    case 'review':
      return null;
    default:
      return null;
  }
}

export function getFirstIncompleteBookingStepIndex(stepIds: BookingStepId[], context: BookingFlowStateContext) {
  const index = stepIds.findIndex((stepId) => !isBookingStepComplete(stepId, context));
  return index === -1 ? stepIds.length - 1 : index;
}

export function isBookingStepAccessible(
  stepId: BookingStepId,
  stepIds: BookingStepId[],
  currentStepIndex: number,
  context: BookingFlowStateContext
) {
  const targetIndex = stepIds.indexOf(stepId);
  return targetIndex <= Math.max(currentStepIndex, getFirstIncompleteBookingStepIndex(stepIds, context));
}
