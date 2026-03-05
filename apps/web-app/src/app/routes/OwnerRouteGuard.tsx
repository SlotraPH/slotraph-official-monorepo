import { Button } from '@slotra/ui';
import type { ReactNode } from 'react';
import { RouteStateCard } from '@/app/components/RouteStateCard';
import { appConfig } from '@/config/env';
import { getOwnerRouteAccessResource } from '@/features/auth/data';

interface OwnerRouteGuardProps {
  children: ReactNode;
}

export function OwnerRouteGuard({ children }: OwnerRouteGuardProps) {
  const resource = getOwnerRouteAccessResource();

  if (resource.status === 'loading') {
    return <RouteStateCard title="Loading owner access" description="Checking the owner auth boundary before rendering protected routes." variant="loading" />;
  }

  if (resource.status === 'error') {
    return <RouteStateCard title="Owner access unavailable" description={resource.message} variant="error" onRetry={() => window.location.reload()} />;
  }

  if (resource.data.session.status !== 'authenticated') {
    return (
      <RouteStateCard
        title="Owner access is guarded"
        description={`Owner routes are behind a frontend auth boundary. Current mode: ${appConfig.ownerAuthMode}.`}
        variant="empty"
        actions={<Button type="button" variant="outline">Mock sign-in required</Button>}
      />
    );
  }

  return <>{children}</>;
}
