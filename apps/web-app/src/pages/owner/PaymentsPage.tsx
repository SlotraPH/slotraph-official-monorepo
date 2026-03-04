import { useState } from 'react';
import { RouteStateCard } from '@/app/components/RouteStateCard';
import { AppPill, PageIntro } from '@/app/components/PageTemplates';
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
      <PageIntro
        eyebrow="Payments"
        title="Payment setup"
        description="Keep the payments story operational and honest for MVP: what is configured, what still needs manual collection, and what remains out of scope."
        pills={(
          <AppPill tone="warning">
            {paymentSettings.collectionMethod === 'hybrid' ? 'Manual collection' : 'Scoped setting'}
          </AppPill>
        )}
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
