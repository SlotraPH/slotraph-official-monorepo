import { AlertTriangle, BadgeCent, ClipboardCheck, Landmark, ReceiptText, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AppPill, OwnerPageScaffold, PageIntro } from '@/app/components/PageTemplates';
import { RouteStateCard } from '@/app/components/RouteStateCard';
import { ownerPaymentsPersistenceClient, type PaymentOperationItem, type PaymentProcessingStatus } from '@/features/owner/payments/persistenceClient';
import { FlowLayout, FlowSection, ReviewBlock, StatusTabs } from '@/modules/shared/flow/FlowScaffolds';
import {
  BrandButton,
  BrandSelect,
  BrandTextarea,
  Card,
  SaveStateIndicator,
  StatusTag,
  colors,
  radii,
  spacing,
  typography,
  useBrandToast,
  type SaveStateStatus,
} from '@/ui';
import { type BillingDraft, validateBillingField, validateBillingForm } from './validation';

type BillingView = 'activity' | 'collection' | 'checklist';

function createDefaultDraft(): BillingDraft {
  return {
    collectionMethod: 'hybrid',
    depositType: 'none',
    depositValue: '0',
    requireDepositFor: 'manual-review',
    instructions: '',
  };
}

export function BillingWorkspace() {
  const toast = useBrandToast();
  const [sessionStatus, setSessionStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [sessionMessage, setSessionMessage] = useState('Loading payment operations...');
  const [view, setView] = useState<BillingView>('activity');
  const [draft, setDraft] = useState<BillingDraft>(createDefaultDraft);
  const [checklist, setChecklist] = useState<Array<{ id: string; title: string; description: string; status: 'Ready now' | 'Later phase' }>>([]);
  const [operations, setOperations] = useState<PaymentOperationItem[]>([]);
  const [acceptedMethods, setAcceptedMethods] = useState<string[]>([]);
  const [bookingPolicyLabel, setBookingPolicyLabel] = useState('Manual review');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [saveState, setSaveState] = useState<SaveStateStatus>('saved');
  const [lastSavedLabel, setLastSavedLabel] = useState('Waiting for first save');
  const [pendingPolicyDraft, setPendingPolicyDraft] = useState<BillingDraft | null>(null);
  const [actionInFlightOperationId, setActionInFlightOperationId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [lastOperationTransition, setLastOperationTransition] = useState<{
    operationId: string;
    customerName: string;
    previousStatus: PaymentProcessingStatus;
    nextStatus: PaymentProcessingStatus;
  } | null>(null);

  async function hydratePayments() {
    setSessionStatus('loading');
    setSessionMessage('Loading payment operations...');
    setActionError(null);

    try {
      const snapshot = await ownerPaymentsPersistenceClient.load();
      setDraft({
        collectionMethod: snapshot.policy.collectionMethod,
        depositType: snapshot.policy.depositType,
        depositValue: snapshot.policy.depositValue,
        requireDepositFor: snapshot.policy.requireDepositFor,
        instructions: snapshot.policy.instructions,
      });
      setChecklist(snapshot.checklist);
      setOperations(snapshot.operations);
      setAcceptedMethods(snapshot.acceptedPaymentMethodOptions);
      setBookingPolicyLabel(snapshot.bookingPreferences.bookingApproval);
      setSaveState('saved');
      setLastSavedLabel('Policy restored');
      setSessionStatus('ready');
      setSessionMessage('');
    } catch {
      setSessionStatus('error');
      setSessionMessage('Could not load payment operations. Retry to restore billing policy and payment activity.');
    }
  }

  useEffect(() => {
    void hydratePayments();
  }, []);

  if (sessionStatus === 'loading') {
    return <RouteStateCard title="Loading payment settings" description="Preparing policy, checklist, and transaction states." variant="loading" />;
  }

  if (sessionStatus === 'error') {
    return <RouteStateCard title="Payments unavailable" description={sessionMessage} variant="error" onRetry={() => void hydratePayments()} />;
  }

  const operationsByStatus = (() => {
    const base = {
      pending: 0,
      paid: 0,
      failed: 0,
      refunded: 0,
      blocked: 0,
    };

    for (const operation of operations) {
      base[operation.status] += 1;
    }

    return base;
  })();

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

  async function persistPolicy(draftToSave: BillingDraft) {
    setSaveState('saving');
    setPendingPolicyDraft(draftToSave);

    try {
      const result = await ownerPaymentsPersistenceClient.savePolicy(draftToSave);
      setDraft({
        collectionMethod: result.policy.collectionMethod,
        depositType: result.policy.depositType,
        depositValue: result.policy.depositValue,
        requireDepositFor: result.policy.requireDepositFor,
        instructions: result.policy.instructions,
      });
      setPendingPolicyDraft(null);
      setSaveState('saved');
      setLastSavedLabel(`Saved at ${new Date(result.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      toast.success({
        title: 'Payment policy saved',
        description: 'Collection defaults are now aligned for owner and staff workflows.',
      });
    } catch {
      setSaveState('failed');
      toast.error({
        title: 'Policy save failed',
        description: 'Retry to keep payment collection policy changes.',
      });
    }
  }

  function handleSave() {
    const nextErrors = validateBillingForm(draft);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      setSaveState('failed');
      return;
    }

    void persistPolicy(draft);
  }

  function retrySave() {
    if (!pendingPolicyDraft) {
      return;
    }

    void persistPolicy(pendingPolicyDraft);
  }

  async function transitionOperation(
    operation: PaymentOperationItem,
    nextStatus: PaymentProcessingStatus,
    options: { trackUndo: boolean; successTitle?: string } = { trackUndo: true },
  ) {
    setActionInFlightOperationId(operation.id);
    setActionError(null);

    try {
      const result = await ownerPaymentsPersistenceClient.transitionOperation(operation.id, nextStatus);
      setOperations((current) => current.map((item) => (item.id === operation.id ? result.operation : item)));

      if (options.trackUndo) {
        setLastOperationTransition({
          operationId: operation.id,
          customerName: operation.customerName,
          previousStatus: result.previousStatus,
          nextStatus: result.operation.status,
        });
      }

      toast.success({
        title: options.successTitle ?? 'Payment status updated',
        description: `${operation.customerName} payment moved to ${result.operation.status}.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not update payment status. Retry this action.';
      setActionError(message);
      toast.error({
        title: 'Payment action failed',
        description: message,
      });
    } finally {
      setActionInFlightOperationId(null);
    }
  }

  async function handleUndoOperation() {
    if (!lastOperationTransition) {
      return;
    }

    const operation = operations.find((item) => item.id === lastOperationTransition.operationId);
    if (!operation) {
      setLastOperationTransition(null);
      return;
    }

    await transitionOperation(operation, lastOperationTransition.previousStatus, {
      trackUndo: false,
      successTitle: 'Payment status restored',
    });
    setLastOperationTransition(null);
  }

  return (
    <OwnerPageScaffold>
      <PageIntro
        eyebrow="Billing"
        title="Payments and billing operations"
        description="Operate collection policy, payment states, and rollout checklist from one integration-facing workspace."
        pills={(
          <>
            <AppPill tone="warning">{operationsByStatus.pending} pending</AppPill>
            <AppPill tone="success">{operationsByStatus.paid} paid</AppPill>
            <AppPill>{operationsByStatus.failed} failed</AppPill>
            <AppPill>{operationsByStatus.refunded} refunded</AppPill>
            <AppPill>{operationsByStatus.blocked} blocked</AppPill>
            <SaveStateIndicator status={saveState} savedLabel={lastSavedLabel} onRetry={retrySave} />
          </>
        )}
      />

      <FlowSection eyebrow="Billing views" title="Collection, activity, and checklist" description="Switch between policy editing, payment activity, and readiness checklist without leaving this route.">
        <StatusTabs current={view} onChange={setView} options={[
          { label: 'Activity', value: 'activity' },
          { label: 'Collection', value: 'collection' },
          { label: 'Checklist', value: 'checklist' },
        ]} />
      </FlowSection>

      <FlowLayout
        sidebar={(
          <FlowSection eyebrow="Billing summary" title="Current defaults" description="Snapshot of policy and handoff context used by booking and owner workflows.">
            <ReviewBlock
              items={[
                { label: 'Collection method', value: draft.collectionMethod },
                { label: 'Deposit type', value: draft.depositType },
                { label: 'Booking approval', value: bookingPolicyLabel },
                { label: 'Accepted methods', value: acceptedMethods.join(', ') },
              ]}
              title="Policy snapshot"
            />
          </FlowSection>
        )}
      >
        {view === 'collection' ? (
          <FlowSection eyebrow="Collection policy" title="Deposit and payment instructions" description="Validation stays deterministic and save failures always include retry affordances.">
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
        ) : null}

        {view === 'activity' ? (
          <FlowSection eyebrow="Payment activity" title="Status transitions" description="Each payment row supports only valid transitions so pending, paid, failed, refunded, and blocked states remain explicit.">
            {actionError ? (
              <div className="payments-inline-alert payments-inline-alert--error" role="status" aria-live="polite">
                <AlertTriangle size={15} />
                <span>{actionError}</span>
              </div>
            ) : null}
            {lastOperationTransition ? (
              <div className="payments-inline-alert payments-inline-alert--success" role="status" aria-live="polite">
                <span>
                  {lastOperationTransition.customerName} moved to {lastOperationTransition.nextStatus}.
                </span>
                <BrandButton size="nav" variant="secondary" startIcon={<RotateCcw size={13} />} onClick={() => void handleUndoOperation()}>
                  Undo status
                </BrandButton>
              </div>
            ) : null}

            {operations.length === 0 ? (
              <RouteStateCard
                title="No payment activity yet"
                description="Payment operations will appear here once bookings start collecting payment actions."
                variant="empty"
              />
            ) : (
              <div className="payments-activity-table-wrap">
                <table className="payments-activity-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Service</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th>Reference</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {operations.map((operation) => (
                      <tr key={operation.id}>
                        <td>
                          <div className="payments-activity-table__cell-main">
                            <strong>{operation.customerName}</strong>
                            <span>{operation.dueLabel}</span>
                          </div>
                        </td>
                        <td>{operation.serviceName}</td>
                        <td>PHP {operation.amount.toLocaleString()}</td>
                        <td>{operation.method}</td>
                        <td>
                          <StatusTag text={operation.status} tone={toPaymentStatusTone(operation.status)} />
                        </td>
                        <td>{operation.reference}</td>
                        <td>
                          <div className="payments-activity-table__actions">
                            {getOperationActions(operation).map((action) => (
                              <BrandButton
                                key={action.status}
                                size="nav"
                                variant="secondary"
                                disabled={actionInFlightOperationId === operation.id}
                                onClick={() => void transitionOperation(operation, action.status)}
                              >
                                {action.label}
                              </BrandButton>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </FlowSection>
        ) : null}

        {view === 'checklist' ? (
          <FlowSection eyebrow="Implementation checklist" title="What is live versus deferred" description="Checklist remains tied to integration-facing payment state and does not imply unavailable automation.">
            {checklist.length === 0 ? (
              <RouteStateCard title="Checklist unavailable" description="No payment checklist items are loaded for this workspace." variant="empty" />
            ) : (
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
                      <StatusTag text={item.status} tone={item.status === 'Ready now' ? 'positive' : 'neutral'} />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </FlowSection>
        ) : null}
      </FlowLayout>
    </OwnerPageScaffold>
  );
}

function getOperationActions(operation: PaymentOperationItem): Array<{ label: string; status: PaymentProcessingStatus }> {
  if (operation.status === 'pending') {
    return [
      { label: 'Mark paid', status: 'paid' },
      { label: 'Mark failed', status: 'failed' },
      { label: 'Block', status: 'blocked' },
    ];
  }

  if (operation.status === 'failed') {
    return [
      { label: 'Retry pending', status: 'pending' },
      { label: 'Mark paid', status: 'paid' },
      { label: 'Block', status: 'blocked' },
    ];
  }

  if (operation.status === 'blocked') {
    return [
      { label: 'Retry review', status: 'pending' },
      { label: 'Mark failed', status: 'failed' },
    ];
  }

  if (operation.status === 'paid') {
    return [{ label: 'Refund', status: 'refunded' }];
  }

  return [];
}

function toPaymentStatusTone(status: PaymentProcessingStatus) {
  if (status === 'paid') {
    return 'positive' as const;
  }

  if (status === 'pending') {
    return 'accent' as const;
  }

  if (status === 'failed' || status === 'blocked') {
    return 'critical' as const;
  }

  return 'neutral' as const;
}

