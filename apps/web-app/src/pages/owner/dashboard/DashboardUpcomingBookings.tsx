import { Badge, Button, EmptyState, SectionCard } from '@slotra/ui';
import type { UpcomingBooking } from '@/domain/booking/types';

interface DashboardUpcomingBookingsProps {
  bookings: UpcomingBooking[];
}

export function DashboardUpcomingBookings({ bookings }: DashboardUpcomingBookingsProps) {
  return (
    <SectionCard
      title="Upcoming bookings"
      description="Confirmed appointments and the next manual follow-ups."
      actions={<Button variant="ghost" size="sm">Open calendar</Button>}
    >
      {bookings.length === 0 ? (
        <EmptyState
          align="left"
          title="No upcoming bookings yet"
          description="This module now handles a true empty schedule while the app still uses mock owner data."
        />
      ) : (
        <div className="owner-bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="owner-bookings-item">
              <div>
                <p className="owner-bookings-item__name">{booking.customerName}</p>
                <p className="owner-bookings-item__meta">
                  {booking.serviceName} with {booking.staffName}
                </p>
              </div>
              <div className="owner-bookings-item__time">
                <span>{booking.startTime}</span>
                <span>{booking.duration}</span>
              </div>
              <Badge variant={booking.status === 'confirmed' ? 'success' : 'warning'}>
                {booking.status}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
