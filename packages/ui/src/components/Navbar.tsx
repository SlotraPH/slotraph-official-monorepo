import { useState, useEffect, useRef } from 'react';
import { Globe, Check } from 'lucide-react';
import { SymbolWordmark } from '@slotra/branding';

interface NavLink {
    label: string;
    href: string;
}

const NAV_LINKS: NavLink[] = [
    { label: 'Learn', href: '#learn' },
    { label: 'Integrations', href: '#integrations' },
    { label: 'Features', href: '#features' },
    { label: 'Industries', href: '#industries' },
    { label: 'Pricing', href: '#pricing' },
];

const LANGUAGES = [
    { key: 'en', label: 'English', native: 'English' },
    { key: 'tl', label: 'Filipino', native: 'Filipino' },
] as const;

interface NavbarProps {
    loginHref?: string;
    ctaHref?: string;
    ctaLabel?: string;
    inDevelopment?: boolean;
    locale?: 'en' | 'tl';
    alternatePath?: string;
}

export function Navbar({
    loginHref = '/login',
    ctaHref = '/register',
    ctaLabel = 'Get Started',
    inDevelopment = false,
    locale,
    alternatePath,
}: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [activeHref, setActiveHref] = useState(NAV_LINKS[0]?.href ?? '');
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);
    const [hoveredBtn, setHoveredBtn] = useState<'demo' | 'cta' | null>(null);
    const [langOpen, setLangOpen] = useState(false);
    const [hoveredLang, setHoveredLang] = useState<string | null>(null);
    const langRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (!langOpen) return;
        const handler = (e: MouseEvent) => {
            if (langRef.current && !langRef.current.contains(e.target as Node)) {
                setLangOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [langOpen]);

    return (
        <header
            className="fixed left-0 right-0 z-[1000] transition-[background,box-shadow] duration-150"
            style={{
                top: 'var(--banner-h, 0px)',
                backgroundColor: scrolled ? '#ffffff' : 'transparent',
                boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.07)' : 'none',
            }}
            role="banner"
        >
            <div className="max-w-[1200px] mx-auto px-8 h-[62px] flex items-center justify-between">

                {/* Logo */}
                <a href="/" className="flex items-center flex-shrink-0" aria-label="Slotra home">
                    <SymbolWordmark className="h-[50px] w-auto" aria-hidden="true" />
                </a>

                {/* Center nav — invisible while in development to keep logo centered */}
                <nav
                    className={`max-[900px]:hidden${inDevelopment ? ' invisible pointer-events-none' : ''}`}
                    aria-label="Main navigation"
                >
                    <ul className="flex items-center list-none">
                        {NAV_LINKS.map(({ label, href }) => {
                            const isActive = activeHref === href;
                            const isHovered = hoveredLink === href;
                            return (
                                <li key={label}>
                                    <a
                                        href={href}
                                        className="block py-2 px-[15px] text-[13.5px] font-medium whitespace-nowrap transition-colors duration-150"
                                        style={{
                                            color: isActive ? '#2e3192' : isHovered ? '#0f1f2e' : '#4a5668',
                                        }}
                                        onMouseEnter={() => setHoveredLink(href)}
                                        onMouseLeave={() => setHoveredLink(null)}
                                        onClick={() => setActiveHref(href)}
                                    >
                                        {label}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Right CTAs */}
                <div className="flex items-center gap-2">

                    {/* Language switcher */}
                    {locale && alternatePath && (
                        <div ref={langRef} className="relative">
                            <button
                                onClick={() => setLangOpen(o => !o)}
                                aria-label="Switch language"
                                className="inline-flex items-center justify-center w-[34px] h-[34px] rounded-md transition-all duration-150"
                                style={{
                                    border: '1px solid #d0d5dd',
                                    background: langOpen
                                        ? 'linear-gradient(180deg, #f9fafb 0%, #eceef1 100%)'
                                        : 'linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%)',
                                    boxShadow: langOpen
                                        ? 'inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 4px rgba(0,0,0,0.08)'
                                        : 'inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 3px rgba(0,0,0,0.05)',
                                    color: langOpen ? '#2e3192' : '#4a5668',
                                }}
                            >
                                <Globe size={15} strokeWidth={1.75} />
                            </button>

                            {langOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-[210px] rounded-xl overflow-hidden"
                                    style={{
                                        top: '100%',
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e2e6ea',
                                        boxShadow: '0 8px 24px rgba(15,31,46,0.1), 0 2px 6px rgba(15,31,46,0.06)',
                                    }}
                                >
                                    {/* Header */}
                                    <div
                                        className="px-4 pt-3 pb-2"
                                        style={{ borderBottom: '1px solid #f0f2f5' }}
                                    >
                                        <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#b0bac6' }}>
                                            Language
                                        </p>
                                    </div>

                                    {/* Options */}
                                    <div className="p-1.5">
                                        {LANGUAGES.map(({ key, label, native }) => {
                                            const isActive = locale === key;
                                            const href = isActive ? '#' : alternatePath;
                                            return (
                                                <a
                                                    key={key}
                                                    href={href}
                                                    onClick={() => setLangOpen(false)}
                                                    onMouseEnter={() => setHoveredLang(key)}
                                                    onMouseLeave={() => setHoveredLang(null)}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-100"
                                                    style={{
                                                        backgroundColor: hoveredLang === key && !isActive ? 'rgba(15,31,46,0.04)' : 'transparent',
                                                        textDecoration: 'none',
                                                        cursor: isActive ? 'default' : 'pointer',
                                                        pointerEvents: isActive ? 'none' : 'auto',
                                                    }}
                                                >
                                                    {/* Check or placeholder */}
                                                    <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                                                        {isActive && <Check size={13} strokeWidth={2.5} style={{ color: '#2e3192' }} />}
                                                    </div>

                                                    <div className="flex flex-col">
                                                        <span
                                                            className="text-[13px] font-medium leading-tight"
                                                            style={{ color: isActive ? '#2e3192' : '#0f1f2e' }}
                                                        >
                                                            {label}
                                                        </span>
                                                        {label !== native && (
                                                            <span className="text-[11px] leading-tight" style={{ color: '#b0bac6' }}>
                                                                {native}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Active badge */}
                                                    {isActive && (
                                                        <span
                                                            className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                                                            style={{ backgroundColor: 'rgba(46,49,146,0.08)', color: '#2e3192' }}
                                                        >
                                                            {key.toUpperCase()}
                                                        </span>
                                                    )}
                                                </a>
                                            );
                                        })}
                                    </div>

                                    {/* Footer note */}
                                    <div
                                        className="px-4 py-2.5"
                                        style={{ borderTop: '1px solid #f0f2f5' }}
                                    >
                                        <p className="text-[10px]" style={{ color: '#c8d0da' }}>
                                            More languages coming soon
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <a
                        href={loginHref}
                        onMouseEnter={() => setHoveredBtn('demo')}
                        onMouseLeave={() => setHoveredBtn(null)}
                        className="inline-flex items-center h-[34px] px-4 rounded-md text-[13px] font-medium tracking-[0.1px] whitespace-nowrap transition-all duration-150"
                        style={{
                            color: hoveredBtn === 'demo' ? '#0f1f2e' : '#4a5668',
                            border: '1px solid #d0d5dd',
                            background: hoveredBtn === 'demo'
                                ? 'linear-gradient(180deg, #f9fafb 0%, #eceef1 100%)'
                                : 'linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%)',
                            boxShadow: hoveredBtn === 'demo'
                                ? 'inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 4px rgba(0,0,0,0.08)'
                                : 'inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 3px rgba(0,0,0,0.05)',
                        }}
                    >
                        Book a Demo
                    </a>

                    {!inDevelopment && (
                        <>
                            {/* Divider */}
                            <div className="w-px h-[18px] mx-1" style={{ backgroundColor: '#dde1e7' }} />
                            <a
                                href={ctaHref}
                                onMouseEnter={() => setHoveredBtn('cta')}
                                onMouseLeave={() => setHoveredBtn(null)}
                                className="inline-flex items-center h-[34px] px-4 rounded-md text-[13px] font-semibold tracking-[0.1px] whitespace-nowrap transition-all duration-150"
                                style={{
                                    color: '#ffffff',
                                    border: '1px solid rgba(0,0,0,0.18)',
                                    background: hoveredBtn === 'cta'
                                        ? 'linear-gradient(180deg, #3538b5 0%, #272a86 100%)'
                                        : 'linear-gradient(180deg, #3336a4 0%, #2a2d8c 100%)',
                                    boxShadow: hoveredBtn === 'cta'
                                        ? 'inset 0 1px 0 rgba(255,255,255,0.18), 0 3px 10px rgba(46,49,146,0.4)'
                                        : 'inset 0 1px 0 rgba(255,255,255,0.14), 0 2px 6px rgba(46,49,146,0.25)',
                                }}
                            >
                                {ctaLabel}
                            </a>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
