import { useState } from 'react';
import { Badge, Button, Card, EmptyState, PageHeader } from '@slotra/ui';

interface Service {
  id: string;
  name: string;
  category: string;
  duration: string;
  price: string;
  bookings: number;
}

const MOCK_SERVICES: Service[] = [
  { id: '1', name: 'Haircut & Style', category: 'Hair', duration: '45 min', price: 'PHP 350', bookings: 142 },
  { id: '2', name: 'Beard Trim', category: 'Grooming', duration: '30 min', price: 'PHP 200', bookings: 87 },
  { id: '3', name: 'Color & Highlights', category: 'Hair', duration: '2 hrs', price: 'PHP 1,200', bookings: 34 },
];

export function ServicesPage() {
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = MOCK_SERVICES.filter((service) =>
    service.name.toLowerCase().includes(query.toLowerCase())
  );

  function handleCopyLink(id: string) {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  }

  return (
    <div>
      <PageHeader
        title={(
          <>
            Services
            <span className="svc-count-badge">{MOCK_SERVICES.length}</span>
          </>
        )}
        subtitle="Manage the services customers can book."
        actions={<Button variant="primary" size="sm">+ Add Service</Button>}
      />

      <div className="svc-toolbar">
        <div className="svc-search-wrap">
          <svg className="svc-search-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75">
            <circle cx="8.5" cy="8.5" r="5.25" />
            <path d="M12.5 12.5L17 17" strokeLinecap="round" />
          </svg>
          <input
            className="input svc-search-input"
            type="search"
            placeholder="Search services..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <Card padded={false} style={{ overflow: 'hidden' }}>
        <div className="svc-table-head">
          <div className="svc-col svc-col--name">Service</div>
          <div className="svc-col svc-col--dur">Duration</div>
          <div className="svc-col svc-col--price">Price</div>
          <div className="svc-col svc-col--bookings">Bookings</div>
          <div className="svc-col svc-col--actions" />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No services match your search"
            description="Try a different keyword or clear the search to see all services."
            className="svc-empty-state"
          />
        ) : (
          filtered.map((service) => (
            <div key={service.id} className="svc-row">
              <div className="svc-col svc-col--name">
                <div className="svc-icon-wrap">
                  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                    <rect x="3" y="3" width="6" height="6" rx="1.5" />
                    <rect x="11" y="3" width="6" height="6" rx="1.5" />
                    <rect x="3" y="11" width="6" height="6" rx="1.5" />
                    <rect x="11" y="11" width="6" height="6" rx="1.5" />
                  </svg>
                </div>
                <div>
                  <p className="svc-name">{service.name}</p>
                  <p className="svc-cat">{service.category}</p>
                </div>
              </div>
              <div className="svc-col svc-col--dur">{service.duration}</div>
              <div className="svc-col svc-col--price">
                <span className="svc-price">{service.price}</span>
              </div>
              <div className="svc-col svc-col--bookings">
                <Badge variant="default">{service.bookings}</Badge>
              </div>
              <div className="svc-col svc-col--actions">
                <button
                  className={`btn btn--outline btn--sm svc-copy-btn ${copiedId === service.id ? 'svc-copy-btn--copied' : ''}`}
                  onClick={() => handleCopyLink(service.id)}
                  title="Copy booking link"
                  type="button"
                >
                  {copiedId === service.id ? (
                    <>
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                        <path d="M3 8l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" width="12" height="12">
                        <rect x="5" y="5" width="8" height="8" rx="1.5" />
                        <path d="M3 11V3h8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Copy link
                    </>
                  )}
                </button>
                <Button variant="ghost" size="sm" aria-label={`More actions for ${service.name}`}>
                  ...
                </Button>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
