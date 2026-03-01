import { NavLink } from 'react-router-dom';

const ownerNavItems = [
  { label: 'Dashboard', to: '/owner/dashboard' },
  { label: 'Services', to: '/owner/services' },
  { label: 'Customers', to: '/owner/customers' },
  { label: 'Settings', to: '/owner/settings' },
  { label: 'Onboarding', to: '/owner/onboarding' },
];

export function SidebarNav() {
  return (
    <nav aria-label="Owner navigation" className="sidebar-nav">
      <div className="sidebar-nav__eyebrow">Owner Area</div>
      <ul className="sidebar-nav__list">
        {ownerNavItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'sidebar-nav__link sidebar-nav__link--active' : 'sidebar-nav__link'
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
