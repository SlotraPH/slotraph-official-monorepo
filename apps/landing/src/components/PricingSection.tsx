import React, { useState } from 'react';
import { LandingButton } from '@slotra/ui';

const CheckIcon = ({ muted }: { muted?: boolean }) => (
    <svg
        className={`w-4 h-4 flex-shrink-0 ${muted ? 'text-muted' : 'text-brand'}`}
        viewBox="0 0 20 20"
        fill="currentColor"
    >
        <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
        />
    </svg>
);

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
        ],
    };

    return (
        <section id="pricing" className="bg-page py-24">
            {/* Header */}
            <div className="text-center max-w-[600px] mx-auto mb-16 flex flex-col gap-4">
                <h2 className="text-[48px] font-extrabold text-navy tracking-[-1px]">
                    Simple, transparent pricing
                </h2>
                <p className="text-lg text-secondary">
                    Choose the plan that's right for your business. Grow at your own pace.
                </p>
            </div>

            {/* Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
                <span className={`text-sm ${!isAnnual ? 'font-semibold text-navy' : 'font-medium text-secondary'}`}>
                    Monthly
                </span>
                <div
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${isAnnual ? 'bg-brand' : 'bg-[#e2e6ea]'}`}
                    onClick={() => setIsAnnual(!isAnnual)}
                    role="switch"
                    aria-checked={isAnnual}
                >
                    <div
                        className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${isAnnual ? 'translate-x-6' : ''}`}
                    />
                </div>
                <span className={`text-sm ${isAnnual ? 'font-semibold text-navy' : 'font-medium text-secondary'}`}>
                    Annual (Save 20%)
                </span>
            </div>

            {/* Pricing Grid */}
            <div className="max-w-[900px] mx-auto grid grid-cols-2 gap-8 px-6 items-stretch">
                {/* Free Plan */}
                <div className="bg-white border-[1.5px] border-[#e2e6ea] rounded-2xl p-10 flex flex-col transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(15,31,46,0.12)]">
                    <div className="mb-8">
                        <h3 className="text-[22px] font-bold text-navy mb-1">Start Free</h3>
                        <p className="text-sm text-secondary">Perfect for side projects and early startups.</p>
                    </div>
                    <div className="flex items-baseline gap-1 mb-8">
                        <span className="text-[28px] font-bold text-navy">₱</span>
                        <span className="text-[56px] font-extrabold text-navy leading-none">0</span>
                        <span className="text-sm text-muted">/mo</span>
                    </div>
                    <div className="w-full mb-8">
                        <LandingButton variant="outline" size="md" className="w-full">
                            Get Started
                        </LandingButton>
                    </div>
                    <ul className="list-none flex flex-col gap-4">
                        {features.free.map((feature, i) => (
                            <li
                                key={i}
                                className={`flex items-center gap-[10px] text-sm ${feature.included ? 'text-secondary' : 'text-muted line-through opacity-70'}`}
                            >
                                <CheckIcon muted={!feature.included} />
                                <span>{feature.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Pro Plan */}
                <div className="bg-white border-[1.5px] border-brand rounded-2xl p-10 flex flex-col relative shadow-[0_4px_16px_rgba(15,31,46,0.10)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(15,31,46,0.12)]">
                    <div className="absolute top-[-12px] left-1/2 -translate-x-1/2 bg-brand text-white text-xs font-bold py-1 px-3 rounded-full uppercase tracking-[0.5px]">
                        Most Popular
                    </div>
                    <div className="mb-8">
                        <h3 className="text-[22px] font-bold text-navy mb-1">Get Pro</h3>
                        <p className="text-sm text-secondary">Advanced tools for growing businesses.</p>
                    </div>
                    <div className="flex items-baseline gap-1 mb-8">
                        <span className="text-[28px] font-bold text-navy">₱</span>
                        <span className="text-[56px] font-extrabold text-navy leading-none">
                            {isAnnual ? '399' : '499'}
                        </span>
                        <span className="text-sm text-muted">/mo</span>
                    </div>
                    <div className="w-full mb-8">
                        <LandingButton variant="primary" size="md" className="w-full">
                            Upgrade Now
                        </LandingButton>
                    </div>
                    <ul className="list-none flex flex-col gap-4">
                        {features.pro.map((feature, i) => (
                            <li key={i} className="flex items-center gap-[10px] text-sm text-secondary">
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
