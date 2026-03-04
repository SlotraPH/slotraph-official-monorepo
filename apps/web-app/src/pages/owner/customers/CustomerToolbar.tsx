import { Select } from '@slotra/ui';

interface CustomerToolbarProps {
  query: string;
  status: string;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function CustomerToolbar({
  query,
  status,
  onQueryChange,
  onStatusChange,
}: CustomerToolbarProps) {
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
          placeholder="Search by name, email, or tag"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>

      <Select
        className="owner-toolbar__select"
        aria-label="Filter customers by status"
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
      >
        <option value="All">All customers</option>
        <option value="VIP">VIP</option>
        <option value="Active">Active</option>
        <option value="New">New</option>
        <option value="Needs follow-up">Needs follow-up</option>
      </Select>
    </div>
  );
}
