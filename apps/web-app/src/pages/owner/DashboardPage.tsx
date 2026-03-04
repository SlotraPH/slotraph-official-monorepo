import { EmptyState, PageHeader, SectionCard } from '@slotra/ui';

export function DashboardPage() {
  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Welcome back. Here's an overview of your business." />
      <SectionCard title="Overview" description="Summary cards and business activity land here in a later phase.">
        <EmptyState
          title="Dashboard metrics coming soon"
          description="Phase 1 keeps this as a placeholder while consolidating reusable owner UI."
          className="dashboard-empty-state"
        />
      </SectionCard>
    </div>
  );
}
