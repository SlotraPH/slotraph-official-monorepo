import { useState } from 'react';
import { Check } from 'lucide-react';

// ── Interactive Grid Pattern ───────────────────────────────

function InteractiveGridPattern({
    width = 40,
    height = 40,
    squares = [40, 30] as [number, number],
}: {
    width?: number;
    height?: number;
    squares?: [number, number];
}) {
    const [horizontal, vertical] = squares;
    const [hoveredSquare, setHoveredSquare] = useState<number | null>(null);

    return (
        <svg
            width={width * horizontal}
            height={height * vertical}
            className="absolute inset-0 h-full w-full"
        >
            {Array.from({ length: horizontal * vertical }).map((_, index) => {
                const x = (index % horizontal) * width;
                const y = Math.floor(index / horizontal) * height;
                return (
                    <rect
                        key={index}
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        style={{
                            stroke: 'rgba(46,49,146,0.05)',
                            strokeWidth: 1,
                            fill: hoveredSquare === index
                                ? 'rgba(46,49,146,0.03)'
                                : 'transparent',
                            transition: hoveredSquare === index
                                ? 'fill 100ms ease-in-out'
                                : 'fill 1000ms ease-in-out',
                        }}
                        onMouseEnter={() => setHoveredSquare(index)}
                        onMouseLeave={() => setHoveredSquare(null)}
                    />
                );
            })}
        </svg>
    );
}

// ── WaitlistSection ────────────────────────────────────────

export function WaitlistSection() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [btnHovered, setBtnHovered] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: wire up to backend / email service
        setSubmitted(true);
    };

    return (
        <section
            id="waitlist"
            className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
            style={{ paddingTop: 'calc(var(--banner-h, 0px) + 62px)', paddingBottom: '80px' }}
        >
            {/* Interactive grid background */}
            <InteractiveGridPattern />

            {/* Radial fade mask so grid fades out at edges */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 65% 55% at 50% 50%, transparent 20%, #f7f8fa 80%)',
                }}
            />

            {/* Content */}
            <div className="relative z-10 max-w-[540px] w-full flex flex-col items-center text-center gap-6">

                {/* Badge */}
                <span
                    className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.8px] px-3 py-[5px] rounded-full"
                    style={{ backgroundColor: '#ecedf9', color: '#2e3192' }}
                >
                    <span
                        className="w-[6px] h-[6px] rounded-full flex-shrink-0"
                        style={{ backgroundColor: '#2e3192', animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' }}
                    />
                    Coming Soon
                </span>

                {/* Headline */}
                <h1
                    className="text-[46px] font-bold leading-[1.1] tracking-[-0.03em] max-[640px]:text-[34px]"
                    style={{ color: '#0f1f2e' }}
                >
                    Scheduling software<br />built for the Philippines
                </h1>

                {/* Subheadline */}
                <p
                    className="text-[15px] leading-[1.75] max-w-[420px]"
                    style={{ color: '#4a5668' }}
                >
                    Slotra automates bookings, reminders, and payments — so you can focus on growing your business.
                </p>

                {/* Form / Success */}
                {submitted ? (
                    <div
                        className="flex items-center gap-2 mt-2 text-[14px] font-medium"
                        style={{ color: '#2e3192' }}
                    >
                        <Check size={16} aria-hidden="true" />
                        You're on the list! We'll reach out when we launch.
                    </div>
                ) : (
                    <>
                        <form
                            onSubmit={handleSubmit}
                            className="flex gap-2 w-full max-w-[420px] mt-2 max-[480px]:flex-col"
                        >
                            <input
                                type="email"
                                required
                                placeholder="Enter your work email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="flex-1 h-[42px] px-4 rounded-md text-[13.5px] outline-none transition-[border-color] duration-150"
                                style={{
                                    border: '1px solid #d4d8de',
                                    color: '#0f1f2e',
                                    backgroundColor: '#ffffff',
                                }}
                                onFocus={e => (e.currentTarget.style.borderColor = '#2e3192')}
                                onBlur={e => (e.currentTarget.style.borderColor = '#d4d8de')}
                            />
                            <button
                                type="submit"
                                onMouseEnter={() => setBtnHovered(true)}
                                onMouseLeave={() => setBtnHovered(false)}
                                className="h-[42px] px-5 rounded-md text-[13px] font-semibold whitespace-nowrap transition-[background,box-shadow] duration-150 max-[480px]:w-full"
                                style={{
                                    backgroundColor: btnHovered ? '#252880' : '#2e3192',
                                    color: '#ffffff',
                                    boxShadow: btnHovered
                                        ? '0 2px 12px rgba(46,49,146,0.35)'
                                        : '0 1px 4px rgba(46,49,146,0.2)',
                                }}
                            >
                                Join Waitlist
                            </button>
                        </form>

                        <p className="text-[12px]" style={{ color: '#a0aab4' }}>
                            No spam. We'll notify you when Slotra is ready to use.
                        </p>
                    </>
                )}
            </div>
        </section>
    );
}
