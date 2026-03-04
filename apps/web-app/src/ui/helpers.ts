import type { CSSProperties } from 'react';
import { colors, motion, radii, shadows, spacing, typography } from './tokens';

type TypographyStyleToken = Exclude<keyof typeof typography, 'fontFamily'>;

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export function stackStyle(gap: keyof typeof spacing): CSSProperties {
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[gap],
  };
}

export function typographyStyle(
  token: TypographyStyleToken,
  color = colors.navy,
): CSSProperties {
  return {
    fontFamily: typography.fontFamily,
    color,
    ...typography[token],
  };
}

export function panelStyle(overrides?: CSSProperties): CSSProperties {
  return {
    background: '#ffffff',
    border: `1px solid ${colors.border}`,
    borderRadius: radii.xl,
    boxShadow: shadows.card,
    ...overrides,
  };
}

export function interactiveStyle(overrides?: CSSProperties): CSSProperties {
  return {
    transition: motion.interactive,
    ...overrides,
  };
}
