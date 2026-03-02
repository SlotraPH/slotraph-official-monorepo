import { PageHeader } from '@slotra/ui';

export function DashboardPage() {
  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Welcome back. Here's an overview of your business." />
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-8)',
        textAlign: 'center',
        color: 'var(--color-text-muted)',
        fontSize: 'var(--font-size-sm)',
      }}>
        Dashboard metrics coming soon
      </div>
    </div>
  );
}
