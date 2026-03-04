import { EmptyState } from '@slotra/ui';
import { Link } from 'react-router-dom';
import { loadBookingConfirmation } from './bookingSession';
import { ConfirmationSummary } from './components/ConfirmationSummary';

export function BookingConfirmation() {
  const confirmation = loadBookingConfirmation();

  return (
    <main className="public-page booking-page booking-page--confirmation">
      <div className="booking-shell">
        {confirmation ? (
          <ConfirmationSummary confirmation={confirmation} />
        ) : (
          <div className="booking-confirmation booking-confirmation--empty">
            <EmptyState
              title="No recent booking confirmation found"
              description="Start from the booking flow to create a local confirmation state for this session."
              actions={(
                <Link className="button-link" to="/book">
                  Go to booking
                </Link>
              )}
            />
          </div>
        )}
      </div>
    </main>
  );
}
