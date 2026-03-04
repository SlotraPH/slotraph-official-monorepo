import { PageHeader } from '@slotra/ui';
import { DashboardActivityFeed } from './dashboard/DashboardActivityFeed';
import { DashboardQuickActions } from './dashboard/DashboardQuickActions';
import { DashboardSummaryCards } from './dashboard/DashboardSummaryCards';
import { DashboardUpcomingBookings } from './dashboard/DashboardUpcomingBookings';
import {
  DASHBOARD_ACTIVITY,
  DASHBOARD_QUICK_ACTIONS,
  DASHBOARD_SUMMARY,
  UPCOMING_BOOKINGS,
} from './mockOwnerData';

export function DashboardPage() {
  return (
    <div className="owner-page-stack">
      <PageHeader title="Dashboard" subtitle="Welcome back. Here's an overview of your business." />
      <DashboardSummaryCards items={DASHBOARD_SUMMARY} />
      <div className="owner-two-column-layout">
        <DashboardUpcomingBookings bookings={UPCOMING_BOOKINGS} />
        <DashboardQuickActions actions={DASHBOARD_QUICK_ACTIONS} />
      </div>
      <DashboardActivityFeed items={DASHBOARD_ACTIVITY} />
    </div>
  );
}
