import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  LayoutDashboard,
  Settings,
  Sparkles,
  X,
} from 'lucide-react';
import wordmark from '@slotra/branding/assets/slotra_symbol_wordmark.png';
import { appConfig } from '@/config/env';
import { BrandButton, colors, layout, spacing, typography } from '@/ui';

interface AppShellProps {
  children: ReactNode;
  contentClassName?: string;
}

const NAV_LINKS = [
  { label: 'Setup', to: '/owner/onboarding' },
  { label: 'Dashboard', to: '/owner/dashboard' },
  { label: 'Calendar', to: '/owner/calendar' },
  { label: 'Booking', to: '/book' },
  { label: 'Settings', to: '/owner/settings' },
] as const;

const bannerStorageKey = 'slotra-web-app-banner-dismissed';

export function AppShell({ children, contentClassName }: AppShellProps) {
  const { pathname } = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const isScrolledRef = useRef(false);
  const scrollFrameRef = useRef<number | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.localStorage.getItem(bannerStorageKey) === 'true';
  });

  const showBanner = appConfig.inDevelopment && !bannerDismissed;
  const navbarSolid = isScrolled || pathname !== '/';

  useEffect(() => {
    const onScroll = () => {
      if (scrollFrameRef.current !== null) {
        return;
      }

      scrollFrameRef.current = window.requestAnimationFrame(() => {
        scrollFrameRef.current = null;
        const nextIsScrolled = window.scrollY > 12;
        if (isScrolledRef.current === nextIsScrolled) {
          return;
        }

        isScrolledRef.current = nextIsScrolled;
        setIsScrolled(nextIsScrolled);
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--banner-h', showBanner ? '40px' : '0px');
    return () => document.documentElement.style.setProperty('--banner-h', '0px');
  }, [showBanner]);

  const footerYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="app-shell">
      <a className="app-shell__skip-link" href="#main-content">Skip to content</a>
      {showBanner ? (
        <div className="app-shell__banner">
          <div className="app-shell__banner-inner">
            <div className="app-shell__banner-copy">
              <span className="app-shell__banner-badge">In Development</span>
              <span className="app-shell__banner-text">
                The web app is still being refit to the 2026 brand system. Some workflows remain preview-only.
              </span>
              <Link className="app-shell__banner-link" to="/owner/onboarding">
                Review setup progress
              </Link>
            </div>
            <button
              aria-label="Dismiss development banner"
              className="app-shell__banner-dismiss"
              type="button"
              onClick={() => {
                setBannerDismissed(true);
                window.localStorage.setItem(bannerStorageKey, 'true');
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : null}

      <header className={`app-shell__navbar ${navbarSolid ? 'app-shell__navbar--solid' : ''}`}>
        <div className="app-shell__navbar-inner">
          <Link aria-label="Slotra owner setup" className="app-shell__brand" to="/owner/onboarding">
            <img alt="Slotra" className="app-shell__brand-image" src={wordmark} />
          </Link>

          <nav aria-label="Primary" className="app-shell__nav">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                className={({ isActive }) => `app-shell__nav-link${isActive ? ' app-shell__nav-link--active' : ''}`}
                to={link.to}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="app-shell__actions">
            <a className="app-shell__action-link" href="mailto:hello@slotra.ph?subject=Book%20a%20Demo">
              <BrandButton
                size="nav"
                startIcon={<CalendarDays size={15} />}
                variant="secondary"
              >
                Book a Demo
              </BrandButton>
            </a>
            {!appConfig.inDevelopment ? (
              <Link className="app-shell__action-link" to="/owner/onboarding">
                <BrandButton size="nav" endIcon={<ArrowRight size={15} />}>
                  Get Started
                </BrandButton>
              </Link>
            ) : null}
          </div>
        </div>
      </header>

      <main className={`app-shell__main${contentClassName ? ` ${contentClassName}` : ''}`} id="main-content" tabIndex={-1}>
        {children}
      </main>

      <footer className="app-shell__footer">
        <div className="app-shell__footer-inner">
          <div className="app-shell__footer-brand">
            <img alt="Slotra" className="app-shell__footer-image" src={wordmark} />
            <p className="app-shell__footer-copy">
              Scheduling software built for the Philippines. Brand, booking, and owner operations now share one shell.
            </p>
          </div>
          <div className="app-shell__footer-links">
            <Link to="/owner/onboarding">
              <LayoutDashboard size={15} />
              Owner setup
            </Link>
            <Link to="/owner/dashboard">
              <Sparkles size={15} />
              Owner workspace
            </Link>
            <Link to="/book">
              <CalendarDays size={15} />
              Public booking
            </Link>
            <Link to="/owner/settings">
              <Settings size={15} />
              Settings
            </Link>
          </div>
          <div className="app-shell__footer-meta">
            <a href="mailto:hello@slotra.ph">hello@slotra.ph</a>
            <a href="https://www.facebook.com/profile.php?id=61586607277534" rel="noreferrer" target="_blank">
              Facebook
            </a>
            <span>© {footerYear} Slotra Technologies Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function AppShellContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={className}
      style={{
        margin: '0 auto',
        maxWidth: layout.maxWidth,
        paddingInline: spacing[8],
        width: '100%',
      }}
    >
      {children}
    </div>
  );
}

export function AppShellLead({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: ReactNode;
  description: ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
      {eyebrow ? (
        <span style={{ color: colors.muted, fontFamily: typography.fontFamily, ...typography.overline }}>
          {eyebrow}
        </span>
      ) : null}
      <h1 style={{ color: colors.navy, fontFamily: typography.fontFamily, margin: 0, ...typography.hero }}>
        {title}
      </h1>
      <p
        style={{
          color: colors.secondary,
          fontFamily: typography.fontFamily,
          margin: 0,
          maxWidth: 640,
          ...typography.bodyLarge,
        }}
      >
        {description}
      </p>
    </div>
  );
}

