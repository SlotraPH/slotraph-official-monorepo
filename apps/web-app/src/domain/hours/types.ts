export interface BusinessHour {
  id: string;
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export type BusinessHourDraft = BusinessHour;
