export interface DashboardSummary {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  hint: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  timeLabel: string;
}

export const DASHBOARD_SUMMARY: DashboardSummary[] = [
  {
    id: 'bookings',
    label: 'This week bookings',
    value: '42',
    change: '+8 vs last week',
    trend: 'up',
    hint: '7 are first-time customers.',
  },
  {
    id: 'revenue',
    label: 'Projected revenue',
    value: 'PHP 26,400',
    change: '+12%',
    trend: 'up',
    hint: 'Based on confirmed bookings only.',
  },
  {
    id: 'utilization',
    label: 'Staff utilization',
    value: '78%',
    change: 'Steady',
    trend: 'neutral',
    hint: 'Peak window is 3 PM to 7 PM.',
  },
  {
    id: 'no-show',
    label: 'Deposit follow-ups',
    value: '3',
    change: '-2 open',
    trend: 'down',
    hint: 'Manual reminders still required.',
  },
];

export const DASHBOARD_QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'new-service',
    title: 'Create a new service',
    description: 'Add a new offering with price, duration, and visibility.',
  },
  {
    id: 'new-customer',
    title: 'Add a customer',
    description: 'Capture contact details and notes before their first booking.',
  },
  {
    id: 'availability',
    title: 'Review availability',
    description: 'Update hours and booking buffers before the weekend rush.',
  },
];

export const DASHBOARD_ACTIVITY: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Three bookings still need deposit confirmation',
    detail: 'Payments are still manually tracked in this phase.',
    timeLabel: 'Updated 12 minutes ago',
  },
  {
    id: 'act-2',
    title: 'Customer return rate is strongest for haircut bundles',
    detail: 'Bundle services are driving repeat visits from VIP customers.',
    timeLabel: 'Weekly insight',
  },
  {
    id: 'act-3',
    title: 'Next action: set team notification defaults',
    detail: 'Reminder channels are configurable in Settings.',
    timeLabel: 'Recommended',
  },
];
