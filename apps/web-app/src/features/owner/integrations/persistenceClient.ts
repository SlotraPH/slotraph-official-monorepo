export type IntegrationLifecycleState =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'degraded'
  | 'error'
  | 'reauth-required';

export type IntegrationSyncHealth = 'healthy' | 'warning' | 'critical' | 'unknown';

export type IntegrationErrorType = 'auth-failure' | 'rate-limit' | 'config-issue' | 'network-issue';

export type IntegrationIncidentSeverity = 'info' | 'warning' | 'critical';

export interface IntegrationProviderSnapshot {
  id: string;
  name: string;
  category: string;
  state: IntegrationLifecycleState;
  syncHealth: IntegrationSyncHealth;
  lastSyncAt: string | null;
  message: string;
  errorType: IntegrationErrorType | null;
  errorDetail: string | null;
  retryBackoffUntil: string | null;
  requiresReauth: boolean;
}

export interface IntegrationIncident {
  id: string;
  providerId: string;
  providerName: string;
  createdAt: string;
  severity: IntegrationIncidentSeverity;
  type: IntegrationErrorType | 'status-change' | 'sync-success';
  message: string;
  detail: string;
}

export interface IntegrationsPersistenceSnapshot {
  providers: IntegrationProviderSnapshot[];
  incidents: IntegrationIncident[];
  roadmap: string[];
}

export interface IntegrationActionResult {
  snapshot: IntegrationsPersistenceSnapshot;
  providerId: string;
  savedAt: string;
}

export interface OwnerIntegrationsPersistenceClient {
  load(): Promise<IntegrationsPersistenceSnapshot>;
  connect(providerId: string): Promise<IntegrationActionResult>;
  disconnect(providerId: string): Promise<IntegrationActionResult>;
  reauthenticate(providerId: string): Promise<IntegrationActionResult>;
  runSync(providerId: string): Promise<IntegrationActionResult>;
}

const STORAGE_KEY = 'slotra.owner.integrations.v1';

function wait(durationMs: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, durationMs);
  });
}

function cloneProvider(provider: IntegrationProviderSnapshot): IntegrationProviderSnapshot {
  return { ...provider };
}

function cloneIncident(incident: IntegrationIncident): IntegrationIncident {
  return { ...incident };
}

function cloneSnapshot(snapshot: IntegrationsPersistenceSnapshot): IntegrationsPersistenceSnapshot {
  return {
    providers: snapshot.providers.map(cloneProvider),
    incidents: snapshot.incidents.map(cloneIncident),
    roadmap: [...snapshot.roadmap],
  };
}

function createDefaultProviders(): IntegrationProviderSnapshot[] {
  return [
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      category: 'Scheduling',
      state: 'connected',
      syncHealth: 'healthy',
      lastSyncAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      message: 'Actively syncing new bookings.',
      errorType: null,
      errorDetail: null,
      retryBackoffUntil: null,
      requiresReauth: false,
    },
    {
      id: 'meta-leads',
      name: 'Meta Lead Forms',
      category: 'Lead intake',
      state: 'reauth-required',
      syncHealth: 'critical',
      lastSyncAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
      message: 'Token expired and new leads are paused.',
      errorType: 'auth-failure',
      errorDetail: 'Reconnect to restore lead ingestion.',
      retryBackoffUntil: null,
      requiresReauth: true,
    },
    {
      id: 'viber-broadcast',
      name: 'Viber Broadcast',
      category: 'Messaging',
      state: 'degraded',
      syncHealth: 'warning',
      lastSyncAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      message: 'Sync throughput is reduced due to API quota pressure.',
      errorType: 'rate-limit',
      errorDetail: 'Retry attempts are being throttled by provider API limits.',
      retryBackoffUntil: new Date(Date.now() + 70 * 1000).toISOString(),
      requiresReauth: false,
    },
    {
      id: 'xero',
      name: 'Xero Accounting',
      category: 'Finance',
      state: 'error',
      syncHealth: 'critical',
      lastSyncAt: null,
      message: 'Initial setup failed due to missing org mapping.',
      errorType: 'config-issue',
      errorDetail: 'Map the Xero organization and retry connection.',
      retryBackoffUntil: null,
      requiresReauth: false,
    },
    {
      id: 'whatsapp-reminders',
      name: 'WhatsApp Reminders',
      category: 'Messaging',
      state: 'disconnected',
      syncHealth: 'unknown',
      lastSyncAt: null,
      message: 'Not connected yet.',
      errorType: null,
      errorDetail: null,
      retryBackoffUntil: null,
      requiresReauth: false,
    },
  ];
}

