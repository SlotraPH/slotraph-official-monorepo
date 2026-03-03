const LOGOS = [
    { name: 'GCash', abbr: 'G' },
    { name: 'Maya', abbr: 'M' },
    { name: 'PayMongo', abbr: 'PM' },
    { name: 'UnionBank', abbr: 'UB' },
    { name: 'BDO', abbr: 'BDO' },
    { name: 'BPI', abbr: 'BPI' },
];

export function SocialProofSection() {
    return (
        <section
            className="bg-white py-24 border-t border-[#e2e6ea]"
            aria-label="Featured integrations and partners"
        >
            <div className="max-w-[1200px] mx-auto px-6 flex flex-col items-center gap-8 text-center">
                <p className="text-[22px] font-extrabold text-navy tracking-[-0.5px]">
                    Who's talking about us
                </p>

                <div className="bg-[#f0f2f5] rounded-full py-4 px-6 flex items-center gap-4 flex-wrap justify-center">
                    {LOGOS.map((logo, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-1.5 py-1.5 px-[14px] bg-white border border-[#e2e6ea] rounded-full shadow-[0_1px_3px_rgba(15,31,46,0.08)]"
                            title={logo.name}
                        >
                            <span className="text-xs font-extrabold text-brand tracking-[0.5px]">{logo.abbr}</span>
                            <span className="text-sm font-semibold text-secondary">{logo.name}</span>
                        </div>
                    ))}
                </div>

                <p className="text-sm text-muted max-w-[480px] leading-[1.6]">
                    Slotra integrates with the payment providers your customers already use.
                </p>
            </div>
        </section>
    );
}
