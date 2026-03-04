import { EmptyState } from '@slotra/ui';
import type { BookingSlot } from '../types';

interface TimeSlotPickerProps {
  slots: BookingSlot[];
  selectedSlotId: string | null;
  error?: string;
  onSelect: (slotId: string) => void;
}

export function TimeSlotPicker({
  slots,
  selectedSlotId,
  error,
  onSelect,
}: TimeSlotPickerProps) {
  if (!slots.length) {
    return (
      <EmptyState
        align="left"
        title="No time slots left for this date"
        description="Choose another date to see the next available openings."
      />
    );
  }

  return (
    <div className="booking-stage-stack">
      <div className="booking-slot-grid">
        {slots.map((slot) => {
          const isSelected = slot.id === selectedSlotId;

          return (
            <button
              key={slot.id}
              type="button"
              className={[
                'booking-slot-card',
                isSelected ? 'booking-slot-card--selected' : '',
                !slot.available ? 'booking-slot-card--disabled' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onSelect(slot.id)}
              disabled={!slot.available}
            >
              <strong>{slot.startLabel}</strong>
              <span>{slot.endLabel}</span>
              <small>{slot.available ? 'Available' : 'Unavailable'}</small>
            </button>
          );
        })}
      </div>
      {error ? <p className="booking-inline-error">{error}</p> : null}
    </div>
  );
}
