import { Badge, EmptyState, SectionCard } from '@slotra/ui';
import type { CustomerRecord } from '../mockOwnerData';

interface CustomerListProps {
  items: CustomerRecord[];
  selectedId: string | null;
  onSelect: (customer: CustomerRecord) => void;
}

export function CustomerList({ items, selectedId, onSelect }: CustomerListProps) {
  return (
    <SectionCard title="Customer list" description="Searchable and filterable customer records for owner follow-up.">
      {items.length === 0 ? (
        <EmptyState
          title="No customers match this view"
          description="Try another filter or search term to review the rest of your customer base."
        />
      ) : (
        <div className="customer-list">
          {items.map((customer) => (
            <button
              key={customer.id}
              className={[
                'customer-list__item',
                customer.id === selectedId ? 'customer-list__item--selected' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              type="button"
              onClick={() => onSelect(customer)}
            >
              <div>
                <p className="customer-list__name">{customer.name}</p>
                <p className="customer-list__meta">{customer.email}</p>
              </div>
              <Badge variant={customer.status === 'VIP' ? 'success' : 'default'}>
                {customer.status}
              </Badge>
              <div className="customer-list__stats">
                <span>{customer.totalVisits} visits</span>
                <span>PHP {customer.totalSpend.toLocaleString()}</span>
                <span>{customer.upcomingBooking}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
