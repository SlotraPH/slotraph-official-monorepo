import { PageHeader } from '@slotra/ui';

export function ServicesPage() {
  return (
    <div>
      <PageHeader title="Services" subtitle="Manage the services customers can book." />
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-8)',
        textAlign: 'center',
        color: 'var(--color-text-muted)',
        fontSize: 'var(--font-size-sm)',
      }}>
        Services list coming soon
      </div>
    </div>
  );
}
