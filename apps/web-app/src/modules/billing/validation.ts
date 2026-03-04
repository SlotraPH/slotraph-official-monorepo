import type { DepositRequirement, DepositType, PaymentCollectionMethod } from '@/domain/payments/types';

export interface BillingDraft {
  collectionMethod: PaymentCollectionMethod;
  depositType: DepositType;
  depositValue: string;
  requireDepositFor: DepositRequirement;
  instructions: string;
}

export type BillingErrors = Partial<Record<keyof BillingDraft, string>>;

export function validateBillingField(draft: BillingDraft, field: keyof BillingDraft) {
  if (field === 'instructions') {
    return draft.instructions.trim() ? undefined : 'Enter staff payment instructions.';
  }

  if (field === 'depositValue' && draft.depositType !== 'none') {
    if (!draft.depositValue.trim()) {
      return 'Enter a deposit value.';
    }
    return /^\d+(\.\d+)?$/.test(draft.depositValue) ? undefined : 'Use numbers only for the deposit value.';
  }

  return undefined;
}

export function validateBillingForm(draft: BillingDraft) {
  return {
    depositValue: validateBillingField(draft, 'depositValue'),
    instructions: validateBillingField(draft, 'instructions'),
  } satisfies BillingErrors;
}
