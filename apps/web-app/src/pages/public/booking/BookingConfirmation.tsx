import { EmptyState } from '@slotra/ui';
import { loadPublicBookingConfirmation } from '@/features/public-booking/data';
import { Link } from 'react-router-dom';
import { ConfirmationSummary } from './components/ConfirmationSummary';

export function BookingConfirmation() {
  const confirmation = loadPublicBookingConfirmation();

  return (
    <div className="booking-page booking-page--confirmation">
      <div className="booking-shell">
        {confirmation ? (
          <ConfirmationSummary confirmation={confirmation} />
        ) : (
          <div className="booking-confirmation booking-confirmation--empty">
            <EmptyState
              title="No recent booking confirmation found"
              description="Start from the booking flow to create a new confirmation for this browser session."
              actions={(
                <Link className="button-link" to="/book">
                  Go to booking
                </Link>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
