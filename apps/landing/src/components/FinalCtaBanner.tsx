import React from 'react';

export const FinalCtaBanner: React.FC = () => {
    return (
        <section className="bg-brand py-24 text-white text-center">
            <div className="max-w-[800px] mx-auto px-6 flex flex-col items-center gap-8">
                <h2 className="text-[clamp(28px,4vw,48px)] font-extrabold leading-[1.2] tracking-[-1px]">
                    Ready to automate your business scheduling?
                </h2>
                <p className="text-lg opacity-90 max-w-[500px]">
                    Join hundreds of Philippine businesses using Slotra to grow their revenue and save time.
                </p>
                <form
                    className="w-full max-w-[480px] flex"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <input
                        type="email"
                        placeholder="Enter your work email"
                        className="flex-1 py-[14px] px-6 border-0 rounded-l-[10px] text-base text-navy outline-none placeholder:text-muted"
                        required
                    />
                    <button
                        type="submit"
                        className="py-[14px] px-8 bg-navy text-white font-bold rounded-r-[10px] transition-[background,transform] duration-200 hover:bg-[#1a3248] hover:-translate-y-px"
                    >
                        Get Started Free
                    </button>
                </form>
            </div>
        </section>
    );
};
