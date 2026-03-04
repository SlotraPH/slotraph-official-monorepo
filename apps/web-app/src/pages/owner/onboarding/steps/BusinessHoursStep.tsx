import { Badge, SectionCard } from '@slotra/ui';
import type { BusinessHourDraft } from '../types';

interface BusinessHoursStepProps {
  businessHours: BusinessHourDraft[];
  errors: Record<string, string>;
  onHoursChange: (hourId: string, nextValue: Partial<BusinessHourDraft>) => void;
}

export function BusinessHoursStep({ businessHours, errors, onHoursChange }: BusinessHoursStepProps) {
  return (
    <SectionCard
      title="Business hours"
      description="Define the booking window customers will eventually see in the public scheduler."
    >
      {errors.businessHours && <p className="onboarding-error-banner">{errors.businessHours}</p>}

      <div className="owner-settings-stack">
        {businessHours.map((slot) => (
          <div key={slot.id} className="onboarding-hours-row">
            <div className="onboarding-hours-row__day">
              <div>
                <p className="onboarding-editor-card__title">{slot.day}</p>
                <p className="onboarding-editor-card__meta">Controls availability defaults for this day.</p>
              </div>
              <Badge variant={slot.isOpen ? 'success' : 'default'}>{slot.isOpen ? 'Open' : 'Closed'}</Badge>
            </div>

            <label className="onboarding-toggle">
              <input
                type="checkbox"
                checked={slot.isOpen}
                onChange={(event) => onHoursChange(slot.id, { isOpen: event.target.checked })}
              />
              <span>Accept bookings</span>
            </label>

            <div className="onboarding-hours-row__inputs">
              <label className="form-field">
                <span className="form-field__label">Open</span>
                <input
                  className="input"
                  type="time"
                  value={slot.openTime}
                  disabled={!slot.isOpen}
                  onChange={(event) => onHoursChange(slot.id, { openTime: event.target.value })}
                />
              </label>

              <label className="form-field">
                <span className="form-field__label">Close</span>
                <input
                  className="input"
                  type="time"
                  value={slot.closeTime}
                  disabled={!slot.isOpen}
                  onChange={(event) => onHoursChange(slot.id, { closeTime: event.target.value })}
                />
              </label>
            </div>

            {errors[`hours-${slot.id}`] && <p className="onboarding-inline-error">{errors[`hours-${slot.id}`]}</p>}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
