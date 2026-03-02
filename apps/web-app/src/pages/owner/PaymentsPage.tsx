import { PageHeader } from '@slotra/ui';

export function PaymentsPage() {
    return (
        <div>
            <PageHeader title="Payments" subtitle="Track revenue and manage payment settings." />
            <div style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-8)',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                fontSize: 'var(--font-size-sm)',
            }}>
                Payments view coming soon
            </div>
        </div>
    );
}
