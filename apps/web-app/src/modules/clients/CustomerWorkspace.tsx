import { useState } from 'react';
import { Compass, Mail, Phone, Search, UserPlus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppPill, OwnerPageScaffold, PageIntro } from '@/app/components/PageTemplates';
import { RouteStateCard } from '@/app/components/RouteStateCard';
import type { CustomerRecord } from '@/domain/customer/types';
import { getOwnerCustomersResource } from '@/features/owner/data';
import { EmptyFlowState, FlowLayout, FlowSection, ReviewBlock, StatusTabs } from '@/modules/shared/flow/FlowScaffolds';
import { BrandButton, BrandInput, BrandTextarea, Card, colors, radii, spacing, typography, useBrandToast } from '@/ui';
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

  const segmentSummary = [
    { label: 'VIP clients', value: customers.filter((customer) => customer.status === 'VIP').length.toString() },
    { label: 'New this cycle', value: customers.filter((customer) => customer.status === 'New').length.toString() },
    { label: 'Follow-up queue', value: customers.filter((customer) => customer.status === 'Needs follow-up').length.toString() },
  ];

  return (
    <OwnerPageScaffold>
      <PageIntro
        eyebrow="Clients"
        title="Client intake and relationship workspace"
        description="Search, segment, review, and stage new intake records from one branded flow instead of several disconnected owner cards."
        actions={(
          <Link style={{ textDecoration: 'none' }} to="/book">
            <BrandButton size="nav" startIcon={<Compass size={15} />} variant="secondary">
              Open booking form
            </BrandButton>
          </Link>
        )}
        pills={(
          <>
            <AppPill tone="success">{customers.filter((customer) => customer.status === 'VIP').length} VIP</AppPill>
            <AppPill>{customers.filter((customer) => customer.status === 'New').length} new</AppPill>
            <AppPill>{customers.filter((customer) => customer.status === 'Needs follow-up').length} follow-up</AppPill>
          </>
        )}
      />

      <FlowLayout
        sidebar={(
          <>
            <FlowSection eyebrow="Segments" title="Relationship mix" description="Use the same segment counts across routing, customer review, and intake follow-up.">
              <ReviewBlock items={segmentSummary} title="Current pipeline" />
            </FlowSection>
            <FlowSection eyebrow="Intake flow" title="Create a client draft" description="This intake form validates on blur and clears errors as soon as entries become valid again.">
              <div style={{ display: 'grid', gap: spacing[4] }}>
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
                <BrandButton startIcon={<UserPlus size={15} />} onClick={handleSubmit}>
                  Save intake draft
                </BrandButton>
              </div>
            </FlowSection>
          </>
        )}
      >
        <FlowSection eyebrow="Client lookup" title="Search and filter" description="Keyboard search and segment tabs stay at the top of the client workspace so the focus order stays predictable.">
          <div style={{ display: 'grid', gap: spacing[4] }}>
            <BrandInput
              aria-label="Search clients by name, email, or tag"
              leadingIcon={Search}
              placeholder="Search by name, email, or tag"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <StatusTabs current={status} onChange={(value) => setStatus(value)} options={[...STATUS_OPTIONS]} />
          </div>
        </FlowSection>

        <FlowLayout
          sidebar={selectedCustomer ? <CustomerProfile customer={selectedCustomer} /> : undefined}
        >
          <FlowSection eyebrow="Client records" title="Matching clients" description={`${filtered.length} customer${filtered.length === 1 ? '' : 's'} match the current search and segment.`}>
            {filtered.length === 0 ? (
              <EmptyFlowState
                action={<BrandButton variant="secondary" onClick={() => { setQuery(''); setStatus('All'); }}>Reset filters</BrandButton>}
                description="Try another search term or switch the current segment to review the rest of your client base."
                icon={Users}
                title="No clients match this view"
              />
            ) : (
              <div style={{ display: 'grid', gap: spacing[3] }}>
                {filtered.map((customer) => {
                  const selected = customer.id === selectedId;
                  return (
                    <button
                      key={customer.id}
                      aria-pressed={selected}
                      type="button"
                      onClick={() => setSelectedId(customer.id)}
                      style={{
                        background: selected ? 'rgba(46,49,146,0.06)' : '#ffffff',
                        border: `1px solid ${selected ? colors.brand : colors.border}`,
                        borderRadius: radii.lg,
                        cursor: 'pointer',
                        display: 'grid',
                        gap: spacing[2],
                        padding: spacing[4],
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ alignItems: 'start', display: 'flex', gap: spacing[3], justifyContent: 'space-between' }}>
                        <div style={{ display: 'grid', gap: 2 }}>
                          <strong style={{ color: colors.navy, fontFamily: typography.fontFamily }}>{customer.name}</strong>
                          <span style={{ color: colors.secondary, fontFamily: typography.fontFamily, ...typography.bodySmall }}>{customer.email}</span>
                        </div>
                        <Tag text={customer.status} />
                      </div>
                      <div style={{ color: colors.secondary, display: 'flex', flexWrap: 'wrap', gap: spacing[3], fontFamily: typography.fontFamily, ...typography.label }}>
                        <span>{customer.totalVisits} visits</span>
                        <span>PHP {customer.totalSpend.toLocaleString()}</span>
                        <span>{customer.upcomingBooking}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </FlowSection>
        </FlowLayout>
      </FlowLayout>
    </OwnerPageScaffold>
  );
}

function CustomerProfile({ customer }: { customer: CustomerRecord }) {
  return (
    <FlowSection
      eyebrow="Client profile"
      title={customer.name}
      description="Focused detail view for staff handoff, retention, and manual follow-up."
      action={<Tag text={customer.source} />}
    >
      <div style={{ display: 'grid', gap: spacing[4] }}>
        <Card padding={4} surfaceStyle={{ background: 'rgba(46,49,146,0.04)' }}>
          <div style={{ display: 'grid', gap: spacing[2] }}>
            <MetaLine icon={Phone} text={customer.phone} />
            <MetaLine icon={Mail} text={customer.email} />
          </div>
        </Card>
        <ReviewBlock
          items={[
            { label: 'Total spend', value: `PHP ${customer.totalSpend.toLocaleString()}` },
            { label: 'Total visits', value: customer.totalVisits.toString() },
            { label: 'Upcoming booking', value: customer.upcomingBooking },
          ]}
          title="Relationship value"
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[2] }}>
          {customer.tags.map((tag) => <Tag key={tag} text={tag} />)}
        </div>
        <Card padding={4}>
          <div style={{ display: 'grid', gap: spacing[2] }}>
            <span style={{ color: colors.muted, fontFamily: typography.fontFamily, ...typography.overline }}>Notes</span>
            <p style={{ color: colors.secondary, fontFamily: typography.fontFamily, margin: 0, ...typography.bodySmall }}>{customer.notes}</p>
          </div>
        </Card>
      </div>
    </FlowSection>
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
        padding: '6px 10px',
      }}
    >
      {text}
    </span>
  );
}

function MetaLine({ icon: Icon, text }: { icon: typeof Mail; text: string }) {
  return (
    <div style={{ alignItems: 'center', color: colors.secondary, display: 'flex', gap: spacing[2], fontFamily: typography.fontFamily }}>
      <Icon size={15} />
      <span style={typography.bodySmall}>{text}</span>
    </div>
  );
}
