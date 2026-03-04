import { describe, expect, it } from 'vitest';
import { PUBLIC_BOOKING_SERVICES } from '@/mocks/services';
import { formatSelectedDate, getDateOptions, getSlotsForDate } from './availability';

describe('booking availability helpers', () => {
  it('returns a stable 10-day availability window', () => {
    const options = getDateOptions(PUBLIC_BOOKING_SERVICES[0]!, null);

    expect(options).toHaveLength(10);
    expect(options.some((option) => option.isAvailable)).toBe(true);
  });

  it('returns no slots for invalid dates', () => {
    expect(getSlotsForDate(PUBLIC_BOOKING_SERVICES[0]!, 'not-a-date', null)).toEqual([]);
  });

  it('formats valid selected dates and falls back for invalid input', () => {
    expect(formatSelectedDate('2026-03-05')).toContain('March');
    expect(formatSelectedDate('not-a-date')).toBe('not-a-date');
  });
});
