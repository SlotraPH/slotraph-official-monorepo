import { useMemo, useState, type MouseEvent, type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppShellContainer } from './AppShell';
import { BrandButton, Card, colors, radii, shadows, spacing, typography } from '@/ui';

interface PageSectionProps {
  children: ReactNode;
  className?: string;
  grid?: boolean;
  tone?: 'default' | 'muted';
}

interface HeroSectionProps {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
}

interface GridItem {
  description: string;
  eyebrow?: string;
  title: string;
}

interface StepItem {
  description: string;
  title: string;
}

interface MetricItem {
  label: string;
  value: string;
}

interface PageIntroProps {
  eyebrow?: string;
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
  pills?: ReactNode;
}

export function PageSection({
  children,
  className,
  grid,
  tone = 'default',
}: PageSectionProps) {
  return (
    <section className={`shell-section shell-section--${tone}${grid ? ' shell-section--grid' : ''}${className ? ` ${className}` : ''}`}>
      <AppShellContainer>{children}</AppShellContainer>
    </section>
  );
}

export function HeroSection({ actions, aside, description, eyebrow, title }: HeroSectionProps) {
  return (
    <PageSection className="hero-section" grid tone="muted">
      <div className="hero-section__layout">
        <div className="hero-section__copy">
          <span style={{ color: colors.muted, fontFamily: typography.fontFamily, ...typography.overline }}>
            {eyebrow}
          </span>
          <h1 style={{ color: colors.navy, fontFamily: typography.fontFamily, margin: 0, ...typography.hero }}>
            {title}
          </h1>
          <p style={{ color: colors.secondary, fontFamily: typography.fontFamily, margin: 0, ...typography.bodyLarge }}>
            {description}
          </p>
          {actions ? <div className="hero-section__actions">{actions}</div> : null}
        </div>
        <div className="hero-section__aside">
          {aside}
        </div>
      </div>
      <InteractiveGridBackdrop />
    </PageSection>
  );
}

export function FeatureGridSection({
  description,
  eyebrow,
  items,
  title,
}: {
  description: string;
  eyebrow: string;
  items: GridItem[];
  title: string;
}) {
  return (
    <PageSection tone="default">
      <div className="section-header">
        <span style={{ color: colors.muted, fontFamily: typography.fontFamily, ...typography.overline }}>{eyebrow}</span>
        <h2 style={{ color: colors.navy, fontFamily: typography.fontFamily, margin: 0, ...typography.sectionHeading }}>{title}</h2>
        <p style={{ color: colors.secondary, fontFamily: typography.fontFamily, margin: 0, maxWidth: 720, ...typography.body }}>{description}</p>
      </div>

      <div className="template-grid template-grid--three">
        {items.map((item) => (
          <Card key={item.title} className="template-panel">
            {item.eyebrow ? (
              <span style={{ color: colors.muted, fontFamily: typography.fontFamily, ...typography.overline }}>
                {item.eyebrow}
              </span>
            ) : null}
            <h3 style={{ color: colors.navy, fontFamily: typography.fontFamily, margin: 0, ...typography.subHeading }}>
              {item.title}
            </h3>
            <p style={{ color: colors.secondary, fontFamily: typography.fontFamily, margin: 0, ...typography.body }}>
              {item.description}
            </p>
          </Card>
        ))}
      </div>
    </PageSection>
  );
}

export function StepsSection({
  description,
  eyebrow,
  items,
  title,
}: {
  description: string;
  eyebrow: string;
  items: StepItem[];
  title: string;
}) {
  return (
    <PageSection tone="muted">
      <div className="section-header">
        <span style={{ color: colors.muted, fontFamily: typography.fontFamily, ...typography.overline }}>{eyebrow}</span>
        <h2 style={{ color: colors.navy, fontFamily: typography.fontFamily, margin: 0, ...typography.sectionHeading }}>{title}</h2>
        <p style={{ color: colors.secondary, fontFamily: typography.fontFamily, margin: 0, maxWidth: 720, ...typography.body }}>{description}</p>
      </div>

      <div className="template-grid template-grid--three">
        {items.map((item, index) => (
          <Card key={item.title} className="template-panel template-panel--step">
            <div className="template-step-index">{String(index + 1).padStart(2, '0')}</div>
            <h3 style={{ color: colors.navy, fontFamily: typography.fontFamily, margin: 0, ...typography.subHeading }}>
              {item.title}
            </h3>
            <p style={{ color: colors.secondary, fontFamily: typography.fontFamily, margin: 0, ...typography.body }}>
              {item.description}
            </p>
          </Card>
        ))}
      </div>
    </PageSection>
  );
}

