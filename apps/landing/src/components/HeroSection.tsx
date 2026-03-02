import { useState } from 'react';
import { LandingButton } from '@slotra/ui';

export function HeroSection() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder: redirect to register with email pre-filled
        if (email) {
            window.location.href = `/register?email=${encodeURIComponent(email)}`;
        }
    };

    return (
        <section className="l-hero" aria-label="Hero">
            <div className="l-hero__inner">
                {/* Left Column */}
                <div className="l-hero__left">
                    <h1 className="l-hero__headline">
                        Free scheduling<br />software for the&nbsp;PH
                    </h1>

                    <p className="l-hero__subtext">
                        Organize your business with 24/7 automated online booking,
                        reminders, payments, and more — built for Philippine businesses.
                    </p>

                    <form className="l-hero__cta-row" onSubmit={handleSubmit} noValidate>
                        <input
                            className="l-hero__email-input"
                            type="email"
                            placeholder="Your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            aria-label="Email address"
                            id="hero-email"
                        />
                        <button type="submit" className="l-hero__cta-btn">
                            Start Free
                        </button>
                    </form>

                    {/* Trust Indicator */}
                    <div className="l-hero__trust">
                        <div className="l-hero__stars" aria-hidden="true">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <span key={i} className="l-hero__star">★</span>
                            ))}
                        </div>
                        <p className="l-hero__trust-text">
                            <strong>Excellent</strong> · Trusted by 500+ Philippine businesses
                        </p>
                    </div>
                </div>

                {/* Right Column — App Mockup */}
                <div className="l-hero__right" aria-hidden="true">
                    <div className="l-hero__mockup-wrap">
                        {/* Main dashboard mockup */}
                        <div className="l-mockup-main">
                            <div className="l-mockup-topbar">
                                <div className="l-mockup-dot l-mockup-dot--red" />
                                <div className="l-mockup-dot l-mockup-dot--yellow" />
                                <div className="l-mockup-dot l-mockup-dot--green" />
                            </div>
                            <div className="l-mockup-body">
                                {/* Sidebar icons */}
                                <div className="l-mockup-sidebar">
                                    {[true, false, false, false, false].map((active, i) => (
                                        <div
                                            key={i}
                                            className={`l-mockup-sidebar-item${active ? ' l-mockup-sidebar-item--active' : ''}`}
                                        />
                                    ))}
                                </div>

                                {/* Calendar content */}
                                <div className="l-mockup-content">
                                    <div className="l-mockup-calendar-header">
                                        <div className="l-mockup-calendar-title" />
                                    </div>
                                    <div className="l-mockup-calendar-grid">
                                        {Array.from({ length: 35 }).map((_, i) => {
                                            const isToday = i === 14;
                                            const isEvent = [8, 15, 20, 22, 27].includes(i);
                                            return (
                                                <div
                                                    key={i}
                                                    className={[
                                                        'l-mockup-day',
                                                        isToday ? 'l-mockup-day--today' : '',
                                                        isEvent ? 'l-mockup-day--event' : '',
                                                    ].filter(Boolean).join(' ')}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating phone overlay */}
                        <div className="l-mockup-phone">
                            <div className="l-mockup-phone-notch" />
                            <div className="l-mockup-phone-body">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className={`l-mockup-appt${i % 2 === 0 ? ' l-mockup-appt--blue' : ''}`}>
                                        <div className="l-mockup-appt-line" />
                                        <div className="l-mockup-appt-line" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
