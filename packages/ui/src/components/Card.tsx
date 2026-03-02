import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    padded?: boolean;
    flat?: boolean;
}

export function Card({ children, padded = true, flat = false, className = '', ...rest }: CardProps) {
    const classes = [
        'card',
        padded ? 'card--padded' : '',
        flat ? 'card--flat' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');
    return (
        <div className={classes} {...rest}>
            {children}
        </div>
    );
}
