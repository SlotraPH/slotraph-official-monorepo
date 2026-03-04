import type { CSSProperties, LabelHTMLAttributes } from 'react';
import { colors, typography } from './tokens';

export interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  optionalText?: string;
  labelStyle?: CSSProperties;
}

export function FormLabel({
  children,
  labelStyle,
  optionalText,
  required,
  style,
  ...props
}: FormLabelProps) {
  return (
    <label
      {...props}
      style={{
        alignItems: 'center',
        color: colors.secondary,
        display: 'flex',
        fontFamily: typography.fontFamily,
        fontSize: typography.label.fontSize,
        fontWeight: typography.label.fontWeight,
        gap: 6,
        lineHeight: typography.label.lineHeight,
        textAlign: 'left',
        ...labelStyle,
        ...style,
      }}
    >
      <span>{children}</span>
      {required ? <span style={{ color: colors.error }}>*</span> : null}
      {optionalText ? <span style={{ color: colors.muted, fontWeight: 400 }}>{optionalText}</span> : null}
    </label>
  );
}
