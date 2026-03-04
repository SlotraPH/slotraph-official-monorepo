export interface AvailabilityDraft {
  day: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

export type AvailabilityErrors = Partial<Record<keyof AvailabilityDraft, string>>;

export function validateAvailabilityField(draft: AvailabilityDraft, field: keyof AvailabilityDraft) {
  if (field === 'day') {
    return draft.day ? undefined : 'Choose a day.';
  }

  if (!draft.isOpen) {
    return undefined;
  }

  if (field === 'openTime') {
    return draft.openTime ? undefined : 'Choose an opening time.';
  }

  if (field === 'closeTime') {
    if (!draft.closeTime) {
      return 'Choose a closing time.';
    }
    return draft.closeTime > draft.openTime ? undefined : 'Closing time must be later than opening time.';
  }

  return undefined;
}

export function validateAvailabilityForm(draft: AvailabilityDraft) {
  return {
    day: validateAvailabilityField(draft, 'day'),
    openTime: validateAvailabilityField(draft, 'openTime'),
    closeTime: validateAvailabilityField(draft, 'closeTime'),
  } satisfies AvailabilityErrors;
}
