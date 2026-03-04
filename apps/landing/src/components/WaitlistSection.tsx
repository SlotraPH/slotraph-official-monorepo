import { useState, useEffect, useRef } from 'react';
import { Check, User, Mail, AlertCircle } from 'lucide-react';
import { AppIcon } from '@slotra/branding';
import { sileo } from 'sileo';
import { supabase } from '../lib/supabase';

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

type Fields = { name: string; email: string };
type FieldErrors = Partial<Fields>;

function validateName(v: string): string {
    if (!v.trim()) return 'Full name is required.';
    if (v.trim().length < 2) return 'Name must be at least 2 characters.';
    if (!/^[\p{L}\s\-'.]+$/u.test(v.trim())) return 'Please enter a valid name.';
    return '';
}

function validateEmail(v: string): string {
    if (!v.trim()) return 'Work email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'Please enter a valid email address.';
    return '';
}

export function WaitlistSection() {
    const [fields, setFields] = useState<Fields>({ name: '', email: '' });
    const [errors, setErrors] = useState<FieldErrors>({});
    const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
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

    const validate = (f: Fields): FieldErrors => ({
        name: validateName(f.name) || undefined,
        email: validateEmail(f.email) || undefined,
    });

    const handleBlur = (field: keyof Fields) => {
        setTouched(t => ({ ...t, [field]: true }));
        const fieldErrors = validate(fields);
        setErrors(e => ({ ...e, [field]: fieldErrors[field] }));
    };

    const handleChange = (field: keyof Fields, value: string) => {
        const next = { ...fields, [field]: value };
        setFields(next);
        // Clear error as soon as the field becomes valid
        if (touched[field]) {
            const fieldErrors = validate(next);
            setErrors(e => ({ ...e, [field]: fieldErrors[field] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const allTouched = { name: true, email: true };
        setTouched(allTouched);
        const fieldErrors = validate(fields);
        setErrors(fieldErrors);
        if (fieldErrors.name || fieldErrors.email) return;
        if (!supabase) {
            sileo.error({
                title: 'Waitlist is unavailable',
                description: 'Supabase environment variables are missing for this app.',
            });
            return;
        }

        setLoading(true);
        const { error } = await supabase
            .from('waitlist_entries')
            .insert({ name: fields.name.trim(), email: fields.email.trim().toLowerCase() });
        setLoading(false);

        if (error) {
            if (error.code === '23505') {
                // Duplicate email — show inline field error
                setTouched(t => ({ ...t, email: true }));
                setErrors(e => ({ ...e, email: 'This email is already on the waitlist.' }));
            } else {
                sileo.error({
                    title: 'Something went wrong',
                    description: 'Please try again in a moment.',
                });
            }
            return;
        }

        setSubmitted(true);
        sileo.success({
            title: "You're on the list!",
            description: "We'll notify you when Slotra is ready to use.",
        });
    };

    // Per-field input style helpers
    const inputStyle = (field: keyof Fields): React.CSSProperties => {
        const hasError = touched[field] && errors[field];
        return {
            padding: '0 14px 0 40px',
            border: `1px solid ${hasError ? '#e53e3e' : '#d4d8de'}`,
            color: '#0f1f2e',
            backgroundColor: '#ffffff',
            boxShadow: hasError
                ? '0 0 0 3px rgba(229,62,62,0.1), 0 1px 2px rgba(0,0,0,0.04)'
                : '0 1px 2px rgba(0,0,0,0.04)',
        };
    };

    const iconColor = (field: keyof Fields): string =>
        touched[field] && errors[field] ? '#e53e3e' : '#a0aab4';

    const onInputFocus = (e: React.FocusEvent<HTMLInputElement>, field: keyof Fields) => {
        const hasError = touched[field] && errors[field];
        e.currentTarget.style.borderColor = hasError ? '#e53e3e' : '#2e3192';
        e.currentTarget.style.boxShadow = hasError
            ? '0 0 0 3px rgba(229,62,62,0.12), 0 1px 2px rgba(0,0,0,0.04)'
            : '0 0 0 3px rgba(46,49,146,0.08), 0 1px 2px rgba(0,0,0,0.04)';
    };

    const onInputBlur = (e: React.FocusEvent<HTMLInputElement>, field: keyof Fields) => {
        handleBlur(field);
        // style is re-derived after state update via inputStyle()
        const hasError = errors[field] || validateName(fields.name) || validateEmail(fields.email);
        e.currentTarget.style.borderColor = hasError ? '#e53e3e' : '#d4d8de';
        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';
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
                        Scheduling software<br />built for the{' '}
                        <span className="relative inline-block whitespace-nowrap">
                            Philippines
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 230 18"
                                preserveAspectRatio="none"
                                className="absolute pointer-events-none"
                                style={{ bottom: '-6px', left: '-4px', width: 'calc(100% + 8px)', height: '14px' }}
                            >
                                {/* Highlighter body — thick semi-transparent fill */}
                                <path
                                    d="M3 11 C40 8, 90 14, 140 10 C180 6, 210 13, 227 10"
                                    stroke="rgba(46,49,146,0.18)"
                                    strokeWidth="11"
                                    fill="none"
                                    strokeLinecap="round"
                                    style={{
                                        strokeDasharray: 230,
                                        strokeDashoffset: 0,
                                        animation: 'draw-highlight 0.5s ease-out 0.3s both',
                                    }}
                                />
                                {/* Top edge — slightly darker for marker definition */}
                                <path
                                    d="M3 7 C40 5, 90 9, 140 6 C180 3, 210 8, 227 6"
                                    stroke="rgba(46,49,146,0.12)"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeLinecap="round"
                                    style={{
                                        strokeDasharray: 230,
                                        strokeDashoffset: 0,
                                        animation: 'draw-highlight 0.5s ease-out 0.3s both',
                                    }}
                                />
                            </svg>
                        </span>
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
                                        className="text-[12px] font-medium text-left"
                                        style={{ color: '#4a5668' }}
                                    >
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-[14px] top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: iconColor('name') }}>
                                            <User size={15} aria-hidden="true" />
                                        </span>
                                        <input
                                            id="waitlist-name"
                                            type="text"
                                            placeholder="Juan dela Cruz"
                                            value={fields.name}
                                            onChange={e => handleChange('name', e.target.value)}
                                            onFocus={e => onInputFocus(e, 'name')}
                                            onBlur={e => onInputBlur(e, 'name')}
                                            aria-invalid={!!(touched.name && errors.name)}
                                            aria-describedby={errors.name ? 'error-name' : undefined}
                                            className="w-full h-[44px] rounded-lg text-[14px] outline-none transition-all duration-150"
                                            style={inputStyle('name')}
                                        />
                                        {touched.name && errors.name && (
                                            <span className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#e53e3e' }}>
                                                <AlertCircle size={15} aria-hidden="true" />
                                            </span>
                                        )}
                                    </div>
                                    {touched.name && errors.name && (
                                        <p id="error-name" className="flex items-center gap-1 text-[12px]" style={{ color: '#e53e3e' }}>
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Work Email */}
                                <div className="flex flex-col gap-[6px]">
                                    <label
                                        htmlFor="waitlist-email"
                                        className="text-[12px] font-medium text-left"
                                        style={{ color: '#4a5668' }}
                                    >
                                        Work Email
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-[14px] top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: iconColor('email') }}>
                                            <Mail size={15} aria-hidden="true" />
                                        </span>
                                        <input
                                            id="waitlist-email"
                                            type="email"
                                            placeholder="juan@company.com"
                                            value={fields.email}
                                            onChange={e => handleChange('email', e.target.value)}
                                            onFocus={e => onInputFocus(e, 'email')}
                                            onBlur={e => onInputBlur(e, 'email')}
                                            aria-invalid={!!(touched.email && errors.email)}
                                            aria-describedby={errors.email ? 'error-email' : undefined}
                                            className="w-full h-[44px] rounded-lg text-[14px] outline-none transition-all duration-150"
                                            style={inputStyle('email')}
                                        />
                                        {touched.email && errors.email && (
                                            <span className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#e53e3e' }}>
                                                <AlertCircle size={15} aria-hidden="true" />
                                            </span>
                                        )}
                                    </div>
                                    {touched.email && errors.email && (
                                        <p id="error-email" className="flex items-center gap-1 text-[12px]" style={{ color: '#e53e3e' }}>
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    onMouseEnter={() => setBtnHovered(true)}
                                    onMouseLeave={() => setBtnHovered(false)}
                                    className="w-full h-[44px] rounded-lg text-[14px] font-semibold transition-all duration-150"
                                    style={{
                                        marginTop: 6,
                                        color: '#ffffff',
                                        border: '1px solid rgba(0,0,0,0.18)',
                                        background: loading
                                            ? 'linear-gradient(180deg, #3336a4 0%, #2a2d8c 100%)'
                                            : btnHovered
                                                ? 'linear-gradient(180deg, #3538b5 0%, #272a86 100%)'
                                                : 'linear-gradient(180deg, #3336a4 0%, #2a2d8c 100%)',
                                        boxShadow: btnHovered && !loading
                                            ? 'inset 0 1px 0 rgba(255,255,255,0.18), 0 3px 10px rgba(46,49,146,0.4)'
                                            : 'inset 0 1px 0 rgba(255,255,255,0.14), 0 2px 6px rgba(46,49,146,0.25)',
                                        opacity: loading ? 0.75 : 1,
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {loading ? 'Joining…' : 'Join the Waitlist'}
                                </button>
                            </form>

                            <p className="text-[12px]" style={{ color: '#a0aab4' }}>
                                No spam. We'll notify you when Slotra is ready to use.
                            </p>
                        </>
                    )}
                </div>

                {/* ── Right: 3D AppIcon ── */}
                <div className="relative flex items-center justify-center max-[900px]:hidden">

                    {/* Outer ambient glow */}
                    <div
                        className="absolute pointer-events-none"
                        style={{
                            width: 480,
                            height: 480,
                            background: 'radial-gradient(circle, rgba(46,49,146,0.2) 0%, rgba(46,49,146,0.06) 50%, transparent 70%)',
                            filter: 'blur(56px)',
                            transform: `translate(${tilt.y * 8}px, ${tilt.x * -8}px)`,
                            transition: 'transform 0.35s ease-out',
                        }}
                    />

                    {/* Icon wrapper — perspective tilt */}
                    <div
                        style={{
                            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                            transition: 'transform 0.2s ease-out',
                            borderRadius: '23%',
                            overflow: 'hidden',
                            position: 'relative',
                            boxShadow: [
                                `${-tilt.y * 2.5}px ${tilt.x * 2.5}px 70px rgba(46,49,146,0.3)`,
                                '0 24px 64px rgba(46,49,146,0.2)',
                                '0 6px 20px rgba(0,0,0,0.14)',
                                'inset 0 0 0 1px rgba(255,255,255,0.14)',
                            ].join(', '),
                        }}
                    >
                        <AppIcon
                            style={{ width: 300, height: 300, display: 'block' }}
                            aria-hidden="true"
                        />

                        {/* Primary shine — top-left sweep */}
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.08) 38%, transparent 62%)',
                                pointerEvents: 'none',
                            }}
                        />

                        {/* Specular highlight — small bright spot top-left */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '-8%',
                                left: '-4%',
                                width: '52%',
                                height: '52%',
                                background: 'radial-gradient(ellipse at 42% 42%, rgba(255,255,255,0.18) 0%, transparent 65%)',
                                pointerEvents: 'none',
                            }}
                        />

                        {/* Right edge shadow */}
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                bottom: 0,
                                width: '28%',
                                background: 'linear-gradient(to left, rgba(0,0,20,0.14) 0%, transparent 100%)',
                                pointerEvents: 'none',
                            }}
                        />

                        {/* Bottom depth */}
                        <div
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '38%',
                                background: 'linear-gradient(to top, rgba(0,0,20,0.22) 0%, transparent 100%)',
                                pointerEvents: 'none',
                            }}
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}
