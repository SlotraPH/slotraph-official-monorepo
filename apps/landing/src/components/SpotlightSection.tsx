export function SpotlightSection() {
    return (
        <section className="l-spotlight" aria-label="Spotlight your brand">
            <div className="l-spotlight__inner">
                {/* Left — Product Mockup Card */}
                <div className="l-spotlight__mockup" aria-hidden="true">
                    <div className="l-spotlight__card">
                        {/* Booking page preview */}
                        <div className="l-spotlight__card-header">
                            <div className="l-spotlight__card-avatar" />
                            <div className="l-spotlight__card-meta">
                                <div className="l-spotlight__card-line l-spotlight__card-line--bold" />
                                <div className="l-spotlight__card-line l-spotlight__card-line--muted" />
                            </div>
                        </div>

                        <div className="l-spotlight__card-divider" />

                        {/* Service slots */}
                        <div className="l-spotlight__slots">
                            {[
                                { label: 'Haircut & Style', price: '₱350', color: 'green' },
                                { label: 'Color Treatment', price: '₱800', color: 'blue' },
                                { label: 'Beard Trim', price: '₱150', color: 'purple' },
                            ].map((s, i) => (
                                <div key={i} className={`l-spotlight__slot l-spotlight__slot--${s.color}`}>
                                    <span className="l-spotlight__slot-dot" />
                                    <span className="l-spotlight__slot-label">{s.label}</span>
                                    <span className="l-spotlight__slot-price">{s.price}</span>
                                </div>
                            ))}
                        </div>

                        <div className="l-spotlight__card-divider" />

                        {/* Time picker mock */}
                        <p className="l-spotlight__time-label">Pick a time</p>
                        <div className="l-spotlight__times">
                            {['9:00 AM', '10:00 AM', '11:30 AM', '2:00 PM', '4:30 PM', '5:00 PM'].map((t, i) => (
                                <div key={i} className={`l-spotlight__time-chip${i === 2 ? ' l-spotlight__time-chip--selected' : ''}`}>
                                    {t}
                                </div>
                            ))}
                        </div>

                        <button className="l-spotlight__book-btn">Confirm Booking</button>
                    </div>

                    {/* Decorative badge */}
                    <div className="l-spotlight__badge">
                        <span className="l-spotlight__badge-icon">✓</span>
                        <div>
                            <p className="l-spotlight__badge-title">Booking confirmed!</p>
                            <p className="l-spotlight__badge-sub">SMS sent to customer</p>
                        </div>
                    </div>
                </div>

                {/* Right — Copy */}
                <div className="l-spotlight__copy">
                    <p className="l-spotlight__eyebrow">Your branded booking page</p>
                    <h2 className="l-spotlight__heading">
                        Spotlight your&nbsp;brand, every booking
                    </h2>
                    <p className="l-spotlight__body">
                        Give your customers a seamless, professional booking experience under
                        your business name. Customize your page, set your services, and let
                        clients book anytime — no phone tag required.
                    </p>
                    <a href="/register" className="l-btn l-btn--outline l-btn--md">
                        Claim your free page →
                    </a>
                </div>
            </div>
        </section>
    );
}
