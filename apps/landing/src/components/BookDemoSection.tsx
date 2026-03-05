import { useState, useEffect, useRef, useCallback } from 'react';
import { Check, ChevronLeft, ChevronRight, Clock, Video, Calendar, Loader2 } from 'lucide-react';
import { SymbolWordmark } from '@slotra/branding';
import { sileo } from 'sileo';
import { Turnstile } from '@marsidev/react-turnstile';

declare const __SUPABASE_URL__: string;

// ── Types ──────────────────────────────────────────────────

type Step = 'date' | 'time' | 'details' | 'confirmed';

interface Availability {
    [date: string]: string[]; // "YYYY-MM-DD" → ISO slot strings
}

interface Confirmation {
    uid: string;
    meetUrl: string;
    startTime: string;
}

// ── Helpers ────────────────────────────────────────────────

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function toDateKey(date: Date): string {
    return date.toISOString().slice(0, 10);
}

function formatSlotTime(isoString: string, timezone: string): string {
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: timezone,
    }).format(new Date(isoString));
}

function formatConfirmedDate(isoString: string, timezone: string): string {
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: timezone,
    }).format(new Date(isoString));
}

function formatSelectedDate(dateKey: string): string {
    const parts = dateKey.split('-').map(Number);
    const date = new Date(parts[0]!, parts[1]! - 1, parts[2]!);
    return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(date);
}

function getGoogleCalUrl(startIso: string, meetUrl: string): string {
    const start = new Date(startIso);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace('.000', '');
    return [
        'https://calendar.google.com/calendar/render?action=TEMPLATE',
        `&text=Slotra+Demo`,
        `&dates=${fmt(start)}/${fmt(end)}`,
        `&details=Join+Google+Meet:+${encodeURIComponent(meetUrl)}`,
        `&location=${encodeURIComponent(meetUrl)}`,
    ].join('');
}

// ── Sub-components ─────────────────────────────────────────

