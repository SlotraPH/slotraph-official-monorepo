declare global {
  interface Window {
    slotraAnalytics?: {
      track: (eventName: string, payload?: Record<string, unknown>) => void;
    };
  }
}

export function trackWebEvent(eventName: string, payload: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(
    new CustomEvent('slotra:analytics', {
      detail: {
        eventName,
        payload,
      },
    })
  );

  window.slotraAnalytics?.track(eventName, payload);
}
