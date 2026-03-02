import { PageHeader } from '@slotra/ui';

export function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure your account and business preferences." />
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-8)',
        textAlign: 'center',
        color: 'var(--color-text-muted)',
        fontSize: 'var(--font-size-sm)',
      }}>
        Settings panels coming soon
      </div>
    </div>
  );
}
