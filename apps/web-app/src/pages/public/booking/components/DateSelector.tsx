import type { BookingDateOption } from '../types';

interface DateSelectorProps {
  dateOptions: BookingDateOption[];
  selectedDate: string | null;
  error?: string;
  onSelect: (value: string) => void;
}

export function DateSelector({
  dateOptions,
  selectedDate,
  error,
  onSelect,
}: DateSelectorProps) {
  return (
    <div className="booking-stage-stack">
      <div className="booking-date-grid">
        {dateOptions.map((option) => {
          const isSelected = option.value === selectedDate;

          return (
            <button
              key={option.value}
              type="button"
              className={[
                'booking-date-card',
                isSelected ? 'booking-date-card--selected' : '',
                !option.isAvailable ? 'booking-date-card--disabled' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onSelect(option.value)}
              disabled={!option.isAvailable}
            >
              <span className="booking-date-card__weekday">{option.weekdayLabel}</span>
              <strong>{option.dayLabel}</strong>
              <span className="booking-date-card__month">{option.monthLabel}</span>
              <span className="booking-date-card__availability">{option.availabilityLabel}</span>
            </button>
          );
        })}
      </div>
      {error ? <p className="booking-inline-error">{error}</p> : null}
    </div>
  );
}
