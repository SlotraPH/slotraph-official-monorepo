import type { ReactNode, TextareaHTMLAttributes } from 'react';
import { FormField } from './FormField';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: ReactNode;
    hint?: ReactNode;
    error?: ReactNode;
    footer?: ReactNode;
}

export function Textarea({
    label,
    hint,
    error,
    footer,
    className = '',
    id,
    ...rest
}: TextareaProps) {
    const textareaId = id ?? (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
        <FormField
            label={label}
            hint={hint}
            error={error}
            footer={footer}
            htmlFor={textareaId}
        >
            <textarea
                id={textareaId}
                className={['input ui-textarea', className].filter(Boolean).join(' ')}
                aria-invalid={!!error}
                {...rest}
            />
        </FormField>
    );
}
