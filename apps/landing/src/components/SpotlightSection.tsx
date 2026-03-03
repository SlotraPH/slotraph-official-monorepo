import { LandingButton } from '@slotra/ui';

const SLOTS = [
    { label: 'Haircut & Style', price: '₱350', color: 'green' },
    { label: 'Color Treatment', price: '₱800', color: 'blue' },
    { label: 'Beard Trim', price: '₱150', color: 'purple' },
] as const;

const SLOT_BORDER: Record<string, string> = {
    green: '#2e3192',
    blue: '#3b6ef5',
    purple: '#9b59b6',
};

const TIMES = ['9:00 AM', '10:00 AM', '11:30 AM', '2:00 PM', '4:30 PM', '5:00 PM'];

export function SpotlightSection() {
    return (
        <section className="bg-white py-24 border-t border-[#e2e6ea]" aria-label="Spotlight your brand">
            <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 gap-16 items-center">

                {/* Left — Product Mockup Card */}
                <div className="relative" aria-hidden="true">
                    <div className="bg-white border border-[#e2e6ea] rounded-2xl shadow-[0_16px_48px_rgba(15,31,46,0.14)] p-6 flex flex-col gap-4">

                        {/* Booking page preview header */}
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-light to-[#c5c7ea] flex-shrink-0" />
                            <div className="flex flex-col gap-[5px] flex-1">
                                <div className="h-2.5 rounded bg-[rgba(15,31,46,0.15)] w-[60%]" />
                                <div className="h-2.5 rounded bg-[#e2e6ea] w-[40%]" />
                            </div>
                        </div>

                        <div className="h-px bg-[#e2e6ea] my-1" />

                        {/* Service slots */}
                        <div className="flex flex-col gap-2">
                            {SLOTS.map((s, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 py-[10px] px-3 rounded-[10px] bg-page border border-[#e2e6ea]"
                                    style={{ borderLeft: `3px solid ${SLOT_BORDER[s.color]}` }}
                                >
                                    <span className="w-2 h-2 rounded-full bg-current opacity-40 flex-shrink-0" />
                                    <span className="text-sm font-medium text-navy flex-1">{s.label}</span>
                                    <span className="text-sm font-semibold text-secondary">{s.price}</span>
                                </div>
                            ))}
                        </div>

                        <div className="h-px bg-[#e2e6ea] my-1" />

                        {/* Time picker mock */}
                        <p className="text-xs font-semibold text-muted uppercase tracking-[0.6px]">Pick a time</p>
                        <div className="flex flex-wrap gap-1.5">
                            {TIMES.map((t, i) => (
                                <div
                                    key={i}
                                    className={`py-1.5 px-3 text-xs font-medium rounded-full cursor-pointer border ${
                                        i === 2
                                            ? 'bg-brand text-white border-brand'
                                            : 'bg-page text-secondary border-[#e2e6ea]'
                                    }`}
                                >
                                    {t}
                                </div>
                            ))}
                        </div>

                        <button className="w-full py-3 bg-brand text-white text-sm font-semibold rounded-[10px] cursor-pointer">
                            Confirm Booking
                        </button>
                    </div>

                    {/* Decorative badge */}
                    <div className="absolute bottom-[-20px] right-[-20px] flex items-center gap-2 bg-white border border-[#e2e6ea] rounded-xl shadow-[0_8px_32px_rgba(15,31,46,0.12)] py-[10px] px-[14px]">
                        <span className="w-7 h-7 bg-brand text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                            ✓
                        </span>
                        <div>
                            <p className="text-sm font-semibold text-navy whitespace-nowrap">Booking confirmed!</p>
                            <p className="text-xs text-muted whitespace-nowrap">SMS sent to customer</p>
                        </div>
                    </div>
                </div>

                {/* Right — Copy */}
                <div className="flex flex-col gap-6">
                    <p className="text-sm font-semibold text-brand uppercase tracking-[0.8px]">Your branded booking page</p>
                    <h2 className="text-[clamp(28px,3vw,36px)] font-extrabold text-navy leading-[1.15] tracking-[-1px]">
                        Spotlight your&nbsp;brand, every booking
                    </h2>
                    <p className="text-lg text-secondary leading-[1.65] max-w-[440px]">
                        Give your customers a seamless, professional booking experience under
                        your business name. Customize your page, set your services, and let
                        clients book anytime — no phone tag required.
                    </p>
                    <LandingButton href="/register" variant="outline" size="md">
                        Claim your free page →
                    </LandingButton>
                </div>
            </div>
        </section>
    );
}
