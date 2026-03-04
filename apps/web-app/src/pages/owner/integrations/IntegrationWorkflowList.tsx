import { Badge, SectionCard } from '@slotra/ui';
import type { IntegrationWorkflow } from '@/mocks/owner/integrations';

interface IntegrationWorkflowListProps {
  items: IntegrationWorkflow[];
}

export function IntegrationWorkflowList({ items }: IntegrationWorkflowListProps) {
  return (
    <SectionCard title="Priority workflows" description="Operationally important connections and the scope each one has in MVP.">
      <div className="owner-checklist">
        {items.map((item) => (
          <div key={item.id} className="owner-checklist__item">
            <div>
              <p className="owner-checklist__title">{item.name}</p>
              <p className="owner-checklist__description">{item.summary}</p>
              <p className="owner-checklist__meta">{item.category} · {item.scope}</p>
            </div>
            <Badge variant={item.state === 'Configured' ? 'success' : 'default'}>
              {item.state}
            </Badge>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
