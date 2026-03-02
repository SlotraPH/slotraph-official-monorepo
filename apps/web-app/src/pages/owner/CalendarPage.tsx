import { PageHeader } from '@slotra/ui';

export function CalendarPage() {
    return (
        <div>
            <PageHeader title="Calendar" subtitle="View and manage your appointments." />
            <div style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-8)',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                fontSize: 'var(--font-size-sm)',
            }}>
                Calendar view coming soon
            </div>
        </div>
    );
}
