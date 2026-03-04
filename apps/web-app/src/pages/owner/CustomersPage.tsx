import { useState } from 'react';
import { Badge, PageHeader } from '@slotra/ui';
import { RouteStateCard } from '@/app/components/RouteStateCard';
import { getOwnerCustomersResource } from '@/features/owner/data';
import { Link } from 'react-router-dom';
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
      <PageHeader
        title="Customers"
        subtitle="View and manage your customer base."
        actions={<Link className="button-link" to="/book">Open booking form</Link>}
      />
      <div className="owner-inline-stats">
        <Badge variant="success">{customers.filter((customer) => customer.status === 'VIP').length} VIP</Badge>
        <Badge variant="default">{customers.filter((customer) => customer.status === 'New').length} new</Badge>
        <Badge variant="default">{customers.filter((customer) => customer.status === 'Needs follow-up').length} follow-up</Badge>
      </div>
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
