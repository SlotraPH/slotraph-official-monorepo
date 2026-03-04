export type PaymentCollectionMethod = 'manual-transfer' | 'pay-on-site' | 'hybrid';
export type DepositType = 'none' | 'flat' | 'percentage';
export type DepositRequirement = 'all-bookings' | 'high-value-only' | 'manual-review';
export type PaymentChecklistStatus = 'Ready now' | 'Later phase';

export interface PaymentSettings {
  collectionMethod: PaymentCollectionMethod;
  depositType: DepositType;
  depositValue: string;
  requireDepositFor: DepositRequirement;
  acceptedMethods: string[];
  instructions: string;
  defaultPolicyLabel: string;
}

export interface BookingPreferencesSettings {
  leadTime: string;
  cancellationWindow: string;
  bookingApproval: string;
}

export interface PaymentChecklistItem {
  id: string;
  title: string;
  description: string;
  status: PaymentChecklistStatus;
}

export type PaymentPreferencesDraft = Omit<PaymentSettings, 'defaultPolicyLabel'>;
