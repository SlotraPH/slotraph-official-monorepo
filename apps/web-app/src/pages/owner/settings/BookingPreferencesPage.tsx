import { useState } from 'react';
import { Button, SectionCard, Select } from '@slotra/ui';
import { getOwnerPaymentsResource } from '@/features/owner/data';

export function BookingPreferencesPage() {
  const resource = getOwnerPaymentsResource();
  const preferences = resource.status === 'ready' ? resource.data.bookingPreferences : null;
  const [leadTime, setLeadTime] = useState(() => preferences?.leadTime ?? '2 hours');
  const [cancellationWindow, setCancellationWindow] = useState(() => preferences?.cancellationWindow ?? '12 hours');
  const [bookingApproval, setBookingApproval] = useState(() => preferences?.bookingApproval ?? 'Manual review');

  return (
    <SectionCard title="Booking preferences" description="Operational rules for how bookings should be accepted before backend persistence is added.">
      <div className="owner-form-grid">
        <Select id="booking-lead-time" label="Minimum lead time" value={leadTime} onChange={(event) => setLeadTime(event.target.value)}>
          <option value="2 hours">2 hours</option>
          <option value="6 hours">6 hours</option>
          <option value="1 day">1 day</option>
        </Select>
        <Select id="booking-cancel-window" label="Cancellation window" value={cancellationWindow} onChange={(event) => setCancellationWindow(event.target.value)}>
          <option value="12 hours">12 hours</option>
          <option value="24 hours">24 hours</option>
          <option value="48 hours">48 hours</option>
        </Select>
        <Select id="booking-approval" label="Approval flow" value={bookingApproval} onChange={(event) => setBookingApproval(event.target.value)}>
          <option value="Manual review">Manual review</option>
          <option value="Auto-approve public slots">Auto-approve public slots</option>
        </Select>
      </div>
      <div className="owner-form-actions">
        <Button type="button">Save booking preferences</Button>
      </div>
    </SectionCard>
  );
}
