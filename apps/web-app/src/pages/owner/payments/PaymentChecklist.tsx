import { Badge, SectionCard } from '@slotra/ui';
import type { PaymentChecklistItem } from '../mockOwnerData';

interface PaymentChecklistProps {
  items: PaymentChecklistItem[];
}

export function PaymentChecklist({ items }: PaymentChecklistProps) {
  return (
    <SectionCard title="Implementation checklist" description="What the team can prepare now versus what depends on later phases.">
      <div className="owner-checklist">
        {items.map((item) => (
          <div key={item.id} className="owner-checklist__item">
            <div>
              <p className="owner-checklist__title">{item.title}</p>
              <p className="owner-checklist__description">{item.description}</p>
            </div>
            <Badge variant={item.status === 'Ready now' ? 'success' : 'default'}>
              {item.status}
            </Badge>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
