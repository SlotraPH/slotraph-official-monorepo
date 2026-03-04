export interface IntegrationWorkflow {
  id: string;
  name: string;
  category: string;
  summary: string;
  state: 'Configured' | 'Planned' | 'Deferred';
  scope: string;
}

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
