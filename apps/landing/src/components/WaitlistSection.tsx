import { useState, useEffect, useRef } from 'react';
import { Check, User, Mail, AlertCircle } from 'lucide-react';
import { AppIcon } from '@slotra/branding';
import { sileo } from 'sileo';
import { Turnstile } from '@marsidev/react-turnstile';
import { useTranslations, type Locale } from '../i18n/utils';

declare const __SUPABASE_URL__: string;
declare const __TURNSTILE_SITE_KEY__: string;

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

type ErrorKey =
    | 'error.name_required' | 'error.name_short' | 'error.name_invalid'
    | 'error.email_required' | 'error.email_invalid';

function validateName(v: string): ErrorKey | '' {
    if (!v.trim()) return 'error.name_required';
    if (v.trim().length < 2) return 'error.name_short';
    if (!/^[\p{L}\s\-'.]+$/u.test(v.trim())) return 'error.name_invalid';
    return '';
}

function validateEmail(v: string): ErrorKey | '' {
    if (!v.trim()) return 'error.email_required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'error.email_invalid';
    return '';
}

export function WaitlistSection({ turnstileSiteKey, locale = 'en' }: { turnstileSiteKey: string; locale?: Locale }) {
    const t = useTranslations(locale);
    const [fields, setFields] = useState<Fields>({ name: '', email: '' });
    const [errors, setErrors] = useState<FieldErrors>({});
    const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [btnHovered, setBtnHovered] = useState(false);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const [turnstileStatus, setTurnstileStatus] = useState<'loading' | 'ready' | 'error'>('loading');
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
        name: validateName(f.name) ? t(validateName(f.name) as ErrorKey) : undefined,
        email: validateEmail(f.email) ? t(validateEmail(f.email) as ErrorKey) : undefined,
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
        if (!turnstileToken) {
            sileo.error(
                turnstileStatus === 'loading'
                    ? { title: t('toast.still_verifying_title'), description: t('toast.still_verifying_desc') }
                    : { title: t('toast.bot_failed_title'), description: t('toast.bot_failed_desc') }
            );
            return;
        }

        setLoading(true);
        let res: Response;
        try {
            res = await fetch(
                `${__SUPABASE_URL__}/functions/v1/join-waitlist`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: fields.name.trim(),
                        email: fields.email.trim().toLowerCase(),
                        token: turnstileToken,
                    }),
                }
            );
        } catch {
            setLoading(false);
            sileo.error({ title: t('toast.error_title'), description: t('toast.error_desc') });
            return;
        }
        setLoading(false);

        if (res.ok) {
            setSubmitted(true);
            sileo.success({
                title: t('toast.waitlist_success_title'),
                description: t('toast.waitlist_success_desc'),
            });
            return;
        }

        const data = await res.json().catch(() => ({}));

        if (res.status === 409 && data.error === 'duplicate_email') {
            setTouched(prev => ({ ...prev, email: true }));
            setErrors(e => ({ ...e, email: t('error.duplicate_email') }));
        } else if (res.status === 429) {
            sileo.error({ title: t('toast.rate_limit_title'), description: t('toast.rate_limit_desc') });
        } else if (res.status === 403) {
            sileo.error({ title: t('toast.bot_failed_title'), description: t('toast.bot_failed_desc') });
        } else {
            sileo.error({ title: t('toast.error_title'), description: t('toast.error_desc') });
        }
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
            style={{ paddingTop: 'calc(var(--banner-h, 0px) + 120px)', paddingBottom: '80px' }}
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
                        className="text-[58px] font-black leading-[1.1] tracking-[-0.02em] max-[640px]:text-[42px]"
                        style={{ color: '#0f1f2e' }}
                    >
                        {/* Line 1: ✳️ Scheduling. */}
                        <span className="flex items-center gap-[0.25em]">
                            <span aria-hidden="true" style={{ fontSize: '0.42em', lineHeight: 1 }}>✳️</span>
                            {t('waitlist.headline1')}
                        </span>

                        {/* Line 2: Software. — oval */}
                        <span className="block">
                            <span
                                style={{
                                    display: 'inline-block',
                                    border: '2.5px solid #0f1f2e',
                                    borderRadius: '50%',
                                    padding: '0.05em 0.36em',
                                    transform: 'rotate(-1.5deg)',
                                    transformOrigin: 'center',
                                }}
                            >
                                {t('waitlist.headline2')}
                            </span>
                        </span>

                        {/* Line 3: built for the Philippines. */}
                        <span className="flex items-baseline gap-[0.2em] flex-wrap">
                            <span style={{ fontSize: '0.52em', fontWeight: 400, color: '#7a8799' }}>{t('waitlist.headline3_prefix')}</span>
                            <span
                                style={{
                                    backgroundImage: 'linear-gradient(rgba(0,195,255,0.35), rgba(0,195,255,0.35))',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'left center',
                                    backgroundSize: '0% 100%',
                                    padding: '0.03em 0.1em',
                                    borderRadius: '4px',
                                    animation: 'highlight-reveal 0.55s ease-out 0.35s forwards',
                                }}
                            >
                                {t('waitlist.headline3_highlight')}
                            </span>
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p
                        className="text-[15px] leading-[1.75] max-w-[400px]"
                        style={{ color: '#4a5668' }}
                    >
                        {t('waitlist.subtitle')}
                    </p>

                    {/* Form / Success */}
                    {submitted ? (
                        <div
                            className="flex items-center gap-2 text-[14px] font-medium"
                            style={{ color: '#2e3192' }}
                        >
                            <Check size={16} aria-hidden="true" />
                            {t('waitlist.success')}
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
                                        {t('waitlist.name_label')}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-[14px] top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: iconColor('name') }}>
                                            <User size={15} aria-hidden="true" />
                                        </span>
                                        <input
                                            id="waitlist-name"
                                            type="text"
                                            placeholder={t('waitlist.name_placeholder')}
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
                                        {t('waitlist.email_label')}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-[14px] top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: iconColor('email') }}>
                                            <Mail size={15} aria-hidden="true" />
                                        </span>
                                        <input
                                            id="waitlist-email"
                                            type="email"
                                            placeholder={t('waitlist.email_placeholder')}
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
                                    disabled={loading || turnstileStatus === 'loading'}
                                    onMouseEnter={() => setBtnHovered(true)}
                                    onMouseLeave={() => setBtnHovered(false)}
                                    className="w-full h-[44px] rounded-lg text-[14px] font-semibold transition-all duration-150"
                                    style={{
                                        marginTop: 6,
                                        color: '#ffffff',
                                        border: '1px solid rgba(0,0,0,0.18)',
                                        background: loading || turnstileStatus === 'loading'
                                            ? 'linear-gradient(180deg, #3336a4 0%, #2a2d8c 100%)'
                                            : btnHovered
                                                ? 'linear-gradient(180deg, #3538b5 0%, #272a86 100%)'
                                                : 'linear-gradient(180deg, #3336a4 0%, #2a2d8c 100%)',
                                        boxShadow: btnHovered && !loading && turnstileStatus !== 'loading'
                                            ? 'inset 0 1px 0 rgba(255,255,255,0.18), 0 3px 10px rgba(46,49,146,0.4)'
                                            : 'inset 0 1px 0 rgba(255,255,255,0.14), 0 2px 6px rgba(46,49,146,0.25)',
                                        opacity: loading || turnstileStatus === 'loading' ? 0.75 : 1,
                                        cursor: loading || turnstileStatus === 'loading' ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {loading ? t('waitlist.submit_loading') : turnstileStatus === 'loading' ? t('waitlist.submit_verifying') : t('waitlist.submit')}
                                </button>
                            </form>

                            <Turnstile
                                siteKey={turnstileSiteKey}
                                onSuccess={(token) => { setTurnstileToken(token); setTurnstileStatus('ready'); }}
                                onError={() => { setTurnstileToken(null); setTurnstileStatus('error'); }}
                                onExpire={() => { setTurnstileToken(null); setTurnstileStatus('loading'); }}
                                options={{ size: 'invisible' }}
                            />

                            <p className="text-[12px]" style={{ color: '#a0aab4' }}>
                                {t('waitlist.privacy')}
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
