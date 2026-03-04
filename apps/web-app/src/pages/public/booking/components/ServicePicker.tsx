import { Badge } from '@slotra/ui';
import { formatCurrency, formatDuration } from '../mockData';
import type { BookingService } from '../types';

interface ServicePickerProps {
  services: BookingService[];
  selectedServiceId: string | null;
  error?: string;
  onSelect: (serviceId: string) => void;
}

export function ServicePicker({
  services,
  selectedServiceId,
  error,
  onSelect,
}: ServicePickerProps) {
  return (
    <div className="booking-stage-stack">
      <div className="booking-choice-grid">
        {services.map((service) => {
          const isSelected = service.id === selectedServiceId;

          return (
            <button
              key={service.id}
              type="button"
              className={[
                'booking-choice-card',
                isSelected ? 'booking-choice-card--selected' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onSelect(service.id)}
            >
              <div className="booking-choice-card__top">
                <div>
                  <p className="booking-choice-card__eyebrow">{service.category}</p>
                  <h3>{service.name}</h3>
                </div>
                <Badge variant={isSelected ? 'accent' : 'default'}>
                  {formatCurrency(service.price)}
                </Badge>
              </div>
              <p>{service.description}</p>
              <div className="booking-choice-card__footer">
                <span>{formatDuration(service.durationMinutes)}</span>
                <span>{service.leadNote}</span>
              </div>
            </button>
          );
        })}
      </div>
      {error ? <p className="booking-inline-error">{error}</p> : null}
    </div>
  );
}
