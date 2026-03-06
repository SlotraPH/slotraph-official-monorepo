import { useState } from 'react';
import type { Locale } from '../i18n/utils';

interface Props {
    locale: Locale;
    alternatePath: string;
}

export function LanguageSwitcher({ locale, alternatePath }: Props) {
    const [hovered, setHovered] = useState<Locale | null>(null);

    const options: { key: Locale; label: string; href: string }[] = [
        { key: 'en', label: 'EN', href: locale === 'en' ? '#' : alternatePath },
        { key: 'tl', label: 'TL', href: locale === 'tl' ? '#' : alternatePath },
    ];

    return (
        <div
            className="flex items-center gap-[2px] rounded-lg p-[3px]"
            style={{ backgroundColor: 'rgba(15,31,46,0.06)' }}
        >
            {options.map(({ key, label, href }) => {
                const active = locale === key;
                return (
                    <a
                        key={key}
                        href={href}
                        onMouseEnter={() => setHovered(key)}
                        onMouseLeave={() => setHovered(null)}
                        aria-current={active ? 'page' : undefined}
                        className="rounded-md px-2.5 py-1 text-[12px] font-semibold tracking-wide transition-all duration-150"
                        style={{
                            backgroundColor: active ? '#ffffff' : 'transparent',
                            color: active ? '#0f1f2e' : hovered === key ? '#0f1f2e' : '#7a8799',
                            boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                            pointerEvents: active ? 'none' : 'auto',
                            textDecoration: 'none',
                        }}
                    >
                        {label}
                    </a>
                );
            })}
        </div>
    );
}
