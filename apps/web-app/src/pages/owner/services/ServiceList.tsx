import { ArchiveRestore, PencilLine, Plus } from 'lucide-react';
import { formatCurrency, formatDuration } from '@/domain/service/formatters';
import type { ServiceRecord } from '@/domain/service/types';
import { BrandButton, Card } from '@/ui';

interface ServiceListProps {
  items: ServiceRecord[];
  selectedId: string | null;
  viewMode: 'cards' | 'table';
  onSelect: (service: ServiceRecord) => void;
  onArchiveToggle: (serviceId: string) => void;
  onCreateNew: () => void;
  onResetFilters: () => void;
}

export function ServiceList({
  items,
  selectedId,
  viewMode,
  onSelect,
  onArchiveToggle,
  onCreateNew,
  onResetFilters,
}: ServiceListProps) {
  if (items.length === 0) {
    return (
      <Card className="services-empty-state" padding={6}>
        <h2>No services in this view</h2>
        <p>Try clearing filters or create a new service draft for this session.</p>
        <div className="services-empty-state__actions">
          <BrandButton size="nav" variant="secondary" onClick={onResetFilters}>
            Reset filters
          </BrandButton>
          <BrandButton size="nav" startIcon={<Plus size={14} />} onClick={onCreateNew}>
            Create service
          </BrandButton>
        </div>
      </Card>
    );
  }

  return (
    <Card className="services-list-card" padding={5}>
      <div className="services-list-card__header">
        <div>
          <h2>Catalog records</h2>
          <p>Sorted by current search and status filters. Select a row to update details.</p>
        </div>
        <span className="services-list-card__count">{items.length} shown</span>
      </div>

      {viewMode === 'table' ? (
        <div className="services-table-wrap">
          <table className="services-table">
            <thead>
              <tr>
                <th scope="col">Service</th>
                <th scope="col">Duration</th>
                <th scope="col">Price</th>
                <th scope="col">Visibility</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((service) => {
                const selected = selectedId === service.id;
                return (
                  <tr key={service.id} className={selected ? 'is-selected' : undefined}>
                    <td>
                      <button className="services-table__name-button" type="button" onClick={() => onSelect(service)}>
                        <span className="services-table__name">{service.name}</span>
                        <span className="services-table__meta">{service.category} • {service.bookings} bookings</span>
                      </button>
                    </td>
                    <td>{formatDuration(service.durationMinutes)}</td>
                    <td>{formatCurrency(service.price)}</td>
                    <td>{service.visibility}</td>
                    <td>
                      <StatusChip status={service.status} />
                    </td>
                    <td>
                      <div className="services-table__actions">
                        <BrandButton size="nav" startIcon={<PencilLine size={13} />} variant="secondary" onClick={() => onSelect(service)}>
                          Edit
                        </BrandButton>
                        <BrandButton
                          size="nav"
                          startIcon={<ArchiveRestore size={13} />}
                          variant="secondary"
                          onClick={() => onArchiveToggle(service.id)}
                        >
                          {service.status === 'Archived' ? 'Restore' : 'Archive'}
                        </BrandButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="services-card-list">
          {items.map((service) => {
            const selected = selectedId === service.id;
            return (
              <article key={service.id} className={`services-card-item${selected ? ' is-selected' : ''}`}>
                <button className="services-card-item__body" type="button" onClick={() => onSelect(service)}>
                  <div className="services-card-item__header">
                    <div>
                      <h3>{service.name}</h3>
                      <p>{service.category} • {formatDuration(service.durationMinutes)}</p>
                    </div>
                    <StatusChip status={service.status} />
                  </div>
                  <p className="services-card-item__description">{service.description}</p>
                  <div className="services-card-item__meta">
                    <span>{formatCurrency(service.price)}</span>
                    <span>{service.bookings} bookings</span>
                    <span>{service.visibility}</span>
                  </div>
                </button>
                <div className="services-card-item__actions">
                  <BrandButton size="nav" startIcon={<PencilLine size={13} />} variant="secondary" onClick={() => onSelect(service)}>
                    Edit
                  </BrandButton>
                  <BrandButton
                    size="nav"
                    startIcon={<ArchiveRestore size={13} />}
                    variant="secondary"
                    onClick={() => onArchiveToggle(service.id)}
                  >
                    {service.status === 'Archived' ? 'Restore' : 'Archive'}
                  </BrandButton>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </Card>
  );
}

function StatusChip({ status }: { status: ServiceRecord['status'] }) {
  return <span className={`services-status-chip services-status-chip--${status.toLowerCase()}`}>{status}</span>;
}
