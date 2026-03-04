import { useState } from 'react';
import { Badge, PageHeader } from '@slotra/ui';
import { RouteStateCard } from '@/app/components/RouteStateCard';
import type { ServiceRecord } from '@/domain/service/types';
import { getOwnerServicesResource } from '@/features/owner/data';
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
  const [selectedId, setSelectedId] = useState<string | null>(
    () => (resource.status === 'ready' ? resource.data.services[0]?.id ?? null : null)
  );
  const [draft, setDraft] = useState<ServiceDraft>(EMPTY_DRAFT);
  const [mode, setMode] = useState<'create' | 'edit'>('edit');

  if (resource.status === 'loading') {
    return <RouteStateCard title="Loading services" description="Preparing the owner service catalog." variant="loading" />;
  }

  if (resource.status === 'error') {
    return <RouteStateCard title="Services unavailable" description={resource.message} variant="error" />;
  }

  const filtered = services.filter((service) =>
    (status === 'All' || service.status === status)
    && `${service.name} ${service.category}`.toLowerCase().includes(query.toLowerCase())
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
          : service
      )
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
          : service
      )
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

  return (
    <div className="owner-page-stack">
      <PageHeader
        title={(
          <>
            Services
            <span className="svc-count-badge">{services.length}</span>
          </>
        )}
        subtitle="Manage the services customers can book."
        actions={<Badge variant="default">Session-only changes</Badge>}
      />
      <div className="owner-inline-stats">
        <Badge variant="success">{activeCount} active</Badge>
        <Badge variant="default">{hiddenCount} hidden</Badge>
        <Badge variant="default">{archivedCount} archived</Badge>
      </div>
      <ServiceToolbar
        query={query}
        status={status}
        onQueryChange={setQuery}
        onStatusChange={setStatus}
        onAddService={handleAddService}
      />
      <div className="owner-two-column-layout owner-two-column-layout--wide">
        <ServiceList
          items={filtered}
          selectedId={selectedId}
          onSelect={handleSelect}
          onArchiveToggle={handleArchiveToggle}
        />
        <ServiceEditor
          mode={mode}
          draft={draft}
          onDraftChange={handleDraftChange}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
