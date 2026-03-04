import { useState } from 'react';
import { AppIcon } from '@slotra/branding';

// ── Interactive Grid Pattern (shared pattern from WaitlistSection) ──

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

// ── NotFoundSection ────────────────────────────────────────

export function NotFoundSection() {
    const [hoveredBtn, setHoveredBtn] = useState<'home' | 'support' | null>(null);

    return (
        <div
            className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden"
            style={{ backgroundColor: '#ffffff' }}
        >
            {/* Interactive grid background */}
            <InteractiveGridPattern />

            {/* Radial fade mask */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 65% 55% at 50% 50%, transparent 20%, #ffffff 80%)',
                }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center">

                {/* App icon */}
                <AppIcon
                    style={{ width: 110, height: 110, display: 'block', flexShrink: 0 }}
                    aria-hidden="true"
                />

                {/* 404 */}
                <p
                    className="font-bold leading-none tracking-[-0.03em]"
                    style={{ fontSize: 96, color: '#0f1f2e', marginTop: 40 }}
                >
                    404
                </p>

                {/* Heading */}
                <h1
                    className="font-bold tracking-[-0.015em]"
                    style={{ fontSize: 24, color: '#0f1f2e', marginTop: 20 }}
                >
                    Oops! Page not found.
                </h1>

                {/* Description */}
                <p
                    className="leading-[1.75] max-w-[340px]"
                    style={{ fontSize: 14, color: '#6b7685', marginTop: 12 }}
                >
                    The page you're looking for doesn't seem to exist. But don't worry, let's get you back on track.
                </p>

                {/* Buttons */}
                <div className="flex items-center gap-3" style={{ marginTop: 48 }}>
                    <a
                        href="/"
                        onMouseEnter={() => setHoveredBtn('home')}
                        onMouseLeave={() => setHoveredBtn(null)}
                        className="inline-flex items-center justify-center whitespace-nowrap transition-all duration-150"
                        style={{
                            height: 44,
                            padding: '0 28px',
                            borderRadius: 10,
                            fontSize: 14,
                            fontWeight: 600,
                            color: '#ffffff',
                            border: '1px solid rgba(0,0,0,0.18)',
                            background: hoveredBtn === 'home'
                                ? 'linear-gradient(180deg, #3538b5 0%, #272a86 100%)'
                                : 'linear-gradient(180deg, #3336a4 0%, #2a2d8c 100%)',
                            boxShadow: hoveredBtn === 'home'
                                ? 'inset 0 1px 0 rgba(255,255,255,0.18), 0 3px 10px rgba(46,49,146,0.4)'
                                : 'inset 0 1px 0 rgba(255,255,255,0.14), 0 2px 6px rgba(46,49,146,0.25)',
                        }}
                    >
                        Back to Home
                    </a>
                    <a
                        href="mailto:hello@slotra.ph"
                        onMouseEnter={() => setHoveredBtn('support')}
                        onMouseLeave={() => setHoveredBtn(null)}
                        className="inline-flex items-center justify-center whitespace-nowrap transition-all duration-150"
                        style={{
                            height: 44,
                            padding: '0 28px',
                            borderRadius: 10,
                            fontSize: 14,
                            fontWeight: 500,
                            color: hoveredBtn === 'support' ? '#0f1f2e' : '#4a5668',
                            border: '1px solid #d0d5dd',
                            background: hoveredBtn === 'support'
                                ? 'linear-gradient(180deg, #f9fafb 0%, #eceef1 100%)'
                                : 'linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%)',
                            boxShadow: hoveredBtn === 'support'
                                ? 'inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 4px rgba(0,0,0,0.08)'
                                : 'inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 3px rgba(0,0,0,0.05)',
                        }}
                    >
                        Report a Problem
                    </a>
                </div>

                {/* Need help */}
                <p style={{ fontSize: 13, color: '#7a8799', marginTop: 36 }}>
                    Need help?{' '}
                    <a
                        href="mailto:hello@slotra.ph"
                        className="font-medium underline underline-offset-2 transition-colors duration-150"
                        style={{ color: '#2e3192' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#252880')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#2e3192')}
                    >
                        hello@slotra.ph
                    </a>
                </p>
            </div>
        </div>
    );
}
