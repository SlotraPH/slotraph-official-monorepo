import { useState } from 'react';
import { Badge, PageHeader } from '@slotra/ui';
import { RouteStateCard } from '@/app/components/RouteStateCard';
import { getOwnerPaymentsResource } from '@/features/owner/data';
import { PaymentChecklist } from './payments/PaymentChecklist';
import { PaymentLimitations } from './payments/PaymentLimitations';
import { PaymentPolicyPanel } from './payments/PaymentPolicyPanel';
import { PaymentStatusOverview } from './payments/PaymentStatusOverview';

export function PaymentsPage() {
  const resource = getOwnerPaymentsResource();
  const [policy, setPolicy] = useState(
    () => (resource.status === 'ready' ? resource.data.paymentSettings.defaultPolicyLabel : '')
  );

  if (resource.status === 'loading') {
    return <RouteStateCard title="Loading payment settings" description="Preparing deposit and collection defaults." variant="loading" />;
  }

  if (resource.status === 'error') {
    return <RouteStateCard title="Payments unavailable" description={resource.message} variant="error" />;
  }

  const { checklist, paymentSettings } = resource.data;

  return (
    <div className="owner-page-stack">
      <PageHeader
        title="Payments"
        subtitle="Owner-facing payment setup is intentionally scoped to operational settings for MVP."
        actions={<Badge variant="warning">{paymentSettings.collectionMethod === 'hybrid' ? 'Manual collection' : 'Scoped setting'}</Badge>}
      />
      <PaymentStatusOverview policyLabel={policy} />
      <div className="owner-two-column-layout">
        <PaymentPolicyPanel value={policy} onChange={setPolicy} />
        <PaymentChecklist items={checklist} />
      </div>
      <PaymentLimitations />
    </div>
  );
}
