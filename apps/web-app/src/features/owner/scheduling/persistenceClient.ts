import type { BusinessHourDraft } from '@/domain/hours/types';
import { getOwnerBusinessSettingsResource } from '@/features/owner/data';

export const SCHEDULING_OVERRIDE_STATUSES = ['closed', 'custom', 'extended'] as const;
export type SchedulingOverrideStatus = (typeof SCHEDULING_OVERRIDE_STATUSES)[number];

export interface SchedulingOverrideDraft {
  id: string;
  date: string;
  status: SchedulingOverrideStatus;
  openTime: string;
  closeTime: string;
  note: string;
}

export interface SchedulingPersistenceSnapshot {
  timezone: string;
  weeklyHours: BusinessHourDraft[];
  overrides: SchedulingOverrideDraft[];
  blackoutDates: string[];
}

export interface SchedulingSaveResult {
  savedAt: string;
  snapshot: SchedulingPersistenceSnapshot;
}

export interface SchedulingPersistenceClient {
  load(): Promise<SchedulingPersistenceSnapshot>;
  save(snapshot: SchedulingPersistenceSnapshot): Promise<SchedulingSaveResult>;
  createDefaultSnapshot(): SchedulingPersistenceSnapshot;
}

const SCHEDULING_STORAGE_KEY = 'slotra.owner.scheduling.v1';

function wait(durationMs: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, durationMs);
  });
}

function cloneWeeklyHours(hours: BusinessHourDraft[]) {
  return hours.map<BusinessHourDraft>((hour) => ({ ...hour }));
}

function cloneOverrides(overrides: SchedulingOverrideDraft[]) {
  return overrides.map<SchedulingOverrideDraft>((override) => ({ ...override }));
}

function cloneSnapshot(snapshot: SchedulingPersistenceSnapshot): SchedulingPersistenceSnapshot {
  return {
    timezone: snapshot.timezone,
    weeklyHours: cloneWeeklyHours(snapshot.weeklyHours),
    overrides: cloneOverrides(snapshot.overrides),
    blackoutDates: [...snapshot.blackoutDates],
  };
}

function parseSnapshot(value: string): SchedulingPersistenceSnapshot {
  const parsed = JSON.parse(value) as SchedulingPersistenceSnapshot;

  if (!Array.isArray(parsed.weeklyHours) || !Array.isArray(parsed.overrides) || !Array.isArray(parsed.blackoutDates)) {
    throw new Error('Scheduling data is invalid.');
  }

  return cloneSnapshot(parsed);
}

function createDefaultSnapshot(): SchedulingPersistenceSnapshot {
  const businessResource = getOwnerBusinessSettingsResource();
  const businessSeed = businessResource.status === 'ready' ? businessResource.data : null;

  return {
    timezone: businessSeed?.business.timezone ?? 'Asia/Manila',
    weeklyHours: cloneWeeklyHours(businessSeed?.businessHours ?? []),
    overrides: [
      {
        id: 'ovr-holiday',
        date: '2026-03-29',
        status: 'closed',
        openTime: '10:00',
        closeTime: '19:00',
        note: 'Staff planning day',
      },
      {
        id: 'ovr-sale',
        date: '2026-03-15',
        status: 'extended',
        openTime: '09:00',
        closeTime: '21:00',
        note: 'Weekend promo window',
      },
    ],
    blackoutDates: ['2026-04-18'],
  };
}

function loadFromStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.sessionStorage.getItem(SCHEDULING_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  return parseSnapshot(raw);
}

function saveToStorage(snapshot: SchedulingPersistenceSnapshot) {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(SCHEDULING_STORAGE_KEY, JSON.stringify(snapshot));
}

export const ownerSchedulingPersistenceClient: SchedulingPersistenceClient = {
  async load() {
    await wait(160);
    return loadFromStorage() ?? createDefaultSnapshot();
  },
  async save(snapshot) {
    await wait(200);
    saveToStorage(snapshot);
    return {
      savedAt: new Date().toISOString(),
      snapshot: cloneSnapshot(snapshot),
    };
  },
  createDefaultSnapshot() {
    return createDefaultSnapshot();
  },
};