function StepIndicator({ step }: { step: Step }) {
    const steps: { key: Step; label: string }[] = [
        { key: 'date', label: 'Date' },
        { key: 'time', label: 'Time' },
        { key: 'details', label: 'Details' },
    ];
    const activeIdx = steps.findIndex(s => s.key === step);

    return (
        <div className="flex items-center gap-0 mb-6">
            {steps.map(({ key, label }, idx) => {
                const done = activeIdx > idx;
                const active = activeIdx === idx;
                return (
                    <div key={key} className="flex items-center">
                        <div className="flex items-center gap-1.5">
                            <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold transition-all duration-150"
                                style={{
                                    backgroundColor: done || active ? '#2e3192' : '#e2e6ea',
                                    color: done || active ? '#ffffff' : '#7a8799',
                                }}
                            >
                                {done ? <Check size={12} strokeWidth={3} /> : idx + 1}
                            </div>
                            <span
                                className="text-[12px] font-medium"
                                style={{ color: active ? '#0f1f2e' : done ? '#2e3192' : '#7a8799' }}
                            >
                                {label}
                            </span>
                        </div>
                        {idx < steps.length - 1 && (
                            <div className="w-8 h-px mx-2" style={{ backgroundColor: done ? '#2e3192' : '#e2e6ea' }} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function CalendarPicker({
    year, month, availability, selectedDate, availLoading,
    onSelectDate, onPrevMonth, onNextMonth,
}: {
    year: number;
    month: number; // 0-indexed
    availability: Availability;
    selectedDate: string | null;
    availLoading: boolean;
    onSelectDate: (date: string) => void;
    onPrevMonth: () => void;
    onNextMonth: () => void;
}) {
    const today = toDateKey(new Date());
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const now = new Date();
    const isPrevDisabled = year < now.getFullYear() ||
        (year === now.getFullYear() && month <= now.getMonth());

    const cells: (number | null)[] = [
        ...Array(firstDayOfWeek).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    // Pad to complete last row
    while (cells.length % 7 !== 0) cells.push(null);

    return (
        <div>
            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={onPrevMonth}
                    disabled={isPrevDisabled}
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-100"
                    style={{
                        color: isPrevDisabled ? '#d0d5dd' : '#4a5668',
                        cursor: isPrevDisabled ? 'not-allowed' : 'pointer',
                    }}
                >
                    <ChevronLeft size={18} />
                </button>
                <span className="text-[14px] font-semibold" style={{ color: '#0f1f2e' }}>
                    {MONTH_NAMES[month]} {year}
                </span>
                <button
                    onClick={onNextMonth}
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-100"
                    style={{ color: '#4a5668' }}
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 mb-1">
                {DAY_LABELS.map(d => (
                    <div key={d} className="text-center text-[11px] font-medium py-1" style={{ color: '#7a8799' }}>
                        {d}
                    </div>
                ))}
            </div>

            {/* Date grid */}
            {availLoading ? (
                <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 35 }).map((_, i) => (
                        <div key={i} className="aspect-square rounded-lg animate-pulse" style={{ backgroundColor: '#f0f1f3' }} />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-7 gap-1">
                    {cells.map((day, i) => {
                        if (!day) return <div key={i} />;

                        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const isPast = dateKey < today;
                        const hasSlots = !!availability[dateKey]?.length;
                        const isSelected = dateKey === selectedDate;
                        const isToday = dateKey === today;
                        const disabled = isPast || !hasSlots;

                        return (
                            <button
                                key={i}
                                onClick={() => !disabled && onSelectDate(dateKey)}
                                disabled={disabled}
                                className="aspect-square flex items-center justify-center rounded-lg text-[13px] font-medium transition-all duration-100"
                                style={{
                                    backgroundColor: isSelected
                                        ? '#2e3192'
                                        : hasSlots && !isPast
                                            ? 'rgba(46,49,146,0.06)'
                                            : 'transparent',
                                    color: isSelected
                                        ? '#ffffff'
                                        : disabled
                                            ? '#c8cdd5'
                                            : '#0f1f2e',
                                    cursor: disabled ? 'not-allowed' : 'pointer',
                                    outline: isToday && !isSelected ? '2px solid #2e3192' : 'none',
                                    outlineOffset: '-2px',
                                }}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function SlotPicker({
    dateKey, slots, selectedSlot, timezone,
    onSelectSlot, onBack,
}: {
    dateKey: string;
    slots: string[];
    selectedSlot: string | null;
    timezone: string;
    onSelectSlot: (slot: string) => void;
    onBack: () => void;
}) {
    return (
        <div>
            <button
                onClick={onBack}
                className="flex items-center gap-1 text-[13px] font-medium mb-4 transition-colors duration-100"
                style={{ color: '#4a5668' }}
            >
                <ChevronLeft size={15} /> Back
            </button>
            <p className="text-[13px] font-semibold mb-1" style={{ color: '#0f1f2e' }}>
                {formatSelectedDate(dateKey)}
            </p>
            <p className="text-[11px] mb-4" style={{ color: '#7a8799' }}>
                {timezone.replace(/_/g, ' ')}
            </p>
            {slots.length === 0 ? (
                <p className="text-[13px] text-center py-6" style={{ color: '#7a8799' }}>
                    No slots available for this day.
                </p>
            ) : (
                <div className="grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-1">
                    {slots.map(slot => {
                        const isSelected = slot === selectedSlot;
                        return (
                            <button
                                key={slot}
                                onClick={() => onSelectSlot(slot)}
                                className="h-10 rounded-lg text-[13px] font-medium transition-all duration-100"
                                style={{
                                    border: `1px solid ${isSelected ? '#2e3192' : '#d4d8de'}`,
                                    backgroundColor: isSelected ? '#2e3192' : '#ffffff',
                                    color: isSelected ? '#ffffff' : '#0f1f2e',
                                    boxShadow: isSelected
                                        ? '0 2px 6px rgba(46,49,146,0.25)'
                                        : '0 1px 2px rgba(0,0,0,0.04)',
                                }}
                            >
                                {formatSlotTime(slot, timezone)}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function DetailsForm({
    fields, errors, touched, loading, turnstileStatus, turnstileSiteKey,
    selectedDate, selectedSlot, timezone,
    onChange, onBlur, onSubmit, onBack,
    onTurnstileSuccess, onTurnstileError, onTurnstileExpire,
}: {
    fields: { name: string; email: string; message: string };
    errors: Partial<{ name: string; email: string }>;
    touched: Partial<Record<'name' | 'email', boolean>>;
    loading: boolean;
    turnstileStatus: 'loading' | 'ready' | 'error';
    turnstileSiteKey: string;
    selectedDate: string;
    selectedSlot: string;
    timezone: string;
    onChange: (field: string, value: string) => void;
    onBlur: (field: 'name' | 'email') => void;
    onSubmit: (e: React.FormEvent) => void;
    onBack: () => void;
    onTurnstileSuccess: (token: string) => void;
    onTurnstileError: () => void;
    onTurnstileExpire: () => void;
}) {
    const [btnHovered, setBtnHovered] = useState(false);
    const busy = loading || turnstileStatus === 'loading';

    const inputBase: React.CSSProperties = {
        width: '100%',
        height: 44,
        borderRadius: 8,
        fontSize: 14,
        outline: 'none',
        fontFamily: 'inherit',
        backgroundColor: '#ffffff',
        transition: 'border-color 150ms, box-shadow 150ms',
    };

    const inputStyle = (field: 'name' | 'email'): React.CSSProperties => {
        const hasError = touched[field] && errors[field];
        return {
            ...inputBase,
            padding: '0 14px',
            border: `1px solid ${hasError ? '#e53e3e' : '#d4d8de'}`,
            boxShadow: hasError
                ? '0 0 0 3px rgba(229,62,62,0.1)'
                : '0 1px 2px rgba(0,0,0,0.04)',
            color: '#0f1f2e',
        };
    };

    return (
        <form onSubmit={onSubmit}>
            <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1 text-[13px] font-medium mb-4 transition-colors duration-100"
                style={{ color: '#4a5668' }}
            >
                <ChevronLeft size={15} /> Back
            </button>

            {/* Selected time summary */}
            <div
                className="flex items-center gap-2 rounded-lg px-3 py-2 mb-5 text-[13px]"
                style={{ backgroundColor: 'rgba(46,49,146,0.06)', color: '#2e3192' }}
            >
                <Clock size={14} />
                <span className="font-medium">
                    {formatSlotTime(selectedSlot, timezone)}, {formatSelectedDate(selectedDate)}
                </span>
            </div>

            <div className="flex flex-col gap-3">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium" style={{ color: '#4a5668' }}>
                        Full Name
                    </label>
                    <input
                        type="text"
                        placeholder="Juan dela Cruz"
                        value={fields.name}
                        onChange={e => onChange('name', e.target.value)}
                        onBlur={() => onBlur('name')}
                        style={inputStyle('name')}
                    />
                    {touched.name && errors.name && (
                        <p className="text-[12px]" style={{ color: '#e53e3e' }}>{errors.name}</p>
                    )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium" style={{ color: '#4a5668' }}>
                        Work Email
                    </label>
                    <input
                        type="email"
                        placeholder="juan@company.com"
                        value={fields.email}
                        onChange={e => onChange('email', e.target.value)}
                        onBlur={() => onBlur('email')}
                        style={inputStyle('email')}
                    />
                    {touched.email && errors.email && (
                        <p className="text-[12px]" style={{ color: '#e53e3e' }}>{errors.email}</p>
                    )}
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium" style={{ color: '#4a5668' }}>
                        What would you like to discuss? <span style={{ color: '#a0aab4' }}>(optional)</span>
                    </label>
                    <textarea
                        placeholder="Tell us about your business and what you're looking for..."
                        value={fields.message}
                        onChange={e => onChange('message', e.target.value)}
                        rows={3}
                        style={{
                            ...inputBase,
                            height: 'auto',
                            padding: '10px 14px',
                            border: '1px solid #d4d8de',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                            resize: 'none',
                            color: '#0f1f2e',
                        }}
                    />
                </div>

                <Turnstile
                    siteKey={turnstileSiteKey}
                    onSuccess={onTurnstileSuccess}
                    onError={onTurnstileError}
                    onExpire={onTurnstileExpire}
                    options={{ size: 'invisible' }}
                />

                <button
                    type="submit"
                    disabled={busy}
                    onMouseEnter={() => setBtnHovered(true)}
                    onMouseLeave={() => setBtnHovered(false)}
                    className="w-full h-[44px] rounded-lg text-[14px] font-semibold transition-all duration-150 flex items-center justify-center gap-2"
                    style={{
                        marginTop: 2,
                        color: '#ffffff',
                        border: '1px solid rgba(0,0,0,0.18)',
                        background: busy
                            ? 'linear-gradient(180deg, #3336a4 0%, #2a2d8c 100%)'
                            : btnHovered
                                ? 'linear-gradient(180deg, #3538b5 0%, #272a86 100%)'
                                : 'linear-gradient(180deg, #3336a4 0%, #2a2d8c 100%)',
                        boxShadow: btnHovered && !busy
                            ? 'inset 0 1px 0 rgba(255,255,255,0.18), 0 3px 10px rgba(46,49,146,0.4)'
                            : 'inset 0 1px 0 rgba(255,255,255,0.14), 0 2px 6px rgba(46,49,146,0.25)',
                        opacity: busy ? 0.75 : 1,
                        cursor: busy ? 'not-allowed' : 'pointer',
                    }}
                >
                    {loading && <Loader2 size={15} className="animate-spin" />}
                    {loading ? 'Booking…' : turnstileStatus === 'loading' ? 'Verifying…' : 'Confirm Booking'}
                </button>
            </div>
        </form>
    );
}

function ConfirmedView({ confirmation, email, timezone }: {
    confirmation: Confirmation;
    email: string;
    timezone: string;
}) {
    const [hovered, setHovered] = useState(false);
    return (
        <div className="flex flex-col items-center text-center gap-4 py-4">
            <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(46,49,146,0.1)' }}
            >
                <Check size={28} style={{ color: '#2e3192' }} strokeWidth={2.5} />
            </div>
            <div>
                <h3 className="text-[18px] font-bold mb-1" style={{ color: '#0f1f2e' }}>
                    Demo booked!
                </h3>
                <p className="text-[14px]" style={{ color: '#4a5668' }}>
                    {formatConfirmedDate(confirmation.startTime, timezone)}
                </p>
            </div>

            <p className="text-[13px]" style={{ color: '#7a8799' }}>
                A confirmation email has been sent to <strong style={{ color: '#4a5668' }}>{email}</strong>.
                The Google Meet link is also included.
            </p>

            <div className="flex flex-col gap-2 w-full">
                {confirmation.meetUrl && (
                    <a
                        href={confirmation.meetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        className="flex items-center justify-center gap-2 h-[44px] rounded-lg text-[14px] font-semibold transition-all duration-150"
                        style={{
                            color: '#ffffff',
                            border: '1px solid rgba(0,0,0,0.18)',
                            background: hovered
                                ? 'linear-gradient(180deg, #3538b5 0%, #272a86 100%)'
                                : 'linear-gradient(180deg, #3336a4 0%, #2a2d8c 100%)',
                            boxShadow: hovered
                                ? 'inset 0 1px 0 rgba(255,255,255,0.18), 0 3px 10px rgba(46,49,146,0.4)'
                                : 'inset 0 1px 0 rgba(255,255,255,0.14), 0 2px 6px rgba(46,49,146,0.25)',
                        }}
                    >
                        <Video size={15} /> Open Google Meet
                    </a>
                )}

                <a
                    href={getGoogleCalUrl(confirmation.startTime, confirmation.meetUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 h-[44px] rounded-lg text-[13px] font-medium transition-colors duration-150"
                    style={{
                        color: '#4a5668',
                        border: '1px solid #d4d8de',
                        background: 'linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 3px rgba(0,0,0,0.05)',
                    }}
                >
                    <Calendar size={14} /> Add to Google Calendar
                </a>
            </div>
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────

export function BookDemoSection({ turnstileSiteKey }: { turnstileSiteKey: string }) {
    const now = new Date();
    const [step, setStep] = useState<Step>('date');
    const [viewYear, setViewYear] = useState(now.getFullYear());
    const [viewMonth, setViewMonth] = useState(now.getMonth()); // 0-indexed
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [availability, setAvailability] = useState<Availability>({});
    const [availLoading, setAvailLoading] = useState(true);
    const [fields, setFields] = useState({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState<Partial<{ name: string; email: string }>>({});
    const [touched, setTouched] = useState<Partial<Record<'name' | 'email', boolean>>>({});
    const [loading, setLoading] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const [turnstileStatus, setTurnstileStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
    const userTimezone = useRef(Intl.DateTimeFormat().resolvedOptions().timeZone);

    const fetchAvailability = useCallback(async (year: number, month: number) => {
        setAvailLoading(true);
        try {
            const res = await fetch(
                `${__SUPABASE_URL__}/functions/v1/get-availability?year=${year}&month=${month + 1}&timezone=${encodeURIComponent(userTimezone.current)}`
            );
            if (!res.ok) throw new Error('unavailable');
            const data = await res.json();
            setAvailability((prev: Availability) => ({ ...prev, ...data.slots }));
        } catch {
            // Silently fail — all dates will appear as unavailable
        } finally {
            setAvailLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAvailability(viewYear, viewMonth);
    }, [viewYear, viewMonth, fetchAvailability]);

    const handlePrevMonth = () => {
        if (viewMonth === 0) { setViewYear((y: number) => y - 1); setViewMonth(11); }
        else setViewMonth((m: number) => m - 1);
    };
    const handleNextMonth = () => {
        if (viewMonth === 11) { setViewYear((y: number) => y + 1); setViewMonth(0); }
        else setViewMonth((m: number) => m + 1);
    };

    const handleSelectDate = (date: string) => {
        setSelectedDate(date);
        setSelectedSlot(null);
        setStep('time');
    };

    const handleSelectSlot = (slot: string) => {
        setSelectedSlot(slot);
        setStep('details');
    };

    const validate = () => {
        const e: Partial<{ name: string; email: string }> = {};
        if (!fields.name.trim() || fields.name.trim().length < 2) e.name = 'Full name is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.email.trim())) e.email = 'Valid email is required.';
        return e;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ name: true, email: true });
        const fieldErrors = validate();
        setErrors(fieldErrors);
        if (Object.keys(fieldErrors).length > 0) return;

        if (!turnstileToken) {
            sileo.error(
                turnstileStatus === 'loading'
                    ? { title: 'Still verifying', description: 'Please wait a moment and try again.' }
                    : { title: 'Bot check failed', description: 'Please refresh and try again.' }
            );
            return;
        }

        if (!selectedDate || !selectedSlot) return;

        setLoading(true);
        let res: Response;
        try {
            res = await fetch(`${__SUPABASE_URL__}/functions/v1/book-demo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: fields.name.trim(),
                    email: fields.email.trim().toLowerCase(),
                    startTime: selectedSlot,
                    timezone: userTimezone.current,
                    message: fields.message.trim() || undefined,
                    token: turnstileToken,
                }),
            });
        } catch {
            setLoading(false);
            sileo.error({ title: 'Something went wrong', description: 'Please try again in a moment.' });
            return;
        }
        setLoading(false);

        if (res.ok) {
            const data = await res.json();
            setConfirmation({ uid: data.uid, meetUrl: data.meetUrl, startTime: data.startTime });
            setStep('confirmed');
            sileo.success({ title: 'Demo booked!', description: "We'll see you soon." });
            return;
        }

        const data = await res.json().catch(() => ({}));
        if (res.status === 429) {
            sileo.error({ title: 'Too many attempts', description: 'Please try again in a few minutes.' });
        } else if (res.status === 403) {
            sileo.error({ title: 'Bot check failed', description: 'Please refresh and try again.' });
        } else if (res.status === 503) {
            sileo.error({ title: 'Booking unavailable', description: 'Please try again later or contact us directly.' });
        } else {
            sileo.error({ title: 'Something went wrong', description: 'Please try again in a moment.' });
        }
        console.error('book-demo error:', data);
    };

    const slotsForDate = selectedDate ? (availability[selectedDate] ?? []) : [];

    return (
        <section
            className="relative min-h-screen flex items-center overflow-hidden"
            style={{ paddingTop: 'calc(var(--banner-h, 0px) + 80px)', paddingBottom: '80px', backgroundColor: '#f7f8fa' }}
        >
            <div className="relative z-10 max-w-[1200px] mx-auto px-6 w-full grid grid-cols-2 gap-16 items-center max-[900px]:grid-cols-1">

                {/* ── Left: Content ── */}
                <div className="flex flex-col gap-6">
                    <div>
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
                        <p className="text-[15px] leading-[1.75]" style={{ color: '#4a5668' }}>
                            Book a personalized 30-minute Google Meet with our team. We'll walk you through how Slotra fits your business and answer any questions.
                        </p>
                    </div>

                    {/* What's covered */}
                    <div className="flex flex-col gap-3">
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
                    </div>

                    {/* Meta pills */}
                    <div className="flex items-center gap-3 flex-wrap">
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

                {/* ── Right: Booking card ── */}
                <div
                    className="w-full rounded-2xl p-6"
                    style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e6ea',
                        boxShadow: '0 4px 24px rgba(15,31,46,0.08)',
                    }}
                >
                    {step !== 'confirmed' && <StepIndicator step={step} />}

                    {step === 'date' && (
                        <CalendarPicker
                            year={viewYear}
                            month={viewMonth}
                            availability={availability}
                            selectedDate={selectedDate}
                            availLoading={availLoading}
                            onSelectDate={handleSelectDate}
                            onPrevMonth={handlePrevMonth}
                            onNextMonth={handleNextMonth}
                        />
                    )}

                    {step === 'time' && selectedDate && (
                        <SlotPicker
                            dateKey={selectedDate}
                            slots={slotsForDate}
                            selectedSlot={selectedSlot}
                            timezone={userTimezone.current}
                            onSelectSlot={handleSelectSlot}
                            onBack={() => setStep('date')}
                        />
                    )}

                    {step === 'details' && selectedDate && selectedSlot && (
                        <DetailsForm
                            fields={fields}
                            errors={errors}
                            touched={touched}
                            loading={loading}
                            turnstileStatus={turnstileStatus}
                            turnstileSiteKey={turnstileSiteKey}
                            selectedDate={selectedDate}
                            selectedSlot={selectedSlot}
                            timezone={userTimezone.current}
                            onChange={(field, value) => {
                                setFields((f: typeof fields) => ({ ...f, [field]: value }));
                                if (touched[field as 'name' | 'email']) {
                                    setErrors((er: typeof errors) => ({ ...er, [field]: undefined }));
                                }
                            }}
                            onBlur={field => {
                                setTouched((t: typeof touched) => ({ ...t, [field]: true }));
                                const e = validate();
                                setErrors((er: typeof errors) => ({ ...er, [field]: e[field] }));
                            }}
                            onSubmit={handleSubmit}
                            onBack={() => setStep('time')}
                            onTurnstileSuccess={token => { setTurnstileToken(token); setTurnstileStatus('ready'); }}
                            onTurnstileError={() => { setTurnstileToken(null); setTurnstileStatus('error'); }}
                            onTurnstileExpire={() => { setTurnstileToken(null); setTurnstileStatus('loading'); }}
                        />
                    )}

                    {step === 'confirmed' && confirmation && (
                        <ConfirmedView
                            confirmation={confirmation}
                            email={fields.email}
                            timezone={userTimezone.current}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}
