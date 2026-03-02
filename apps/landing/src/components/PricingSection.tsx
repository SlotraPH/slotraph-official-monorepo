import React, { useState } from 'react';
import { LandingButton } from '@slotra/ui';

export const PricingSection: React.FC = () => {
    const [isAnnual, setIsAnnual] = useState(false);

    const features = {
        free: [
            { text: 'Unlimited bookings', included: true },
            { text: 'Email reminders', included: true },
            { text: 'Basic calendar sync', included: true },
            { text: 'Payments integration', included: false },
            { text: 'Custom branding', included: false },
            { text: 'Advanced analytics', included: false },
        ],
        pro: [
            { text: 'Unlimited bookings', included: true },
            { text: 'SMS & Email reminders', included: true },
            { text: 'Bidirectional sync', included: true },
            { text: 'Payments integration', included: true },
            { text: 'Custom branding', included: true },
            { text: 'Advanced analytics', included: true },
        ]
    };

    const CheckIcon = () => (
        <svg className="l-pricing__feature-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
    );

    return (
        <section id="pricing" className="l-pricing">
            <div className="l-pricing__header">
                <h2 className="l-pricing__title">Simple, transparent pricing</h2>
                <p className="l-pricing__subtitle">
                    Choose the plan that's right for your business. Grow at your own pace.
                </p>
            </div>

            <div className="l-pricing__toggle-wrap">
                <span className={`l-pricing__toggle-label ${!isAnnual ? 'l-pricing__toggle-label--active' : ''}`}>
                    Monthly
                </span>
                <div
                    className={`l-pricing__toggle ${isAnnual ? 'l-pricing__toggle--active' : ''}`}
                    onClick={() => setIsAnnual(!isAnnual)}
                >
                    <div className="l-pricing__toggle-dot" />
                </div>
                <span className={`l-pricing__toggle-label ${isAnnual ? 'l-pricing__toggle-label--active' : ''}`}>
                    Annual (Save 20%)
                </span>
            </div>

            <div className="l-pricing__grid">
                {/* Free Plan */}
                <div className="l-pricing__card">
                    <div className="l-pricing__card-header">
                        <h3 className="l-pricing__card-name">Start Free</h3>
                        <p className="l-pricing__card-desc">Perfect for side projects and early startups.</p>
                    </div>
                    <div className="l-pricing__card-price">
                        <span className="l-pricing__price-currency">₱</span>
                        <span className="l-pricing__price-amount">0</span>
                        <span className="l-pricing__price-period">/mo</span>
                    </div>
                    <div className="l-pricing__card-btn">
                        <LandingButton variant="outline" size="md" className="l-pricing__card-btn">
                            Get Started
                        </LandingButton>
                    </div>
                    <ul className="l-pricing__card-features">
                        {features.free.map((feature, i) => (
                            <li key={i} className={`l-pricing__feature ${!feature.included ? 'l-pricing__feature--muted' : ''}`}>
                                <CheckIcon />
                                <span>{feature.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Pro Plan */}
                <div className="l-pricing__card l-pricing__card--featured">
                    <div className="l-pricing__card-tag">Most Popular</div>
                    <div className="l-pricing__card-header">
                        <h3 className="l-pricing__card-name">Get Pro</h3>
                        <p className="l-pricing__card-desc">Advanced tools for growing businesses.</p>
                    </div>
                    <div className="l-pricing__card-price">
                        <span className="l-pricing__price-currency">₱</span>
                        <span className="l-pricing__price-amount">{isAnnual ? '399' : '499'}</span>
                        <span className="l-pricing__price-period">/mo</span>
                    </div>
                    <div className="l-pricing__card-btn">
                        <LandingButton variant="primary" size="md" className="l-pricing__card-btn">
                            Upgrade Now
                        </LandingButton>
                    </div>
                    <ul className="l-pricing__card-features">
                        {features.pro.map((feature, i) => (
                            <li key={i} className="l-pricing__feature">
                                <CheckIcon />
                                <span>{feature.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};
