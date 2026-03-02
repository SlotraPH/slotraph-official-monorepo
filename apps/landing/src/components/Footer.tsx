import React from 'react';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="l-footer">
            <div className="l-footer__inner">
                <div className="l-footer__grid">
                    {/* Brand Column */}
                    <div className="l-footer__brand">
                        <div className="l-footer__logo">
                            <div className="l-footer__logo-icon">S</div>
                            <span>Slotra</span>
                        </div>
                        <p className="l-footer__tagline">
                            The all-in-one scheduling platform built for the modern Philippine business.
                        </p>
                        <div className="l-footer__socials">
                            {['fb', 'tw', 'ig', 'li'].map((id) => (
                                <a key={id} href="#" className="l-footer__social-link" aria-label={id}>
                                    <div style={{ width: 18, height: 18, background: 'currentColor', opacity: 0.5, borderRadius: 2 }} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="l-footer__col-title">Product</h4>
                        <ul className="l-footer__links">
                            {['Features', 'Pricing', 'Mobile App', 'Integrations'].map((link) => (
                                <li key={link} className="l-footer__link"><a href="#">{link}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="l-footer__col-title">Company</h4>
                        <ul className="l-footer__links">
                            {['About Us', 'Careers', 'Blog', 'Contact'].map((link) => (
                                <li key={link} className="l-footer__link"><a href="#">{link}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* App Store Column */}
                    <div>
                        <h4 className="l-footer__col-title">Download</h4>
                        <div className="l-footer__apps">
                            <button className="l-footer__app-btn">
                                <div style={{ width: 24, height: 24, background: '#fff', opacity: 0.2, borderRadius: 4 }} />
                                <div className="l-footer__app-content">
                                    <span className="l-footer__app-label">Download on the</span>
                                    <span className="l-footer__app-name">App Store</span>
                                </div>
                            </button>
                            <button className="l-footer__app-btn">
                                <div style={{ width: 24, height: 24, background: '#fff', opacity: 0.2, borderRadius: 4 }} />
                                <div className="l-footer__app-content">
                                    <span className="l-footer__app-label">Get it on</span>
                                    <span className="l-footer__app-name">Google Play</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="l-footer__bottom">
                    <p className="l-footer__copyright">
                        © {currentYear} Slotra Technologies Inc. All rights reserved.
                    </p>
                    <ul className="l-footer__legal">
                        {['Privacy Policy', 'Terms of Service', 'Cookies'].map((link) => (
                            <li key={link} className="l-footer__legal-link"><a href="#">{link}</a></li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    );
};
