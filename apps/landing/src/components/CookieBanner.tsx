import { useState, useEffect } from 'react';
import { Globe, X } from 'lucide-react';
import { useTranslations, type Locale } from '../i18n/utils';
import { getConsent, setConsent, initPostHog } from '../lib/analytics';

export function CookieBanner({ locale }: { locale: Locale }) {
  const t = useTranslations(locale);
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const show = () => {
    setLeaving(false);
    setVisible(true);
  };

  const dismiss = (value: 'accepted' | 'declined') => {
    setConsent(value);
    if (value === 'accepted') {
      initPostHog(locale);
      window.dispatchEvent(new Event('cookie-consent-accepted'));
    }
    setLeaving(true);
    setTimeout(() => setVisible(false), 260);
  };

  useEffect(() => {
    if (getConsent() !== null) return;
    const timer = setTimeout(show, 1500);

    const handleOpen = () => show();
    window.addEventListener('open-cookie-settings', handleOpen);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('open-cookie-settings', handleOpen);
    };
  }, []);

  useEffect(() => {
    const handleOpen = () => show();
    window.addEventListener('open-cookie-settings', handleOpen);
    return () => window.removeEventListener('open-cookie-settings', handleOpen);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label={t('cookie.dismiss')}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1001,
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e6ea',
        boxShadow: '0 -4px 24px rgba(15,31,46,0.06)',
        transform: leaving ? 'translateY(100%)' : 'translateY(0)',
        transition: leaving
          ? 'transform 250ms ease-in'
          : 'transform 350ms ease-out',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        {/* Globe icon */}
        <Globe size={14} style={{ color: '#7a8799', flexShrink: 0 }} aria-hidden="true" />

        {/* Text */}
        <p
          style={{
            fontSize: 13,
            color: '#4a5668',
            flex: 1,
            minWidth: 200,
            margin: 0,
          }}
        >
          {t('cookie.banner_text')}{' '}
          <a
            href="#"
            onClick={e => e.preventDefault()}
            style={{ color: '#2e3192', textDecoration: 'underline', textUnderlineOffset: 2 }}
          >
            {t('cookie.learn_more')}
          </a>
        </p>

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexShrink: 0,
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => dismiss('declined')}
            style={{
              height: 34,
              padding: '0 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              color: '#4a5668',
              backgroundColor: 'transparent',
              border: '1px solid #d4d8de',
              cursor: 'pointer',
            }}
          >
            {t('cookie.decline')}
          </button>
          <button
            onClick={() => dismiss('accepted')}
            style={{
              height: 34,
              padding: '0 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              color: '#ffffff',
              backgroundColor: '#2e3192',
              border: '1px solid rgba(0,0,0,0.12)',
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(46,49,146,0.25)',
            }}
          >
            {t('cookie.accept')}
          </button>
          <button
            onClick={() => dismiss('declined')}
            aria-label={t('cookie.dismiss')}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#a0aab4',
            }}
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
