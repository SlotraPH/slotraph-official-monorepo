import { BadgePlus, CircleSlash, FileEdit, Save } from 'lucide-react';
import type { ServiceRecord } from '@/domain/service/types';
import { BrandButton, BrandInput, BrandSelect, BrandTextarea, Card } from '@/ui';

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
    <Card className="service-editor-panel" as="section" padding={5}>
      <div className="service-editor-panel__header">
        <span className="service-editor-panel__mode">{mode === 'create' ? 'New draft' : 'Editing selected service'}</span>
        <h2>{mode === 'create' ? 'Create service' : 'Service editor'}</h2>
        <p>All changes stay local to this browser session in Phase 5.</p>
      </div>

      <div className="service-editor-panel__grid">
        <BrandInput
          autoComplete="off"
          label="Service name"
          placeholder="Ex: Signature haircut"
          value={draft.name}
          onChange={(event) => onDraftChange('name', event.target.value)}
        />
        <BrandInput
          autoComplete="off"
          label="Category"
          placeholder="Ex: Hair"
          value={draft.category}
          onChange={(event) => onDraftChange('category', event.target.value)}
        />
        <BrandInput
          label="Duration (minutes)"
          min="15"
          step="15"
          type="number"
          value={draft.durationMinutes}
          onChange={(event) => onDraftChange('durationMinutes', event.target.value)}
        />
        <BrandInput
          label="Price (PHP)"
          min="0"
          step="50"
          type="number"
          value={draft.price}
          onChange={(event) => onDraftChange('price', event.target.value)}
        />
        <BrandSelect
          label="Visibility"
          value={draft.visibility}
          onChange={(event) => onDraftChange('visibility', event.target.value)}
        >
          <option value="Public">Public</option>
          <option value="Private">Private</option>
        </BrandSelect>
        <BrandSelect
          label="Status"
          value={draft.status}
          onChange={(event) => onDraftChange('status', event.target.value)}
        >
          <option value="Active">Active</option>
          <option value="Hidden">Hidden</option>
          <option value="Archived">Archived</option>
        </BrandSelect>
      </div>

      <BrandTextarea
        helperText="Shown to customers in booking surfaces when visibility is public."
        label="Description"
        rows={4}
        value={draft.description}
        onChange={(event) => onDraftChange('description', event.target.value)}
      />

      <div className="service-editor-panel__tips">
        <span><BadgePlus size={14} /> Keep names short and specific for faster booking decisions.</span>
        <span><FileEdit size={14} /> Update status to hidden while revising prices internally.</span>
      </div>

      <div className="service-editor-panel__actions">
        <BrandButton fullWidth startIcon={<Save size={15} />} onClick={onSave}>
          {mode === 'create' ? 'Create service' : 'Save changes'}
        </BrandButton>
        <BrandButton fullWidth startIcon={<CircleSlash size={15} />} variant="secondary" onClick={onCancel}>
          Cancel
        </BrandButton>
      </div>
    </Card>
  );
}
