import { Card, EmptyState } from '@slotra/ui';
import type { ReactNode } from 'react';
import { RefreshCcw } from 'lucide-react';
import { BrandButton } from '@/ui';

interface RouteStateCardProps {
  title: string;
  description: string;
  variant: 'loading' | 'error' | 'empty';
  actions?: ReactNode;
  onRetry?: () => void;
}

export function RouteStateCard({ title, description, variant, actions, onRetry }: RouteStateCardProps) {
  const actionContent = variant === 'error' && onRetry
    ? (
      <div className="route-state-card__actions">
        {actions}
        <BrandButton size="nav" startIcon={<RefreshCcw size={14} />} variant="secondary" onClick={onRetry}>
          Retry
        </BrandButton>
      </div>
      )
    : actions;

  if (variant === 'loading') {
    return (
      <Card className="route-state-card route-state-card--loading">
        <div className="empty-state empty-state--left">
          <div className="route-state-card__skeleton" aria-hidden="true" />
          <div className="empty-state__body">
            <h2 className="empty-state__title">{title}</h2>
            <p className="empty-state__description">{description}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`route-state-card route-state-card--${variant}`}>
      <EmptyState align="left" title={title} description={description} actions={actionContent} />
    </Card>
  );
}
