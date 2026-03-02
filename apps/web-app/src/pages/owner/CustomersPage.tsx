import { PageHeader } from '@slotra/ui';

export function CustomersPage() {
  return (
    <div>
      <PageHeader title="Customers" subtitle="Manage your customer contacts and history." />
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-8)',
        textAlign: 'center',
        color: 'var(--color-text-muted)',
        fontSize: 'var(--font-size-sm)',
      }}>
        Customer list coming soon
      </div>
    </div>
  );
}
