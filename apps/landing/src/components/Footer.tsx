import React from 'react';
import { SymbolWordmark } from '@slotra/branding';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-navy py-24 pb-12 text-white">
            <div className="max-w-[1200px] mx-auto px-6">

                {/* Main grid */}
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-16 mb-24 max-[900px]:grid-cols-2 max-[640px]:grid-cols-1 max-[640px]:gap-6">

                    {/* Brand Column */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center">
                            <SymbolWordmark
                                className="h-9 w-auto brightness-0 invert"
                                aria-label="Slotra"
                            />
                        </div>
                        <p className="text-sm text-white/60 max-w-[240px] leading-[1.6]">
                            The all-in-one scheduling platform built for the modern Philippine business.
                        </p>
                        <div className="flex gap-4">
                            {['fb', 'tw', 'ig', 'li'].map((id) => (
                                <a
                                    key={id}
                                    href="#"
                                    className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center transition-[background,transform] duration-200 text-white/80 hover:bg-brand hover:text-white hover:-translate-y-0.5"
                                    aria-label={id}
                                >
                                    <div style={{ width: 18, height: 18, background: 'currentColor', opacity: 0.5, borderRadius: 2 }} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product Column */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-[1px] mb-6 text-white">Product</h4>
                        <ul className="list-none flex flex-col gap-4">
                            {['Features', 'Pricing', 'Mobile App', 'Integrations'].map((link) => (
                                <li key={link}>
                                    <a
                                        href="#"
                                        className="text-sm text-white/60 transition-colors duration-200 hover:text-brand"
                                    >
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-[1px] mb-6 text-white">Company</h4>
                        <ul className="list-none flex flex-col gap-4">
                            {['About Us', 'Careers', 'Blog', 'Contact'].map((link) => (
                                <li key={link}>
                                    <a
                                        href="#"
                                        className="text-sm text-white/60 transition-colors duration-200 hover:text-brand"
                                    >
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Download Column */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-[1px] mb-6 text-white">Download</h4>
                        <div className="flex flex-col gap-2.5">
                            {[
                                { label: 'Download on the', name: 'App Store' },
                                { label: 'Get it on', name: 'Google Play' },
                            ].map((app) => (
                                <button
                                    key={app.name}
                                    className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-[10px] py-2 px-4 transition-colors duration-200 hover:bg-white/10"
                                >
                                    <div style={{ width: 24, height: 24, background: '#fff', opacity: 0.2, borderRadius: 4 }} />
                                    <div className="flex flex-col text-left">
                                        <span className="text-[10px] uppercase opacity-60">{app.label}</span>
                                        <span className="text-sm font-semibold">{app.name}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/10 flex justify-between items-center flex-wrap gap-6 max-[640px]:flex-col max-[640px]:items-start">
                    <p className="text-xs text-white/40">
                        © {currentYear} Slotra Technologies Inc. All rights reserved.
                    </p>
                    <ul className="flex gap-6 list-none">
                        {['Privacy Policy', 'Terms of Service', 'Cookies'].map((link) => (
                            <li key={link}>
                                <a
                                    href="#"
                                    className="text-xs text-white/40 transition-colors duration-200 hover:text-white"
                                >
                                    {link}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    );
};
