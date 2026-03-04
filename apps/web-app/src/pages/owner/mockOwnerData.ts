export interface DashboardSummary {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  hint: string;
}

export interface UpcomingBooking {
  id: string;
  customerName: string;
  serviceName: string;
  staffName: string;
  startTime: string;
  duration: string;
  status: 'confirmed' | 'deposit due' | 'follow-up';
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

export interface ServiceRecord {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  price: number;
  visibility: 'Public' | 'Private';
  status: 'Active' | 'Hidden' | 'Archived';
  bookings: number;
  description: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'VIP' | 'Active' | 'New' | 'Needs follow-up';
  lastVisit: string;
  totalVisits: number;
  totalSpend: number;
  upcomingBooking: string;
  source: string;
  notes: string;
  tags: string[];
}

export interface PaymentChecklistItem {
  id: string;
  title: string;
  description: string;
  status: 'Ready now' | 'Later phase';
}

export interface IntegrationWorkflow {
  id: string;
  name: string;
  category: string;
  summary: string;
  state: 'Configured' | 'Planned' | 'Deferred';
  scope: string;
}

export interface TeamMemberRecord {
  id: string;
  name: string;
  role: string;
  services: string[];
  schedule: string;
  status: 'Active' | 'Invite pending';
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

export const UPCOMING_BOOKINGS: UpcomingBooking[] = [
  {
    id: 'bk-101',
    customerName: 'Anna Mercado',
    serviceName: 'Color Retouch',
    staffName: 'Dheyn',
    startTime: 'Today, 1:30 PM',
    duration: '90 min',
    status: 'confirmed',
  },
  {
    id: 'bk-102',
    customerName: 'Marco Santos',
    serviceName: 'Haircut & Beard Trim',
    staffName: 'Kai',
    startTime: 'Today, 4:00 PM',
    duration: '60 min',
    status: 'deposit due',
  },
  {
    id: 'bk-103',
    customerName: 'Rhea Tolentino',
    serviceName: 'Brazilian Blowout',
    staffName: 'Dheyn',
    startTime: 'Tomorrow, 10:00 AM',
    duration: '2 hrs',
    status: 'follow-up',
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

export const OWNER_SERVICES: ServiceRecord[] = [
  {
    id: 'svc-1',
    name: 'Haircut & Style',
    category: 'Hair',
    durationMinutes: 45,
    price: 350,
    visibility: 'Public',
    status: 'Active',
    bookings: 142,
    description: 'Classic cut with wash, style, and finishing product.',
  },
  {
    id: 'svc-2',
    name: 'Beard Trim',
    category: 'Grooming',
    durationMinutes: 30,
    price: 200,
    visibility: 'Public',
    status: 'Active',
    bookings: 87,
    description: 'Shape, line-up, and hot towel finish.',
  },
  {
    id: 'svc-3',
    name: 'Color & Highlights',
    category: 'Color',
    durationMinutes: 120,
    price: 1200,
    visibility: 'Private',
    status: 'Hidden',
    bookings: 34,
    description: 'Consultation-led service with toner and styling finish.',
  },
  {
    id: 'svc-4',
    name: 'Scalp Treatment',
    category: 'Wellness',
    durationMinutes: 40,
    price: 650,
    visibility: 'Public',
    status: 'Archived',
    bookings: 9,
    description: 'Seasonal treatment paused until supplies are restocked.',
  },
];

export const OWNER_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'cus-1',
    name: 'Anna Mercado',
    email: 'anna@example.com',
    phone: '+63 917 555 1408',
    status: 'VIP',
    lastVisit: 'Feb 28',
    totalVisits: 14,
    totalSpend: 10200,
    upcomingBooking: 'Today, 1:30 PM',
    source: 'Instagram',
    notes: 'Prefers ash tones and late afternoon slots.',
    tags: ['Color loyalist', 'Deposit-friendly'],
  },
  {
    id: 'cus-2',
    name: 'Marco Santos',
    email: 'marco@example.com',
    phone: '+63 917 555 1840',
    status: 'Active',
    lastVisit: 'Feb 24',
    totalVisits: 7,
    totalSpend: 3050,
    upcomingBooking: 'Today, 4:00 PM',
    source: 'Walk-in',
    notes: 'Usually books haircut and beard trim together.',
    tags: ['Weekend regular'],
  },
  {
    id: 'cus-3',
    name: 'Rhea Tolentino',
    email: 'rhea@example.com',
    phone: '+63 918 555 9012',
    status: 'Needs follow-up',
    lastVisit: 'Jan 30',
    totalVisits: 3,
    totalSpend: 4200,
    upcomingBooking: 'Tomorrow, 10:00 AM',
    source: 'Referral',
    notes: 'Requested reminder before confirming large-ticket services.',
    tags: ['High-touch'],
  },
  {
    id: 'cus-4',
    name: 'Jamie Cruz',
    email: 'jamie@example.com',
    phone: '+63 915 555 4455',
    status: 'New',
    lastVisit: 'First booking pending',
    totalVisits: 0,
    totalSpend: 0,
    upcomingBooking: 'Mar 8, 11:00 AM',
    source: 'Google search',
    notes: 'First-time client interested in package recommendations.',
    tags: ['First visit'],
  },
];

export const PAYMENT_CHECKLIST: PaymentChecklistItem[] = [
  {
    id: 'manual-policy',
    title: 'Choose a default deposit policy',
    description: 'You can already define how staff should collect deposits manually.',
    status: 'Ready now',
  },
  {
    id: 'proof-flow',
    title: 'Standardize proof-of-payment handling',
    description: 'Document where your team verifies GCash, Maya, or bank transfer receipts.',
    status: 'Ready now',
  },
  {
    id: 'gateway',
    title: 'Connect a payment gateway',
    description: 'Live checkout and automated payouts remain out of scope for this phase.',
    status: 'Later phase',
  },
];

export const INTEGRATION_WORKFLOWS: IntegrationWorkflow[] = [
  {
    id: 'gcal',
    name: 'Google Calendar',
    category: 'Scheduling',
    summary: 'Used as the first live sync target for owner calendar visibility.',
    state: 'Configured',
    scope: 'Important for MVP operations',
  },
  {
    id: 'meta',
    name: 'Instagram lead handoff',
    category: 'Lead capture',
    summary: 'Not a technical integration yet; this is a workflow reminder to tag incoming DMs.',
    state: 'Planned',
    scope: 'Manual workflow only',
  },
  {
    id: 'payments',
    name: 'GCash / Maya checkout',
    category: 'Payments',
    summary: 'Tracked as a dependency for a later backend-backed payments phase.',
    state: 'Deferred',
    scope: 'No live connection in MVP',
  },
];

export const INTEGRATION_ROADMAP = [
  'Two-way calendar sync beyond Google Calendar',
  'Automated messaging via Viber or WhatsApp',
  'CRM sync for high-volume customer segments',
  'Payment gateway activation once backend contracts exist',
];

export const TEAM_MEMBERS: TeamMemberRecord[] = [
  {
    id: 'tm-1',
    name: 'Dheyn Ramos',
    role: 'Owner / Lead Barber',
    services: ['Haircut & Style', 'Color & Highlights'],
    schedule: 'Tue-Sun, 10 AM to 7 PM',
    status: 'Active',
  },
  {
    id: 'tm-2',
    name: 'Kai Flores',
    role: 'Junior Barber',
    services: ['Haircut & Style', 'Beard Trim'],
    schedule: 'Wed-Sun, 11 AM to 8 PM',
    status: 'Active',
  },
  {
    id: 'tm-3',
    name: 'Sam Bautista',
    role: 'Front desk',
    services: ['Customer support'],
    schedule: 'Mon-Sat, 9 AM to 6 PM',
    status: 'Invite pending',
  },
];
