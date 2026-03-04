import React from 'react';
import { Facebook, Instagram } from 'lucide-react';
import { SymbolWordmark } from '@slotra/branding';

// ── Custom brand icons not in lucide ──────────────────────

const TikTokIcon = ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.73a8.26 8.26 0 0 0 4.83 1.55V6.79a4.85 4.85 0 0 1-1.06-.1z" />
    </svg>
);

const AppleIcon = ({ size = 15 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
);

const GooglePlayIcon = ({ size = 15 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M3.18 23.76c.3.17.65.22.99.14l12.6-7.27-2.61-2.61-10.98 9.74zm16.29-10.98-2.96-1.71-2.93 2.93 2.93 2.93 3-1.73a1.31 1.31 0 0 0-.04-2.42zM3.09.24a1.3 1.3 0 0 0-.91 1.28v20.96c0 .58.33 1.07.83 1.28L14.36 12 3.09.24zm10.08 11.06L3.17.38c.34-.08.69-.03.99.14l12.6 7.27-3.59 3.51z" />
    </svg>
);

// ── Data ──────────────────────────────────────────────────

const PRODUCT_LINKS = ['Features', 'Pricing', 'Integrations', 'Mobile App'];
const COMPANY_LINKS = ['About Us', 'Careers', 'Blog', 'Contact'];
const LEGAL_LINKS   = ['Privacy Policy', 'Terms of Service', 'Cookies'];

const SOCIAL = [
    { label: 'Facebook',  Icon: Facebook,  href: '#' },
    { label: 'Instagram', Icon: Instagram, href: '#' },
    { label: 'TikTok',    Icon: TikTokIcon, href: '#' },
] as const;

const STORE_BUTTONS = [
    { label: 'App Store',    sublabel: 'Download on the', Icon: AppleIcon,      href: '#' },
    { label: 'Google Play',  sublabel: 'Get it on',       Icon: GooglePlayIcon, href: '#' },
];

// ── Component ─────────────────────────────────────────────

export const Footer: React.FC = () => {
    const year = new Date().getFullYear();

    return (
        <footer style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e6ea' }}>
            <div className="max-w-[1200px] mx-auto px-6 pt-14 pb-0">

                {/* Main grid */}
                <div className="grid grid-cols-[2fr_1fr_1fr_1.4fr] gap-12 pb-12 max-[900px]:grid-cols-2 max-[640px]:grid-cols-1 max-[640px]:gap-8">

                    {/* Brand */}
                    <div className="flex flex-col gap-5">
                        <SymbolWordmark className="h-7 w-auto" aria-label="Slotra" />

                        <p className="text-[12px] leading-[1.7] max-w-[200px]" style={{ color: '#7a8799' }}>
                            Automated scheduling for Philippine businesses.
                        </p>

                        {/* Social icons */}
                        <div className="flex gap-2">
                            {SOCIAL.map(({ label, Icon, href }) => (
                                <SocialBtn key={label} label={label} href={href}>
                                    <Icon size={13} />
                                </SocialBtn>
                            ))}
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.9px] mb-5" style={{ color: '#7a8799' }}>
                            Product
                        </p>
                        <ul className="list-none flex flex-col gap-[10px]">
                            {PRODUCT_LINKS.map(link => (
                                <li key={link}>
                                    <FooterLink href="#">{link}</FooterLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.9px] mb-5" style={{ color: '#7a8799' }}>
                            Company
                        </p>
                        <ul className="list-none flex flex-col gap-[10px]">
                            {COMPANY_LINKS.map(link => (
                                <li key={link}>
                                    <FooterLink href="#">{link}</FooterLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Download */}
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.9px] mb-5" style={{ color: '#7a8799' }}>
                            Download
                        </p>
                        <div className="flex flex-col gap-2">
                            {STORE_BUTTONS.map(({ label, sublabel, Icon, href }) => (
                                <StoreBtn key={label} href={href} label={label} sublabel={sublabel} Icon={Icon} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div
                    className="flex items-center justify-between flex-wrap gap-4 py-5 max-[640px]:flex-col max-[640px]:items-start"
                    style={{ borderTop: '1px solid #f0f1f3' }}
                >
                    <p className="text-[11px]" style={{ color: '#b0b7c0' }}>
                        © {year} Slotra Technologies Inc. All rights reserved.
                    </p>
                    <ul className="flex items-center gap-1 list-none">
                        {LEGAL_LINKS.map((link, i) => (
                            <li key={link} className="flex items-center gap-1">
                                {i > 0 && (
                                    <span className="text-[11px] select-none" style={{ color: '#d4d8de' }}>·</span>
                                )}
                                <FooterLink href="#" small>{link}</FooterLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    );
};

// ── Sub-components ────────────────────────────────────────

function FooterLink({
    href,
    children,
    small,
}: {
    href: string;
    children: React.ReactNode;
    small?: boolean;
}) {
    const size = small ? '11px' : '12px';
    return (
        <a
            href={href}
            className="transition-colors duration-150"
            style={{ color: '#7a8799', fontSize: size }}
            onMouseEnter={e => (e.currentTarget.style.color = '#2e3192')}
            onMouseLeave={e => (e.currentTarget.style.color = '#7a8799')}
        >
            {children}
        </a>
    );
}

function SocialBtn({
    label,
    href,
    children,
}: {
    label: string;
    href: string;
    children: React.ReactNode;
}) {
    return (
        <a
            href={href}
            aria-label={label}
            className="w-[28px] h-[28px] flex items-center justify-center rounded-md transition-[border-color,color] duration-150"
            style={{ border: '1px solid #e2e6ea', color: '#7a8799' }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#2e3192';
                e.currentTarget.style.color = '#2e3192';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#e2e6ea';
                e.currentTarget.style.color = '#7a8799';
            }}
        >
            {children}
        </a>
    );
}

function StoreBtn({
    href,
    label,
    sublabel,
    Icon,
}: {
    href: string;
    label: string;
    sublabel: string;
    Icon: React.FC<{ size?: number }>;
}) {
    return (
        <a
            href={href}
            className="flex items-center gap-2.5 rounded-lg px-3 py-[9px] transition-[border-color] duration-150"
            style={{ border: '1px solid #e2e6ea', color: '#0f1f2e' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#2e3192')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#e2e6ea')}
        >
            <span style={{ color: '#4a5668', flexShrink: 0 }}>
                <Icon size={15} />
            </span>
            <span className="flex flex-col text-left leading-tight">
                <span className="text-[9px] uppercase tracking-[0.5px]" style={{ color: '#7a8799' }}>
                    {sublabel}
                </span>
                <span className="text-[12px] font-semibold" style={{ color: '#0f1f2e' }}>
                    {label}
                </span>
            </span>
        </a>
    );
}
