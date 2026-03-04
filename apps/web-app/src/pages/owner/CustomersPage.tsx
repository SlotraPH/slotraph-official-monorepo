import { useState } from 'react';
import { RouteStateCard } from '@/app/components/RouteStateCard';
import { AppPill, PageIntro } from '@/app/components/PageTemplates';
import { getOwnerCustomersResource } from '@/features/owner/data';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { BrandButton } from '@/ui';
import { CustomerDetailPanel } from './customers/CustomerDetailPanel';
import { CustomerImportCallout } from './customers/CustomerImportCallout';
import { CustomerList } from './customers/CustomerList';
import { CustomerToolbar } from './customers/CustomerToolbar';

export function CustomersPage() {
  const resource = getOwnerCustomersResource();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [selectedId, setSelectedId] = useState<string | null>(
    () => (resource.status === 'ready' ? resource.data.customers[0]?.id ?? null : null)
  );

  if (resource.status === 'loading') {
    return <RouteStateCard title="Loading customers" description="Preparing owner customer records." variant="loading" />;
  }

  if (resource.status === 'error') {
    return <RouteStateCard title="Customers unavailable" description={resource.message} variant="error" />;
  }

  const { customers } = resource.data;

  const filtered = customers.filter((customer) => {
    const haystack = `${customer.name} ${customer.email} ${customer.tags.join(' ')}`.toLowerCase();
    return (status === 'All' || customer.status === status) && haystack.includes(query.toLowerCase());
  });

  const selectedCustomer = filtered.find((customer) => customer.id === selectedId)
    ?? customers.find((customer) => customer.id === selectedId)
    ?? null;

  return (
    <div className="owner-page-stack">
      <PageIntro
        eyebrow="Customers"
        title="Customer relationships"
        description="Search, segment, and review the current customer base without changing the mock data wiring underneath the page."
        actions={(
          <Link style={{ textDecoration: 'none' }} to="/book">
            <BrandButton size="nav" startIcon={<Compass size={15} />} variant="secondary">
              Open booking form
            </BrandButton>
          </Link>
        )}
        pills={(
          <>
            <AppPill tone="success">{customers.filter((customer) => customer.status === 'VIP').length} VIP</AppPill>
            <AppPill>{customers.filter((customer) => customer.status === 'New').length} new</AppPill>
            <AppPill>{customers.filter((customer) => customer.status === 'Needs follow-up').length} follow-up</AppPill>
          </>
        )}
      />
      <CustomerToolbar
        query={query}
        status={status}
        onQueryChange={setQuery}
        onStatusChange={setStatus}
      />
      <div className="owner-two-column-layout owner-two-column-layout--wide">
        <CustomerList items={filtered} selectedId={selectedId} onSelect={(customer) => setSelectedId(customer.id)} />
        <CustomerDetailPanel customer={selectedCustomer} />
      </div>
      <CustomerImportCallout />
    </div>
  );
}
