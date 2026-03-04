import { Badge, Card } from '@slotra/ui';
import { Link } from 'react-router-dom';
import type { BookingConfirmationRecord } from '../types';

interface ConfirmationSummaryProps {
  confirmation: BookingConfirmationRecord;
}

export function ConfirmationSummary({ confirmation }: ConfirmationSummaryProps) {
  return (
    <div className="booking-confirmation">
      <Card className="booking-confirmation__hero">
        <div className="booking-confirmation__status">
          <Badge variant="success">{confirmation.statusLabel}</Badge>
          <span>Reference {confirmation.reference}</span>
        </div>
        <h1>Booking request received</h1>
        <p>
          {confirmation.businessName} has your request recorded. The team can now confirm the slot
          and follow up using the contact details you provided.
        </p>
      </Card>

      <div className="booking-confirmation__grid">
        <Card className="booking-confirmation__panel">
          <h2>Appointment summary</h2>
          <dl className="booking-confirmation__details">
            <div>
              <dt>Service</dt>
              <dd>{confirmation.serviceName}</dd>
            </div>
            <div>
              <dt>Duration</dt>
              <dd>{confirmation.serviceDurationLabel}</dd>
            </div>
            <div>
              <dt>Price</dt>
              <dd>{confirmation.servicePriceLabel}</dd>
            </div>
            <div>
              <dt>Staff</dt>
              <dd>{confirmation.staffName}</dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>{confirmation.dateLabel}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>{confirmation.timeLabel}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{confirmation.businessCity}</dd>
            </div>
          </dl>
        </Card>

        <Card className="booking-confirmation__panel">
          <h2>Customer details</h2>
          <dl className="booking-confirmation__details">
            <div>
              <dt>Name</dt>
              <dd>{confirmation.customer.fullName}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{confirmation.customer.email}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{confirmation.customer.phone}</dd>
            </div>
            <div>
              <dt>Notes</dt>
              <dd>{confirmation.customer.notes || 'No notes added'}</dd>
            </div>
          </dl>
          <p className="booking-confirmation__followup">{confirmation.followUpNote}</p>
        </Card>
      </div>

      <div className="booking-confirmation__actions">
        <Link className="button-link" to="/book">
          Book another appointment
        </Link>
        <Link className="button-link button-link--secondary" to="/">
          Return home
        </Link>
      </div>
    </div>
  );
}
