import { AlertCircle, type LucideIcon } from 'lucide-react';
import { forwardRef, useId, useState, type CSSProperties, type TextareaHTMLAttributes } from 'react';
import { FormLabel, type FormLabelProps } from './FormLabel';
import { colors, motion, radii, spacing, typography } from './tokens';

export interface BrandTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  helperText?: string;
  label?: string;
  labelProps?: Omit<FormLabelProps, 'children'>;
  leadingIcon?: LucideIcon;
  textareaStyle?: CSSProperties;
  fieldStyle?: CSSProperties;
}

export const BrandTextarea = forwardRef<HTMLTextAreaElement, BrandTextareaProps>(function BrandTextarea(
  {
    error,
    fieldStyle,
    helperText,
    id,
    label,
    labelProps,
    leadingIcon: LeadingIcon,
    style,
    textareaStyle,
    ...props
  },
  ref,
) {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const helperId = helperText || error ? `${textareaId}-hint` : undefined;
    const [focused, setFocused] = useState(false);
    const hasError = Boolean(error);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
        {label ? <FormLabel htmlFor={textareaId} {...labelProps}>{label}</FormLabel> : null}
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
                top: 16,
              }}
            >
              <LeadingIcon size={15} />
            </span>
          ) : null}
          <textarea
            {...props}
            id={textareaId}
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
              lineHeight: typography.bodySmall.lineHeight,
              minHeight: 112,
              outline: 'none',
              paddingBottom: 14,
              paddingInline: LeadingIcon ? 40 : 14,
              paddingTop: 12,
              paddingRight: hasError ? 42 : 14,
              resize: 'vertical',
              transition: motion.color,
              width: '100%',
              ...textareaStyle,
            }}
          />
          {hasError ? (
            <span
              aria-hidden="true"
              style={{
                color: colors.error,
                display: 'inline-flex',
                position: 'absolute',
                right: 14,
                top: 16,
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
