import { Badge, Button, SectionCard } from '@slotra/ui';
import type { CustomerRecord } from '@/domain/customer/types';

interface CustomerDetailPanelProps {
  customer: CustomerRecord | null;
}

export function CustomerDetailPanel({ customer }: CustomerDetailPanelProps) {
  if (!customer) {
    return (
      <SectionCard title="Customer details" description="Select a customer to review notes, value, and next steps." />
    );
  }

  return (
    <SectionCard
      title="Customer details"
      description="Focused detail view for staff handoff, retention, and manual follow-up."
      actions={<Badge variant="default">{customer.source}</Badge>}
    >
      <div className="customer-panel">
        <div className="customer-panel__hero">
          <div className="customer-panel__avatar">{customer.name.slice(0, 1)}</div>
          <div>
            <p className="customer-panel__name">{customer.name}</p>
            <p className="customer-panel__contact">{customer.phone}</p>
            <p className="customer-panel__contact">{customer.email}</p>
          </div>
        </div>

        <div className="customer-panel__stats">
          <div>
            <span>Total spend</span>
            <strong>PHP {customer.totalSpend.toLocaleString()}</strong>
          </div>
          <div>
            <span>Total visits</span>
            <strong>{customer.totalVisits}</strong>
          </div>
          <div>
            <span>Upcoming booking</span>
            <strong>{customer.upcomingBooking}</strong>
          </div>
        </div>

        <div className="customer-panel__tags">
          {customer.tags.map((tag) => (
            <Badge key={tag} variant="default">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="customer-panel__note">
          <p className="customer-panel__section-label">Notes</p>
          <p>{customer.notes}</p>
        </div>

        <div className="customer-panel__actions">
          <Button size="sm" type="button">Create booking</Button>
          <Button variant="outline" size="sm" type="button">Send reminder</Button>
        </div>
      </div>
    </SectionCard>
  );
}
