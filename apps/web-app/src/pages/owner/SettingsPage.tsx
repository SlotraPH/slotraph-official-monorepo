import { PageHeader } from '@slotra/ui';
import { NavLink, Outlet } from 'react-router-dom';

const SETTINGS_TABS = [
  { label: 'Brand Details', to: '/owner/settings/brand', enabled: true },
  { label: 'Team', to: '/owner/settings/team', enabled: false },
  { label: 'Notifications', to: '/owner/settings/notifications', enabled: false },
  { label: 'Billing', to: '/owner/settings/billing', enabled: false },
];

export function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Manage your account, brand, and preferences."
      />

      {/* Tab navigation */}
      <nav className="settings-tabs" aria-label="Settings sections">
        {SETTINGS_TABS.map((tab) =>
          tab.enabled ? (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                ['settings-tab', isActive ? 'settings-tab--active' : ''].filter(Boolean).join(' ')
              }
            >
              {tab.label}
            </NavLink>
          ) : (
            <button key={tab.to} className="settings-tab settings-tab--disabled" disabled>
              {tab.label}
              <span className="settings-tab__soon">Soon</span>
            </button>
          )
        )}
      </nav>

      {/* Active settings panel */}
      <div className="settings-panel">
        <Outlet />
      </div>
    </div>
  );
}
