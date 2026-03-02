import React from 'react';

export const FinalCtaBanner: React.FC = () => {
    return (
        <section className="l-final-cta">
            <div className="l-final-cta__inner">
                <h2 className="l-final-cta__title">
                    Ready to automate your business scheduling?
                </h2>
                <p className="l-final-cta__subtitle">
                    Join hundreds of Philippine businesses using Slotra to grow their revenue and save time.
                </p>
                <form className="l-final-cta__form" onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="email"
                        placeholder="Enter your work email"
                        className="l-final-cta__input"
                        required
                    />
                    <button type="submit" className="l-final-cta__btn">
                        Get Started Free
                    </button>
                </form>
            </div>
        </section>
    );
};
