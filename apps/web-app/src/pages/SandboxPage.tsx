import { Bell, CalendarDays, CheckCircle2, Mail, Search, Sparkles, UserRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell, AppShellContainer } from '@/app/components/AppShell';
import {
  BrandButton,
  BrandInput,
  Card,
  SectionHeading,
  Typography,
  colors,
  radii,
  shadows,
  spacing,
  typography,
  useBrandToast,
} from '@/ui';

const tokenCards = [
  { label: 'Brand', value: colors.brand },
  { label: 'Brand light', value: colors.brandLight },
  { label: 'Navy', value: colors.navy },
  { label: 'Page', value: colors.page },
  { label: 'Secondary', value: colors.secondary },
  { label: 'Border', value: colors.border },
  { label: 'Error', value: colors.error },
] as const;

export function SandboxPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [attempted, setAttempted] = useState(false);
  const toast = useBrandToast();

  const emailError = useMemo(() => {
    if (!attempted && !email) return undefined;
    if (!email.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return 'Use a valid email address.';
    return undefined;
  }, [attempted, email]);

  return (
    <AppShell>
      <section
        style={{
          background: `
            radial-gradient(circle at top left, rgba(46,49,146,0.08), transparent 30%),
            linear-gradient(180deg, #ffffff 0%, ${colors.page} 100%)
          `,
          padding: `${spacing[10]}px 0`,
        }}
      >
        <AppShellContainer>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: spacing[8],
            gap: spacing[4],
            flexWrap: 'wrap',
          }}
        >
          <SectionHeading
            eyebrow="Sandbox"
            title="Slotra design tokens and primitives"
            description="This isolated route exists to verify the new web-app token layer, gradients, focus rings, typography scale, and toast styling without touching production navigation."
          />
          <Link to="/owner/onboarding" style={{ textDecoration: 'none' }}>
            <BrandButton size="nav" variant="secondary">Back to setup</BrandButton>
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gap: spacing[6],
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            marginBottom: spacing[6],
          }}
        >
          <Card elevated>
            <SectionHeading
              eyebrow="Buttons"
              title="Brand gradients"
              description="Hover states use the required gradient shift plus stronger glow."
            />
            <div style={{ display: 'flex', gap: spacing[3], marginTop: spacing[4], flexWrap: 'wrap' }}>
              <BrandButton startIcon={<Sparkles size={15} />}>Primary action</BrandButton>
              <BrandButton variant="secondary" startIcon={<CalendarDays size={15} />}>
                Secondary action
              </BrandButton>
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Toasts"
              title="Sileo configuration"
              description="Bottom-left, navy fill, 14px roundness, white title text."
            />
            <div style={{ display: 'flex', gap: spacing[3], marginTop: spacing[4], flexWrap: 'wrap' }}>
              <BrandButton
                size="nav"
                startIcon={<CheckCircle2 size={15} />}
                onClick={() => toast.success({ title: 'Settings saved', description: 'Brand tokens are ready to adopt.' })}
              >
                Success toast
              </BrandButton>
              <BrandButton
                size="nav"
                variant="secondary"
                startIcon={<Bell size={15} />}
                onClick={() => toast.info({ title: 'Sandbox only', description: 'This route is intentionally isolated from product nav.' })}
              >
                Info toast
              </BrandButton>
            </div>
          </Card>
        </div>

        <Card style={{ marginBottom: spacing[6] }}>
          <SectionHeading
            eyebrow="Forms"
            title="Brand input primitive"
            description="Lucide icon slots, box-shadow focus rings, inline style escape hatches, and validation messaging."
          />
          <div
            style={{
              display: 'grid',
              gap: spacing[4],
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              marginTop: spacing[5],
            }}
          >
            <BrandInput
              helperText="Validate on blur or submit in consuming forms."
              label="Customer name"
              leadingIcon={UserRound}
              placeholder="Juan dela Cruz"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <BrandInput
              error={emailError}
              label="Email address"
              leadingIcon={Mail}
              placeholder="juan@slotra.ph"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <BrandInput
              helperText="Surface styles can be overridden inline where shared brand rendering needs it."
              label="Search services"
              leadingIcon={Search}
              placeholder="Haircut, consultation, facial"
              trailingContent={<span style={{ color: colors.muted, fontSize: typography.caption.fontSize }}>Ctrl+K</span>}
              inputStyle={{ background: 'linear-gradient(180deg, #ffffff 0%, #fcfcfd 100%)' }}
            />
          </div>
          <div style={{ marginTop: spacing[4] }}>
            <BrandButton
              onClick={() => {
                setAttempted(true);
                if (!emailError) {
                  toast.success({ title: 'Inputs look good', description: 'The primitive is ready for onboarding and booking forms.' });
                }
              }}
            >
              Validate sample form
            </BrandButton>
          </div>
        </Card>

        <div
          style={{
            display: 'grid',
            gap: spacing[6],
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          }}
        >
          <Card>
            <SectionHeading
              eyebrow="Typography"
              title="Shared type scale"
              description="Inter is loaded globally in the web-app entry and these constants are exported from TypeScript for reuse."
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4], marginTop: spacing[5] }}>
              <Typography as="h1" variant="hero">Scheduling software built for the Philippines</Typography>
              <Typography as="h2" color={colors.navy} variant="subHeading">Composed for owner and public product surfaces.</Typography>
              <Typography color={colors.secondary} variant="bodyLarge">
                Tokens stay in TypeScript so branded inline styles remain sharable across isolated app modules.
              </Typography>
              <Typography color={colors.secondary} variant="body">
                Buttons, cards, and inputs follow the March 2026 brand document rather than the older scaffold palette.
              </Typography>
              <Typography color={colors.muted} variant="caption">
                Caption text uses the muted neutral ramp and the published line-height rules.
              </Typography>
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Tokens"
              title="Reference values"
              description="A quick visual pass for the token surface."
            />
            <div style={{ display: 'grid', gap: spacing[3], marginTop: spacing[5] }}>
              {tokenCards.map((token) => (
                <div
                  key={token.label}
                  style={{
                    alignItems: 'center',
                    border: `1px solid ${colors.border}`,
                    borderRadius: radii.lg,
                    display: 'flex',
                    gap: spacing[3],
                    padding: spacing[3],
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      background: token.value,
                      borderRadius: radii.md,
                      boxShadow: token.value === colors.brand ? shadows.brandGlowSm : undefined,
                      display: 'inline-block',
                      height: 36,
                      width: 36,
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="label">{token.label}</Typography>
                    <Typography color={colors.secondary} variant="caption">{token.value}</Typography>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        </AppShellContainer>
      </section>
    </AppShell>
  );
}
