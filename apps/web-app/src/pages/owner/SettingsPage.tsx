import { OwnerPageScaffold, PageIntro } from '@/app/components/PageTemplates';
import { NavLink, Outlet } from 'react-router-dom';

const SETTINGS_TABS = [
  { label: 'Brand Details', to: '/owner/settings/brand', enabled: true },
  { label: 'Business Profile', to: '/owner/settings/business', enabled: true },
  { label: 'Team', to: '/owner/settings/team', enabled: true },
  { label: 'Notifications', to: '/owner/settings/notifications', enabled: true },
  { label: 'Domain', to: '/owner/settings/domain', enabled: true },
  { label: 'Booking', to: '/owner/settings/booking', enabled: true },
  { label: 'Publish', to: '/owner/settings/publish', enabled: true },
];

export function SettingsPage() {
  return (
    <OwnerPageScaffold>
      <PageIntro
        eyebrow="Settings"
        title="Configuration and launch controls"
        description="Manage brand setup, operations defaults, communication templates, domain connection, and publish readiness from one settings workspace."
      />
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

      <div className="settings-panel">
        <Outlet />
      </div>
    </OwnerPageScaffold>
  );
}
