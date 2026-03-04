import type { CSSProperties, HTMLAttributes } from 'react';
import { colors, radii, shadows, spacing } from './tokens';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: keyof typeof spacing;
  elevated?: boolean;
  surfaceStyle?: CSSProperties;
}

export function Card({
  children,
  elevated,
  padding = 5,
  style,
  surfaceStyle,
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      style={{
        background: '#ffffff',
        border: `1px solid ${colors.border}`,
        borderRadius: radii.xl,
        boxShadow: elevated ? shadows.elevated : shadows.card,
        padding: spacing[padding],
        ...surfaceStyle,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
