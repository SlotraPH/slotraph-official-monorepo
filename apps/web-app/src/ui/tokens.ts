export type SlotraColorToken =
  | 'brand'
  | 'brandHover'
  | 'brandLight'
  | 'navy'
  | 'page'
  | 'secondary'
  | 'muted'
  | 'border'
  | 'inputBorder'
  | 'inputBorderDefault'
  | 'inputIcon'
  | 'divider'
  | 'dividerStrong'
  | 'error'
  | 'errorRing'
  | 'brandRing'
  | 'toastFill';

export const colors = {
  brand: '#2e3192',
  brandHover: '#252880',
  brandLight: '#ecedf9',
  navy: '#0f1f2e',
  page: '#f7f8fa',
  secondary: '#4a5668',
  muted: '#7a8799',
  border: '#e2e6ea',
  inputBorder: '#d4d8de',
  inputBorderDefault: '#d0d5dd',
  inputIcon: '#a0aab4',
  divider: '#f0f1f3',
  dividerStrong: '#dde1e7',
  error: '#e53e3e',
  errorRing: 'rgba(229,62,62,0.10)',
  brandRing: 'rgba(46,49,146,0.08)',
  toastFill: '#0f1f2e',
} as const satisfies Record<SlotraColorToken, string>;

export const spacing = {
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  24: 96,
} as const;

export const radii = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 16,
  full: 9999,
} as const;

export const shadows = {
  card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  elevated: '0 4px 16px rgba(0,0,0,0.08)',
  brandGlowSm: '0 2px 6px rgba(46,49,146,0.25)',
  brandGlowMd: '0 3px 10px rgba(46,49,146,0.4)',
  brandGlowLg: '0 24px 64px rgba(46,49,146,0.2)',
  insetHighlight: 'inset 0 1px 0 rgba(255,255,255,0.14)',
  insetHighlightHover: 'inset 0 1px 0 rgba(255,255,255,0.18)',
} as const;

export const motion = {
  interactive: 'all 150ms ease',
  color: 'color 150ms ease, border-color 150ms ease, box-shadow 150ms ease, background 150ms ease',
  page: 'all 300ms ease',
  float: '4s ease-in-out infinite',
  drawIn: '0.6s ease-out',
  tilt: 'transform 0.2s ease-out',
} as const;

export const typography = {
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  hero: {
    fontSize: 'clamp(34px, 5vw, 46px)',
    fontWeight: 700,
    letterSpacing: '-0.03em',
    lineHeight: 1.1,
  },
  sectionHeading: {
    fontSize: 'clamp(28px, 3vw, 32px)',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
  },
  subHeading: {
    fontSize: 'clamp(22px, 2.5vw, 24px)',
    fontWeight: 700,
    letterSpacing: '-0.015em',
    lineHeight: 1.3,
  },
  bodyLarge: {
    fontSize: '16px',
    fontWeight: 400,
    letterSpacing: '0',
    lineHeight: 1.75,
  },
  body: {
    fontSize: '15px',
    fontWeight: 400,
    letterSpacing: '0',
    lineHeight: 1.75,
  },
  bodySmall: {
    fontSize: '14px',
    fontWeight: 400,
    letterSpacing: '0',
    lineHeight: 1.6,
  },
  label: {
    fontSize: '12px',
    fontWeight: 500,
    letterSpacing: '0',
    lineHeight: 1.5,
  },
  caption: {
    fontSize: '13px',
    fontWeight: 400,
    letterSpacing: '0',
    lineHeight: 1.5,
  },
  overline: {
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    lineHeight: 1.4,
    textTransform: 'uppercase' as const,
  },
  navLink: {
    fontSize: '13.5px',
    fontWeight: 500,
    letterSpacing: '0',
    lineHeight: 1.4,
  },
  button: {
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '0.1px',
    lineHeight: 1.2,
  },
} as const;

export const layout = {
  maxWidth: 1200,
  contentPaddingDesktop: 32,
  contentPaddingMobile: 24,
} as const;

export type SlotraTokens = {
  colors: typeof colors;
  spacing: typeof spacing;
  radii: typeof radii;
  shadows: typeof shadows;
  motion: typeof motion;
  typography: typeof typography;
  layout: typeof layout;
};

export const slotraTokens: SlotraTokens = {
  colors,
  spacing,
  radii,
  shadows,
  motion,
  typography,
  layout,
};
