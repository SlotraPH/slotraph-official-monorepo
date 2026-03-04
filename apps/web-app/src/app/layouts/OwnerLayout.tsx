import { Outlet } from 'react-router-dom';
import { AppShell } from '@/app/components/AppShell';
import { SidebarNav } from '@/app/components/SidebarNav';

export function OwnerLayout() {
  return (
    <AppShell contentClassName="app-shell__main--owner">
      <div className="owner-workspace">
        <SidebarNav />
        <div className="owner-workspace__content">
          <main className="owner-workspace__main">
            <Outlet />
          </main>
        </div>
      </div>
    </AppShell>
  );
}
