import { FilterX, LayoutGrid, List, Plus, Search } from 'lucide-react';
import { BrandButton, BrandInput, BrandSelect } from '@/ui';

interface ServiceToolbarProps {
  query: string;
  status: string;
  viewMode: 'cards' | 'table';
  hasActiveFilters: boolean;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onViewModeChange: (value: 'cards' | 'table') => void;
  onClearFilters: () => void;
  onAddService: () => void;
}

export function ServiceToolbar({
  query,
  status,
  viewMode,
  hasActiveFilters,
  onQueryChange,
  onStatusChange,
  onViewModeChange,
  onClearFilters,
  onAddService,
}: ServiceToolbarProps) {
  return (
    <div className="services-toolbar-card">
      <div className="services-toolbar__filters">
        <BrandInput
          aria-label="Search services by name or category"
          inputStyle={{ height: 42 }}
          leadingIcon={Search}
          placeholder="Search by name or category"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        <BrandSelect
          aria-label="Filter services by status"
          selectStyle={{ height: 42 }}
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
        >
          <option value="All">All statuses</option>
          <option value="Active">Active</option>
          <option value="Hidden">Hidden</option>
          <option value="Archived">Archived</option>
        </BrandSelect>
      </div>

      <div className="services-toolbar__actions">
        <div aria-label="Service view mode" className="services-view-toggle" role="group">
          <button
            aria-pressed={viewMode === 'cards'}
            className="services-view-toggle__button"
            type="button"
            onClick={() => onViewModeChange('cards')}
          >
            <LayoutGrid size={14} />
            Cards
          </button>
          <button
            aria-pressed={viewMode === 'table'}
            className="services-view-toggle__button"
            type="button"
            onClick={() => onViewModeChange('table')}
          >
            <List size={14} />
            Table
          </button>
        </div>
        {hasActiveFilters ? (
          <BrandButton size="nav" startIcon={<FilterX size={14} />} variant="secondary" onClick={onClearFilters}>
            Clear
          </BrandButton>
        ) : null}
        <BrandButton size="nav" startIcon={<Plus size={14} />} onClick={onAddService}>
          Create service
        </BrandButton>
      </div>
    </div>
  );
}
