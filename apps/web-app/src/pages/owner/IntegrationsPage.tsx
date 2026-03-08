import { AlertTriangle, Link2, RefreshCcw, RotateCcw, ShieldAlert, Unplug, Wifi } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { RouteStateCard } from '@/app/components/RouteStateCard';
import { AppPill, OwnerContentGrid, OwnerPageScaffold, PageIntro } from '@/app/components/PageTemplates';
import {
  ownerIntegrationsPersistenceClient,
  type IntegrationErrorType,
  type IntegrationIncident,
  type IntegrationLifecycleState,
  type IntegrationProviderSnapshot,
} from '@/features/owner/integrations/persistenceClient';
import { BrandButton, Card, StatusTag, useBrandToast } from '@/ui';
import './integrations.css';

export function IntegrationsPage() {
  const toast = useBrandToast();
  const [sessionStatus, setSessionStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [sessionMessage, setSessionMessage] = useState('Loading provider statuses...');
  const [providers, setProviders] = useState<IntegrationProviderSnapshot[]>([]);
  const [incidents, setIncidents] = useState<IntegrationIncident[]>([]);
  const [roadmap, setRoadmap] = useState<string[]>([]);
  const [activeAction, setActiveAction] = useState<{ providerId: string; type: IntegrationActionType } | null>(null);
  const [tickNow, setTickNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTickNow(Date.now());
    }, 1000);
    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    void hydrateIntegrations();
  }, []);

  async function hydrateIntegrations() {
    setSessionStatus('loading');
    setSessionMessage('Loading provider statuses...');
    try {
      const snapshot = await ownerIntegrationsPersistenceClient.load();
      setProviders(snapshot.providers);
      setIncidents(snapshot.incidents);
      setRoadmap(snapshot.roadmap);
      setSessionStatus('ready');
      setSessionMessage('');
    } catch {
      setSessionStatus('error');
      setSessionMessage('Could not load integration states. Retry to restore auth, sync, and incident visibility.');
    }
  }

  async function runAction(provider: IntegrationProviderSnapshot, action: IntegrationActionType) {
    setActiveAction({ providerId: provider.id, type: action });
    try {
      const result = action === 'connect'
        ? await ownerIntegrationsPersistenceClient.connect(provider.id)
        : action === 'disconnect'
          ? await ownerIntegrationsPersistenceClient.disconnect(provider.id)
          : action === 'reauth'
            ? await ownerIntegrationsPersistenceClient.reauthenticate(provider.id)
            : await ownerIntegrationsPersistenceClient.runSync(provider.id);

      setProviders(result.snapshot.providers);
      setIncidents(result.snapshot.incidents);
      setRoadmap(result.snapshot.roadmap);
      toast.success({
        title: getActionSuccessTitle(action),
        description: `${provider.name} updated at ${new Date(result.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Action failed. Retry this provider action.';
      toast.error({
        title: getActionFailureTitle(action),
        description: message,
      });
    } finally {
      setActiveAction(null);
    }
  }

  if (sessionStatus === 'loading') {
    return <RouteStateCard title="Loading integrations" description="Hydrating provider auth, sync, and incident state snapshots." variant="loading" />;
  }

  if (sessionStatus === 'error') {
    return <RouteStateCard title="Integrations unavailable" description={sessionMessage} variant="error" onRetry={() => void hydrateIntegrations()} />;
  }

  const criticalCount = providers.filter((provider) => provider.state === 'error' || provider.state === 'reauth-required').length;
  const degradedCount = providers.filter((provider) => provider.state === 'degraded').length;
  const connectedCount = providers.filter((provider) => provider.state === 'connected').length;
  const disconnectedCount = providers.filter((provider) => provider.state === 'disconnected').length;
  const latestIncident = incidents[0] ?? null;

  return (
    <OwnerPageScaffold>
      <PageIntro
        eyebrow="Integrations"
        title="Provider lifecycle operations"
        description="Manage provider auth, sync health, and troubleshooting from one operational surface with explicit action paths for every provider state."
        pills={(
          <>
            <AppPill tone="success">{connectedCount} connected</AppPill>
            <AppPill tone="warning">{degradedCount} degraded</AppPill>
            <AppPill>{disconnectedCount} disconnected</AppPill>
            <AppPill tone="warning">{criticalCount} critical actions</AppPill>
          </>
        )}
      />

      {criticalCount > 0 ? (
        <div className="integrations-critical-banner" role="status" aria-live="polite">
          <ShieldAlert size={16} />
          <span>
            {criticalCount} provider{criticalCount > 1 ? 's need' : ' needs'} immediate attention. Booking and customer workflows stay available while these integrations are recovered.
          </span>
        </div>
      ) : null}

      <OwnerContentGrid density="wide">
        <Card padding={5}>
          <div className="integrations-workspace">
            {providers.map((provider) => {
              const actionModel = getProviderActionModel(provider, tickNow);
              const busy = activeAction?.providerId === provider.id;
              const secondaryAction = actionModel.secondary;
              return (
                <article key={provider.id} className="integration-provider-card">
                  <header className="integration-provider-card__header">
                    <div>
                      <p className="integration-provider-card__eyebrow">{provider.category}</p>
                      <h2 className="integration-provider-card__title">{provider.name}</h2>
                    </div>
                    <StatusTag text={toStateLabel(provider.state)} tone={toStateTone(provider.state)} />
                  </header>

                  <p className="integration-provider-card__message">{provider.message}</p>

                  <dl className="integration-provider-card__stats">
                    <div>
                      <dt>Last sync</dt>
                      <dd>{formatTimestamp(provider.lastSyncAt)}</dd>
                    </div>
                    <div>
                      <dt>Sync health</dt>
                      <dd>{toSyncHealthLabel(provider.syncHealth)}</dd>
                    </div>
                    <div>
                      <dt>Error class</dt>
                      <dd>{provider.errorType ? toErrorTypeLabel(provider.errorType) : 'None'}</dd>
                    </div>
                  </dl>

                  {provider.errorDetail ? (
                    <div className="integration-provider-card__detail" role="status" aria-live="polite">
                      <AlertTriangle size={15} />
                      <span>{provider.errorDetail}</span>
                    </div>
                  ) : null}

                  {actionModel.backoffLabel ? (
                    <p className="integration-provider-card__backoff">
                      {actionModel.backoffLabel}
                    </p>
                  ) : null}

                  <div className="integration-provider-card__actions">
                    <BrandButton
                      startIcon={actionModel.primary.icon}
                      disabled={busy || actionModel.primary.disabled}
                      onClick={() => void runAction(provider, actionModel.primary.type)}
                    >
                      {busy && activeAction?.type === actionModel.primary.type ? actionModel.primary.loadingLabel : actionModel.primary.label}
                    </BrandButton>
                    {secondaryAction ? (
                      <BrandButton
                        variant="secondary"
                        startIcon={secondaryAction.icon}
                        disabled={busy || secondaryAction.disabled}
                        onClick={() => void runAction(provider, secondaryAction.type)}
                      >
                        {secondaryAction.label}
                      </BrandButton>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </Card>

        <div className="integrations-side-stack">
          <Card padding={5}>
            <h2 className="integrations-panel-title">Incident log</h2>
            <p className="integrations-panel-description">
              Events are ordered newest-first so owners can triage auth, rate-limit, config, and network issues without disrupting unrelated tasks.
            </p>
            {incidents.length === 0 ? (
              <RouteStateCard title="No incidents yet" description="Provider events will appear once auth or sync actions start recording logs." variant="empty" />
            ) : (
              <div className="integrations-incident-list" role="log" aria-live="polite" aria-label="Integration incident log">
                {incidents.slice(0, 8).map((incident) => (
                  <article key={incident.id} className={`integrations-incident-item integrations-incident-item--${incident.severity}`}>
                    <div className="integrations-incident-item__meta">
                      <StatusTag text={incident.severity} tone={toIncidentTone(incident.severity)} />
                      <span>{toErrorTypeLabel(incident.type)}</span>
                      <span>{formatTimestamp(incident.createdAt)}</span>
                    </div>
                    <strong>{incident.providerName}: {incident.message}</strong>
                    <p>{incident.detail}</p>
                  </article>
                ))}
              </div>
            )}
          </Card>

          <Card padding={5}>
            <h2 className="integrations-panel-title">Error taxonomy</h2>
            <ul className="owner-simple-list">
              <li><strong>Auth failure:</strong> expired tokens or revoked grants. Next action is reauthentication.</li>
              <li><strong>Rate limit:</strong> provider API throttling. Respect backoff window before retrying.</li>
              <li><strong>Config issue:</strong> missing mapping or invalid setup. Correct configuration then reconnect.</li>
              <li><strong>Network issue:</strong> transport timeout/unreachable endpoint. Retry when connection stabilizes.</li>
            </ul>
          </Card>

          <Card padding={5}>
            <h2 className="integrations-panel-title">Roadmap sequencing</h2>
            {latestIncident ? (
              <p className="integrations-panel-description">
                Latest event: {latestIncident.providerName} ({toErrorTypeLabel(latestIncident.type)} at {formatTimestamp(latestIncident.createdAt)}).
              </p>
            ) : null}
            <ul className="owner-simple-list">
              {roadmap.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
        </div>
      </OwnerContentGrid>
    </OwnerPageScaffold>
  );
}

type IntegrationActionType = 'connect' | 'disconnect' | 'reauth' | 'sync';

interface IntegrationActionDefinition {
  type: IntegrationActionType;
  label: string;
  loadingLabel: string;
  icon: ReactNode;
  disabled?: boolean;
}

interface IntegrationActionModel {
  primary: IntegrationActionDefinition;
  secondary?: IntegrationActionDefinition;
  backoffLabel?: string;
}

function getProviderActionModel(provider: IntegrationProviderSnapshot, nowMs: number): IntegrationActionModel {
  const backoffRemainingSeconds = provider.retryBackoffUntil
    ? Math.max(0, Math.ceil((new Date(provider.retryBackoffUntil).getTime() - nowMs) / 1000))
    : 0;

  const syncDisabledByBackoff = backoffRemainingSeconds > 0;
  const backoffLabel = syncDisabledByBackoff
    ? `Retry backoff active: try again in ${backoffRemainingSeconds}s.`
    : undefined;

  if (provider.state === 'disconnected') {
    return {
      primary: {
        type: 'connect',
        label: 'Connect provider',
        loadingLabel: 'Connecting...',
        icon: <Link2 size={14} />,
      },
    };
  }

  if (provider.state === 'connecting') {
    return {
      primary: {
        type: 'connect',
        label: 'Connecting...',
        loadingLabel: 'Connecting...',
        icon: <Wifi size={14} />,
        disabled: true,
      },
      secondary: {
        type: 'disconnect',
        label: 'Cancel connection',
        loadingLabel: 'Disconnecting...',
        icon: <Unplug size={14} />,
      },
    };
  }

  if (provider.state === 'reauth-required') {
    return {
      primary: {
        type: 'reauth',
        label: 'Reauthenticate',
        loadingLabel: 'Reauthenticating...',
        icon: <ShieldAlert size={14} />,
      },
      secondary: {
        type: 'disconnect',
        label: 'Disconnect',
        loadingLabel: 'Disconnecting...',
        icon: <Unplug size={14} />,
      },
    };
  }

  if (provider.state === 'error') {
    return {
      primary: {
        type: provider.errorType === 'auth-failure' ? 'reauth' : 'connect',
        label: provider.errorType === 'auth-failure' ? 'Retry auth' : 'Retry connection',
        loadingLabel: provider.errorType === 'auth-failure' ? 'Retrying auth...' : 'Retrying...',
        icon: <RotateCcw size={14} />,
      },
      secondary: {
        type: 'disconnect',
        label: 'Disconnect',
        loadingLabel: 'Disconnecting...',
        icon: <Unplug size={14} />,
      },
      backoffLabel,
    };
  }

  if (provider.state === 'degraded') {
    return {
      primary: {
        type: 'sync',
        label: 'Retry sync',
        loadingLabel: 'Syncing...',
        icon: <RefreshCcw size={14} />,
        disabled: syncDisabledByBackoff,
      },
      secondary: {
        type: 'disconnect',
        label: 'Disconnect',
        loadingLabel: 'Disconnecting...',
        icon: <Unplug size={14} />,
      },
      backoffLabel,
    };
  }

  return {
    primary: {
      type: 'sync',
      label: 'Sync now',
      loadingLabel: 'Syncing...',
      icon: <RefreshCcw size={14} />,
      disabled: syncDisabledByBackoff,
    },
    secondary: {
      type: 'disconnect',
      label: 'Disconnect',
      loadingLabel: 'Disconnecting...',
      icon: <Unplug size={14} />,
    },
    backoffLabel,
  };
}

function toStateLabel(state: IntegrationLifecycleState) {
  switch (state) {
    case 'disconnected':
      return 'Disconnected';
    case 'connecting':
      return 'Connecting';
    case 'connected':
      return 'Connected';
    case 'degraded':
      return 'Degraded';
    case 'error':
      return 'Error';
    case 'reauth-required':
      return 'Reauth required';
    default:
      return 'Unknown';
  }
}

function toStateTone(state: IntegrationLifecycleState) {
  if (state === 'connected') {
    return 'positive' as const;
  }

  if (state === 'connecting' || state === 'degraded') {
    return 'accent' as const;
  }

  if (state === 'error' || state === 'reauth-required') {
    return 'critical' as const;
  }

  return 'neutral' as const;
}

function toIncidentTone(severity: IntegrationIncident['severity']) {
  if (severity === 'critical') {
    return 'critical' as const;
  }
  if (severity === 'warning') {
    return 'accent' as const;
  }
  return 'neutral' as const;
}

function toSyncHealthLabel(health: IntegrationProviderSnapshot['syncHealth']) {
  if (health === 'healthy') {
    return 'Healthy';
  }
  if (health === 'warning') {
    return 'Warning';
  }
  if (health === 'critical') {
    return 'Critical';
  }
  return 'Unknown';
}

function toErrorTypeLabel(type: IntegrationErrorType | IntegrationIncident['type']) {
  switch (type) {
    case 'auth-failure':
      return 'Auth failure';
    case 'rate-limit':
      return 'Rate limit';
    case 'config-issue':
      return 'Config issue';
    case 'network-issue':
      return 'Network issue';
    case 'status-change':
      return 'Status change';
    case 'sync-success':
      return 'Sync success';
    default:
      return 'Operational event';
  }
}

function formatTimestamp(value: string | null) {
  if (!value) {
    return 'Not yet synced';
  }

  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getActionSuccessTitle(action: IntegrationActionType) {
  if (action === 'connect') {
    return 'Provider connection updated';
  }
  if (action === 'disconnect') {
    return 'Provider disconnected';
  }
  if (action === 'reauth') {
    return 'Provider reauthenticated';
  }
  return 'Sync request completed';
}

function getActionFailureTitle(action: IntegrationActionType) {
  if (action === 'connect') {
    return 'Connection failed';
  }
  if (action === 'disconnect') {
    return 'Disconnect failed';
  }
  if (action === 'reauth') {
    return 'Reauthentication failed';
  }
  return 'Sync failed';
}
