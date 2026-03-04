import { Badge, Button } from '@slotra/ui';
import type {
  BookingBusinessProfile,
  BookingCustomerDetails,
  BookingService,
  BookingSlot,
  BookingStaffMember,
} from '../types';

interface ReviewPanelProps {
  business: BookingBusinessProfile;
  service: BookingService;
  staff: BookingStaffMember | null;
  dateLabel: string;
  slot: BookingSlot;
  customer: BookingCustomerDetails;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function ReviewPanel({
  business,
  service,
  staff,
  dateLabel,
  slot,
  customer,
  onConfirm,
  isSubmitting,
}: ReviewPanelProps) {
  return (
    <div className="booking-review">
      <div className="booking-review__section">
        <div className="booking-review__top">
          <div>
            <p className="booking-review__eyebrow">Service</p>
            <h3>{service.name}</h3>
          </div>
          <Badge variant="accent">{service.durationMinutes} min</Badge>
        </div>
        <p>{service.description}</p>
      </div>

      <div className="booking-review__grid">
        <div className="booking-review__section">
          <p className="booking-review__eyebrow">Appointment</p>
          <ul className="booking-review__list">
            <li>{dateLabel}</li>
            <li>
              {slot.startLabel} to {slot.endLabel}
            </li>
            <li>{staff ? staff.name : 'Next available therapist'}</li>
            <li>{business.name}</li>
          </ul>
        </div>
        <div className="booking-review__section">
          <p className="booking-review__eyebrow">Customer</p>
          <ul className="booking-review__list">
            <li>{customer.fullName}</li>
            <li>{customer.email}</li>
            <li>{customer.phone}</li>
            <li>{customer.notes || 'No additional notes'}</li>
          </ul>
        </div>
      </div>

      <div className="booking-review__policy">
        <p className="booking-review__eyebrow">Before you submit</p>
        <p>
          This mock flow reserves the selection locally and routes to confirmation. Payments and
          backend availability sync are deferred to later phases.
        </p>
      </div>

      <Button type="button" size="lg" onClick={onConfirm} disabled={isSubmitting}>
        {isSubmitting ? 'Confirming...' : 'Confirm booking'}
      </Button>
    </div>
  );
}
