import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: ReactNode;
}

export function Button({
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    ...rest
}: ButtonProps) {
    const variantClass = `btn--${variant}`;
    const sizeClass = size !== 'md' ? `btn--${size}` : '';
    return (
        <button
            className={['btn', variantClass, sizeClass, className].filter(Boolean).join(' ')}
            {...rest}
        >
            {children}
        </button>
    );
}
