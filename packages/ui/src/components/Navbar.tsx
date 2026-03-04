import { useState, useEffect } from 'react';
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

interface NavbarProps {
    loginHref?: string;
    ctaHref?: string;
    ctaLabel?: string;
    inDevelopment?: boolean;
}

export function Navbar({
    loginHref = '/login',
    ctaHref = '/register',
    ctaLabel = 'Get Started',
    inDevelopment = false,
}: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [activeHref, setActiveHref] = useState(NAV_LINKS[0]?.href ?? '');
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);
    const [hoveredBtn, setHoveredBtn] = useState<'demo' | 'cta' | null>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

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
