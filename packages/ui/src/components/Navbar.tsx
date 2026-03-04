import { useState, useEffect, useRef } from 'react';
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
}

export function Navbar({
    loginHref = '/login',
    ctaHref = '/register',
    ctaLabel = 'Get Started',
}: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [activeHref, setActiveHref] = useState(NAV_LINKS[0].href);
    const [hoveredBtn, setHoveredBtn] = useState<'demo' | 'cta' | null>(null);

    const navRef = useRef<HTMLUListElement>(null);
    const pillRef = useRef<HTMLSpanElement>(null);
    const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const isFirstPosition = useRef(true);

    // Sticky scroll effect
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Slide the pill indicator to the active link
    useEffect(() => {
        const activeIndex = NAV_LINKS.findIndex(l => l.href === activeHref);
        const activeEl = linkRefs.current[activeIndex];
        const navEl = navRef.current;
        const pill = pillRef.current;
        if (!activeEl || !navEl || !pill) return;

        const navRect = navEl.getBoundingClientRect();
        const linkRect = activeEl.getBoundingClientRect();
        const left = linkRect.left - navRect.left;
        const width = linkRect.width;

        if (isFirstPosition.current) {
            // Set initial position instantly, then enable transition
            isFirstPosition.current = false;
            pill.style.transition = 'none';
            pill.style.left = `${left}px`;
            pill.style.width = `${width}px`;
            requestAnimationFrame(() => {
                pill.style.transition = '';
            });
        } else {
            pill.style.left = `${left}px`;
            pill.style.width = `${width}px`;
        }
    }, [activeHref]);

    return (
        <header
            className={`fixed left-0 right-0 z-[1000] py-3 transition-[background,box-shadow,backdrop-filter] duration-300 ease-in-out${scrolled ? ' bg-white/85 backdrop-blur-lg shadow-[0_1px_0_rgba(0,0,0,0.06),0_4px_24px_rgba(0,0,0,0.06)]' : ' bg-transparent'}`}
            style={{ top: 'var(--banner-h, 0px)' }}
            role="banner"
        >
            <div className="max-w-[1200px] mx-auto px-6 w-full grid grid-cols-[1fr_auto_1fr] items-center gap-6">
                {/* Logo */}
                <a href="/" className="flex items-center" aria-label="Slotra home">
                    <SymbolWordmark className="h-10 w-auto" aria-hidden="true" />
                </a>

                {/* Center nav pill */}
                <nav
                    className="bg-[#f0f1f3] border border-[#d8dce2] rounded-full p-1 max-[900px]:hidden"
                    aria-label="Main navigation"
                >
                    <ul className="flex items-center list-none gap-0.5 relative" ref={navRef}>
                        {/* Sliding indicator */}
                        <span
                            ref={pillRef}
                            className="absolute top-0 left-0 h-full bg-brand rounded-full pointer-events-none z-0 transition-[left,width] duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                            aria-hidden="true"
                        />
                        {NAV_LINKS.map(({ label, href }, i) => (
                            <li key={label}>
                                <a
                                    ref={el => { linkRefs.current[i] = el; }}
                                    href={href}
                                    className="block py-2 px-[18px] rounded-full text-sm font-medium whitespace-nowrap relative z-[1] transition-colors duration-200"
                                    style={{ color: activeHref === href ? '#ffffff' : '#4a5668' }}
                                    onClick={() => setActiveHref(href)}
                                >
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Right CTAs */}
                <div className="flex items-center gap-2 justify-end">
                    <a
                        href={loginHref}
                        onMouseEnter={() => setHoveredBtn('demo')}
                        onMouseLeave={() => setHoveredBtn(null)}
                        className="inline-flex items-center py-[7px] px-[14px] rounded-lg text-[13px] font-medium tracking-[0.15px] whitespace-nowrap transition-[border-color,background,color] duration-150"
                        style={{
                            border: '1px solid',
                            borderColor: hoveredBtn === 'demo' ? '#a8b0bb' : '#d4d8de',
                            color: hoveredBtn === 'demo' ? '#0f1f2e' : '#4a5668',
                            backgroundColor: hoveredBtn === 'demo' ? '#f3f4f6' : 'transparent',
                        }}
                    >
                        Book a Demo
                    </a>
                    <a
                        href={ctaHref}
                        onMouseEnter={() => setHoveredBtn('cta')}
                        onMouseLeave={() => setHoveredBtn(null)}
                        className="inline-flex items-center py-[7px] px-[14px] rounded-lg text-[13px] font-semibold tracking-[0.15px] whitespace-nowrap transition-[background,box-shadow] duration-150"
                        style={{
                            backgroundColor: hoveredBtn === 'cta' ? '#252880' : '#2e3192',
                            color: '#ffffff',
                            boxShadow: hoveredBtn === 'cta'
                                ? '0 2px 12px rgba(46,49,146,0.35)'
                                : '0 1px 4px rgba(46,49,146,0.2)',
                        }}
                    >
                        {ctaLabel}
                    </a>
                </div>
            </div>
        </header>
    );
}
