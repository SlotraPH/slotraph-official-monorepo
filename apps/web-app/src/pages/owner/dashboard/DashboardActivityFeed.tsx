import { SectionCard } from '@slotra/ui';
import type { ActivityItem } from '@/mocks/owner/dashboard';

interface DashboardActivityFeedProps {
  items: ActivityItem[];
}

export function DashboardActivityFeed({ items }: DashboardActivityFeedProps) {
  return (
    <SectionCard title="Business pulse" description="Operational notes worth acting on this week.">
      <div className="owner-activity-list">
        {items.map((item) => (
          <div key={item.id} className="owner-activity-item">
            <div className="owner-activity-item__dot" aria-hidden="true" />
            <div>
              <p className="owner-activity-item__title">{item.title}</p>
              <p className="owner-activity-item__detail">{item.detail}</p>
              <p className="owner-activity-item__time">{item.timeLabel}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
