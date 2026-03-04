import { Badge, Button, SectionCard } from '@slotra/ui';
import type { UpcomingBooking } from '../mockOwnerData';

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
    </SectionCard>
  );
}
