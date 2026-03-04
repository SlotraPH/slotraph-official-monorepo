import { useState } from 'react';
import { Button, SectionCard, Select } from '@slotra/ui';

export function BookingPreferencesPage() {
  const [leadTime, setLeadTime] = useState('2 hours');
  const [cancellationWindow, setCancellationWindow] = useState('12 hours');
  const [bookingApproval, setBookingApproval] = useState('Manual review');

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
