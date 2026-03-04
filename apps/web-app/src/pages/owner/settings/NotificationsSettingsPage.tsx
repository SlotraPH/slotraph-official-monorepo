import { useState } from 'react';
import { Button, SectionCard } from '@slotra/ui';

const NOTIFICATION_DEFAULTS = [
  {
    id: 'confirmations',
    label: 'Booking confirmations',
    description: 'Send confirmation after staff approves the booking.',
  },
  {
    id: 'reminders',
    label: 'Appointment reminders',
    description: 'Remind customers 24 hours before their schedule.',
  },
  {
    id: 'cancellations',
    label: 'Cancellation alerts',
    description: 'Notify staff immediately when a booking changes.',
  },
  {
    id: 'digest',
    label: 'Daily owner digest',
    description: 'Summarize tomorrow’s appointments every evening.',
  },
];

export function NotificationsSettingsPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    confirmations: true,
    reminders: true,
    cancellations: true,
    digest: false,
  });

  return (
    <SectionCard title="Notification defaults" description="Owner-managed communication settings before automation is wired to real providers.">
      <div className="owner-toggle-list">
        {NOTIFICATION_DEFAULTS.map((item) => (
          <label key={item.id} className="owner-toggle-row">
            <div>
              <p className="owner-toggle-row__title">{item.label}</p>
              <p className="owner-toggle-row__description">{item.description}</p>
            </div>
            <input
              type="checkbox"
              checked={enabled[item.id]}
              onChange={(event) =>
                setEnabled((current) => ({
                  ...current,
                  [item.id]: event.target.checked,
                }))
              }
            />
          </label>
        ))}
      </div>
      <div className="owner-form-actions">
        <Button type="button">Save notification defaults</Button>
      </div>
    </SectionCard>
  );
}
