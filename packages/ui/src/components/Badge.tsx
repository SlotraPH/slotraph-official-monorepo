import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent';

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
    return (
        <span className={['badge', `badge--${variant}`, className].filter(Boolean).join(' ')}>
            {children}
        </span>
    );
}