function createDefaultSnapshot(): IntegrationsPersistenceSnapshot {
  return {
    providers: createDefaultProviders(),
    incidents: [
      {
        id: 'inc-1',
        providerId: 'meta-leads',
        providerName: 'Meta Lead Forms',
        createdAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
        severity: 'critical',
        type: 'auth-failure',
        message: 'Authentication failure',
        detail: 'OAuth token expired. Reauthentication is required before lead sync can resume.',
      },
      {
        id: 'inc-2',
        providerId: 'viber-broadcast',
        providerName: 'Viber Broadcast',
        createdAt: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
        severity: 'warning',
        type: 'rate-limit',
        message: 'Rate limit encountered',
        detail: 'Provider returned 429 responses. Backoff window applied for retry safety.',
      },
      {
        id: 'inc-3',
        providerId: 'google-calendar',
        providerName: 'Google Calendar',
        createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        severity: 'info',
        type: 'sync-success',
        message: 'Sync complete',
        detail: '6 booking updates synced with no conflicts.',
      },
    ],
    roadmap: [
      'Add provider-specific webhook diagnostics per sync run.',
      'Expose per-provider SLA target and alert thresholds.',
      'Wire server-side retry scheduling and dead-letter queue visibility.',
      'Migrate session-scoped snapshots to backend integration adapters.',
    ],
  };
}

function readFromStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as IntegrationsPersistenceSnapshot;
    if (!parsed || !Array.isArray(parsed.providers) || !Array.isArray(parsed.incidents) || !Array.isArray(parsed.roadmap)) {
      return null;
    }
    return cloneSnapshot(parsed);
  } catch {
    return null;
  }
}

