import type { CSSProperties, ElementType, HTMLAttributes } from 'react';
import { colors, radii, shadows, spacing } from './tokens';

type CardElement = HTMLDivElement;

export interface CardProps extends HTMLAttributes<CardElement> {
  as?: ElementType;
  padding?: keyof typeof spacing;
  elevated?: boolean;
  surfaceStyle?: CSSProperties;
}

export function Card({
  as: Component = 'div',
  children,
  elevated,
  padding = 5,
  style,
  surfaceStyle,
  ...props
}: CardProps) {
  return (
    <Component
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
    </Component>
  );
}
