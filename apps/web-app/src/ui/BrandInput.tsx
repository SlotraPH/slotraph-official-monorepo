import {
  AlertCircle,
  type LucideIcon,
} from 'lucide-react';
import { forwardRef, useId, useState, type CSSProperties, type InputHTMLAttributes, type ReactNode } from 'react';
import { colors, motion, radii, shadows, spacing, typography } from './tokens';
import { FormLabel, type FormLabelProps } from './FormLabel';

export interface BrandInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  error?: string;
  helperText?: string;
  label?: string;
  labelProps?: Omit<FormLabelProps, 'children'>;
  leadingIcon?: LucideIcon;
  trailingContent?: ReactNode;
  inputStyle?: CSSProperties;
  fieldStyle?: CSSProperties;
}

export const BrandInput = forwardRef<HTMLInputElement, BrandInputProps>(function BrandInput(
  {
    error,
    fieldStyle,
    helperText,
    id,
    inputStyle,
    label,
    labelProps,
    leadingIcon: LeadingIcon,
    style,
    trailingContent,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = helperText || error ? `${inputId}-hint` : undefined;
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(error);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label ? <FormLabel htmlFor={inputId} {...labelProps}>{label}</FormLabel> : null}
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
        <input
          {...props}
          id={inputId}
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
            paddingRight: hasError || trailingContent ? 42 : 14,
            transition: motion.color,
            width: '100%',
            ...inputStyle,
          }}
        />
        {trailingContent ? (
          <span
            style={{
              alignItems: 'center',
              display: 'inline-flex',
              position: 'absolute',
              right: 14,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            {trailingContent}
          </span>
        ) : null}
        {!trailingContent && hasError ? (
          <span
            aria-hidden="true"
            style={{
              color: colors.error,
              display: 'inline-flex',
              position: 'absolute',
              right: 14,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <AlertCircle size={15} />
          </span>
        ) : null}
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