function saveToStorage(snapshot: IntegrationsPersistenceSnapshot) {
  if (typeof window === 'undefined') {
    return;
  }
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

function getSnapshot() {
  return readFromStorage() ?? createDefaultSnapshot();
}

function getProvider(snapshot: IntegrationsPersistenceSnapshot, providerId: string) {
  const index = snapshot.providers.findIndex((provider) => provider.id === providerId);
  if (index < 0) {
    throw new Error('Provider was not found. Refresh and retry.');
  }

  const provider = snapshot.providers[index];
  if (!provider) {
    throw new Error('Provider was not found. Refresh and retry.');
  }

  return { index, provider };
}

function appendIncident(
  snapshot: IntegrationsPersistenceSnapshot,
  provider: IntegrationProviderSnapshot,
  incident: Omit<IntegrationIncident, 'id' | 'createdAt' | 'providerId' | 'providerName'>,
) {
  const entry: IntegrationIncident = {
    id: `inc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    providerId: provider.id,
    providerName: provider.name,
    createdAt: new Date().toISOString(),
    ...incident,
  };

  return [entry, ...snapshot.incidents].slice(0, 30);
}

function updateProvider(snapshot: IntegrationsPersistenceSnapshot, providerId: string, next: IntegrationProviderSnapshot) {
  const providers = snapshot.providers.map((provider) => (provider.id === providerId ? cloneProvider(next) : cloneProvider(provider)));
  return { ...snapshot, providers };
}

function createActionResult(snapshot: IntegrationsPersistenceSnapshot, providerId: string): IntegrationActionResult {
  const cloned = cloneSnapshot(snapshot);
  saveToStorage(cloned);
  return {
    snapshot: cloned,
    providerId,
    savedAt: new Date().toISOString(),
  };
}

function withBackoff(seconds: number) {
  return new Date(Date.now() + seconds * 1000).toISOString();
}

export const ownerIntegrationsPersistenceClient: OwnerIntegrationsPersistenceClient = {
  async load() {
    await wait(180);
    const snapshot = getSnapshot();
    saveToStorage(snapshot);
    return cloneSnapshot(snapshot);
  },
  async connect(providerId) {
    await wait(260);
    const snapshot = getSnapshot();
    const { provider } = getProvider(snapshot, providerId);

    if (provider.state === 'connected') {
      throw new Error(`${provider.name} is already connected.`);
    }

    const isConfigFailure = provider.id === 'xero';
    const isReauthCase = provider.id === 'meta-leads';
    const nextProvider: IntegrationProviderSnapshot = isConfigFailure
      ? {
        ...provider,
        state: 'error',
        syncHealth: 'critical',
        message: 'Connection blocked by configuration mismatch.',
        errorType: 'config-issue',
        errorDetail: 'Verify organization mapping and retry connection.',
        retryBackoffUntil: null,
      }
      : isReauthCase
        ? {
          ...provider,
          state: 'reauth-required',
          syncHealth: 'critical',
          message: 'Provider requires OAuth reauthentication.',
          errorType: 'auth-failure',
          errorDetail: 'Reauthenticate to restore lead ingestion.',
          retryBackoffUntil: null,
          requiresReauth: true,
        }
        : {
          ...provider,
          state: 'connected',
          syncHealth: 'healthy',
          lastSyncAt: new Date().toISOString(),
          message: 'Connected and ready for sync.',
          errorType: null,
          errorDetail: null,
          retryBackoffUntil: null,
          requiresReauth: false,
        };

    const nextSnapshotBase = updateProvider(snapshot, providerId, nextProvider);
    const incidents = appendIncident(nextSnapshotBase, nextProvider, isConfigFailure
      ? {
        severity: 'critical',
        type: 'config-issue',
        message: 'Configuration issue',
        detail: 'Connection attempt failed due to missing provider configuration.',
      }
      : isReauthCase
        ? {
          severity: 'critical',
          type: 'auth-failure',
          message: 'Authentication failure',
          detail: 'Provider rejected credentials and requested reauthentication.',
        }
        : {
          severity: 'info',
          type: 'status-change',
          message: 'Provider connected',
          detail: 'Connection established and provider is ready to sync.',
        });

    return createActionResult({ ...nextSnapshotBase, incidents }, providerId);
  },
  async disconnect(providerId) {
    await wait(190);
    const snapshot = getSnapshot();
    const { provider } = getProvider(snapshot, providerId);

    const nextProvider: IntegrationProviderSnapshot = {
      ...provider,
      state: 'disconnected',
      syncHealth: 'unknown',
      message: 'Disconnected by user action.',
      errorType: null,
      errorDetail: null,
      retryBackoffUntil: null,
      requiresReauth: false,
    };

    const nextSnapshotBase = updateProvider(snapshot, providerId, nextProvider);
    const incidents = appendIncident(nextSnapshotBase, nextProvider, {
      severity: 'warning',
      type: 'status-change',
      message: 'Provider disconnected',
      detail: 'Connection was disabled from the integrations workspace.',
    });
    return createActionResult({ ...nextSnapshotBase, incidents }, providerId);
  },
  async reauthenticate(providerId) {
    await wait(280);
    const snapshot = getSnapshot();
    const { provider } = getProvider(snapshot, providerId);

    if (!provider.requiresReauth && provider.state !== 'reauth-required') {
      throw new Error(`${provider.name} does not need reauthentication right now.`);
    }

    const nextProvider: IntegrationProviderSnapshot = {
      ...provider,
      state: 'connected',
      syncHealth: 'healthy',
      lastSyncAt: new Date().toISOString(),
      message: 'Reauthenticated successfully.',
      errorType: null,
      errorDetail: null,
      retryBackoffUntil: null,
      requiresReauth: false,
    };

    const nextSnapshotBase = updateProvider(snapshot, providerId, nextProvider);
    const incidents = appendIncident(nextSnapshotBase, nextProvider, {
      severity: 'info',
      type: 'status-change',
      message: 'Reauthentication successful',
      detail: 'Provider credentials were refreshed and sync resumed.',
    });
    return createActionResult({ ...nextSnapshotBase, incidents }, providerId);
  },
  async runSync(providerId) {
    await wait(220);
    const snapshot = getSnapshot();
    const { provider } = getProvider(snapshot, providerId);

    if (provider.state === 'disconnected') {
      throw new Error(`Connect ${provider.name} before running sync.`);
    }

    if (provider.state === 'reauth-required') {
      throw new Error(`Reauthenticate ${provider.name} before running sync.`);
    }

    if (provider.id === 'viber-broadcast') {
      const backoffUntil = withBackoff(75);
      const nextProvider: IntegrationProviderSnapshot = {
        ...provider,
        state: 'degraded',
        syncHealth: 'warning',
        message: 'Sync throttled. Backoff is active before retry.',
        errorType: 'rate-limit',
        errorDetail: 'Provider rate limit reached. Wait for backoff before retrying.',
        retryBackoffUntil: backoffUntil,
      };

      const nextSnapshotBase = updateProvider(snapshot, providerId, nextProvider);
      const incidents = appendIncident(nextSnapshotBase, nextProvider, {
        severity: 'warning',
        type: 'rate-limit',
        message: 'Rate limit triggered',
        detail: 'Sync retry window is delayed to protect provider limits.',
      });

      return createActionResult({ ...nextSnapshotBase, incidents }, providerId);
    }

    if (provider.id === 'xero') {
      const nextProvider: IntegrationProviderSnapshot = {
        ...provider,
        state: 'error',
        syncHealth: 'critical',
        message: 'Sync blocked by network transport error.',
        errorType: 'network-issue',
        errorDetail: 'Could not reach provider endpoint. Retry when connection stabilizes.',
        retryBackoffUntil: withBackoff(45),
      };

      const nextSnapshotBase = updateProvider(snapshot, providerId, nextProvider);
      const incidents = appendIncident(nextSnapshotBase, nextProvider, {
        severity: 'critical',
        type: 'network-issue',
        message: 'Network issue',
        detail: 'Provider sync request timed out. Backoff applied before next retry.',
      });

      return createActionResult({ ...nextSnapshotBase, incidents }, providerId);
    }

    const nextProvider: IntegrationProviderSnapshot = {
      ...provider,
      state: 'connected',
      syncHealth: 'healthy',
      lastSyncAt: new Date().toISOString(),
      message: 'Latest sync completed successfully.',
      errorType: null,
      errorDetail: null,
      retryBackoffUntil: null,
    };

    const nextSnapshotBase = updateProvider(snapshot, providerId, nextProvider);
    const incidents = appendIncident(nextSnapshotBase, nextProvider, {
      severity: 'info',
      type: 'sync-success',
      message: 'Sync successful',
      detail: 'Provider sync completed without errors.',
    });

    return createActionResult({ ...nextSnapshotBase, incidents }, providerId);
  },
};
