type OwnerAuthMode = 'bypass' | 'mock-session';

interface AppConfig {
  apiBaseUrl: string | null;
  ownerAuthMode: OwnerAuthMode;
}

function normalizeApiBaseUrl(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed.replace(/\/+$/, '') : null;
}

function normalizeOwnerAuthMode(value: string | undefined): OwnerAuthMode {
  return value === 'mock-session' ? 'mock-session' : 'bypass';
}

export const appConfig: AppConfig = {
  apiBaseUrl: normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
  ownerAuthMode: normalizeOwnerAuthMode(import.meta.env.VITE_OWNER_AUTH_MODE),
};
