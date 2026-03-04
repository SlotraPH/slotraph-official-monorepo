import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, LayoutDashboard, Settings, Sparkles } from 'lucide-react';
import { AppShell } from '@/app/components/AppShell';
import {
  FeatureGridSection,
  HeroSection,
  LaunchCard,
  MetricsSection,
  StepsSection,
} from '@/app/components/PageTemplates';
import { BrandButton } from '@/ui';

const featureItems = [
  {
    eyebrow: 'Owner operations',
    title: 'Run the daily workspace from one brand-consistent shell',
    description:
      'Calendar, services, customers, payments, and settings now share the same navigation, spacing rhythm, and branded controls.',
  },
  {
    eyebrow: 'Public booking',
    title: 'Keep the booking route honest while the flow is still modular',
    description:
      'The customer journey stays wired to the current data flow, but the surrounding templates now match the Slotra system.',
  },
  {
    eyebrow: 'Phase 3 scope',
    title: 'Shift layout debt out of the feature layer',
    description:
      'Reusable hero, grid, and section templates make the remaining feature-level Phase 4 refactors more isolated and predictable.',
  },
] as const;

const steps = [
  {
    title: 'Set up the owner workspace',
    description: 'Finish onboarding, confirm the booking slug, and review the current settings defaults.',
  },
  {
    title: 'Tune the service and scheduling surfaces',
    description: 'Adjust services, availability, and customer touchpoints without breaking the mock flows underneath.',
  },
  {
    title: 'Preview the public journey',
    description: 'Run the booking flow and confirmation screens through the same shell before deeper feature polish lands.',
  },
] as const;

const metrics = [
  { label: 'Max layout width', value: '1200px' },
  { label: 'Shared shell sections', value: '3' },
  { label: 'Desktop nav breakpoint', value: '900px' },
] as const;

export function HomePage() {
  return (
    <AppShell>
      <HeroSection
        eyebrow="Slotra web-app"
        title="Layouts, navigation, and page templates refit to the Slotra brand system."
        description="Use this web app as the working product shell: owner operations on one side, public booking on the other, all under the same navbar, spacing rhythm, and surface treatment."
        actions={(
          <>
            <Link style={{ textDecoration: 'none' }} to="/owner/dashboard">
              <BrandButton endIcon={<ArrowRight size={15} />} startIcon={<LayoutDashboard size={15} />}>
                Open owner dashboard
              </BrandButton>
            </Link>
            <Link style={{ textDecoration: 'none' }} to="/book">
              <BrandButton size="form" startIcon={<CalendarDays size={15} />} variant="secondary">
                Preview booking flow
              </BrandButton>
            </Link>
          </>
        )}
        aside={(
          <LaunchCard
            ctaLabel="Review onboarding"
            description="The onboarding and booking routes remain modular. Phase 3 focuses on the shell, templates, and branded page framing around them."
            items={[
              'Shared navbar and footer',
              'Owner workspace rail',
              'Reusable hero and grid sections',
              'Implementation notes for Phase 4 cleanup',
            ]}
            to="/owner/onboarding"
            title="Current implementation milestone"
          />
        )}
      />

      <FeatureGridSection
        description="The top-level routes are now framed like a product, not a scaffold. The reusable templates below are the baseline for the remaining feature-level cleanup."
        eyebrow="Templates"
        items={featureItems.slice()}
        title="One shell, reusable page sections, and cleaner route framing"
      />

      <MetricsSection items={metrics.slice()} />

      <StepsSection
        description="These routes stay useful as preview surfaces while the remaining feature refactors land in the next phase."
        eyebrow="Suggested flow"
        items={steps.slice()}
        title="Move through the app in the same order a real business would"
      />

      <FeatureGridSection
        description="Keep the remaining utilities visible without turning the home route into a dead-end chooser screen."
        eyebrow="Utility routes"
        items={[
          {
            eyebrow: 'Sandbox',
            title: 'Inspect the token layer in isolation',
            description: 'Use the sandbox route to verify gradients, typography, inputs, and toast styling before deeper page migrations.',
          },
          {
            eyebrow: 'Settings',
            title: 'Review brand and operational defaults',
            description: 'Settings pages stay connected to current mock repositories while the surface chrome shifts to the Slotra system.',
          },
          {
            eyebrow: 'Owner shell',
            title: 'Keep routing and auth guards intact',
            description: 'The navigation changes are shell-level only. Existing owner route guards and current page data flows remain in place.',
          },
        ]}
        title="Supporting routes still available during the refit"
      />

      <section className="shell-section shell-section--muted">
        <div className="shell-section__container shell-section__container--cta">
          <div className="shell-cta-card">
            <div className="shell-cta-card__copy">
              <span className="shell-cta-card__eyebrow">Continue</span>
              <h2>Pick the next route to verify the Phase 3 shell.</h2>
              <p>Use the owner workspace for operational pages, the booking route for customer-facing templates, or the sandbox for token-level checks.</p>
            </div>
            <div className="shell-cta-card__actions">
              <Link style={{ textDecoration: 'none' }} to="/owner/dashboard">
                <BrandButton startIcon={<LayoutDashboard size={15} />}>Owner workspace</BrandButton>
              </Link>
              <Link style={{ textDecoration: 'none' }} to="/sandbox">
                <BrandButton startIcon={<Sparkles size={15} />} variant="secondary">Open sandbox</BrandButton>
              </Link>
              <Link style={{ textDecoration: 'none' }} to="/owner/settings">
                <BrandButton startIcon={<Settings size={15} />} variant="secondary">Settings</BrandButton>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
