import { Button, FormField, SectionCard, Select, Textarea } from '@slotra/ui';
import type { ServiceRecord } from '../mockOwnerData';

export interface ServiceDraft {
  name: string;
  category: string;
  durationMinutes: string;
  price: string;
  visibility: ServiceRecord['visibility'];
  status: ServiceRecord['status'];
  description: string;
}

interface ServiceEditorProps {
  mode: 'create' | 'edit';
  draft: ServiceDraft;
  onDraftChange: (field: keyof ServiceDraft, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ServiceEditor({
  mode,
  draft,
  onDraftChange,
  onSave,
  onCancel,
}: ServiceEditorProps) {
  return (
    <SectionCard
      title={mode === 'create' ? 'Create service' : 'Edit service'}
      description="These fields stay local for now, but match the shape needed for backend CRUD later."
    >
      <div className="owner-form-grid">
        <FormField label="Service name" htmlFor="service-name">
          <input
            id="service-name"
            className="input"
            type="text"
            value={draft.name}
            onChange={(event) => onDraftChange('name', event.target.value)}
          />
        </FormField>

        <FormField label="Category" htmlFor="service-category">
          <input
            id="service-category"
            className="input"
            type="text"
            value={draft.category}
            onChange={(event) => onDraftChange('category', event.target.value)}
          />
        </FormField>

        <FormField label="Duration (minutes)" htmlFor="service-duration">
          <input
            id="service-duration"
            className="input"
            type="number"
            min="15"
            step="15"
            value={draft.durationMinutes}
            onChange={(event) => onDraftChange('durationMinutes', event.target.value)}
          />
        </FormField>

        <FormField label="Price (PHP)" htmlFor="service-price">
          <input
            id="service-price"
            className="input"
            type="number"
            min="0"
            step="50"
            value={draft.price}
            onChange={(event) => onDraftChange('price', event.target.value)}
          />
        </FormField>

        <Select
          id="service-visibility"
          label="Visibility"
          value={draft.visibility}
          onChange={(event) => onDraftChange('visibility', event.target.value)}
        >
          <option value="Public">Public</option>
          <option value="Private">Private</option>
        </Select>

        <Select
          id="service-status"
          label="Status"
          value={draft.status}
          onChange={(event) => onDraftChange('status', event.target.value)}
        >
          <option value="Active">Active</option>
          <option value="Hidden">Hidden</option>
          <option value="Archived">Archived</option>
        </Select>
      </div>

      <Textarea
        id="service-description"
        label="Description"
        rows={4}
        value={draft.description}
        onChange={(event) => onDraftChange('description', event.target.value)}
      />

      <div className="owner-form-actions">
        <Button type="button" onClick={onSave}>
          {mode === 'create' ? 'Create service' : 'Save changes'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </SectionCard>
  );
}
