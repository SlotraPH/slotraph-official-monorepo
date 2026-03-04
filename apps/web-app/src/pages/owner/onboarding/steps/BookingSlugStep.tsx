import { Badge, FormField, SectionCard } from '@slotra/ui';
import { getBusinessInitials } from '../../settings/brandDetailsShared';

interface BookingSlugStepProps {
  businessName: string;
  industry: string;
  about: string;
  slug: string;
  error?: string;
  onSlugChange: (nextSlug: string) => void;
}

export function BookingSlugStep({
  businessName,
  industry,
  about,
  slug,
  error,
  onSlugChange,
}: BookingSlugStepProps) {
  const initials = getBusinessInitials(businessName);

  return (
    <div className="onboarding-step-grid">
      <SectionCard
        title="Claim your booking link"
        description="Keep the public URL short and easy to remember. This stays local for now, but the shape matches the future backend contract."
      >
        <FormField
          label="Booking page URL"
          hint="Only lowercase letters, numbers, and hyphens."
          htmlFor="onboarding-booking-slug"
          error={error}
        >
          <div className="form-prefix-wrap">
            <span className="form-prefix">slotra.app/book/</span>
            <input
              id="onboarding-booking-slug"
              className="input form-prefix-input"
              value={slug}
              onChange={(event) => onSlugChange(event.target.value)}
              placeholder="your-business-slug"
            />
          </div>
        </FormField>

        <div className="onboarding-callout">
          <Badge variant="accent">Public booking page</Badge>
          <p className="onboarding-callout__text">
            Customers will use this link for future service selection and booking confirmation.
          </p>
        </div>
      </SectionCard>

      <SectionCard
        title="Preview"
        description="A lightweight preview helps owners sanity-check the public identity before continuing."
      >
        <div className="brand-preview-card card onboarding-preview-card">
          <div className="brand-preview__banner">
            <div className="brand-preview__banner-overlay" />
          </div>
          <div className="brand-preview__avatar-wrap">
            <div className="brand-preview__avatar">{initials || 'S'}</div>
          </div>
          <div className="brand-preview__body">
            <p className="brand-preview__biz-name">{businessName || 'Your business name'}</p>
            <p className="brand-preview__industry">{industry || 'Choose an industry'}</p>
            <p className="brand-preview__about">
              {about ? (about.length > 90 ? `${about.slice(0, 90)}...` : about) : 'Your business summary appears here.'}
            </p>
            <div className="brand-preview__url">slotra.app/book/{slug || 'your-business'}</div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
