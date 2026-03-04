import { useState } from 'react';
import { Badge, Button, PageHeader } from '@slotra/ui';
import { CustomerDetailPanel } from './customers/CustomerDetailPanel';
import { CustomerImportCallout } from './customers/CustomerImportCallout';
import { CustomerList } from './customers/CustomerList';
import { CustomerToolbar } from './customers/CustomerToolbar';
import { OWNER_CUSTOMERS } from './mockOwnerData';

export function CustomersPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [selectedId, setSelectedId] = useState<string | null>(OWNER_CUSTOMERS[0]?.id ?? null);

  const filtered = OWNER_CUSTOMERS.filter((customer) => {
    const haystack = `${customer.name} ${customer.email} ${customer.tags.join(' ')}`.toLowerCase();
    return (status === 'All' || customer.status === status) && haystack.includes(query.toLowerCase());
  });

  const selectedCustomer = filtered.find((customer) => customer.id === selectedId)
    ?? OWNER_CUSTOMERS.find((customer) => customer.id === selectedId)
    ?? null;

  return (
    <div className="owner-page-stack">
      <PageHeader
        title="Customers"
        subtitle="View and manage your customer base."
        actions={<Button variant="primary" size="sm">Add customer</Button>}
      />
      <div className="owner-inline-stats">
        <Badge variant="success">{OWNER_CUSTOMERS.filter((customer) => customer.status === 'VIP').length} VIP</Badge>
        <Badge variant="default">{OWNER_CUSTOMERS.filter((customer) => customer.status === 'New').length} new</Badge>
        <Badge variant="default">{OWNER_CUSTOMERS.filter((customer) => customer.status === 'Needs follow-up').length} follow-up</Badge>
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
