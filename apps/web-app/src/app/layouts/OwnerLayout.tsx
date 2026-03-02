import { Outlet } from 'react-router-dom';
import { SidebarNav } from '@/app/components/SidebarNav';
import { TopBar } from '@/app/components/TopBar';

export function OwnerLayout() {
  return (
    <div className="owner-shell">
      <SidebarNav />
      <div className="owner-shell__content">
        <TopBar />
        <main className="owner-shell__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
