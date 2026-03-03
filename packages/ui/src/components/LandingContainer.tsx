import type { HTMLAttributes, ReactNode } from 'react';

interface LandingContainerProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
}

export function LandingContainer({ children, className = '', ...rest }: LandingContainerProps) {
    return (
        <div
            className={['max-w-[1200px] mx-auto px-6 w-full', className].filter(Boolean).join(' ')}
            {...rest}
        >
            {children}
        </div>
    );
}
