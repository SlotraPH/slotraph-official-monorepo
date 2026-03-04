import type { CSSProperties, ReactNode } from 'react';
import { colors, spacing, typography } from './tokens';

export interface SectionHeadingProps {
  align?: 'left' | 'center';
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  style?: CSSProperties;
}

export function SectionHeading({
  action,
  align = 'left',
  description,
  eyebrow,
  style,
  title,
}: SectionHeadingProps) {
  const textAlign = align;
  return (
    <div
      style={{
        alignItems: align === 'center' ? 'center' : 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[2],
        textAlign,
        ...style,
      }}
    >
      {eyebrow ? (
        <span style={{ color: colors.muted, fontFamily: typography.fontFamily, ...typography.overline }}>
          {eyebrow}
        </span>
      ) : null}
      <div
        style={{
          alignItems: align === 'center' ? 'center' : 'flex-start',
          display: 'flex',
          flexDirection: 'column',
          gap: spacing[2],
          width: '100%',
        }}
      >
        <h2 style={{ color: colors.navy, fontFamily: typography.fontFamily, margin: 0, ...typography.sectionHeading }}>
          {title}
        </h2>
        {description ? (
          <p style={{ color: colors.secondary, fontFamily: typography.fontFamily, margin: 0, maxWidth: 720, ...typography.body }}>
            {description}
          </p>
        ) : null}
        {action}
      </div>
    </div>
  );
}
