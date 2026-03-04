import { Badge, Button, EmptyState, SectionCard } from '@slotra/ui';
import { formatCurrency, formatDuration } from '@/domain/service/formatters';
import type { ServiceRecord } from '@/domain/service/types';

interface ServiceListProps {
  items: ServiceRecord[];
  selectedId: string | null;
  onSelect: (service: ServiceRecord) => void;
  onArchiveToggle: (serviceId: string) => void;
}

export function ServiceList({
  items,
  selectedId,
  onSelect,
  onArchiveToggle,
}: ServiceListProps) {
  return (
    <SectionCard
      title="Service catalog"
      description="Prepared for CRUD flows with active, hidden, and archived states."
    >
      {items.length === 0 ? (
        <EmptyState
          title="No services match this filter"
          description="Clear the search or switch statuses to review the full service catalog."
        />
      ) : (
        <div className="service-list">
          {items.map((service) => (
            <div
              key={service.id}
              className={[
                'service-list__item',
                selectedId === service.id ? 'service-list__item--selected' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <button className="service-list__body" type="button" onClick={() => onSelect(service)}>
                <div className="service-list__header">
                  <div>
                    <p className="service-list__title">{service.name}</p>
                    <p className="service-list__subtitle">
                      {service.category} · {formatDuration(service.durationMinutes)}
                    </p>
                  </div>
                  <Badge variant={service.status === 'Active' ? 'success' : 'default'}>
                    {service.status}
                  </Badge>
                </div>

                <p className="service-list__description">{service.description}</p>

                <div className="service-list__footer">
                  <span>{formatCurrency(service.price)}</span>
                  <span>{service.bookings} bookings</span>
                  <span>{service.visibility}</span>
                </div>
              </button>

              <div className="service-list__actions">
                <Button variant="ghost" size="sm" type="button" onClick={() => onSelect(service)}>
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => onArchiveToggle(service.id)}
                >
                  {service.status === 'Archived' ? 'Restore' : 'Archive'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
