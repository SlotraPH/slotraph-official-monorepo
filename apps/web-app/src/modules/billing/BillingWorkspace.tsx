import { useState } from 'react';
import { BadgeCent, ClipboardCheck, Landmark, ReceiptText } from 'lucide-react';
import { AppPill, OwnerPageScaffold, PageIntro } from '@/app/components/PageTemplates';
import { RouteStateCard } from '@/app/components/RouteStateCard';
import { mockOwnerRouteClient } from '@/features/owner/routeClient';
import { FlowLayout, FlowSection, ReviewBlock, StatusTabs } from '@/modules/shared/flow/FlowScaffolds';
import {
  BrandButton,
  BrandSelect,
  BrandTextarea,
  Card,
  SaveStateIndicator,
  colors,
  radii,
  spacing,
  typography,
  useBrandToast,
  type SaveStateStatus,
} from '@/ui';
import { type BillingDraft, validateBillingField, validateBillingForm } from './validation';

type BillingView = 'collection' | 'checklist';

export function BillingWorkspace() {
  const resource = mockOwnerRouteClient.getPaymentsQuery();
  const toast = useBrandToast();
  const [view, setView] = useState<BillingView>('collection');
  const [draft, setDraft] = useState<BillingDraft>(() => {
    if (resource.status !== 'success') {
      return {
        collectionMethod: 'hybrid',
        depositType: 'none',
        depositValue: '0',
        requireDepositFor: 'manual-review',
        instructions: '',
      };
    }

    return {
      collectionMethod: resource.data.paymentSettings.collectionMethod,
      depositType: resource.data.paymentSettings.depositType,
      depositValue: resource.data.paymentSettings.depositValue,
      requireDepositFor: resource.data.paymentSettings.requireDepositFor,
      instructions: resource.data.paymentSettings.instructions,
    };
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [saveState, setSaveState] = useState<SaveStateStatus>('idle');
  const [lastSavedLabel, setLastSavedLabel] = useState('Saved');

  if (resource.status === 'loading') {
    return <RouteStateCard title="Loading payment settings" description="Preparing deposit and collection defaults." variant="loading" />;
  }

  if (resource.status === 'error') {
    return <RouteStateCard title="Payments unavailable" description={resource.message} variant="error" onRetry={() => window.location.reload()} />;
  }

  const { checklist, paymentSettings } = resource.data;

  function setField<K extends keyof BillingDraft>(field: K, value: BillingDraft[K]) {
    const nextDraft = { ...draft, [field]: value };
    setDraft(nextDraft);
    setSaveState('idle');
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: validateBillingField(nextDraft, field),
    }));
  }

  function handleBlur(field: keyof BillingDraft) {
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: validateBillingField(draft, field),
    }));
  }

  function handleSave() {
    const nextErrors = validateBillingForm(draft);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      setSaveState('failed');
      return;
    }

    setSaveState('saving');
    setLastSavedLabel(`Saved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    setSaveState('saved');
    toast.success({
      title: 'Billing policy updated',
      description: 'Collection instructions and deposit defaults were saved to the local billing preview.',
    });
  }

  return (
    <OwnerPageScaffold>
      <PageIntro
        eyebrow="Billing"
        title="Payments and billing views"
        description="Keep billing honest for the current MVP: branded policy controls, checklist visibility, and a clear statement of what still runs manually."
        pills={(
          <>
            <AppPill tone="warning">Manual collection</AppPill>
            <AppPill>{checklist.filter((item) => item.status === 'Ready now').length} ready now</AppPill>
            <SaveStateIndicator status={saveState} savedLabel={lastSavedLabel} onRetry={handleSave} />
          </>
        )}
      />

      <FlowSection eyebrow="Billing views" title="Collection and rollout status" description="Switch between policy editing and the implementation checklist without leaving the billing workspace.">
        <StatusTabs current={view} onChange={setView} options={[
          { label: 'Collection', value: 'collection' },
          { label: 'Checklist', value: 'checklist' },
        ]} />
      </FlowSection>

      <FlowLayout
        sidebar={(
          <FlowSection eyebrow="Billing summary" title="Current defaults" description="These settings drive the current owner-facing payment messaging and customer follow-up copy.">
            <ReviewBlock
              items={[
                { label: 'Collection method', value: paymentSettings.collectionMethod },
                { label: 'Deposit type', value: paymentSettings.depositType },
                { label: 'Default policy', value: paymentSettings.defaultPolicyLabel },
              ]}
              title="Policy snapshot"
            />
          </FlowSection>
        )}
      >
        {view === 'collection' ? (
          <FlowSection eyebrow="Collection policy" title="Deposit and payment instructions" description="Each field validates on blur. The instruction block is required so staff always has a usable handoff message.">
            <div style={{ display: 'grid', gap: spacing[4], gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
              <BrandSelect label="Collection method" value={draft.collectionMethod} onChange={(event) => setField('collectionMethod', event.target.value as BillingDraft['collectionMethod'])}>
                <option value="manual-transfer">Manual transfer</option>
                <option value="pay-on-site">Pay on site</option>
                <option value="hybrid">Hybrid</option>
              </BrandSelect>
              <BrandSelect label="Deposit type" value={draft.depositType} onChange={(event) => setField('depositType', event.target.value as BillingDraft['depositType'])}>
                <option value="none">No deposit</option>
                <option value="flat">Flat amount</option>
                <option value="percentage">Percentage</option>
              </BrandSelect>
              <BrandSelect label="Require deposit for" value={draft.requireDepositFor} onChange={(event) => setField('requireDepositFor', event.target.value as BillingDraft['requireDepositFor'])}>
                <option value="all-bookings">All bookings</option>
                <option value="high-value-only">High-value only</option>
                <option value="manual-review">Manual review</option>
              </BrandSelect>
              <BrandSelect
                error={errors.depositValue}
                helperText={draft.depositType === 'none' ? 'No deposit is currently required.' : 'Use a peso amount or percentage number only.'}
                label="Deposit value"
                value={draft.depositValue}
                onBlur={() => handleBlur('depositValue')}
                onChange={(event) => setField('depositValue', event.target.value)}
              >
                {draft.depositType === 'percentage' ? (
                  <>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="75">75</option>
                  </>
                ) : (
                  <>
                    <option value="0">0</option>
                    <option value="500">500</option>
                    <option value="1000">1000</option>
                    <option value="1500">1500</option>
                  </>
                )}
              </BrandSelect>
            </div>
            <BrandTextarea
              error={errors.instructions}
              label="Staff payment instructions"
              value={draft.instructions}
              onBlur={() => handleBlur('instructions')}
              onChange={(event) => setField('instructions', event.target.value)}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[3] }}>
              <BrandButton startIcon={<BadgeCent size={15} />} onClick={handleSave}>
                Save billing policy
              </BrandButton>
              <BrandButton variant="secondary" startIcon={<ReceiptText size={15} />}>
                Share team instructions
              </BrandButton>
            </div>
          </FlowSection>
        ) : (
          <FlowSection eyebrow="Implementation checklist" title="What is live versus deferred" description="The checklist keeps scope explicit so billing UI does not imply unavailable payment automation.">
            <div style={{ display: 'grid', gap: spacing[3] }}>
              {checklist.map((item) => (
                <Card key={item.id} padding={4}>
                  <div style={{ alignItems: 'start', display: 'grid', gap: spacing[3], gridTemplateColumns: 'auto minmax(0, 1fr) auto' }}>
                    <div
                      aria-hidden="true"
                      style={{
                        alignItems: 'center',
                        background: item.status === 'Ready now' ? 'rgba(46,49,146,0.08)' : 'rgba(122,135,153,0.12)',
                        borderRadius: radii.lg,
                        color: item.status === 'Ready now' ? colors.brand : colors.secondary,
                        display: 'inline-flex',
                        height: 40,
                        justifyContent: 'center',
                        width: 40,
                      }}
                    >
                      {item.status === 'Ready now' ? <ClipboardCheck size={20} /> : <Landmark size={20} />}
                    </div>
                    <div style={{ display: 'grid', gap: 2 }}>
                      <strong style={{ color: colors.navy, fontFamily: typography.fontFamily }}>{item.title}</strong>
                      <span style={{ color: colors.secondary, fontFamily: typography.fontFamily, ...typography.bodySmall }}>{item.description}</span>
                    </div>
                    <Tag text={item.status} />
                  </div>
                </Card>
              ))}
            </div>
          </FlowSection>
        )}
      </FlowLayout>
    </OwnerPageScaffold>
  );
}

function Tag({ text }: { text: string }) {
  return (
    <span
      style={{
        background: 'rgba(46,49,146,0.08)',
        borderRadius: radii.full,
        color: colors.brand,
        display: 'inline-flex',
        fontFamily: typography.fontFamily,
        fontSize: typography.label.fontSize,
        fontWeight: 600,
        justifyContent: 'center',
        padding: '6px 10px',
      }}
    >
      {text}
    </span>
  );
}
