import { Badge, Card } from '@slotra/ui';
import type { BookingBusinessProfile } from '../types';

interface BusinessHeaderProps {
  business: BookingBusinessProfile;
}

export function BusinessHeader({ business }: BusinessHeaderProps) {
  return (
    <Card className="booking-business-header">
      <div className="booking-business-header__identity">
        <div className="booking-business-header__avatar" aria-hidden="true">
          {business.name
            .split(' ')
            .slice(0, 2)
            .map((part) => part[0])
            .join('')}
        </div>
        <div className="booking-business-header__copy">
          <div className="booking-business-header__meta">
            <Badge variant="accent">{business.category}</Badge>
            <span>{business.city}</span>
            <span>{business.responseTime}</span>
          </div>
          <h1>{business.name}</h1>
          <p>{business.description}</p>
        </div>
      </div>
      <div className="booking-business-header__stats" aria-label="Business highlights">
        <div>
          <strong>{business.rating?.toFixed(1) ?? '0.0'}</strong>
          <span>Average rating</span>
        </div>
        <div>
          <strong>{business.reviewCount ?? 0}+</strong>
          <span>Recent reviews</span>
        </div>
      </div>
    </Card>
  );
}
