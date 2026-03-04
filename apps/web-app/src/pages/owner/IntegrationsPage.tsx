import { RouteStateCard } from '@/app/components/RouteStateCard';
import { PageIntro } from '@/app/components/PageTemplates';
import { getOwnerIntegrationsResource } from '@/features/owner/data';
import { IntegrationOverview } from './integrations/IntegrationOverview';
import { IntegrationRoadmap } from './integrations/IntegrationRoadmap';
import { IntegrationWorkflowList } from './integrations/IntegrationWorkflowList';

export function IntegrationsPage() {
  const resource = getOwnerIntegrationsResource();

  if (resource.status === 'loading') {
    return <RouteStateCard title="Loading integrations" description="Preparing MVP integration workflow fixtures." variant="loading" />;
  }

  if (resource.status === 'error') {
    return <RouteStateCard title="Integrations unavailable" description={resource.message} variant="error" />;
  }

  const { roadmap, workflows } = resource.data;

  return (
    <div className="owner-page-stack">
      <PageIntro
        eyebrow="Integrations"
        title="Integration posture"
        description="Keep the integrations story honest: what is configured, what is manual today, and what is still roadmap-only."
      />
      <IntegrationOverview />
      <div className="owner-two-column-layout">
        <IntegrationWorkflowList items={workflows} />
        <IntegrationRoadmap items={roadmap} />
      </div>
    </div>
  );
}
