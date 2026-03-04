import { PageIntro } from '@/app/components/PageTemplates';
import { RouteStateCard } from '@/app/components/RouteStateCard';
import { getOwnerDashboardResource } from '@/features/owner/data';
import { DashboardActivityFeed } from './dashboard/DashboardActivityFeed';
import { DashboardQuickActions } from './dashboard/DashboardQuickActions';
import { DashboardSummaryCards } from './dashboard/DashboardSummaryCards';
import { DashboardUpcomingBookings } from './dashboard/DashboardUpcomingBookings';

export function DashboardPage() {
  const resource = getOwnerDashboardResource();

  if (resource.status === 'loading') {
    return <RouteStateCard title="Loading dashboard" description="Preparing owner metrics and upcoming bookings." variant="loading" />;
  }

  if (resource.status === 'error') {
    return <RouteStateCard title="Dashboard unavailable" description={resource.message} variant="error" />;
  }

  const { activity, bookings, quickActions, summary } = resource.data;

  return (
    <div className="owner-page-stack">
      <PageIntro
        eyebrow="Owner dashboard"
        title="Business overview"
        description="Track upcoming bookings, recent activity, and the current setup posture from one branded workspace shell."
      />
      <DashboardSummaryCards items={summary} />
      <div className="owner-two-column-layout">
        <DashboardUpcomingBookings bookings={bookings} />
        <DashboardQuickActions actions={quickActions} />
      </div>
      <DashboardActivityFeed items={activity} />
    </div>
  );
}
