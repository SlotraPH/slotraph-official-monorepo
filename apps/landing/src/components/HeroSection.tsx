import { useState } from 'react';

export function HeroSection() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            window.location.href = `/register?email=${encodeURIComponent(email)}`;
        }
    };

    return (
        <section className="bg-page overflow-hidden" aria-label="Hero">
            <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 gap-16 items-center min-h-[calc(100vh-64px)] py-24 max-[900px]:grid-cols-1 max-[900px]:min-h-fit max-[900px]:py-16">

                {/* Left Column */}
                <div className="flex flex-col gap-6">
                    <h1 className="text-[clamp(36px,4.5vw,56px)] font-extrabold text-navy leading-[1.1] tracking-[-1.5px]">
                        Free scheduling<br />software for the&nbsp;PH
                    </h1>

                    <p className="text-lg text-secondary leading-[1.65] max-w-[440px]">
                        Organize your business with 24/7 automated online booking,
                        reminders, payments, and more — built for Philippine businesses.
                    </p>

                    <form
                        className="flex items-stretch gap-0 mt-2 max-w-[480px] max-[640px]:flex-col max-[640px]:gap-2"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <input
                            className="flex-1 py-[14px] px-4 text-sm text-navy bg-white border-[1.5px] border-[#e2e6ea] border-r-0 rounded-l-[10px] outline-none transition-[border-color] duration-200 placeholder:text-muted focus:border-brand max-[640px]:border-r-[1.5px] max-[640px]:rounded-[10px]"
                            type="email"
                            placeholder="Your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            aria-label="Email address"
                            id="hero-email"
                        />
                        <button
                            type="submit"
                            className="py-[14px] px-6 text-sm font-semibold text-white bg-brand border-[1.5px] border-brand rounded-r-[10px] cursor-pointer whitespace-nowrap transition-[background,transform] duration-200 hover:bg-brand-hover hover:border-brand-hover hover:-translate-y-px active:translate-y-0 max-[640px]:rounded-[10px] max-[640px]:text-center"
                        >
                            Start Free
                        </button>
                    </form>

                    {/* Trust Indicator */}
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex gap-0.5" aria-hidden="true">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <span key={i} className="text-[#00b67a] text-lg leading-none">★</span>
                            ))}
                        </div>
                        <p className="text-sm text-secondary">
                            <strong className="font-semibold text-navy">Excellent</strong>
                            {' '}· Trusted by 500+ Philippine businesses
                        </p>
                    </div>
                </div>

                {/* Right Column — App Mockup */}
                <div
                    className="relative flex items-center justify-center min-h-[500px] max-[900px]:min-h-[340px]"
                    aria-hidden="true"
                >
                    <div className="relative w-full max-w-[560px]">
                        {/* Main dashboard mockup */}
                        <div className="bg-white rounded-2xl shadow-[0_16px_48px_rgba(15,31,46,0.14)] border border-[#e2e6ea] overflow-hidden w-full aspect-[16/11] flex flex-col [transform:perspective(800px)_rotateY(-4deg)_rotateX(2deg)]">
                            <div className="bg-navy h-9 flex items-center px-3 gap-1.5 flex-shrink-0">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                            </div>
                            <div className="grid grid-cols-[56px_1fr] flex-1 bg-page overflow-hidden">
                                {/* Sidebar icons */}
                                <div className="bg-navy flex flex-col items-center py-3 gap-2">
                                    {[true, false, false, false, false].map((active, i) => (
                                        <div
                                            key={i}
                                            className={`w-8 h-8 rounded-[6px] ${active ? 'bg-brand' : 'bg-white/10'}`}
                                        />
                                    ))}
                                </div>

                                {/* Calendar content */}
                                <div className="p-3 flex flex-col gap-2">
                                    <div className="flex gap-2 items-center">
                                        <div className="h-3 bg-navy rounded w-20 opacity-70" />
                                    </div>
                                    <div className="grid grid-cols-7 gap-[3px] flex-1">
                                        {Array.from({ length: 35 }).map((_, i) => {
                                            const isToday = i === 14;
                                            const isEvent = [8, 15, 20, 22, 27].includes(i);
                                            return (
                                                <div
                                                    key={i}
                                                    className={`rounded h-[30px] border ${
                                                        isToday
                                                            ? 'bg-brand border-brand'
                                                            : isEvent
                                                            ? 'bg-brand-light border-[#b2e0cb]'
                                                            : 'bg-white border-[#e2e6ea]'
                                                    }`}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating phone overlay */}
                        <div className="absolute bottom-[-24px] right-[-24px] w-[140px] bg-white rounded-2xl shadow-[0_8px_32px_rgba(15,31,46,0.12)] border border-[#e2e6ea] overflow-hidden animate-float">
                            <div className="h-2 bg-navy flex items-center justify-center" />
                            <div className="p-2 flex flex-col gap-[5px]">
                                {[1, 2, 3, 4].map((i) => {
                                    const isBlue = i % 2 === 0;
                                    return (
                                        <div
                                            key={i}
                                            className={`border-l-2 rounded-[3px] p-1 flex flex-col gap-0.5 ${isBlue ? 'bg-[#e8f0ff] border-l-[#3b6ef5]' : 'bg-brand-light border-l-brand'}`}
                                        >
                                            <div className={`h-1.5 rounded-sm w-[70%] opacity-80 ${isBlue ? 'bg-[#3b6ef5]' : 'bg-brand'}`} />
                                            <div className={`h-1.5 rounded-sm w-1/2 opacity-50 ${isBlue ? 'bg-[#3b6ef5]' : 'bg-brand'}`} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
