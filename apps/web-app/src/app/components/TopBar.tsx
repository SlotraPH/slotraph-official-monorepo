import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/owner/calendar': 'Calendar',
  '/owner/services': 'Services',
  '/owner/customers': 'Customers',
  '/owner/payments': 'Payments',
  '/owner/integrations': 'Integrations',
  '/owner/settings': 'Settings',
  '/owner/onboarding': 'Onboarding',
  '/owner/dashboard': 'Dashboard',
};

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 4v12M4 10h12" strokeLinecap="round" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="11" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="11" width="6" height="6" rx="1" />
      <rect x="11" y="11" width="6" height="6" rx="1" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
      <circle cx="4" cy="10" r="1.5" />
      <circle cx="10" cy="10" r="1.5" />
      <circle cx="16" cy="10" r="1.5" />
    </svg>
  );
}

export function TopBar() {
  const { pathname } = useLocation();

  // Match using prefix so nested routes (e.g. /owner/settings/brand) still get the right title
  const title =
    Object.entries(pageTitles).find(([path]) => pathname.startsWith(path))?.[1] ?? 'Dashboard';

  return (
    <header className="topbar">
      <div className="topbar__left">
        <h1 className="topbar__page-title">{title}</h1>
      </div>
      <div className="topbar__right">
        <button className="topbar__icon-btn" type="button" aria-label="View options">
          <GridIcon />
        </button>
        <button className="topbar__icon-btn" type="button" aria-label="Add new">
          <PlusIcon />
        </button>
        <button className="topbar__icon-btn" type="button" aria-label="More options">
          <DotsIcon />
        </button>
      </div>
    </header>
  );
}
