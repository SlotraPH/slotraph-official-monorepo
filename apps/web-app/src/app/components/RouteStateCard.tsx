import { Card, EmptyState } from '@slotra/ui';
import type { ReactNode } from 'react';

interface RouteStateCardProps {
  title: string;
  description: string;
  variant: 'loading' | 'error' | 'empty';
  actions?: ReactNode;
}

export function RouteStateCard({ title, description, variant, actions }: RouteStateCardProps) {
  if (variant === 'loading') {
    return (
      <Card>
        <div className="empty-state empty-state--left">
          <div className="empty-state__body">
            <h2 className="empty-state__title">{title}</h2>
            <p className="empty-state__description">{description}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <EmptyState align="left" title={title} description={description} actions={actions} />
    </Card>
  );
}
