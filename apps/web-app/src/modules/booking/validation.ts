import type { BookingCustomerDetails, BookingCustomerErrors } from '@/domain/booking/types';
import { validateBookingCustomerDetails } from '@/features/public-booking/validation';

export type BookingCustomerField = keyof BookingCustomerDetails;

export function validateBookingCustomerField(
  customer: BookingCustomerDetails,
  field: BookingCustomerField,
) {
  if (field === 'notes') {
    return undefined;
  }

  return validateBookingCustomerDetails(customer).errors[field];
}

export function validateBookingCustomerForm(customer: BookingCustomerDetails) {
  return validateBookingCustomerDetails(customer).errors satisfies BookingCustomerErrors;
}
