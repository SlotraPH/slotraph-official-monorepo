import type { HTMLAttributes, ReactNode } from 'react';

interface LandingSectionProps extends HTMLAttributes<HTMLElement> {
    children: ReactNode;
    className?: string;
    /** Vertical padding on top and bottom. Default: lg (96px) */
    spacing?: 'sm' | 'md' | 'lg';
}

const spacingMap: Record<string, string> = {
    sm: 'py-12',
    md: 'py-[72px]',
    lg: 'py-24',
};

export function LandingSection({
    children,
    className = '',
    spacing = 'lg',
    ...rest
}: LandingSectionProps) {
    return (
        <section
            className={[spacingMap[spacing], className].filter(Boolean).join(' ')}
            {...rest}
        >
            {children}
        </section>
    );
}
