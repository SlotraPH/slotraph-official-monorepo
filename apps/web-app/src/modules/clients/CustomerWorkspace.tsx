import { AlertTriangle, Compass, Mail, Phone, Search, UserPlus, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppPill, OwnerPageScaffold, PageIntro } from '@/app/components/PageTemplates';
import { RouteStateCard } from '@/app/components/RouteStateCard';
import type { CustomerRecord, CustomerStatus } from '@/domain/customer/types';
import { ownerCustomerPersistenceClient } from '@/features/owner/customers/persistenceClient';
import { EmptyFlowState, StatusTabs } from '@/modules/shared/flow/FlowScaffolds';
import {
  BrandButton,
  BrandInput,
  BrandTextarea,
  Card,
  MetricCard,
  SaveStateIndicator,
  StatusTag,
  useBrandToast,
  type SaveStateStatus,
} from '@/ui';
import { type ClientIntakeDraft, validateClientIntakeField, validateClientIntakeForm } from './validation';

const STATUS_OPTIONS = [
  { label: 'All', value: 'All' },
  { label: 'VIP', value: 'VIP' },
  { label: 'Active', value: 'Active' },
  { label: 'New', value: 'New' },
  { label: 'Follow-up', value: 'Needs follow-up' },
] as const;

const EMPTY_DRAFT: ClientIntakeDraft = {
  fullName: '',
  email: '',
  phone: '',
  notes: '',
};

