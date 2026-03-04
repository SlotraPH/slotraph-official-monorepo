import { Link, NavLink } from 'react-router-dom';
import {
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  LayoutGrid,
  PlugZap,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react';
import symbol from '@slotra/branding/assets/slotra_symbol.png';

const mainNavItems = [
  { label: 'Dashboard', to: '/owner/dashboard', Icon: LayoutDashboard },
  { label: 'Calendar', to: '/owner/calendar', Icon: CalendarDays },
  { label: 'Services', to: '/owner/services', Icon: LayoutGrid },
  { label: 'Customers', to: '/owner/customers', Icon: Users },
  { label: 'Payments', to: '/owner/payments', Icon: CreditCard },
  { label: 'Integrations', to: '/owner/integrations', Icon: PlugZap },
  { label: 'Settings', to: '/owner/settings', Icon: Settings },
] as const;

export function SidebarNav() {
  return (
    <aside className="owner-workspace__sidebar">
      <div className="owner-sidebar">
        <div className="owner-sidebar__brand">
          <img alt="" className="owner-sidebar__brand-symbol" src={symbol} />
          <div className="owner-sidebar__brand-copy">
            <span>Owner workspace</span>
            <strong>Slotra operations</strong>
          </div>
        </div>

        <nav aria-label="Owner navigation" className="owner-sidebar__section">
          <span className="owner-sidebar__section-label">Navigate</span>
          <div className="owner-sidebar__links">
            {mainNavItems.map(({ Icon, label, to }) => (
              <NavLink
                key={to}
                className={({ isActive }) => `owner-sidebar__link${isActive ? ' owner-sidebar__link--active' : ''}`}
                to={to}
              >
                <Icon size={16} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="owner-sidebar__section">
          <span className="owner-sidebar__section-label">Launch</span>
          <div className="owner-sidebar__preview-card">
            <p className="owner-sidebar__preview-title">Public booking preview</p>
            <p className="owner-sidebar__preview-copy">
              Keep the customer-facing route aligned while you update services, hours, and settings.
            </p>
            <Link className="owner-sidebar__preview-link" to="/book">
              Open booking flow
            </Link>
          </div>
          <Link className="owner-sidebar__support-link" to="/owner/onboarding">
            <Sparkles size={15} />
            Review onboarding checklist
          </Link>
        </div>

        <div className="owner-sidebar__profile">
          <div className="owner-sidebar__avatar">DM</div>
          <div>
            <strong>Dheyn Michael</strong>
            <span>Workspace owner</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
