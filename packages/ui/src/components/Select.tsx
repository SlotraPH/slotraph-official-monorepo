import type { ReactNode, SelectHTMLAttributes } from 'react';
import { FormField } from './FormField';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: ReactNode;
    hint?: ReactNode;
    error?: ReactNode;
    footer?: ReactNode;
}

export function Select({
    label,
    hint,
    error,
    footer,
    className = '',
    id,
    children,
    ...rest
}: SelectProps) {
    const selectId = id ?? (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
        <FormField
            label={label}
            hint={hint}
            error={error}
            footer={footer}
            htmlFor={selectId}
        >
            <div className="ui-select">
                <select
                    id={selectId}
                    className={['input ui-select__control', className].filter(Boolean).join(' ')}
                    aria-invalid={!!error}
                    {...rest}
                >
                    {children}
                </select>
                <svg className="ui-select__caret" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                    <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </FormField>
    );
}
