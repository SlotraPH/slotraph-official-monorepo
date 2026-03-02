import { Button, Badge } from '@slotra/ui';

export function PaymentsPage() {
    return (
        <div>
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-header__title">Payments</h1>
                    <p className="page-header__subtitle">Accept online payments and track your revenue.</p>
                </div>
                <div className="page-header__actions">
                    <Badge variant="warning">Free Plan</Badge>
                </div>
            </div>

            {/* Hero split card */}
            <div className="pay-hero card">
                {/* Left — text + CTA */}
                <div className="pay-hero__left">
                    <div className="pay-hero__eyebrow">
                        <span className="pay-hero__eyebrow-dot" />
                        Payments &amp; Billing
                    </div>
                    <h2 className="pay-hero__heading">
                        Get paid before<br />your client arrives
                    </h2>
                    <p className="pay-hero__body">
                        Require upfront deposits or full payment at booking. Reduce no-shows by up to <strong>70%</strong> and keep your schedule running smoothly.
                    </p>

                    <ul className="pay-feature-list">
                        {[
                            'Collect deposits or full payments online',
                            'Automatic refunds on cancellation',
                            'GCash, Maya, and card support',
                            'Instant payout to your bank account',
                        ].map(f => (
                            <li key={f} className="pay-feature-item">
                                <svg className="pay-feature-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" width="14" height="14">
                                    <path d="M3 8l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {f}
                            </li>
                        ))}
                    </ul>

                    <div className="pay-cta-row">
                        <Button variant="primary" size="lg">Enable Payments</Button>
                        <Button variant="ghost" size="sm">Learn more →</Button>
                    </div>
                </div>

                {/* Right — placeholder visual */}
                <div className="pay-hero__right">
                    <div className="pay-visual">
                        {/* Mock payment confirmation card */}
                        <div className="pay-mock-card">
                            <div className="pay-mock-card__header">
                                <div className="pay-mock-avatar">A</div>
                                <div>
                                    <p className="pay-mock-name">Anna M.</p>
                                    <p className="pay-mock-service">Highlights · 2hrs</p>
                                </div>
                                <span className="badge badge--success pay-mock-badge">Paid</span>
                            </div>
                            <div className="pay-mock-divider" />
                            <div className="pay-mock-row">
                                <span>Deposit (50%)</span>
                                <strong>₱600</strong>
                            </div>
                            <div className="pay-mock-row">
                                <span>Balance due</span>
                                <span className="pay-mock-muted">₱600 on arrival</span>
                            </div>
                            <div className="pay-mock-divider" />
                            <div className="pay-mock-row">
                                <span>Total</span>
                                <strong>₱1,200</strong>
                            </div>
                        </div>

                        {/* Decorative blob */}
                        <div className="pay-visual-blob pay-visual-blob--1" />
                        <div className="pay-visual-blob pay-visual-blob--2" />
                    </div>
                </div>
            </div>

            {/* Stats row */}
            <div className="pay-stats-row">
                {[
                    { label: 'Total Collected', value: '—', hint: 'Enable payments to track' },
                    { label: 'Pending Payouts', value: '—', hint: 'Enable payments to track' },
                    { label: 'No-show Rate', value: '—', hint: 'Enable payments to track' },
                ].map(s => (
                    <div key={s.label} className="pay-stat card card--padded">
                        <p className="pay-stat__label">{s.label}</p>
                        <p className="pay-stat__value">{s.value}</p>
                        <p className="pay-stat__hint">{s.hint}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
