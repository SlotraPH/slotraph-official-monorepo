import type { HTMLAttributes, ReactNode } from 'react';

interface LandingContainerProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
}

export function LandingContainer({ children, className = '', ...rest }: LandingContainerProps) {
    return (
        <div
            className={['l-container', className].filter(Boolean).join(' ')}
            style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 24px',
                width: '100%',
            }}
            {...rest}
        >
            {children}
        </div>
    );
}
