import { Button, SectionCard } from '@slotra/ui';
import type { QuickAction } from '@/mocks/owner/dashboard';

interface DashboardQuickActionsProps {
  actions: QuickAction[];
}

export function DashboardQuickActions({ actions }: DashboardQuickActionsProps) {
  return (
    <SectionCard title="Quick actions" description="Common owner tasks to keep the week moving.">
      <div className="owner-action-grid">
        {actions.map((action) => (
          <div key={action.id} className="owner-action-card">
            <div>
              <p className="owner-action-card__title">{action.title}</p>
              <p className="owner-action-card__description">{action.description}</p>
            </div>
            <Button variant="outline" size="sm" type="button">
              Start
            </Button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
