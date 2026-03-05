import type {
  BookingPreferencesSettings,
  PaymentChecklistItem,
  PaymentSettings,
} from '@/domain/payments/types';
import { getOwnerPaymentsResource } from '@/features/owner/data';
import type { BillingDraft } from '@/modules/billing/validation';

export type PaymentProcessingStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'blocked';

export interface PaymentOperationItem {
  id: string;
  customerName: string;
  serviceName: string;
  amount: number;
  method: string;
  dueLabel: string;
  reference: string;
  status: PaymentProcessingStatus;
}

export interface PaymentPolicySnapshot {
  collectionMethod: BillingDraft['collectionMethod'];
  depositType: BillingDraft['depositType'];
  depositValue: string;
  requireDepositFor: BillingDraft['requireDepositFor'];
  instructions: string;
}

export interface PaymentPersistenceSnapshot {
  policy: PaymentPolicySnapshot;
  checklist: PaymentChecklistItem[];
  bookingPreferences: BookingPreferencesSettings;
  acceptedPaymentMethodOptions: string[];
  operations: PaymentOperationItem[];
}

export interface PaymentPolicySaveResult {
  policy: PaymentPolicySnapshot;
  savedAt: string;
}

export interface PaymentOperationResult {
  operation: PaymentOperationItem;
  previousStatus: PaymentProcessingStatus;
  savedAt: string;
}

export interface OwnerPaymentsPersistenceClient {
  load(): Promise<PaymentPersistenceSnapshot>;
  savePolicy(policy: PaymentPolicySnapshot): Promise<PaymentPolicySaveResult>;
  transitionOperation(operationId: string, nextStatus: PaymentProcessingStatus): Promise<PaymentOperationResult>;
}

const PAYMENTS_STORAGE_KEY = 'slotra.owner.payments.v1';

function wait(durationMs: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, durationMs);
  });
}

function clonePaymentSettings(settings: PaymentSettings): PaymentSettings {
  return {
    ...settings,
    acceptedMethods: [...settings.acceptedMethods],
  };
}

function toPolicySnapshot(settings: PaymentSettings): PaymentPolicySnapshot {
  return {
    collectionMethod: settings.collectionMethod,
    depositType: settings.depositType,
    depositValue: settings.depositValue,
    requireDepositFor: settings.requireDepositFor,
    instructions: settings.instructions,
  };
}

function clonePolicy(policy: PaymentPolicySnapshot): PaymentPolicySnapshot {
  return { ...policy };
}

function cloneChecklist(checklist: PaymentChecklistItem[]) {
  return checklist.map<PaymentChecklistItem>((item) => ({ ...item }));
}

function cloneOperations(operations: PaymentOperationItem[]) {
  return operations.map<PaymentOperationItem>((item) => ({ ...item }));
}

function cloneSnapshot(snapshot: PaymentPersistenceSnapshot): PaymentPersistenceSnapshot {
  return {
    policy: clonePolicy(snapshot.policy),
    checklist: cloneChecklist(snapshot.checklist),
    bookingPreferences: { ...snapshot.bookingPreferences },
    acceptedPaymentMethodOptions: [...snapshot.acceptedPaymentMethodOptions],
    operations: cloneOperations(snapshot.operations),
  };
}

function createDefaultOperations(): PaymentOperationItem[] {
  return [
    {
      id: 'pay-op-1',
      customerName: 'Anna Mercado',
      serviceName: 'Balayage Refresh',
      amount: 3200,
      method: 'GCash',
      dueLabel: 'Today, 2:30 PM',
      reference: 'GC-20260306-2101',
      status: 'pending',
    },
    {
      id: 'pay-op-2',
      customerName: 'Marco Santos',
      serviceName: 'Haircut + Beard Trim',
      amount: 1200,
      method: 'Cash',
      dueLabel: 'Paid at counter',
      reference: 'POS-20260305-042',
      status: 'paid',
    },
    {
      id: 'pay-op-3',
      customerName: 'Rhea Tolentino',
      serviceName: 'Keratin Package',
      amount: 4800,
      method: 'Bank transfer',
      dueLabel: 'Proof pending',
      reference: 'BT-20260304-993',
      status: 'failed',
    },
    {
      id: 'pay-op-4',
      customerName: 'Jamie Cruz',
      serviceName: 'Starter Color Consult',
      amount: 900,
      method: 'Maya',
      dueLabel: 'Risk review hold',
      reference: 'MY-20260303-101',
      status: 'blocked',
    },
    {
      id: 'pay-op-5',
      customerName: 'Bianca Flores',
      serviceName: 'Skin Glow Bundle',
      amount: 2600,
      method: 'GCash',
      dueLabel: 'Refund completed',
      reference: 'RF-20260302-088',
      status: 'refunded',
    },
  ];
}

