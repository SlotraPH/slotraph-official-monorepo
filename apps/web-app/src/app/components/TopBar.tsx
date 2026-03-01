import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/owner/dashboard': 'Dashboard',
  '/owner/services': 'Services',
  '/owner/customers': 'Customers',
  '/owner/settings': 'Settings',
  '/owner/onboarding': 'Onboarding',
};

export function TopBar() {
  const { pathname } = useLocation();

  return (
    <header className="topbar">
      <div>
        <p className="topbar__brand">Slotra</p>
        <h1 className="topbar__title">{pageTitles[pathname] ?? 'Owner Area'}</h1>
      </div>
    </header>
  );
}
