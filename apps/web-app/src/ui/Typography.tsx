import type { CSSProperties, ElementType, ReactNode } from 'react';
import { colors, typography } from './tokens';

type TypographyVariant =
  | 'hero'
  | 'sectionHeading'
  | 'subHeading'
  | 'bodyLarge'
  | 'body'
  | 'bodySmall'
  | 'label'
  | 'caption'
  | 'overline';

export interface TypographyProps<T extends ElementType = 'p'> {
  as?: T;
  children: ReactNode;
  color?: string;
  style?: CSSProperties;
  variant: TypographyVariant;
}

export function Typography<T extends ElementType = 'p'>({
  as,
  children,
  color = colors.navy,
  style,
  variant,
}: TypographyProps<T>) {
  const Component = (as ?? 'p') as ElementType;
  return (
    <Component
      style={{
        color,
        fontFamily: typography.fontFamily,
        margin: 0,
        ...typography[variant],
        ...style,
      }}
    >
      {children}
    </Component>
  );
}
