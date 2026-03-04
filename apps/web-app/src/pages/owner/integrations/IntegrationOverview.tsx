import { Badge, SectionCard } from '@slotra/ui';

export function IntegrationOverview() {
  return (
    <SectionCard
      title="Integration strategy"
      description="This screen tracks which integrations actually matter for MVP instead of simulating full marketplace complexity."
      actions={<Badge variant="warning">Scoped honestly</Badge>}
    >
      <div className="owner-status-grid">
        <div className="owner-status-card">
          <span className="owner-status-card__label">Live target</span>
          <strong>Google Calendar visibility</strong>
          <p>Best near-term operational win for the owner schedule.</p>
        </div>
        <div className="owner-status-card">
          <span className="owner-status-card__label">Manual workflow</span>
          <strong>Lead tagging from social channels</strong>
          <p>Handled by process for now, not by an API integration.</p>
        </div>
        <div className="owner-status-card">
          <span className="owner-status-card__label">Deferred</span>
          <strong>Payments and CRM sync</strong>
          <p>These stay in roadmap territory until the platform contracts are stable.</p>
        </div>
      </div>
    </SectionCard>
  );
}
