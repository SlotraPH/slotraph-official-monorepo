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
        <section className="l-proof" aria-label="Featured integrations and partners">
            <div className="l-proof__inner">
                <p className="l-proof__heading">Who's talking about us</p>
                <div className="l-proof__strip">
                    {LOGOS.map((logo, i) => (
                        <div key={i} className="l-proof__logo-pill" title={logo.name}>
                            <span className="l-proof__logo-abbr">{logo.abbr}</span>
                            <span className="l-proof__logo-name">{logo.name}</span>
                        </div>
                    ))}
                </div>
                <p className="l-proof__caption">
                    Slotra integrates with the payment providers your customers already use.
                </p>
            </div>
        </section>
    );
}
