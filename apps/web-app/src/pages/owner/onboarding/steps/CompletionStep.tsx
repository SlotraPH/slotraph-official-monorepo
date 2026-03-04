import { Badge, Button, SectionCard } from '@slotra/ui';
import { Link } from 'react-router-dom';
import type { OnboardingDraft } from '../types';

interface CompletionStepProps {
  draft: OnboardingDraft;
}

export function CompletionStep({ draft }: CompletionStepProps) {
  const openDays = draft.businessHours.filter((slot) => slot.isOpen).length;
  const activeServices = draft.services.filter((service) => service.status === 'Active').length;

  return (
    <div className="owner-settings-stack">
      <SectionCard
        title="Onboarding complete"
        description="The owner flow is ready end to end at the UI level. The next step is moving into daily operations and later wiring persistence."
      >
        <div className="onboarding-complete-banner">
          <Badge variant="success">Ready for next action</Badge>
          <h2>{draft.businessInfo.name || 'Your business'} is prepared for owner setup.</h2>
          <p>
            {activeServices} active services, {draft.team.length} team members, and {openDays} open business days are staged in local onboarding state.
          </p>
        </div>

        <div className="onboarding-summary-grid">
          <div className="owner-status-card">
            <span className="owner-status-card__label">Booking link</span>
            <p>slotra.app/book/{draft.bookingSlug}</p>
          </div>
          <div className="owner-status-card">
            <span className="owner-status-card__label">Deposit policy</span>
            <p>{draft.paymentPreferences.depositType === 'none' ? 'No deposit required' : `${draft.paymentPreferences.depositValue}${draft.paymentPreferences.depositType === 'percentage' ? '%' : ' PHP'} default deposit`}</p>
          </div>
          <div className="owner-status-card">
            <span className="owner-status-card__label">Accepted methods</span>
            <p>{draft.paymentPreferences.acceptedMethods.join(', ')}</p>
          </div>
        </div>

        <div className="owner-form-actions">
          <Link to="/owner/dashboard">
            <Button type="button">Go to dashboard</Button>
          </Link>
          <Link to="/owner/settings/brand">
            <Button type="button" variant="outline">Review brand details</Button>
          </Link>
        </div>
      </SectionCard>
    </div>
  );
}
