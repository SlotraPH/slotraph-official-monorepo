import { useState, useEffect, useRef, memo } from 'react';
import { Check, Clock, Video } from 'lucide-react';
import Cal, { getCalApi } from '@calcom/embed-react';

// ── Background grid ────────────────────────────────────────

const InteractiveGridPattern = memo(function InteractiveGridPattern({
    width = 40, height = 40, squares = [40, 30] as [number, number],
}: { width?: number; height?: number; squares?: [number, number] }) {
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
                        x={x} y={y} width={width} height={height}
                        style={{
                            stroke: 'rgba(46,49,146,0.05)',
                            strokeWidth: 1,
                            fill: hoveredSquare === index ? 'rgba(46,49,146,0.03)' : 'transparent',
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
});

// ── Main Component ─────────────────────────────────────────

type EmbedStatus = 'loading' | 'ready' | 'error';

export function BookDemoSection() {
    const [embedStatus, setEmbedStatus] = useState<EmbedStatus>('loading');
    const errorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        let cancelled = false;

        const markReady = () => { if (!cancelled) setEmbedStatus('ready'); };
        const markError = () => { if (!cancelled) setEmbedStatus(s => s === 'loading' ? 'error' : s); };

        // Cal.com fires postMessage events when the embed iframe becomes interactive
        const handleMessage = (e: MessageEvent) => {
            try {
                const d = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
                if (
                    d?.namespace === '123456' ||
                    d?.type === '__iframeReady' ||
                    d?.type === 'cal:loaded' ||
                    d?.type === 'cal:linkReady' ||
                    (d?.data?.namespace === '123456')
                ) {
                    markReady();
                }
            } catch { /* ignore parse errors */ }
        };
        window.addEventListener('message', handleMessage);

        // Error fallback: if no signal after 9s, assume failed
        errorTimer.current = setTimeout(markError, 9000);

        (async () => {
            try {
                const cal = await getCalApi({ namespace: '123456' });
                if (cancelled) return;
                cal('ui', {
                    theme: 'light',
                    cssVarsPerTheme: {
                        light: { 'cal-brand': '#2e3192' },
                        dark: { 'cal-brand': '#aec8ff' },
                    },
                    hideEventTypeDetails: false,
                    layout: 'month_view',
                });
            } catch {
                markError();
            }
        })();

        return () => {
            cancelled = true;
            window.removeEventListener('message', handleMessage);
            if (errorTimer.current) clearTimeout(errorTimer.current);
        };
    }, []);

    return (
        <section
            className="relative overflow-hidden"
            style={{ paddingTop: 'calc(var(--banner-h, 0px) + 120px)', paddingBottom: '80px', backgroundColor: '#f7f8fa' }}
        >
            <InteractiveGridPattern />
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, transparent 0%, #f7f8fa 70%)' }}
            />

            <div className="relative z-10 max-w-[1200px] mx-auto px-6 w-full">
                {/* ── Header ── */}
                <div className="flex flex-col items-center text-center mb-10">
                    <span
                        className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
                        style={{ backgroundColor: 'rgba(46,49,146,0.08)', color: '#2e3192' }}
                    >
                        <Video size={12} /> Free 30-min demo
                    </span>
                    <h1
                        className="text-[38px] font-bold leading-[1.15] tracking-[-0.03em] mb-3 max-[640px]:text-[28px]"
                        style={{ color: '#0f1f2e' }}
                    >
                        See Slotra in action
                    </h1>
                    <p className="text-[15px] leading-[1.75] max-w-[520px]" style={{ color: '#4a5668' }}>
                        Book a personalized 30-minute Google Meet with our team. We'll walk you through how Slotra fits your business and answer any questions.
                    </p>

                    {/* Meta pills */}
                    <div className="flex items-center gap-3 flex-wrap justify-center mt-4">
                        {[
                            { icon: <Clock size={13} />, label: '30 minutes' },
                            { icon: <Video size={13} />, label: 'Google Meet' },
                        ].map(({ icon, label }) => (
                            <div
                                key={label}
                                className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-full"
                                style={{ backgroundColor: '#ffffff', border: '1px solid #e2e6ea', color: '#4a5668' }}
                            >
                                {icon} {label}
                            </div>
                        ))}
                    </div>

                </div>

                {/* ── Two-column: checklist + Cal embed ── */}
                <div className="grid grid-cols-[1fr_2fr] gap-10 items-start max-[900px]:grid-cols-1">
                    {/* What's covered + Team */}
                    <div className="flex flex-col gap-3 pt-2">
                        <p className="text-[12px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#7a8799' }}>
                            What we'll cover
                        </p>
                        {[
                            'Live walkthrough of the booking flow',
                            'Staff scheduling & availability setup',
                            'Automated SMS & email reminders',
                            'GCash / Maya payment integration',
                            'Customization for your business type',
                            'Q&A — any questions you have',
                        ].map(item => (
                            <div key={item} className="flex items-center gap-3">
                                <div
                                    className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                                    style={{ backgroundColor: 'rgba(46,49,146,0.1)' }}
                                >
                                    <Check size={11} style={{ color: '#2e3192' }} strokeWidth={3} />
                                </div>
                                <span className="text-[14px]" style={{ color: '#4a5668' }}>{item}</span>
                            </div>
                        ))}

                        {/* Team */}
                        <div className="flex flex-col gap-2 mt-5">
                            <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#b0bac6' }}>
                                You'll meet
                            </p>
                            {[
                                { src: '/team/dheyn.jpg', name: 'Dheyn Orlanda', role: 'Chief Executive Officer' },
                                { src: '/team/francis.png', name: 'Francis Mistica', role: 'Chief Technology Officer' },
                            ].map(({ src, name, role }) => (
                                <div key={name} className="flex items-center gap-3 py-2">
                                    <img
                                        src={src}
                                        alt={name}
                                        className="w-9 h-9 rounded-full object-cover object-top flex-shrink-0"
                                        style={{ border: '1px solid rgba(0,0,0,0.08)' }}
                                    />
                                    <div>
                                        <p className="text-[13px] font-semibold tracking-[-0.01em]" style={{ color: '#0f1f2e' }}>{name}</p>
                                        <p className="text-[11px]" style={{ color: '#7a8799' }}>{role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cal embed */}
                    <div className="relative" style={{ minHeight: '560px' }}>
                        {embedStatus !== 'error' && (
                            <Cal
                                namespace="123456"
                                calLink="slotraph/123456"
                                style={{ width: '100%', height: '100%', overflow: 'scroll' }}
                                config={{ layout: 'month_view', useSlotsViewOnSmallScreen: 'true' }}
                            />
                        )}

                        {/* Loading skeleton */}
                        {embedStatus === 'loading' && (
                            <div
                                className="absolute inset-0 rounded-2xl overflow-hidden"
                                style={{ backgroundColor: '#ffffff', border: '1px solid #e2e6ea', boxShadow: '0 4px 24px rgba(15,31,46,0.06)' }}
                            >
                                <div className="p-8 flex flex-col gap-6 h-full">
                                    {/* Month nav */}
                                    <div className="flex items-center justify-between">
                                        <div className="h-5 w-28 rounded-lg animate-pulse" style={{ backgroundColor: '#eef0f3' }} />
                                        <div className="flex gap-2">
                                            <div className="h-8 w-8 rounded-lg animate-pulse" style={{ backgroundColor: '#eef0f3' }} />
                                            <div className="h-8 w-8 rounded-lg animate-pulse" style={{ backgroundColor: '#eef0f3' }} />
                                        </div>
                                    </div>

                                    {/* Day labels */}
                                    <div className="grid grid-cols-7 gap-2">
                                        {Array.from({ length: 7 }).map((_, i) => (
                                            <div key={i} className="h-3 rounded-md animate-pulse mx-auto w-4/5" style={{ backgroundColor: '#eef0f3' }} />
                                        ))}
                                    </div>

                                    {/* Calendar grid */}
                                    <div className="grid grid-cols-7 gap-2 flex-1">
                                        {Array.from({ length: 35 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className="aspect-square rounded-lg animate-pulse"
                                                style={{ backgroundColor: i % 7 === 0 || i % 11 === 0 ? '#e6e9f5' : '#eef0f3' }}
                                            />
                                        ))}
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px w-full" style={{ backgroundColor: '#eef0f3' }} />

                                    {/* Time slots label */}
                                    <div className="h-4 w-36 rounded-lg animate-pulse" style={{ backgroundColor: '#eef0f3' }} />

                                    {/* Time slot pills */}
                                    <div className="grid grid-cols-3 gap-3">
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <div key={i} className="h-10 rounded-xl animate-pulse" style={{ backgroundColor: i === 1 ? '#e6e9f5' : '#eef0f3' }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error state */}
                        {embedStatus === 'error' && (
                            <div
                                className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center text-center"
                                style={{
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #e2e6ea',
                                    boxShadow: '0 4px 24px rgba(15,31,46,0.06)',
                                    padding: '48px 40px',
                                }}
                            >
                                {/* Icon */}
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                                    style={{ backgroundColor: 'rgba(46,49,146,0.07)' }}
                                >
                                    <Video size={22} style={{ color: '#2e3192' }} />
                                </div>

                                {/* Text */}
                                <p className="text-[17px] font-semibold tracking-[-0.02em] mb-2" style={{ color: '#0f1f2e' }}>
                                    Scheduler unavailable
                                </p>
                                <p className="text-[14px] leading-[1.7] max-w-[300px] mb-8" style={{ color: '#7a8799' }}>
                                    The booking widget couldn't load right now. Reach us directly and we'll get you scheduled.
                                </p>

                                {/* CTA */}
                                <a
                                    href="mailto:hello@slotra.ph"
                                    className="inline-flex items-center gap-2 rounded-xl text-[13px] font-semibold transition-all duration-150 hover:opacity-90"
                                    style={{
                                        padding: '12px 24px',
                                        backgroundColor: '#2e3192',
                                        color: '#ffffff',
                                        boxShadow: '0 2px 8px rgba(46,49,146,0.25)',
                                    }}
                                >
                                    Email us to book
                                </a>

                                {/* Or contact note */}
                                <p className="text-[12px] mt-4" style={{ color: '#b0bac6' }}>
                                    or reach us at <span style={{ color: '#4a5668' }}>hello@slotra.ph</span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
