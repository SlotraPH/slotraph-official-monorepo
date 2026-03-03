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

const BASE =
    'inline-flex items-center justify-center gap-2 font-semibold cursor-pointer border-[1.5px] rounded-full transition-[background,color,border-color,transform,box-shadow] duration-200 no-underline whitespace-nowrap leading-none active:scale-[0.98]';

const SIZE: Record<LandingButtonSize, string> = {
    md: 'py-3 px-[22px] text-sm',
    lg: 'py-4 px-7 text-base',
};

const VARIANT: Record<LandingButtonVariant, string> = {
    primary:
        'bg-brand border-brand hover:-translate-y-px hover:bg-brand-hover hover:border-brand-hover hover:shadow-[0_4px_14px_rgba(46,49,146,0.35)]',
    outline:
        'bg-transparent text-brand border-brand hover:bg-brand-light hover:-translate-y-px',
};

export function LandingButton({
    variant = 'primary',
    size = 'md',
    children,
    href,
    className = '',
    ...rest
}: LandingButtonProps) {
    const classes = [BASE, SIZE[size], VARIANT[variant], className]
        .filter(Boolean)
        .join(' ');

    const colorStyle = variant === 'primary' ? { color: '#ffffff' } : undefined;

    if (href) {
        return (
            <a
                href={href}
                className={classes}
                style={colorStyle}
                {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
            >
                {children}
            </a>
        );
    }

    return (
        <button
            className={classes}
            style={colorStyle}
            {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
        >
            {children}
        </button>
    );
}
