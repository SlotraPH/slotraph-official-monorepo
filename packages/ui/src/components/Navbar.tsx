import { useState, useEffect, useRef } from 'react';
import { SymbolWordmark } from '@slotra/branding';
import { LandingButton } from './LandingButton';

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
            className={`l-navbar${scrolled ? ' l-navbar--scrolled' : ''}`}
            role="banner"
        >
            <div className="l-navbar__inner">
                {/* Logo */}
                <a href="/" className="l-navbar__logo" aria-label="Slotra home">
                    <SymbolWordmark className="l-navbar__logo-img" aria-hidden="true" />
                </a>

                {/* Center nav pill */}
                <nav className="l-navbar__nav-pill" aria-label="Main navigation">
                    <ul className="l-navbar__nav" ref={navRef}>
                        {/* Sliding indicator */}
                        <span ref={pillRef} className="l-navbar__nav-indicator" aria-hidden="true" />
                        {NAV_LINKS.map(({ label, href }, i) => (
                            <li key={label}>
                                <a
                                    ref={el => { linkRefs.current[i] = el; }}
                                    href={href}
                                    className={`l-navbar__nav-link${activeHref === href ? ' l-navbar__nav-link--active' : ''}`}
                                    onClick={() => setActiveHref(href)}
                                >
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Right CTAs */}
                <div className="l-navbar__right">
                    <a href={loginHref} className="l-navbar__login-btn">
                        Book A Demo
                    </a>
                    <LandingButton href={ctaHref} variant="primary" size="md">
                        {ctaLabel}
                    </LandingButton>
                </div>
            </div>
        </header>
    );
}
