import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const BANNER_H = '40px';

export function DevBanner() {
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        document.documentElement.style.setProperty('--banner-h', BANNER_H);
        return () => {
            document.documentElement.style.setProperty('--banner-h', '0px');
        };
    }, []);

    const handleDismiss = () => {
        document.documentElement.style.setProperty('--banner-h', '0px');
        setDismissed(true);
    };

    if (dismissed) return null;

    return (
        <div
            className="fixed top-0 left-0 right-0 z-[1002] flex items-center justify-center px-10 gap-3"
            style={{ height: BANNER_H, backgroundColor: '#0f1f2e' }}
        >
            {/* Badge */}
            <span
                className="inline-flex items-center text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.6px] px-[7px] sm:px-2 py-[3px] rounded-full flex-shrink-0"
                style={{ backgroundColor: '#ecedf9', color: '#2e3192' }}
            >
                In Development
            </span>

            {/* Message */}
            <p className="text-[11px] sm:text-[13px] leading-tight" style={{ color: 'rgba(255,255,255,0.65)' }}>
                <span className="hidden sm:inline">We're actively building Slotra — </span>
                <a
                    href="#waitlist"
                    className="font-medium underline underline-offset-2"
                    style={{ color: 'rgba(255,255,255,0.9)' }}
                >
                    Join the waitlist
                </a>
                <span className="hidden sm:inline"> to get early access.</span>
            </p>

            {/* Dismiss */}
            <button
                onClick={handleDismiss}
                aria-label="Dismiss banner"
                className="absolute right-4 transition-colors duration-150"
                style={{ color: 'rgba(255,255,255,0.35)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
            >
                <X size={14} aria-hidden="true" />
            </button>
        </div>
    );
}