function createDefaultSnapshot(): PaymentPersistenceSnapshot {
  const resource = getOwnerPaymentsResource();
  const data = resource.status === 'ready' ? resource.data : null;
  const paymentSettings = clonePaymentSettings(data?.paymentSettings ?? {
    collectionMethod: 'hybrid',
    depositType: 'none',
    depositValue: '0',
    requireDepositFor: 'manual-review',
    acceptedMethods: ['GCash', 'Maya', 'Bank transfer'],
    instructions: 'Collect proof before approving bookings.',
    defaultPolicyLabel: 'Collect manually',
  });

  return {
    policy: toPolicySnapshot(paymentSettings),
    checklist: cloneChecklist(data?.checklist ?? []),
    bookingPreferences: { ...(data?.bookingPreferences ?? { leadTime: '2 hours', cancellationWindow: '12 hours', bookingApproval: 'Manual review' }) },
    acceptedPaymentMethodOptions: [...(data?.acceptedPaymentMethodOptions ?? ['GCash', 'Maya', 'Bank transfer', 'Cash'])],
    operations: createDefaultOperations(),
  };
}

function loadFromStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.sessionStorage.getItem(PAYMENTS_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as PaymentPersistenceSnapshot;
    if (!parsed || !Array.isArray(parsed.operations) || !Array.isArray(parsed.checklist)) {
      return null;
    }
    return cloneSnapshot(parsed);
  } catch {
    return null;
  }
}

function saveToStorage(snapshot: PaymentPersistenceSnapshot) {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(snapshot));
}

function getSnapshot() {
  return loadFromStorage() ?? createDefaultSnapshot();
}

function isAllowedTransition(current: PaymentProcessingStatus, nextStatus: PaymentProcessingStatus) {
  if (current === nextStatus) {
    return false;
  }

  switch (current) {
    case 'pending':
      return nextStatus === 'paid' || nextStatus === 'failed' || nextStatus === 'blocked';
    case 'failed':
      return nextStatus === 'pending' || nextStatus === 'paid' || nextStatus === 'blocked';
    case 'blocked':
      return nextStatus === 'pending' || nextStatus === 'failed';
    case 'paid':
      return nextStatus === 'refunded';
    case 'refunded':
      return false;
    default:
      return false;
  }
}

function getTransitionError(current: PaymentProcessingStatus, nextStatus: PaymentProcessingStatus) {
  if (current === nextStatus) {
    return `This payment is already ${nextStatus}.`;
  }

  if (current === 'refunded') {
    return 'Refunded payments are final. Create a new charge instead.';
  }

  if (current === 'paid' && nextStatus !== 'refunded') {
    return 'Paid payments can only transition to refunded.';
  }

  if (current === 'blocked' && nextStatus === 'paid') {
    return 'Resolve blocked checks first by moving this payment back to pending.';
  }

  return `Transition from ${current} to ${nextStatus} is not allowed.`;
}

export const ownerPaymentsPersistenceClient: OwnerPaymentsPersistenceClient = {
  async load() {
    await wait(170);
    const snapshot = getSnapshot();
    saveToStorage(snapshot);
    return cloneSnapshot(snapshot);
  },
  async savePolicy(policy) {
    await wait(220);
    const snapshot = getSnapshot();
    const nextSnapshot: PaymentPersistenceSnapshot = {
      ...snapshot,
      policy: clonePolicy(policy),
    };
    saveToStorage(nextSnapshot);
    return {
      policy: clonePolicy(policy),
      savedAt: new Date().toISOString(),
    };
  },
  async transitionOperation(operationId, nextStatus) {
    await wait(200);

    const snapshot = getSnapshot();
    const operationIndex = snapshot.operations.findIndex((item) => item.id === operationId);
    if (operationIndex < 0) {
      throw new Error('Payment record was not found. Refresh and retry.');
    }

    const current = snapshot.operations[operationIndex];
    if (!current) {
      throw new Error('Payment record was not found. Refresh and retry.');
    }

    if (!isAllowedTransition(current.status, nextStatus)) {
      throw new Error(getTransitionError(current.status, nextStatus));
    }

    const nextOperation: PaymentOperationItem = {
      ...current,
      status: nextStatus,
      dueLabel: nextStatus === 'pending'
        ? 'Awaiting payment confirmation'
        : nextStatus === 'paid'
          ? 'Paid and reconciled'
          : nextStatus === 'failed'
            ? 'Payment failed, retry needed'
            : nextStatus === 'blocked'
              ? 'Blocked for review'
              : 'Refund completed',
    };

    const nextOperations = [...snapshot.operations];
    nextOperations[operationIndex] = nextOperation;
    const nextSnapshot: PaymentPersistenceSnapshot = {
      ...snapshot,
      operations: nextOperations,
    };
    saveToStorage(nextSnapshot);

    return {
      operation: { ...nextOperation },
      previousStatus: current.status,
      savedAt: new Date().toISOString(),
    };
  },
};