export function MetricsSection({ items }: { items: MetricItem[] }) {
  return (
    <PageSection tone="default">
      <div className="template-grid template-grid--three">
        {items.map((item) => (
          <Card key={item.label} className="template-panel template-panel--metric" elevated>
            <strong style={{ color: colors.navy, fontFamily: typography.fontFamily, fontSize: '32px', lineHeight: 1.1 }}>
              {item.value}
            </strong>
            <span style={{ color: colors.secondary, fontFamily: typography.fontFamily, ...typography.bodySmall }}>
              {item.label}
            </span>
          </Card>
        ))}
      </div>
    </PageSection>
  );
}

export function PageIntro({ actions, description, eyebrow, pills, title }: PageIntroProps) {
  return (
    <div className="owner-page-intro">
      <div className="owner-page-intro__copy">
        {eyebrow ? (
          <span style={{ color: colors.muted, fontFamily: typography.fontFamily, ...typography.overline }}>
            {eyebrow}
          </span>
        ) : null}
        <h1 style={{ color: colors.navy, fontFamily: typography.fontFamily, margin: 0, ...typography.sectionHeading }}>
          {title}
        </h1>
        <p style={{ color: colors.secondary, fontFamily: typography.fontFamily, margin: 0, maxWidth: 760, ...typography.body }}>
          {description}
        </p>
        {pills ? <div className="owner-page-intro__pills">{pills}</div> : null}
      </div>
      {actions ? <div className="owner-page-intro__actions">{actions}</div> : null}
    </div>
  );
}

export function AppPill({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'accent' | 'neutral' | 'success' | 'warning';
}) {
  return <span className={`app-pill app-pill--${tone}`}>{children}</span>;
}

export function LaunchCard({
  ctaLabel,
  description,
  items,
  to,
  title,
}: {
  ctaLabel: string;
  description: string;
  items: string[];
  to: string;
  title: string;
}) {
  return (
    <Card
      className="template-launch-card"
      elevated
      surfaceStyle={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(247,248,250,0.92) 100%)',
        boxShadow: shadows.brandGlowLg,
        position: 'relative',
      }}
    >
      <div className="template-launch-card__glow" />
      <span style={{ color: colors.muted, fontFamily: typography.fontFamily, ...typography.overline }}>
        Launch Surface
      </span>
      <h2 style={{ color: colors.navy, fontFamily: typography.fontFamily, margin: 0, ...typography.subHeading }}>
        {title}
      </h2>
      <p style={{ color: colors.secondary, fontFamily: typography.fontFamily, margin: 0, ...typography.body }}>
        {description}
      </p>
      <ul className="template-launch-card__list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <Link style={{ textDecoration: 'none' }} to={to}>
        <BrandButton endIcon={<ArrowRight size={15} />}>{ctaLabel}</BrandButton>
      </Link>
    </Card>
  );
}

function InteractiveGridBackdrop() {
  const totalCells = 90;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const cells = useMemo(() => Array.from({ length: totalCells }, (_, index) => index), []);

  function handleMove(event: MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const columns = Math.max(1, Math.floor(bounds.width / 40));
    const column = Math.max(0, Math.min(columns - 1, Math.floor(x / 40)));
    const row = Math.max(0, Math.floor(y / 40));
    setActiveIndex(Math.min(totalCells - 1, row * columns + column));
  }

  return (
    <div
      aria-hidden="true"
      className="template-grid-backdrop"
      onMouseLeave={() => setActiveIndex(null)}
      onMouseMove={handleMove}
    >
      {cells.map((index) => (
        <span
          key={index}
          className={`template-grid-backdrop__cell${activeIndex === index ? ' template-grid-backdrop__cell--active' : ''}`}
        />
      ))}
    </div>
  );
}

export function TemplateRail({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        alignSelf: 'start',
        display: 'grid',
        gap: spacing[4],
        position: 'sticky',
        top: 'calc(var(--app-shell-offset) + 24px)',
      }}
    >
      {children}
    </div>
  );
}

export function TemplateSplit({ children }: { children: ReactNode }) {
  return <div className="template-grid template-grid--two">{children}</div>;
}

export function TemplatePanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Card className={className}>
      <div style={{ display: 'grid', gap: spacing[3] }}>{children}</div>
    </Card>
  );
}

export const templateStyles = {
  sectionSurface: {
    background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,248,250,0.94) 100%)',
    borderRadius: radii.xl,
    boxShadow: shadows.card,
  },
};
