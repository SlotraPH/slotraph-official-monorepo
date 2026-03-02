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
    phone?: string;
    loginHref?: string;
    ctaHref?: string;
    ctaLabel?: string;
}

export function Navbar({
    phone = '+63 (2) 8888-0000',
    loginHref = '/login',
    ctaHref = '/register',
    ctaLabel = 'Start Free',
}: NavbarProps) {
    return (
        <header className="l-navbar" role="banner">
            <div className="l-navbar__inner">
                {/* Logo */}
                <a href="/" className="l-navbar__logo" aria-label="Slotra home">
                    <div className="l-navbar__logo-icon" aria-hidden="true">S</div>
                    <span>slotra</span>
                </a>

                {/* Center Nav */}
                <nav aria-label="Main navigation">
                    <ul className="l-navbar__nav">
                        {NAV_LINKS.map(({ label, href }) => (
                            <li key={label}>
                                <a href={href}>{label}</a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Right Side */}
                <div className="l-navbar__right">
                    <span className="l-navbar__phone">{phone}</span>
                    <a href={loginHref} className="l-navbar__login">
                        Login
                    </a>
                    <LandingButton href={ctaHref} variant="primary" size="md">
                        {ctaLabel}
                    </LandingButton>
                </div>
            </div>
        </header>
    );
}
