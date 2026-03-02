const STEPS = [
    {
        number: '01',
        title: 'Create your free account',
        description:
            'Sign up in under 2 minutes. No credit card needed, no setup fees — just your email and business name.',
    },
    {
        number: '02',
        title: 'Set up your services',
        description:
            'Add your offerings, set durations, pricing, and availability. Your branded booking page goes live instantly.',
    },
    {
        number: '03',
        title: 'Start accepting bookings',
        description:
            'Share your page link, and watch appointments roll in automatically — with reminders and payments handled for you.',
    },
];

export function StepsSection() {
    return (
        <section className="l-steps" aria-label="3 Steps to success">
            <div className="l-steps__inner">
                <div className="l-steps__header">
                    <p className="l-steps__eyebrow">How it works</p>
                    <h2 className="l-steps__heading">3 steps to success</h2>
                    <p className="l-steps__subtext">
                        Getting started with Slotra takes minutes, not days.
                    </p>
                </div>

                <div className="l-steps__cards">
                    {STEPS.map((step, i) => (
                        <div key={i} className="l-step-card">
                            <div className="l-step-card__number">{step.number}</div>
                            <h3 className="l-step-card__title">{step.title}</h3>
                            <p className="l-step-card__description">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
