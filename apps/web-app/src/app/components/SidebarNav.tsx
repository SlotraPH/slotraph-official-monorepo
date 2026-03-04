import { Link, NavLink } from 'react-router-dom';

// Icons stay local to avoid pulling another dependency into the owner shell.
function CalendarIcon() {
  return (
    <svg className="sidebar__nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="14" height="14" rx="2" />
      <path d="M3 8h14M7 2v4M13 2v4" strokeLinecap="round" />
    </svg>
  );
}

function ServicesIcon() {
  return (
    <svg className="sidebar__nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 6h12M4 10h8M4 14h6" strokeLinecap="round" />
    </svg>
  );
}

function CustomersIcon() {
  return (
    <svg className="sidebar__nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="7" r="3" />
      <path d="M2 17c0-3.314 2.686-6 6-6s6 2.686 6 6" strokeLinecap="round" />
      <path d="M15 5a3 3 0 0 1 0 6M18 17c0-2.5-1.5-4.5-3-5.5" strokeLinecap="round" />
    </svg>
  );
}

function PaymentsIcon() {
  return (
    <svg className="sidebar__nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="5" width="16" height="12" rx="2" />
      <path d="M2 9h16" strokeLinecap="round" />
      <path d="M6 13h2M10 13h4" strokeLinecap="round" />
    </svg>
  );
}

function IntegrationsIcon() {
  return (
    <svg className="sidebar__nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="5" cy="10" r="2" />
      <circle cx="15" cy="5" r="2" />
      <circle cx="15" cy="15" r="2" />
      <path d="M7 10h3M12.5 6.5 10 8.5M12.5 13.5 10 11.5" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg className="sidebar__nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="10" cy="10" r="3" />
      <path
        d="M10 2v1.5M10 16.5V18M2 10h1.5M16.5 10H18M4.22 4.22l1.06 1.06M14.72 14.72l1.06 1.06M4.22 15.78l1.06-1.06M14.72 5.28l1.06-1.06"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GettingStartedIcon() {
  return (
    <svg className="sidebar__nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 3l2 4 4.5.65-3.25 3.17.77 4.48L10 13.2l-4.02 2.1.77-4.48L3.5 7.65 8 7z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg className="sidebar__nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="10" cy="10" r="8" />
      <path d="M7.5 7.5a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4" strokeLinecap="round" />
      <circle cx="10" cy="15" r=".75" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      style={{ width: 14, height: 14 }}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M13 3l4 4-4 4M17 7H9a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      style={{ width: 12, height: 12 }}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M10 1.5l2.17 4.4 4.83.7-3.5 3.41.83 4.82L10 12.4l-4.33 2.27.83-4.82-3.5-3.4 4.83-.71z" />
    </svg>
  );
}

const mainNavItems = [
  { label: 'Calendar', to: '/owner/calendar', Icon: CalendarIcon },
  { label: 'Services', to: '/owner/services', Icon: ServicesIcon },
  { label: 'Customers', to: '/owner/customers', Icon: CustomersIcon },
  { label: 'Payments', to: '/owner/payments', Icon: PaymentsIcon },
  { label: 'Integrations', to: '/owner/integrations', Icon: IntegrationsIcon },
  { label: 'Settings', to: '/owner/settings', Icon: SettingsIcon },
];

export function SidebarNav() {
  return (
    <aside className="owner-shell__sidebar">
      <div className="sidebar">
        <div className="sidebar__logo">
          <div className="sidebar__logo-mark">S</div>
          <span className="sidebar__logo-name">Slotra</span>
        </div>

        <nav aria-label="Owner navigation" className="sidebar__nav">
          <ul className="sidebar__nav-list">
            {mainNavItems.map(({ label, to, Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    ['sidebar__nav-item', isActive ? 'sidebar__nav-item--active' : ''].filter(Boolean).join(' ')
                  }
                >
                  <Icon />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar__share-link">
          <Link className="sidebar__share-btn" to="/book">
            Open your booking page preview
            <ShareIcon />
          </Link>
        </div>

        <div className="sidebar__pro-card">
          <p className="sidebar__pro-card-title">Finish your core setup first</p>
          <Link className="sidebar__pro-btn" to="/owner/onboarding">
            <StarIcon />
            Review onboarding
          </Link>
          <Link className="sidebar__pro-link" to="/owner/settings/booking">Review booking settings</Link>
        </div>

        <div className="sidebar__bottom">
          <Link className="sidebar__util-item" to="/owner/onboarding">
            <GettingStartedIcon />
            Getting started
          </Link>
          <Link className="sidebar__util-item" to="/owner/settings">
            <HelpIcon />
            Help &amp; Support
          </Link>
        </div>

        <div className="sidebar__user">
          <div className="sidebar__avatar">
            D
            <span className="sidebar__avatar-dot" />
          </div>
          <span className="sidebar__user-name">Dheyn Michael</span>
        </div>
      </div>
    </aside>
  );
}
