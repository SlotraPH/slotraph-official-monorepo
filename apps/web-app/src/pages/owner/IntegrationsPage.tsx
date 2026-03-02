import { PageHeader } from '@slotra/ui';

export function IntegrationsPage() {
    return (
        <div>
            <PageHeader title="Integrations" subtitle="Connect third-party tools and services." />
            <div style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-8)',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                fontSize: 'var(--font-size-sm)',
            }}>
                Integrations view coming soon
            </div>
        </div>
    );
}
