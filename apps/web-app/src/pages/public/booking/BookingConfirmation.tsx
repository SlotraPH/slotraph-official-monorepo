import { EmptyState } from '@slotra/ui';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { BookingConfirmationRecord } from '@/domain/booking/types';
import { RouteStateCard } from '@/app/components/RouteStateCard';
import { publicBookingIntegrationClient } from '@/features/public-booking/integrationClient';
import { BrandButton } from '@/ui';
import { ConfirmationSummary } from './components/ConfirmationSummary';

export function BookingConfirmation() {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [message, setMessage] = useState('Loading your booking confirmation...');
  const [confirmation, setConfirmation] = useState<BookingConfirmationRecord | null>(null);

  useEffect(() => {
    let canceled = false;

    async function loadConfirmation() {
      setStatus('loading');
      setMessage('Loading your booking confirmation...');

      try {
        const record = await publicBookingIntegrationClient.loadConfirmation();

        if (canceled) {
          return;
        }

        setConfirmation(record);
        setStatus('ready');
      } catch {
        if (canceled) {
          return;
        }

        setStatus('error');
        setMessage('Could not load booking confirmation. Retry to restore your latest confirmation.');
      }
    }

    void loadConfirmation();

    return () => {
      canceled = true;
    };
  }, []);

  if (status === 'loading') {
    return <RouteStateCard title="Loading confirmation" description={message} variant="loading" />;
  }

  if (status === 'error') {
    return <RouteStateCard title="Confirmation unavailable" description={message} variant="error" onRetry={() => window.location.reload()} />;
  }

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
                <div style={{ display: 'flex', gap: 12 }}>
                  <Link className="button-link" to="/book">
                    Go to booking
                  </Link>
                  <BrandButton variant="secondary" onClick={() => window.location.reload()}>
                    Retry check
                  </BrandButton>
                </div>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
