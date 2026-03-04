import type { ReactNode } from 'react';

interface FormFieldProps {
    label?: ReactNode;
    hint?: ReactNode;
    error?: ReactNode;
    footer?: ReactNode;
    htmlFor?: string;
    className?: string;
    children: ReactNode;
}

export function FormField({
    label,
    hint,
    error,
    footer,
    htmlFor,
    className = '',
    children,
}: FormFieldProps) {
    return (
        <div className={['form-field', className].filter(Boolean).join(' ')}>
            {label && (
                <label className="form-field__label" htmlFor={htmlFor}>
                    {label}
                </label>
            )}
            {children}
            {(hint ?? error) && (
                <span
                    className={[
                        'form-field__hint',
                        error ? 'form-field__hint--error' : '',
                    ]
                        .filter(Boolean)
                        .join(' ')}
                >
                    {error ?? hint}
                </span>
            )}
            {footer && <div className="form-field__footer">{footer}</div>}
        </div>
    );
}
