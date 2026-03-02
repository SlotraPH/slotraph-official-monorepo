import type { HTMLAttributes, ReactNode } from 'react';

interface LandingSectionProps extends HTMLAttributes<HTMLElement> {
    children: ReactNode;
    className?: string;
    /** Vertical padding on top and bottom. Default: 96px */
    spacing?: 'sm' | 'md' | 'lg';
}

const spacingMap: Record<string, string> = {
    sm: '48px',
    md: '72px',
    lg: '96px',
};

export function LandingSection({
    children,
    className = '',
    spacing = 'lg',
    style,
    ...rest
}: LandingSectionProps) {
    const pad = spacingMap[spacing];
    return (
        <section
            className={['l-section', className].filter(Boolean).join(' ')}
            style={{ padding: `${pad} 0`, ...style }}
            {...rest}
        >
            {children}
        </section>
    );
}
