import { ChevronDown, type LucideIcon } from 'lucide-react';
import { forwardRef, useId, useState, type CSSProperties, type ReactNode, type SelectHTMLAttributes } from 'react';
import { FormLabel, type FormLabelProps } from './FormLabel';
import { colors, motion, radii, spacing, typography } from './tokens';

export interface BrandSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  helperText?: string;
  label?: string;
  labelProps?: Omit<FormLabelProps, 'children'>;
  leadingIcon?: LucideIcon;
  fieldStyle?: CSSProperties;
  selectStyle?: CSSProperties;
  trailingContent?: ReactNode;
}

export const BrandSelect = forwardRef<HTMLSelectElement, BrandSelectProps>(function BrandSelect(
  {
    children,
    error,
    fieldStyle,
    helperText,
    id,
    label,
    labelProps,
    leadingIcon: LeadingIcon,
    selectStyle,
    style,
    trailingContent,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const helperId = helperText || error ? `${selectId}-hint` : undefined;
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(error);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label ? <FormLabel htmlFor={selectId} {...labelProps}>{label}</FormLabel> : null}
      <div style={{ position: 'relative', ...fieldStyle }}>
        {LeadingIcon ? (
          <span
            aria-hidden="true"
            style={{
              color: hasError ? colors.error : colors.inputIcon,
              display: 'inline-flex',
              left: 14,
              pointerEvents: 'none',
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <LeadingIcon size={15} />
          </span>
        ) : null}
        <select
          {...props}
          id={selectId}
          ref={ref}
          aria-describedby={helperId}
          aria-invalid={hasError}
          onBlur={(event) => {
            setFocused(false);
            props.onBlur?.(event);
          }}
          onFocus={(event) => {
            setFocused(true);
            props.onFocus?.(event);
          }}
          style={{
            appearance: 'none',
            background: '#ffffff',
            border: `1px solid ${hasError ? colors.error : focused ? colors.brand : colors.inputBorder}`,
            borderRadius: radii.md,
            boxShadow: hasError
              ? `0 0 0 3px ${colors.errorRing}, 0 1px 2px rgba(0,0,0,0.04)`
              : focused
                ? `0 0 0 3px ${colors.brandRing}, 0 1px 2px rgba(0,0,0,0.04)`
                : '0 1px 2px rgba(0,0,0,0.04)',
            color: colors.navy,
            fontFamily: typography.fontFamily,
            fontSize: typography.bodySmall.fontSize,
            height: 44,
            lineHeight: typography.bodySmall.lineHeight,
            outline: 'none',
            paddingInline: LeadingIcon ? 40 : 14,
            paddingRight: trailingContent ? 72 : 42,
            transition: motion.color,
            width: '100%',
            ...selectStyle,
          }}
        >
          {children}
        </select>
        <span
          aria-hidden="true"
          style={{
            alignItems: 'center',
            color: hasError ? colors.error : colors.inputIcon,
            display: 'inline-flex',
            gap: spacing[2],
            pointerEvents: 'none',
            position: 'absolute',
            right: 14,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          {trailingContent}
          <ChevronDown size={15} />
        </span>
      </div>
      {helperId ? (
        <p
          id={helperId}
          style={{
            color: hasError ? colors.error : colors.muted,
            fontFamily: typography.fontFamily,
            fontSize: typography.label.fontSize,
            lineHeight: typography.label.lineHeight,
            margin: 0,
            minHeight: spacing[3],
          }}
        >
          {error ?? helperText}
        </p>
      ) : null}
    </div>
  );
});
