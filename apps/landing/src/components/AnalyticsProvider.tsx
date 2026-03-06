import { useEffect } from 'react';
import { type Locale } from '../i18n/utils';
import { getConsent, initPostHog } from '../lib/analytics';

export function AnalyticsProvider({ locale }: { locale: Locale }) {
  useEffect(() => {
    if (getConsent() === 'accepted') {
      initPostHog(locale);
    }

    const handleAccepted = () => initPostHog(locale);
    window.addEventListener('cookie-consent-accepted', handleAccepted);
    return () => window.removeEventListener('cookie-consent-accepted', handleAccepted);
  }, [locale]);

  return null;
}