export function CustomerWorkspace() {
  const toast = useBrandToast();
  const [sessionStatus, setSessionStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [sessionMessage, setSessionMessage] = useState('Loading customer records...');
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [intakeDraftCount, setIntakeDraftCount] = useState(0);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]['value']>('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ClientIntakeDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [intakeSaveState, setIntakeSaveState] = useState<SaveStateStatus>('saved');
  const [lastSavedLabel, setLastSavedLabel] = useState('Waiting for first intake save');
  const [pendingIntakeDraft, setPendingIntakeDraft] = useState<ClientIntakeDraft | null>(null);
  const [statusActionInFlightId, setStatusActionInFlightId] = useState<string | null>(null);
  const [lastStatusUpdate, setLastStatusUpdate] = useState<{
    customerId: string;
    customerName: string;
    previousStatus: CustomerStatus;
    nextStatus: CustomerStatus;
  } | null>(null);
  const [statusActionError, setStatusActionError] = useState<string | null>(null);

  async function hydrateCustomers() {
    setSessionStatus('loading');
    setSessionMessage('Loading customer records...');
    setStatusActionError(null);

    try {
      const snapshot = await ownerCustomerPersistenceClient.load();
      setCustomers(snapshot.customers);
      setIntakeDraftCount(snapshot.intakeDraftCount);
      setSelectedId((current) => (current && snapshot.customers.some((item) => item.id === current)
        ? current
        : snapshot.customers[0]?.id ?? null));
      setSessionStatus('ready');
      setSessionMessage('');
    } catch {
      setSessionStatus('error');
      setSessionMessage('Could not load customer operations data. Retry to restore customers and drafts.');
    }
  }

  useEffect(() => {
    void hydrateCustomers();
  }, []);

  useEffect(() => {
    if (!selectedId && customers[0]) {
      setSelectedId(customers[0].id);
      return;
    }

    if (selectedId && !customers.some((customer) => customer.id === selectedId)) {
      setSelectedId(customers[0]?.id ?? null);
    }
  }, [customers, selectedId]);

  if (sessionStatus === 'loading') {
    return <RouteStateCard title="Loading customers" description="Preparing owner customer records and segment history." variant="loading" />;
  }

  if (sessionStatus === 'error') {
    return <RouteStateCard title="Customers unavailable" description={sessionMessage} variant="error" onRetry={() => void hydrateCustomers()} />;
  }

  if (customers.length === 0) {
    return (
      <RouteStateCard
        title="No customers found"
        description="Customer records are empty in this workspace session."
        variant="empty"
        actions={<BrandButton variant="secondary" onClick={() => void restoreDefaults()}>Reload sample customers</BrandButton>}
      />
    );
  }

  const filtered = customers.filter((customer) => {
    const haystack = `${customer.name} ${customer.email} ${customer.tags.join(' ')}`.toLowerCase();
    return (status === 'All' || customer.status === status) && haystack.includes(query.toLowerCase());
  });
  const selectedCustomer = filtered.find((customer) => customer.id === selectedId)
    ?? customers.find((customer) => customer.id === selectedId)
    ?? null;

  function setField<K extends keyof ClientIntakeDraft>(field: K, value: ClientIntakeDraft[K]) {
    const nextDraft = { ...draft, [field]: value };
    setDraft(nextDraft);
    setIntakeSaveState('idle');
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: validateClientIntakeField(nextDraft, field),
    }));
  }

  function handleBlur(field: keyof ClientIntakeDraft) {
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: validateClientIntakeField(draft, field),
    }));
  }

  async function persistIntake(draftToPersist: ClientIntakeDraft) {
    setIntakeSaveState('saving');
    setPendingIntakeDraft(draftToPersist);

    try {
      const result = await ownerCustomerPersistenceClient.saveIntakeDraft(draftToPersist);
      setCustomers((current) => [result.customer, ...current]);
      setIntakeDraftCount((count) => count + 1);
      setSelectedId(result.customer.id);
      setDraft(EMPTY_DRAFT);
      setErrors({});
      setPendingIntakeDraft(null);
      setIntakeSaveState('saved');
      setLastSavedLabel(`Saved at ${new Date(result.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);

      toast.success({
        title: 'Customer intake saved',
        description: `${result.customer.name} was added to customer operations as a new draft.`,
      });
    } catch {
      setIntakeSaveState('failed');
      toast.error({
        title: 'Intake save failed',
        description: 'Retry to keep this intake draft in customer operations.',
      });
    }
  }

  function handleSubmit() {
    const nextErrors = validateClientIntakeForm(draft);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    void persistIntake(draft);
  }

  const vipCount = customers.filter((customer) => customer.status === 'VIP').length;
  const followUpCount = customers.filter((customer) => customer.status === 'Needs follow-up').length;
  const activeCount = customers.filter((customer) => customer.status === 'Active').length;
  const totalSpend = customers.reduce((sum, customer) => sum + customer.totalSpend, 0);

  async function handleStatusUpdate(customer: CustomerRecord, nextStatus: CustomerStatus) {
    setStatusActionInFlightId(customer.id);
    setStatusActionError(null);

    try {
      const result = await ownerCustomerPersistenceClient.updateCustomerStatus(customer.id, nextStatus);
      setCustomers((current) => current.map((item) => (item.id === customer.id ? result.customer : item)));
      setLastStatusUpdate({
        customerId: customer.id,
        customerName: customer.name,
        previousStatus: result.previousStatus,
        nextStatus: result.customer.status,
      });
      toast.success({
        title: 'Customer status updated',
        description: `${customer.name} moved to ${result.customer.status}.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not update customer status. Retry this action.';
      setStatusActionError(message);
      toast.error({
        title: 'Status update failed',
        description: message,
      });
    } finally {
      setStatusActionInFlightId(null);
    }
  }

  async function handleUndoStatusUpdate() {
    if (!lastStatusUpdate) {
      return;
    }

    const customer = customers.find((item) => item.id === lastStatusUpdate.customerId);
    if (!customer) {
      setLastStatusUpdate(null);
      return;
    }

    await handleStatusUpdate(customer, lastStatusUpdate.previousStatus);
    setLastStatusUpdate(null);
    toast.info({
      title: 'Status change undone',
      description: `${customer.name} was restored to ${lastStatusUpdate.previousStatus}.`,
    });
  }

  async function restoreDefaults() {
    setSessionStatus('loading');
    try {
      const snapshot = await ownerCustomerPersistenceClient.restoreDefaults();
      setCustomers(snapshot.customers);
      setIntakeDraftCount(snapshot.intakeDraftCount);
      setSelectedId(snapshot.customers[0]?.id ?? null);
      setSessionStatus('ready');
      toast.info({
        title: 'Customer defaults restored',
        description: 'Sample customer records and counts are back to baseline.',
      });
    } catch {
      setSessionStatus('error');
      setSessionMessage('Could not restore default customer records. Retry to recover this workspace.');
    }
  }

  function retryIntakeSave() {
    if (!pendingIntakeDraft) {
      return;
    }

    void persistIntake(pendingIntakeDraft);
  }

  const statusSummaryText = `${vipCount} VIP / ${activeCount} active / ${followUpCount} follow-up`;

  return (
    <OwnerPageScaffold>
      <PageIntro
        eyebrow="Customers"
        title="Customer relationship workspace"
        description="Review segments, monitor value, and stage intake drafts from a single owner-friendly experience."
        actions={(
          <Link style={{ textDecoration: 'none' }} to="/book">
            <BrandButton size="nav" startIcon={<Compass size={15} />} variant="secondary">
              Open booking form
            </BrandButton>
          </Link>
        )}
        pills={(
          <>
            <AppPill tone="success">{vipCount} VIP</AppPill>
            <AppPill>{statusSummaryText}</AppPill>
            <AppPill>PHP {totalSpend.toLocaleString()} lifetime spend</AppPill>
            <AppPill>{intakeDraftCount} intake drafts saved</AppPill>
            <SaveStateIndicator status={intakeSaveState} savedLabel={lastSavedLabel} idleLabel="Unsaved intake changes" onRetry={retryIntakeSave} />
          </>
        )}
      />

      <div className="customers-kpi-grid">
        <MetricCard className="customers-kpi-card" label="Active pipeline" value={`${customers.length} clients`} />
        <MetricCard
          className="customers-kpi-card"
          label="Avg. spend per client"
          value={`PHP ${Math.round(totalSpend / Math.max(1, customers.length)).toLocaleString()}`}
        />
        <MetricCard
          className="customers-kpi-card"
          label="Booked in next cycle"
          value={`${customers.filter((customer) => customer.upcomingBooking !== '—').length}`}
        />
      </div>

      <Card className="customers-filter-card" padding={5}>
        <div className="customers-filter-card__top">
          <div>
            <h2>Search and segment</h2>
            <p>Filter by name, email, or tags, then keep one profile selected for staff handoff.</p>
          </div>
        </div>
        <div className="customers-filter-card__controls">
          <BrandInput
            aria-label="Search clients by name, email, or tag"
            leadingIcon={Search}
            placeholder="Search by name, email, or tag"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <StatusTabs current={status} options={[...STATUS_OPTIONS]} onChange={(value) => setStatus(value)} />
        </div>
        {statusActionError ? (
          <div className="customers-inline-alert customers-inline-alert--error" role="status" aria-live="polite">
            <AlertTriangle size={15} />
            <span>{statusActionError}</span>
          </div>
        ) : null}
        {lastStatusUpdate ? (
          <div className="customers-inline-alert customers-inline-alert--success" role="status" aria-live="polite">
            <span>
              {lastStatusUpdate.customerName} moved to {lastStatusUpdate.nextStatus}.
            </span>
            <BrandButton size="nav" variant="secondary" onClick={() => void handleUndoStatusUpdate()}>
              Undo change
            </BrandButton>
          </div>
        ) : null}
      </Card>

      <div className="customers-main-grid">
        <Card className="customers-list-card" padding={5}>
          <div className="customers-list-card__header">
            <h2>Matching clients</h2>
            <span>{filtered.length} results</span>
          </div>
          {filtered.length === 0 ? (
            <EmptyFlowState
              action={<BrandButton variant="secondary" onClick={() => { setQuery(''); setStatus('All'); }}>Reset filters</BrandButton>}
              description="Try another search term or switch the active segment to review the full client list."
              icon={Users}
              title="No clients match this view"
            />
          ) : (
            <div className="customers-list">
              {filtered.map((customer) => {
                const selected = customer.id === selectedId;
                return (
                  <button
                    key={customer.id}
                    aria-pressed={selected}
                    className={`customer-row${selected ? ' is-selected' : ''}`}
                    type="button"
                    onClick={() => setSelectedId(customer.id)}
                  >
                    <div className="customer-row__main">
                      <div>
                        <strong>{customer.name}</strong>
                        <span>{customer.email}</span>
                      </div>
                      <StatusTag text={customer.status} tone={toStatusTone(customer.status)} />
                    </div>
                    <div className="customer-row__metrics">
                      <span>{customer.totalVisits} visits</span>
                      <span>PHP {customer.totalSpend.toLocaleString()}</span>
                      <span>{customer.upcomingBooking}</span>
                    </div>
                    <div className="customer-row__tags">
                      {customer.tags.map((tag) => (
                        <StatusTag key={tag} text={tag} tone="neutral" />
                      ))}
                    </div>
                    <div className="customer-row__actions">
                      {getStatusActions(customer).map((action) => (
                        <BrandButton
                          key={action.status}
                          size="nav"
                          variant="secondary"
                          disabled={statusActionInFlightId === customer.id}
                          onClick={(event) => {
                            event.stopPropagation();
                            void handleStatusUpdate(customer, action.status);
                          }}
                        >
                          {action.label}
                        </BrandButton>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </Card>

        {selectedCustomer ? <CustomerProfile customer={selectedCustomer} /> : null}
      </div>

      <Card className="customers-intake-card" padding={5}>
        <div className="customers-intake-card__header">
          <h2>Create intake draft</h2>
          <p>Use this to collect validated records before persistence and import workflows are wired.</p>
        </div>
        <div className="customers-intake-card__grid">
          <BrandInput
            autoComplete="name"
            error={errors.fullName}
            label="Client name"
            leadingIcon={UserPlus}
            value={draft.fullName}
            onBlur={() => handleBlur('fullName')}
            onChange={(event) => setField('fullName', event.target.value)}
          />
          <BrandInput
            autoComplete="email"
            error={errors.email}
            label="Email"
            leadingIcon={Mail}
            value={draft.email}
            onBlur={() => handleBlur('email')}
            onChange={(event) => setField('email', event.target.value)}
          />
          <BrandInput
            autoComplete="tel"
            error={errors.phone}
            label="Mobile number"
            leadingIcon={Phone}
            value={draft.phone}
            onBlur={() => handleBlur('phone')}
            onChange={(event) => setField('phone', event.target.value)}
          />
          <BrandTextarea
            helperText="Optional retention notes, product preferences, or visit context."
            label="Notes"
            value={draft.notes}
            onBlur={() => handleBlur('notes')}
            onChange={(event) => setField('notes', event.target.value)}
          />
        </div>
        <div className="customers-intake-card__actions">
          <BrandButton startIcon={<UserPlus size={15} />} onClick={handleSubmit}>
            Save intake draft
          </BrandButton>
        </div>
      </Card>
    </OwnerPageScaffold>
  );
}

function CustomerProfile({ customer }: { customer: CustomerRecord }) {
  return (
    <Card className="customer-profile-panel" padding={5}>
      <div className="customer-profile-panel__header">
        <div>
          <span>Client profile</span>
          <h2>{customer.name}</h2>
        </div>
        <StatusTag text={customer.source} tone="neutral" />
      </div>

      <div className="customer-profile-panel__contact">
        <MetaLine icon={Phone} text={customer.phone} />
        <MetaLine icon={Mail} text={customer.email} />
      </div>

      <dl className="customer-profile-panel__stats">
        <StatLine label="Total spend" value={`PHP ${customer.totalSpend.toLocaleString()}`} />
        <StatLine label="Total visits" value={customer.totalVisits.toString()} />
        <StatLine label="Upcoming booking" value={customer.upcomingBooking} />
        <StatLine label="Last visit" value={customer.lastVisit} />
      </dl>

      <div className="customer-profile-panel__tags">
        {customer.tags.map((tag) => <StatusTag key={tag} text={tag} tone="neutral" />)}
      </div>

      <div className="customer-profile-panel__notes">
        <span>Notes</span>
        <p>{customer.notes}</p>
      </div>
    </Card>
  );
}

function MetaLine({ icon: Icon, text }: { icon: typeof Mail; text: string }) {
  return (
    <div className="customer-meta-line">
      <Icon size={15} />
      <span>{text}</span>
    </div>
  );
}

function StatLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function toStatusTone(status: CustomerRecord['status']) {
  if (status === 'VIP') {
    return 'accent' as const;
  }

  if (status === 'Needs follow-up') {
    return 'critical' as const;
  }

  if (status === 'Active') {
    return 'positive' as const;
  }

  return 'neutral' as const;
}

function getStatusActions(customer: CustomerRecord): Array<{ label: string; status: CustomerStatus }> {
  const options: Array<{ label: string; status: CustomerStatus }> = [];

  if (customer.status !== 'Active') {
    options.push({ label: 'Mark active', status: 'Active' });
  }

  if (customer.status !== 'Needs follow-up') {
    options.push({ label: 'Needs follow-up', status: 'Needs follow-up' });
  }

  if (customer.status !== 'VIP') {
    options.push({ label: 'Upgrade VIP', status: 'VIP' });
  }

  return options.slice(0, 2);
}


