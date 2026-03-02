import type { InputHTMLAttributes } from 'react';

interface LandingInputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

export function LandingInput({ className = '', ...rest }: LandingInputProps) {
    return (
        <input
            className={['l-hero__email-input', className].filter(Boolean).join(' ')}
            {...rest}
        />
    );
}
