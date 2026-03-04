import { useState } from 'react';
import { Badge, PageHeader } from '@slotra/ui';
import { PaymentChecklist } from './payments/PaymentChecklist';
import { PaymentLimitations } from './payments/PaymentLimitations';
import { PaymentPolicyPanel } from './payments/PaymentPolicyPanel';
import { PaymentStatusOverview } from './payments/PaymentStatusOverview';
import { PAYMENT_CHECKLIST } from './mockOwnerData';

export function PaymentsPage() {
  const [policy, setPolicy] = useState('Collect 50% deposit manually');

  return (
    <div className="owner-page-stack">
      <PageHeader
        title="Payments"
        subtitle="Owner-facing payment setup is intentionally scoped to operational settings for MVP."
        actions={<Badge variant="warning">Manual collection</Badge>}
      />
      <PaymentStatusOverview policyLabel={policy} />
      <div className="owner-two-column-layout">
        <PaymentPolicyPanel value={policy} onChange={setPolicy} />
        <PaymentChecklist items={PAYMENT_CHECKLIST} />
      </div>
      <PaymentLimitations />
    </div>
  );
}
