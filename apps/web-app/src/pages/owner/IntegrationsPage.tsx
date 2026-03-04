import { PageHeader } from '@slotra/ui';
import { IntegrationOverview } from './integrations/IntegrationOverview';
import { IntegrationRoadmap } from './integrations/IntegrationRoadmap';
import { IntegrationWorkflowList } from './integrations/IntegrationWorkflowList';
import { INTEGRATION_ROADMAP, INTEGRATION_WORKFLOWS } from './mockOwnerData';

export function IntegrationsPage() {
  return (
    <div className="owner-page-stack">
      <PageHeader
        title="Integrations"
        subtitle="Keep the integrations story honest: what is configured, what is manual, and what is deferred."
      />
      <IntegrationOverview />
      <div className="owner-two-column-layout">
        <IntegrationWorkflowList items={INTEGRATION_WORKFLOWS} />
        <IntegrationRoadmap items={INTEGRATION_ROADMAP} />
      </div>
    </div>
  );
}
