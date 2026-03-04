import type {
  BookingPreferencesSettings,
  PaymentChecklistItem,
  PaymentSettings,
} from '@/domain/payments/types';

export const OWNER_PAYMENT_SETTINGS: PaymentSettings = {
  collectionMethod: 'hybrid',
  depositType: 'percentage',
  depositValue: '30',
  requireDepositFor: 'high-value-only',
  acceptedMethods: ['GCash', 'Maya', 'Bank transfer'],
  instructions: 'Ask customers to send proof of payment before confirming high-ticket bookings.',
  defaultPolicyLabel: 'Collect 50% deposit manually',
};

export const OWNER_BOOKING_PREFERENCES: BookingPreferencesSettings = {
  leadTime: '2 hours',
  cancellationWindow: '12 hours',
  bookingApproval: 'Manual review',
};

export const OWNER_PAYMENT_CHECKLIST: PaymentChecklistItem[] = [
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

export const PAYMENT_METHOD_OPTIONS = ['GCash', 'Maya', 'Bank transfer', 'Cash'];
export const TIMEZONE_OPTIONS = ['Asia/Manila', 'Asia/Singapore', 'Asia/Hong_Kong'];
