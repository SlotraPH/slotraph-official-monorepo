import { Badge, Card } from '@slotra/ui';
import type { DashboardSummary } from '../mockOwnerData';

interface DashboardSummaryCardsProps {
  items: DashboardSummary[];
}

export function DashboardSummaryCards({ items }: DashboardSummaryCardsProps) {
  return (
    <div className="owner-summary-grid">
      {items.map((item) => (
        <Card key={item.id} className="owner-summary-card">
          <div className="owner-summary-card__top">
            <p className="owner-summary-card__label">{item.label}</p>
            <Badge
              variant={
                item.trend === 'up' ? 'success' : item.trend === 'down' ? 'warning' : 'default'
              }
            >
              {item.change}
            </Badge>
          </div>
          <p className="owner-summary-card__value">{item.value}</p>
          <p className="owner-summary-card__hint">{item.hint}</p>
        </Card>
      ))}
    </div>
  );
}
