import { Outlet } from 'react-router-dom';
import { AppShell } from '@/app/components/AppShell';
import { SidebarNav } from '@/app/components/SidebarNav';

export function OwnerLayout() {
  return (
    <AppShell contentClassName="app-shell__main--owner">
      <div className="owner-workspace">
        <SidebarNav />
        <div className="owner-workspace__content">
          <div className="owner-workspace__main">
            <Outlet />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
