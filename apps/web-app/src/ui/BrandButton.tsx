import { forwardRef, useState, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';
import { colors, motion, radii, shadows, spacing, typography } from './tokens';

type BrandButtonVariant = 'primary' | 'secondary';
type BrandButtonSize = 'nav' | 'form';

export interface BrandButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BrandButtonVariant;
  size?: BrandButtonSize;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  fullWidth?: boolean;
  surfaceStyle?: CSSProperties;
}

const sizeStyles: Record<BrandButtonSize, CSSProperties> = {
  nav: { height: 34, paddingInline: 16, borderRadius: radii.md, fontSize: '13px' },
  form: { height: 44, paddingInline: 20, borderRadius: radii.lg, fontSize: typography.button.fontSize },
};

function resolveVariantStyle(variant: BrandButtonVariant, hovered: boolean, disabled?: boolean): CSSProperties {
  if (variant === 'secondary') {
    return {
      color: hovered ? colors.navy : colors.secondary,
      border: `1px solid ${colors.inputBorderDefault}`,
      background: hovered
        ? 'linear-gradient(180deg, #f9fafb 0%, #eceef1 100%)'
        : 'linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%)',
      boxShadow: hovered
        ? 'inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 4px rgba(0,0,0,0.08)'
        : 'inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 3px rgba(0,0,0,0.05)',
      opacity: disabled ? 0.65 : 1,
    };
  }

  return {
    color: '#ffffff',
    border: '1px solid rgba(0,0,0,0.18)',
    background: hovered
      ? 'linear-gradient(180deg, #3538b5 0%, #272a86 100%)'
      : 'linear-gradient(180deg, #3336a4 0%, #2a2d8c 100%)',
    boxShadow: hovered
      ? `${shadows.insetHighlightHover}, ${shadows.brandGlowMd}`
      : `${shadows.insetHighlight}, ${shadows.brandGlowSm}`,
    opacity: disabled ? 0.72 : 1,
  };
}

export const BrandButton = forwardRef<HTMLButtonElement, BrandButtonProps>(function BrandButton(
  {
    children,
    className,
    disabled,
    endIcon,
    fullWidth,
    size = 'form',
    startIcon,
    style,
    surfaceStyle,
    type = 'button',
    variant = 'primary',
    ...props
  },
  ref,
) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      {...props}
      ref={ref}
      className={className}
      disabled={disabled}
      type={type}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        alignItems: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        fontFamily: typography.fontFamily,
        fontWeight: typography.button.fontWeight,
        gap: spacing[2],
        justifyContent: 'center',
        letterSpacing: typography.button.letterSpacing,
        transition: motion.interactive,
        whiteSpace: 'nowrap',
        width: fullWidth ? '100%' : undefined,
        ...sizeStyles[size],
        ...resolveVariantStyle(variant, hovered && !disabled, disabled),
        ...surfaceStyle,
        ...style,
      }}
      data-variant={variant}
    >
      {startIcon ? <span aria-hidden="true" style={{ display: 'inline-flex' }}>{startIcon}</span> : null}
      <span>{children}</span>
      {endIcon ? <span aria-hidden="true" style={{ display: 'inline-flex' }}>{endIcon}</span> : null}
    </button>
  );
});
