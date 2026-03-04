import { Badge, SectionCard } from '@slotra/ui';

interface PaymentStatusOverviewProps {
  policyLabel: string;
}

export function PaymentStatusOverview({ policyLabel }: PaymentStatusOverviewProps) {
  return (
    <SectionCard
      title="Current payments scope"
      description="Payments stays lightweight in MVP: manual collection guidance now, live checkout later."
      actions={<Badge variant="warning">Backend deferred</Badge>}
    >
      <div className="owner-status-grid">
        <div className="owner-status-card">
          <span className="owner-status-card__label">Collection mode</span>
          <strong>Manual confirmation</strong>
          <p>Staff records deposits manually after booking requests are approved.</p>
        </div>
        <div className="owner-status-card">
          <span className="owner-status-card__label">Default policy</span>
          <strong>{policyLabel}</strong>
          <p>This setting prepares the team workflow before online checkout is introduced.</p>
        </div>
        <div className="owner-status-card">
          <span className="owner-status-card__label">Accepted methods</span>
          <strong>Cash, bank transfer, GCash proof</strong>
          <p>No automated payout or gateway reconciliation yet.</p>
        </div>
      </div>
    </SectionCard>
  );
}
