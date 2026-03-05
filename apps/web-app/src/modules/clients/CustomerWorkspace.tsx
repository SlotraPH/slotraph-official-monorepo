import { Compass, Mail, Phone, Search, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppPill, OwnerPageScaffold, PageIntro } from '@/app/components/PageTemplates';
import { RouteStateCard } from '@/app/components/RouteStateCard';
import type { CustomerRecord } from '@/domain/customer/types';
import { getOwnerCustomersResource } from '@/features/owner/data';
import { EmptyFlowState, StatusTabs } from '@/modules/shared/flow/FlowScaffolds';
import { BrandButton, BrandInput, BrandTextarea, Card, useBrandToast } from '@/ui';
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
  const resource = getOwnerCustomersResource();
  const toast = useBrandToast();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]['value']>('All');
  const [selectedId, setSelectedId] = useState<string | null>(
    () => (resource.status === 'ready' ? resource.data.customers[0]?.id ?? null : null),
  );
  const [draft, setDraft] = useState<ClientIntakeDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  if (resource.status === 'loading') {
    return <RouteStateCard title="Loading customers" description="Preparing owner customer records." variant="loading" />;
  }

  if (resource.status === 'error') {
    return <RouteStateCard title="Customers unavailable" description={resource.message} variant="error" />;
  }

  const { customers } = resource.data;
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

  function handleSubmit() {
    const nextErrors = validateClientIntakeForm(draft);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    toast.success({
      title: 'Client intake captured',
      description: `Created a local intake draft for ${draft.fullName}. Persistence stays in Phase 5.`,
    });
    setDraft(EMPTY_DRAFT);
    setErrors({});
  }

  const vipCount = customers.filter((customer) => customer.status === 'VIP').length;
  const followUpCount = customers.filter((customer) => customer.status === 'Needs follow-up').length;
  const totalSpend = customers.reduce((sum, customer) => sum + customer.totalSpend, 0);

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
            <AppPill>{followUpCount} follow-up</AppPill>
            <AppPill>PHP {totalSpend.toLocaleString()} lifetime spend</AppPill>
          </>
        )}
      />

      <div className="customers-kpi-grid">
        <KpiCard label="Active pipeline" value={`${customers.length} clients`} />
        <KpiCard label="Avg. spend per client" value={`PHP ${Math.round(totalSpend / Math.max(1, customers.length)).toLocaleString()}`} />
        <KpiCard label="Booked in next cycle" value={`${customers.filter((customer) => customer.upcomingBooking !== '—').length}`} />
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

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="customers-kpi-card" padding={4}>
      <span>{label}</span>
      <strong>{value}</strong>
    </Card>
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

function StatusTag({ text, tone }: { text: string; tone: 'critical' | 'positive' | 'accent' | 'neutral' }) {
  return <span className={`customer-status-tag customer-status-tag--${tone}`}>{text}</span>;
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
