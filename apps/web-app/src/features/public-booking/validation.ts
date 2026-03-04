import type { BookingCustomerValidationService } from './contracts';
import type { BookingCustomerDetails } from '@/domain/booking/types';

export function validateBookingCustomerDetails(customer: BookingCustomerDetails) {
  const errors: {
    fullName?: string;
    email?: string;
    phone?: string;
  } = {};

  if (!customer.fullName.trim()) {
    errors.fullName = 'Enter the customer name.';
  }

  if (!customer.email.trim()) {
    errors.email = 'Enter an email address.';
  } else if (!/\S+@\S+\.\S+/.test(customer.email)) {
    errors.email = 'Enter a valid email address.';
  }

  const digits = customer.phone.replace(/\D/g, '');
  if (!digits) {
    errors.phone = 'Enter a mobile number.';
  } else if (digits.length < 10) {
    errors.phone = 'Enter a valid mobile number.';
  }

  return { errors };
}

export const bookingCustomerValidationService: BookingCustomerValidationService = {
  validate(customer) {
    return validateBookingCustomerDetails(customer);
  },
};
