import { Button, Select } from '@slotra/ui';

interface ServiceToolbarProps {
  query: string;
  status: string;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onAddService: () => void;
}

export function ServiceToolbar({
  query,
  status,
  onQueryChange,
  onStatusChange,
  onAddService,
}: ServiceToolbarProps) {
  return (
    <div className="owner-toolbar">
      <div className="owner-toolbar__search">
        <svg className="owner-toolbar__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75">
          <circle cx="8.5" cy="8.5" r="5.25" />
          <path d="M12.5 12.5L17 17" strokeLinecap="round" />
        </svg>
        <input
          className="input owner-toolbar__input"
          type="search"
          placeholder="Search services by name or category"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>

      <Select
        className="owner-toolbar__select"
        aria-label="Filter services by status"
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
      >
        <option value="All">All statuses</option>
        <option value="Active">Active</option>
        <option value="Hidden">Hidden</option>
        <option value="Archived">Archived</option>
      </Select>

      <Button size="sm" type="button" onClick={onAddService}>
        Add service
      </Button>
    </div>
  );
}
