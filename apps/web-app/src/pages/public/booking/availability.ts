import type { BookingDateOption, BookingService, BookingSlot } from './types';

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
const DAY_FORMATTER = new Intl.DateTimeFormat('en-US', { day: 'numeric' });
const MONTH_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'short' });
const SELECTED_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});

function buildDateFromOffset(offset: number) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date;
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function hashSeed(value: string) {
  return Array.from(value).reduce((total, character) => total + character.charCodeAt(0), 0);
}

function buildSlotLabels(startMinutes: number, durationMinutes: number) {
  const startHours = Math.floor(startMinutes / 60);
  const startRemainder = startMinutes % 60;
  const endMinutes = startMinutes + durationMinutes;
  const endHours = Math.floor(endMinutes / 60);
  const endRemainder = endMinutes % 60;

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const startDate = new Date(2026, 0, 1, startHours, startRemainder);
  const endDate = new Date(2026, 0, 1, endHours, endRemainder);

  return {
    startLabel: timeFormatter.format(startDate),
    endLabel: timeFormatter.format(endDate),
  };
}

export function getDateOptions(service: BookingService, staffId: string | null) {
  const scheduleSeed = hashSeed(`${service.id}:${staffId ?? 'front-desk'}`);

  return Array.from({ length: 10 }, (_, index) => {
    const date = buildDateFromOffset(index);
    const dateKey = toDateKey(date);
    const weekday = date.getDay();
    const base = scheduleSeed + index * 11;
    const closed = weekday === 0;
    const availableSlotCount = closed ? 0 : base % 5 === 0 ? 0 : 3 + (base % 4);

    let availabilityLabel = `${availableSlotCount} slots available`;
    if (closed) {
      availabilityLabel = 'Closed';
    } else if (!availableSlotCount) {
      availabilityLabel = 'Sold out';
    } else if (availableSlotCount <= 3) {
      availabilityLabel = 'Limited availability';
    }

    return {
      value: dateKey,
      weekdayLabel: WEEKDAY_FORMATTER.format(date),
      dayLabel: DAY_FORMATTER.format(date),
      monthLabel: MONTH_FORMATTER.format(date),
      availabilityLabel,
      availableSlotCount,
      isAvailable: availableSlotCount > 0,
    } satisfies BookingDateOption;
  });
}

export function getSlotsForDate(service: BookingService, date: string, staffId: string | null) {
  const dateSeed = hashSeed(`${service.id}:${staffId ?? 'front-desk'}:${date}`);
  const dateObject = new Date(`${date}T00:00:00`);

  if (Number.isNaN(dateObject.getTime()) || dateObject.getDay() === 0 || dateSeed % 5 === 0) {
    return [] as BookingSlot[];
  }

  const startingTimes = [9 * 60, 10 * 60 + 30, 12 * 60, 13 * 60 + 30, 15 * 60, 16 * 60 + 30];

  return startingTimes.map((startMinutes, index) => {
    const labels = buildSlotLabels(startMinutes, service.durationMinutes);
    const available = (dateSeed + index) % 4 !== 0;

    return {
      id: `${date}-${startMinutes}`,
      startLabel: labels.startLabel,
      endLabel: labels.endLabel,
      available,
    } satisfies BookingSlot;
  });
}

export function formatSelectedDate(date: string) {
  const dateObject = new Date(`${date}T00:00:00`);
  if (Number.isNaN(dateObject.getTime())) {
    return date;
  }

  return SELECTED_DATE_FORMATTER.format(dateObject);
}
