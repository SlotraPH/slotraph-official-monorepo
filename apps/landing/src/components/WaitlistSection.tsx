import { useState, useEffect, useRef } from 'react';
import { Check, User, Mail } from 'lucide-react';
import { Symbol } from '@slotra/branding';

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
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [btnHovered, setBtnHovered] = useState(false);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const sectionRef = useRef<HTMLElement>(null);

    // Global cursor-following tilt for the 3D symbol
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const section = sectionRef.current;
            if (!section) return;
            const rect = section.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width / 2);
            const dy = (e.clientY - cy) / (rect.height / 2);
            setTilt({
                x: Math.max(-12, Math.min(12, dy * -12)),
                y: Math.max(-12, Math.min(12, dx * 12)),
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: wire up to backend / email service
        setSubmitted(true);
    };

    return (
        <section
            ref={sectionRef}
            id="waitlist"
            className="relative min-h-screen flex items-center overflow-hidden"
            style={{ paddingTop: 'calc(var(--banner-h, 0px) + 80px)', paddingBottom: '80px' }}
        >
            {/* Interactive grid background */}
            <InteractiveGridPattern />

            {/* Radial fade mask */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 65% 55% at 50% 50%, transparent 20%, #f7f8fa 80%)',
                }}
            />

            {/* 2-column layout */}
            <div className="relative z-10 max-w-[1200px] mx-auto px-8 w-full grid grid-cols-2 gap-16 items-center max-[900px]:grid-cols-1 max-[900px]:justify-items-center">

                {/* ── Left: Content ── */}
                <div className="flex flex-col items-start gap-6 max-[900px]:items-center max-[900px]:text-center">

                    {/* Headline */}
                    <h1
                        className="text-[46px] font-bold leading-[1.1] tracking-[-0.03em] max-[640px]:text-[34px]"
                        style={{ color: '#0f1f2e' }}
                    >
                        Scheduling software<br />built for the Philippines
                    </h1>

                    {/* Subheadline */}
                    <p
                        className="text-[15px] leading-[1.75] max-w-[400px]"
                        style={{ color: '#4a5668' }}
                    >
                        Slotra automates bookings, reminders, and payments — so you can focus on growing your business.
                    </p>

                    {/* Form / Success */}
                    {submitted ? (
                        <div
                            className="flex items-center gap-2 text-[14px] font-medium"
                            style={{ color: '#2e3192' }}
                        >
                            <Check size={16} aria-hidden="true" />
                            You're on the list! We'll reach out when we launch.
                        </div>
                    ) : (
                        <>
                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-3 w-full max-w-[420px]"
                            >
                                {/* Full Name */}
                                <div className="flex flex-col gap-[6px]">
                                    <label
                                        htmlFor="waitlist-name"
                                        className="text-[12px] font-medium"
                                        style={{ color: '#4a5668' }}
                                    >
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-[14px] top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#a0aab4' }}>
                                            <User size={15} aria-hidden="true" />
                                        </span>
                                        <input
                                            id="waitlist-name"
                                            type="text"
                                            required
                                            placeholder="Juan dela Cruz"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            className="w-full h-[44px] rounded-lg text-[14px] outline-none transition-all duration-150"
                                            style={{
                                                padding: '0 14px 0 40px',
                                                border: '1px solid #d4d8de',
                                                color: '#0f1f2e',
                                                backgroundColor: '#ffffff',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                                            }}
                                            onFocus={e => {
                                                e.currentTarget.style.borderColor = '#2e3192';
                                                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(46,49,146,0.08), 0 1px 2px rgba(0,0,0,0.04)';
                                            }}
                                            onBlur={e => {
                                                e.currentTarget.style.borderColor = '#d4d8de';
                                                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Work Email */}
                                <div className="flex flex-col gap-[6px]">
                                    <label
                                        htmlFor="waitlist-email"
                                        className="text-[12px] font-medium"
                                        style={{ color: '#4a5668' }}
                                    >
                                        Work Email
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-[14px] top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#a0aab4' }}>
                                            <Mail size={15} aria-hidden="true" />
                                        </span>
                                        <input
                                            id="waitlist-email"
                                            type="email"
                                            required
                                            placeholder="juan@company.com"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full h-[44px] rounded-lg text-[14px] outline-none transition-all duration-150"
                                            style={{
                                                padding: '0 14px 0 40px',
                                                border: '1px solid #d4d8de',
                                                color: '#0f1f2e',
                                                backgroundColor: '#ffffff',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                                            }}
                                            onFocus={e => {
                                                e.currentTarget.style.borderColor = '#2e3192';
                                                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(46,49,146,0.08), 0 1px 2px rgba(0,0,0,0.04)';
                                            }}
                                            onBlur={e => {
                                                e.currentTarget.style.borderColor = '#d4d8de';
                                                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    onMouseEnter={() => setBtnHovered(true)}
                                    onMouseLeave={() => setBtnHovered(false)}
                                    className="w-full h-[44px] rounded-lg text-[14px] font-semibold transition-all duration-150"
                                    style={{
                                        marginTop: 4,
                                        color: '#ffffff',
                                        border: '1px solid rgba(0,0,0,0.18)',
                                        background: btnHovered
                                            ? 'linear-gradient(180deg, #3538b5 0%, #272a86 100%)'
                                            : 'linear-gradient(180deg, #3336a4 0%, #2a2d8c 100%)',
                                        boxShadow: btnHovered
                                            ? 'inset 0 1px 0 rgba(255,255,255,0.18), 0 3px 10px rgba(46,49,146,0.4)'
                                            : 'inset 0 1px 0 rgba(255,255,255,0.14), 0 2px 6px rgba(46,49,146,0.25)',
                                    }}
                                >
                                    Join the Waitlist
                                </button>
                            </form>

                            <p className="text-[12px]" style={{ color: '#a0aab4' }}>
                                No spam. We'll notify you when Slotra is ready to use.
                            </p>
                        </>
                    )}
                </div>

                {/* ── Right: 3D Symbol ── */}
                <div className="relative flex items-center justify-center max-[900px]:hidden">

                    {/* Ambient glow — follows tilt */}
                    <div
                        className="absolute pointer-events-none"
                        style={{
                            width: 480,
                            height: 480,
                            background: 'radial-gradient(circle, rgba(46,49,146,0.12) 0%, transparent 65%)',
                            filter: 'blur(56px)',
                            transform: `translate(${tilt.y * 12}px, ${tilt.x * -12}px)`,
                            transition: 'transform 0.35s ease-out',
                        }}
                    />

                    {/* Symbol with perspective tilt */}
                    <div
                        style={{
                            transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                            transition: 'transform 0.2s ease-out',
                            filter: [
                                `drop-shadow(${-tilt.y * 3}px ${tilt.x * 3}px 40px rgba(46,49,146,0.3))`,
                                'drop-shadow(0 12px 32px rgba(46,49,146,0.12))',
                            ].join(' '),
                        }}
                    >
                        <Symbol
                            style={{ width: 380, height: 380, display: 'block' }}
                            aria-hidden="true"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}
