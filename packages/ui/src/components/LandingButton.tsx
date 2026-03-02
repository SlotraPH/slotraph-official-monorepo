import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type LandingButtonVariant = 'primary' | 'outline';
type LandingButtonSize = 'md' | 'lg';

interface LandingButtonBaseProps {
    variant?: LandingButtonVariant;
    size?: LandingButtonSize;
    children: ReactNode;
    href?: string;
    className?: string;
}

type LandingButtonProps = LandingButtonBaseProps &
    (
        | ({ href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)
        | ({ href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
    );

export function LandingButton({
    variant = 'primary',
    size = 'md',
    children,
    href,
    className = '',
    ...rest
}: LandingButtonProps) {
    const classes = [
        'l-btn',
        `l-btn--${variant}`,
        `l-btn--${size}`,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    if (href) {
        return (
            <a
                href={href}
                className={classes}
                {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
            >
                {children}
            </a>
        );
    }

    return (
        <button
            className={classes}
            {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
        >
            {children}
        </button>
    );
}
