const FEATURES = [
    {
        icon: '📊',
        heading: 'Stay one step ahead',
        description: 'See upcoming bookings, revenue, and no-shows at a glance from your central dashboard.',
    },
    {
        icon: '🌍',
        heading: 'Reach global customers',
        description: 'Your booking page is online 24/7, welcoming clients from anywhere, at any hour.',
    },
    {
        icon: '💳',
        heading: 'Get paid in advance',
        description: 'Collect deposits or full payment at booking time — no more chasing unpaid bills.',
    },
    {
        icon: '🚫',
        heading: 'No more no-shows',
        description: 'Automated SMS and email reminders keep clients on time and your schedule full.',
    },
];

export function FeatureRow() {
    return (
        <section className="l-features" aria-label="Key features">
            <div className="l-features__inner">
                {FEATURES.map((f, i) => (
                    <div key={i} className="l-feature-item">
                        <div className="l-feature-item__icon" aria-hidden="true">{f.icon}</div>
                        <h3 className="l-feature-item__heading">{f.heading}</h3>
                        <p className="l-feature-item__description">{f.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
