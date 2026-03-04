import type { LucideIcon } from 'lucide-react';
import { Check, ChevronRight } from 'lucide-react';
import { useId, type CSSProperties, type ReactNode } from 'react';
import { BrandButton, Card, colors, radii, shadows, spacing, typography } from '@/ui';

export interface FlowStep {
  id: string;
  label: string;
  description: string;
}

export interface ReviewItem {
  label: string;
  value: ReactNode;
}

export function FlowLayout({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar?: ReactNode;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gap: spacing[5],
        gridTemplateColumns: sidebar ? 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))' : 'minmax(0, 1fr)',
      }}
    >
      <div style={{ display: 'grid', gap: spacing[5] }}>{children}</div>
      {sidebar ? <div style={{ display: 'grid', gap: spacing[5], alignSelf: 'start' }}>{sidebar}</div> : null}
    </div>
  );
}

export function FlowStepper({
  currentStep,
  isStepAccessible,
  isStepComplete,
  onStepSelect,
  steps,
}: {
  currentStep: string;
  isStepAccessible?: (stepId: string) => boolean;
  isStepComplete?: (stepId: string) => boolean;
  onStepSelect?: (stepId: string) => void;
  steps: FlowStep[];
}) {
  return (
    <Card>
      <div style={{ display: 'grid', gap: spacing[4] }}>
        <div style={{ display: 'grid', gap: 4 }}>
          <span style={{ color: colors.muted, fontFamily: typography.fontFamily, margin: 0, ...typography.overline }}>
            Guided flow
          </span>
          <h2 style={{ color: colors.navy, fontFamily: typography.fontFamily, margin: 0, ...typography.subHeading }}>
            Finish each stage in order
          </h2>
        </div>
        <ol aria-label="Flow steps" style={{ display: 'grid', gap: spacing[3], listStyle: 'none', margin: 0, padding: 0 }}>
          {steps.map((step, index) => {
            const isCurrent = step.id === currentStep;
            const complete = isStepComplete?.(step.id) ?? false;
            const accessible = isStepAccessible?.(step.id) ?? true;

            return (
              <li key={step.id}>
                <button
                  aria-current={isCurrent ? 'step' : undefined}
                  disabled={!accessible}
                  type="button"
                  onClick={() => onStepSelect?.(step.id)}
                  style={{
                    alignItems: 'center',
                    background: isCurrent ? 'rgba(46,49,146,0.06)' : '#ffffff',
                    border: `1px solid ${isCurrent ? colors.brand : colors.border}`,
                    borderRadius: radii.lg,
                    boxShadow: isCurrent ? shadows.brandGlowSm : 'none',
                    color: colors.navy,
                    cursor: accessible ? 'pointer' : 'not-allowed',
                    display: 'grid',
                    gap: spacing[3],
                    gridTemplateColumns: '36px minmax(0, 1fr) auto',
                    opacity: accessible ? 1 : 0.55,
                    padding: spacing[3],
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      alignItems: 'center',
                      background: complete ? colors.brand : isCurrent ? colors.brandLight : colors.page,
                      borderRadius: radii.full,
                      color: complete || isCurrent ? colors.brand : colors.secondary,
                      display: 'inline-flex',
                      height: 36,
                      justifyContent: 'center',
                      width: 36,
                    }}
                  >
                    {complete ? <Check size={16} /> : index + 1}
                  </span>
                  <span style={{ display: 'grid', gap: 2 }}>
                    <span style={{ fontFamily: typography.fontFamily, fontSize: typography.bodySmall.fontSize, fontWeight: 600 }}>
                      {step.label}
                    </span>
                    <span style={{ color: colors.secondary, fontFamily: typography.fontFamily, ...typography.label }}>
                      {step.description}
                    </span>
                  </span>
                  <ChevronRight aria-hidden="true" size={15} style={{ color: colors.muted }} />
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </Card>
  );
}

export function FlowSection({
  action,
  children,
  description,
  eyebrow,
  title,
}: {
  action?: ReactNode;
  children: ReactNode;
  description: ReactNode;
  eyebrow?: string;
  title: ReactNode;
}) {
  const headingId = useId();

  return (
    <Card as="section" aria-labelledby={headingId}>
      <div style={{ display: 'grid', gap: spacing[4] }}>
        <div
          style={{
            alignItems: 'start',
            display: 'flex',
            flexWrap: 'wrap',
            gap: spacing[4],
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'grid', gap: 4, maxWidth: 720 }}>
            {eyebrow ? (
              <span style={{ color: colors.muted, fontFamily: typography.fontFamily, ...typography.overline }}>
                {eyebrow}
              </span>
            ) : null}
            <h2 id={headingId} style={{ color: colors.navy, fontFamily: typography.fontFamily, margin: 0, ...typography.subHeading }}>
              {title}
            </h2>
            <p style={{ color: colors.secondary, fontFamily: typography.fontFamily, margin: 0, ...typography.body }}>
              {description}
            </p>
          </div>
          {action}
        </div>
        {children}
      </div>
    </Card>
  );
}

export function ReviewBlock({
  items,
  title,
}: {
  items: ReviewItem[];
  title: string;
}) {
  return (
    <div style={{ display: 'grid', gap: spacing[3] }}>
      <h3 style={{ color: colors.navy, fontFamily: typography.fontFamily, margin: 0, ...typography.bodySmall, fontWeight: 700 }}>
        {title}
      </h3>
      <dl style={{ display: 'grid', gap: spacing[3], margin: 0 }}>
        {items.map((item) => (
          <div
            key={item.label}
            style={{
              border: `1px solid ${colors.border}`,
              borderRadius: radii.lg,
              display: 'grid',
              gap: 4,
              padding: spacing[3],
            }}
          >
            <dt style={{ color: colors.muted, fontFamily: typography.fontFamily, ...typography.overline }}>{item.label}</dt>
            <dd style={{ color: colors.navy, fontFamily: typography.fontFamily, fontSize: typography.body.fontSize, fontWeight: 700, margin: 0 }}>
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function EmptyFlowState({
  action,
  description,
  icon: Icon,
  title,
}: {
  action?: ReactNode;
  description: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <Card
      surfaceStyle={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,248,250,0.96) 100%)',
      }}
    >
      <div style={{ display: 'grid', gap: spacing[4], justifyItems: 'start' }}>
        <div
          aria-hidden="true"
          style={{
            alignItems: 'center',
            background: 'rgba(46,49,146,0.08)',
            borderRadius: radii.xl,
            color: colors.brand,
            display: 'inline-flex',
            height: 56,
            justifyContent: 'center',
            width: 56,
          }}
        >
          <Icon size={44} />
        </div>
        <div style={{ display: 'grid', gap: spacing[2] }}>
          <h2 style={{ color: colors.navy, fontFamily: typography.fontFamily, margin: 0, ...typography.subHeading }}>
            {title}
          </h2>
          <p style={{ color: colors.secondary, fontFamily: typography.fontFamily, margin: 0, ...typography.body }}>
            {description}
          </p>
        </div>
        {action}
      </div>
    </Card>
  );
}

export function FlowActions({
  primaryAction,
  secondaryAction,
  style,
}: {
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        gap: spacing[3],
        justifyContent: 'space-between',
        ...style,
      }}
    >
      <div>{secondaryAction}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[3] }}>{primaryAction}</div>
    </div>
  );
}

export function StatusTabs<T extends string>({
  current,
  onChange,
  options,
}: {
  current: T;
  onChange: (value: T) => void;
  options: Array<{ label: string; value: T }>;
}) {
  return (
    <div
      aria-label="View options"
      role="group"
      style={{
        alignItems: 'center',
        background: '#ffffff',
        border: `1px solid ${colors.border}`,
        borderRadius: radii.full,
        display: 'inline-flex',
        flexWrap: 'wrap',
        gap: 6,
        padding: 6,
      }}
    >
      {options.map((option) => {
        const active = option.value === current;
        return (
          <button
            key={option.value}
            aria-pressed={active}
            type="button"
            onClick={() => onChange(option.value)}
            style={{
              background: active ? 'linear-gradient(180deg, #3336a4 0%, #2a2d8c 100%)' : 'transparent',
              border: 'none',
              borderRadius: radii.full,
              boxShadow: active ? `${shadows.insetHighlight}, ${shadows.brandGlowSm}` : 'none',
              color: active ? '#ffffff' : colors.secondary,
              cursor: 'pointer',
              fontFamily: typography.fontFamily,
              fontSize: typography.label.fontSize,
              fontWeight: 600,
              minHeight: 34,
              padding: '0 14px',
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function InlineButtonLink({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <a href={href} style={{ textDecoration: 'none' }}>
      <BrandButton variant="secondary">{children}</BrandButton>
    </a>
  );
}
