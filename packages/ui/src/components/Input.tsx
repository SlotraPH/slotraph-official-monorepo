import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    hint?: string;
    error?: string;
}

export function Input({ label, hint, error, className = '', id, ...rest }: InputProps) {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {label && (
                <label
                    htmlFor={inputId}
                    style={{
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                    }}
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={['input', className].filter(Boolean).join(' ')}
                aria-invalid={!!error}
                aria-describedby={hint || error ? `${inputId}-hint` : undefined}
                {...rest}
            />
            {(hint ?? error) && (
                <span
                    id={`${inputId}-hint`}
                    style={{
                        fontSize: 'var(--font-size-xs)',
                        color: error ? 'var(--color-danger)' : 'var(--color-text-muted)',
                    }}
                >
                    {error ?? hint}
                </span>
            )}
        </div>
    );
}
