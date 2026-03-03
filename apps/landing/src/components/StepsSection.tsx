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
        <section className="bg-page py-24" aria-label="3 Steps to success">
            <div className="max-w-[1200px] mx-auto px-6 flex flex-col gap-16 items-center">

                <div className="text-center flex flex-col gap-4 max-w-[560px]">
                    <p className="text-sm font-semibold text-brand uppercase tracking-[0.8px]">How it works</p>
                    <h2 className="text-[clamp(28px,3vw,36px)] font-extrabold text-navy tracking-[-1px] leading-[1.15]">
                        3 steps to success
                    </h2>
                    <p className="text-lg text-secondary leading-[1.6]">
                        Getting started with Slotra takes minutes, not days.
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-6 w-full">
                    {STEPS.map((step, i) => (
                        <div
                            key={i}
                            className="bg-white border border-[#e2e6ea] rounded-2xl p-8 flex flex-col gap-4 shadow-[0_1px_3px_rgba(15,31,46,0.08)]"
                        >
                            <div className="text-[28px] font-extrabold text-brand tracking-[-1px] leading-none">
                                {step.number}
                            </div>
                            <h3 className="text-base font-bold text-navy leading-[1.3]">{step.title}</h3>
                            <p className="text-sm text-secondary leading-[1.65]">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
