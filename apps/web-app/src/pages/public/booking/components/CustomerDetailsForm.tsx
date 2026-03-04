import { Input, Textarea } from '@slotra/ui';
import type { BookingCustomerDetails, BookingCustomerErrors } from '../types';

interface CustomerDetailsFormProps {
  customer: BookingCustomerDetails;
  errors: BookingCustomerErrors;
  onChange: (field: keyof BookingCustomerDetails, value: string) => void;
}

export function CustomerDetailsForm({
  customer,
  errors,
  onChange,
}: CustomerDetailsFormProps) {
  return (
    <div className="booking-stage-stack">
      <div className="booking-customer-grid">
        <Input
          id="booking-full-name"
          label="Full name"
          value={customer.fullName}
          error={errors.fullName}
          placeholder="Maria Dela Cruz"
          onChange={(event) => onChange('fullName', event.target.value)}
        />
        <Input
          id="booking-phone"
          label="Mobile number"
          value={customer.phone}
          error={errors.phone}
          placeholder="0917 123 4567"
          onChange={(event) => onChange('phone', event.target.value)}
        />
      </div>
      <Input
        id="booking-email"
        label="Email address"
        value={customer.email}
        error={errors.email}
        placeholder="maria@example.com"
        onChange={(event) => onChange('email', event.target.value)}
      />
      <Textarea
        id="booking-notes"
        label="Booking notes"
        hint="Optional. Mention allergies, preferred look, or anything staff should prepare."
        value={customer.notes}
        placeholder="Please keep the finish low-maintenance for weekdays."
        onChange={(event) => onChange('notes', event.target.value)}
      />
    </div>
  );
}
