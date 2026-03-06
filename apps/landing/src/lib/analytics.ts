import posthog from 'posthog-js';

declare const __POSTHOG_KEY__: string;

const CONSENT_KEY = 'cookie_consent';

export function getConsent(): 'accepted' | 'declined' | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    if (v === 'accepted' || v === 'declined') return v;
    return null;
  } catch {
    return null;
  }
}

export function setConsent(value: 'accepted' | 'declined'): void {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch { /* Safari private mode */ }
}

export function initPostHog(locale: string): void {
  if (!__POSTHOG_KEY__ || posthog.__loaded) return;
  posthog.init(__POSTHOG_KEY__, {
    api_host: 'https://eu.i.posthog.com',
    ui_host: 'https://eu.posthog.com',
    capture_pageview: true,
    capture_pageleave: true,
    persistence: 'localStorage',
    autocapture: false,
    loaded(ph) {
      ph.capture('$pageview', { locale });
    },
  });
}

export function trackEvent(name: string, props?: Record<string, unknown>): void {
  if (!posthog.__loaded) return;
  posthog.capture(name, props);
}
