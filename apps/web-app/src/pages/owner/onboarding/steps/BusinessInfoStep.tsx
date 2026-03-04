import { FormField, SectionCard, Select, Textarea } from '@slotra/ui';
import { TIMEZONE_OPTIONS } from '@/mocks/payments';
import { BRAND_INDUSTRIES, MAX_BRAND_ABOUT_LENGTH } from '../../settings/brandDetailsShared';
import type { BusinessInfoDraft } from '../types';

interface BusinessInfoStepProps {
  value: BusinessInfoDraft;
  errors: Record<string, string>;
  onFieldChange: <K extends keyof BusinessInfoDraft>(field: K, nextValue: BusinessInfoDraft[K]) => void;
}

export function BusinessInfoStep({ value, errors, onFieldChange }: BusinessInfoStepProps) {
  return (
    <div className="owner-settings-stack">
      <SectionCard
        title="Business profile"
        description="These details shape the booking page and the business profile customers will see first."
      >
        <div className="owner-form-grid">
          <FormField label="Business name" htmlFor="onboarding-business-name" error={errors.name}>
            <input
              id="onboarding-business-name"
              className="input"
              value={value.name}
              onChange={(event) => onFieldChange('name', event.target.value)}
              placeholder="e.g. Dheyn's Barbershop"
            />
          </FormField>

          <Select
            id="onboarding-industry"
            label="Industry"
            value={value.industry}
            error={errors.industry}
            onChange={(event) => onFieldChange('industry', event.target.value)}
          >
            {BRAND_INDUSTRIES.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </Select>

          <FormField label="Phone" htmlFor="onboarding-phone" error={errors.phone}>
            <input
              id="onboarding-phone"
              className="input"
              value={value.phone}
              onChange={(event) => onFieldChange('phone', event.target.value)}
              placeholder="+63 917 555 1200"
            />
          </FormField>

          <FormField label="Business email" htmlFor="onboarding-email" error={errors.email}>
            <input
              id="onboarding-email"
              className="input"
              type="email"
              value={value.email}
              onChange={(event) => onFieldChange('email', event.target.value)}
              placeholder="hello@yourbusiness.com"
            />
          </FormField>

          <FormField label="Address" htmlFor="onboarding-address" error={errors.address}>
            <input
              id="onboarding-address"
              className="input"
              value={value.address}
              onChange={(event) => onFieldChange('address', event.target.value)}
              placeholder="City, district, or full address"
            />
          </FormField>

          <Select
            id="onboarding-timezone"
            label="Timezone"
            value={value.timezone}
            error={errors.timezone}
            onChange={(event) => onFieldChange('timezone', event.target.value)}
          >
            {TIMEZONE_OPTIONS.map((timezone) => (
              <option key={timezone} value={timezone}>
                {timezone}
              </option>
            ))}
          </Select>
        </div>

        <Textarea
          id="onboarding-about"
          label="About the business"
          rows={4}
          value={value.about}
          error={errors.about}
          maxLength={MAX_BRAND_ABOUT_LENGTH}
          onChange={(event) => onFieldChange('about', event.target.value)}
          placeholder="Tell customers what makes the business special, what you do best, and where you are located."
          footer={(
            <span className={`form-char-count ${value.about.length >= MAX_BRAND_ABOUT_LENGTH ? 'form-char-count--limit' : ''}`}>
              {value.about.length}/{MAX_BRAND_ABOUT_LENGTH}
            </span>
          )}
        />
      </SectionCard>
    </div>
  );
}
