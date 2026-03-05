import type { HTMLAttributes } from 'react';
import { Card } from './Card';
import { cx } from './helpers';

interface MetricCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
}

export function MetricCard({ className, label, value, ...props }: MetricCardProps) {
  return (
    <Card {...props} className={cx('metric-card', className)} padding={4}>
      <span className="metric-card__label">{label}</span>
      <strong className="metric-card__value">{value}</strong>
    </Card>
  );
}
