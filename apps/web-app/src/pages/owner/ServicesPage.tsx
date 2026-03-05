import { useState } from 'react';
import { AppPill, OwnerContentGrid, OwnerPageScaffold, PageIntro } from '@/app/components/PageTemplates';
import { RouteStateCard } from '@/app/components/RouteStateCard';
import type { ServiceRecord } from '@/domain/service/types';
import { getOwnerServicesResource } from '@/features/owner/data';
import { Card } from '@/ui';
import { ServiceEditor, type ServiceDraft } from './services/ServiceEditor';
import { ServiceList } from './services/ServiceList';
import { ServiceToolbar } from './services/ServiceToolbar';

const EMPTY_DRAFT: ServiceDraft = {
  name: '',
  category: '',
  durationMinutes: '30',
  price: '0',
  visibility: 'Public',
  status: 'Active',
  description: '',
};

export function ServicesPage() {
  const resource = getOwnerServicesResource();
  const [services, setServices] = useState(() => (resource.status === 'ready' ? resource.data.services : []));
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedId, setSelectedId] = useState<string | null>(
    () => (resource.status === 'ready' ? resource.data.services[0]?.id ?? null : null),
  );
  const [draft, setDraft] = useState<ServiceDraft>(EMPTY_DRAFT);
  const [mode, setMode] = useState<'create' | 'edit'>('edit');

  if (resource.status === 'loading') {
    return (
      <OwnerPageScaffold>
        <PageIntro
          eyebrow="Services"
          title="Service catalog"
          description="Loading your active service catalog and pricing controls."
        />
        <Card className="services-loading-state" padding={6}>
          <div className="services-loading-state__pulse" />
          <div className="services-loading-state__pulse" />
          <div className="services-loading-state__pulse" />
        </Card>
      </OwnerPageScaffold>
    );
  }

  if (resource.status === 'error') {
    return <RouteStateCard title="Services unavailable" description={resource.message} variant="error" />;
  }

  const filtered = services.filter((service) =>
    (status === 'All' || service.status === status)
    && `${service.name} ${service.category}`.toLowerCase().includes(query.toLowerCase()),
  );

  const selectedService = services.find((service) => service.id === selectedId) ?? null;

  function toDraft(service: ServiceRecord): ServiceDraft {
    return {
      name: service.name,
      category: service.category,
      durationMinutes: String(service.durationMinutes),
      price: String(service.price),
      visibility: service.visibility,
      status: service.status,
      description: service.description,
    };
  }

  function handleSelect(service: ServiceRecord) {
    setSelectedId(service.id);
    setDraft(toDraft(service));
    setMode('edit');
  }

  function handleAddService() {
    setSelectedId(null);
    setDraft(EMPTY_DRAFT);
    setMode('create');
  }

  function handleDraftChange(field: keyof ServiceDraft, value: string) {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSave() {
    if (!draft.name.trim()) {
      return;
    }

    if (mode === 'create') {
      const newService: ServiceRecord = {
        id: `svc-${services.length + 1}`,
        name: draft.name.trim(),
        category: draft.category.trim() || 'General',
        durationMinutes: Number(draft.durationMinutes) || 30,
        price: Number(draft.price) || 0,
        visibility: draft.visibility,
        status: draft.status,
        description: draft.description.trim() || 'New service draft.',
        bookings: 0,
        staffSelectionMode: 'required',
        staffIds: [],
        leadNote: 'New owner-created service draft.',
      };

      setServices((current) => [newService, ...current]);
      handleSelect(newService);
      return;
    }

    if (!selectedId) {
      return;
    }

    setServices((current) =>
      current.map((service) =>
        service.id === selectedId
          ? {
              ...service,
              name: draft.name.trim(),
              category: draft.category.trim() || 'General',
              durationMinutes: Number(draft.durationMinutes) || 30,
              price: Number(draft.price) || 0,
              visibility: draft.visibility,
              status: draft.status,
              description: draft.description.trim() || 'Service description pending.',
            }
          : service,
      ),
    );
  }

  function handleArchiveToggle(serviceId: string) {
    setServices((current) =>
      current.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              status: service.status === 'Archived' ? 'Active' : 'Archived',
            }
          : service,
      ),
    );
  }

  function handleCancel() {
    if (selectedService) {
      setDraft(toDraft(selectedService));
      setMode('edit');
      return;
    }

    setDraft(EMPTY_DRAFT);
  }

  const activeCount = services.filter((service) => service.status === 'Active').length;
  const hiddenCount = services.filter((service) => service.status === 'Hidden').length;
  const archivedCount = services.filter((service) => service.status === 'Archived').length;
  const hasActiveFilters = status !== 'All' || query.trim().length > 0;

  return (
    <OwnerPageScaffold>
      <PageIntro
        eyebrow="Services"
        title={(
          <>
            Service catalog
            <span className="svc-count-badge">{services.length}</span>
          </>
        )}
        description="Review service performance, adjust availability, and stage updates from one production-ready workspace."
        pills={(
          <>
            <AppPill tone="success">{activeCount} active</AppPill>
            <AppPill>{hiddenCount} hidden</AppPill>
            <AppPill>{archivedCount} archived</AppPill>
          </>
        )}
      />

      <div className="services-summary-grid">
        <ServiceSummaryCard label="Visible catalog" value={`${services.filter((service) => service.visibility === 'Public').length}`} />
        <ServiceSummaryCard label="Avg. ticket" value={`PHP ${Math.round(services.reduce((sum, service) => sum + service.price, 0) / Math.max(1, services.length)).toLocaleString()}`} />
        <ServiceSummaryCard label="Total bookings" value={`${services.reduce((sum, service) => sum + service.bookings, 0)}`} />
      </div>

      <ServiceToolbar
        hasActiveFilters={hasActiveFilters}
        query={query}
        status={status}
        viewMode={viewMode}
        onAddService={handleAddService}
        onClearFilters={() => {
          setQuery('');
          setStatus('All');
        }}
        onQueryChange={setQuery}
        onStatusChange={setStatus}
        onViewModeChange={setViewMode}
      />

      <OwnerContentGrid density="wide">
        <ServiceList
          items={filtered}
          selectedId={selectedId}
          viewMode={viewMode}
          onArchiveToggle={handleArchiveToggle}
          onCreateNew={handleAddService}
          onResetFilters={() => {
            setQuery('');
            setStatus('All');
          }}
          onSelect={handleSelect}
        />
        <ServiceEditor
          draft={draft}
          mode={mode}
          onCancel={handleCancel}
          onDraftChange={handleDraftChange}
          onSave={handleSave}
        />
      </OwnerContentGrid>
    </OwnerPageScaffold>
  );
}

function ServiceSummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="services-summary-card" padding={4}>
      <span>{label}</span>
      <strong>{value}</strong>
    </Card>
  );
}
