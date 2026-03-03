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
        <section
            className="bg-page py-16 border-t border-b border-[#e2e6ea]"
            aria-label="Key features"
        >
            <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-4 gap-8">
                {FEATURES.map((f, i) => (
                    <div key={i} className="flex flex-col gap-2">
                        <div className="text-[28px] leading-none mb-1" aria-hidden="true">{f.icon}</div>
                        <h3 className="text-base font-bold text-navy leading-[1.3]">{f.heading}</h3>
                        <p className="text-sm text-secondary leading-[1.6]">{f.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
