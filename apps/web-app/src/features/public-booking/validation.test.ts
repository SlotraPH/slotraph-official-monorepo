import { describe, expect, it } from 'vitest';
import { validateBookingCustomerDetails } from './validation';

describe('validateBookingCustomerDetails', () => {
  it('requires the booking contact fields', () => {
    expect(
      validateBookingCustomerDetails({
        fullName: '   ',
        email: '',
        phone: '',
        notes: '',
      }).errors
    ).toEqual({
      fullName: 'Enter the customer name.',
      email: 'Enter an email address.',
      phone: 'Enter a mobile number.',
    });
  });

  it('rejects malformed email addresses and short phone numbers', () => {
    expect(
      validateBookingCustomerDetails({
        fullName: 'Alex Cruz',
        email: 'alex-at-example.com',
        phone: '0917',
        notes: '',
      }).errors
    ).toEqual({
      email: 'Enter a valid email address.',
      phone: 'Enter a valid mobile number.',
    });
  });

  it('accepts valid customer details', () => {
    expect(
      validateBookingCustomerDetails({
        fullName: 'Alex Cruz',
        email: 'alex@example.com',
        phone: '+63 917 555 0101',
        notes: 'Prefers afternoon slots.',
      }).errors
    ).toEqual({});
  });
});
