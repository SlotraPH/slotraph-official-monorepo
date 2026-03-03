import type { InputHTMLAttributes } from 'react';

interface LandingInputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

export function LandingInput({ className = '', ...rest }: LandingInputProps) {
    return (
        <input
            className={[
                'flex-1 py-[14px] px-4 text-sm text-navy bg-white border-[1.5px] border-[#e2e6ea] outline-none transition-[border-color] duration-200 placeholder:text-muted focus:border-brand',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
            {...rest}
        />
    );
}
