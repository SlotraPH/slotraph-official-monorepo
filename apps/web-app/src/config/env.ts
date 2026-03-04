type OwnerAuthMode = 'bypass' | 'mock-session';

interface AppConfig {
  apiBaseUrl: string | null;
  inDevelopment: boolean;
  ownerAuthMode: OwnerAuthMode;
}

function normalizeApiBaseUrl(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed.replace(/\/+$/, '') : null;
}

function normalizeOwnerAuthMode(value: string | undefined): OwnerAuthMode {
  return value === 'mock-session' ? 'mock-session' : 'bypass';
}

function normalizeBoolean(value: string | undefined, fallback: boolean) {
  if (value === undefined) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) {
    return true;
  }

  if (['0', 'false', 'no', 'off'].includes(normalized)) {
    return false;
  }

  return fallback;
}

export const appConfig: AppConfig = {
  apiBaseUrl: normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
  inDevelopment: normalizeBoolean(import.meta.env.VITE_IN_DEVELOPMENT, true),
  ownerAuthMode: normalizeOwnerAuthMode(import.meta.env.VITE_OWNER_AUTH_MODE),
};
