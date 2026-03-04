import { EmptyState } from '@slotra/ui';

export function PaymentLimitations() {
  return (
    <EmptyState
      align="left"
      title="Intentionally mocked until later phases"
      description="Live card checkout, auto-refunds, payout tracking, and reconciliation stay out of scope until backend contracts and authentication exist."
      className="owner-inline-empty-state"
    />
  );
}
