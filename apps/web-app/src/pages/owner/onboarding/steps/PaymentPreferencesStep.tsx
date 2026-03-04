import { FormField, SectionCard, Textarea } from '@slotra/ui';
import { PAYMENT_METHOD_OPTIONS } from '../mockData';
import type { PaymentPreferencesDraft } from '../types';

interface PaymentPreferencesStepProps {
  value: PaymentPreferencesDraft;
  errors: Record<string, string>;
  onFieldChange: <K extends keyof PaymentPreferencesDraft>(field: K, nextValue: PaymentPreferencesDraft[K]) => void;
}

export function PaymentPreferencesStep({ value, errors, onFieldChange }: PaymentPreferencesStepProps) {
  return (
    <div className="owner-settings-stack">
      <SectionCard
        title="Payment and deposit preferences"
        description="This phase only stores the policy and staff guidance. Live checkout and payouts still require backend work."
      >
        <div className="onboarding-choice-grid">
          <FormField label="Collection mode">
            <div className="onboarding-radio-list">
              {[
                { value: 'manual-transfer', label: 'Manual transfer first', description: 'Collect GCash, Maya, or bank transfer before confirmation.' },
                { value: 'pay-on-site', label: 'Pay on site', description: 'Let customers pay during the appointment.' },
                { value: 'hybrid', label: 'Hybrid', description: 'Use deposits for some services, then collect the balance on site.' },
              ].map((option) => (
                <label key={option.value} className="onboarding-choice-card">
                  <input
                    type="radio"
                    name="collectionMethod"
                    checked={value.collectionMethod === option.value}
                    onChange={() => onFieldChange('collectionMethod', option.value as PaymentPreferencesDraft['collectionMethod'])}
                  />
                  <div>
                    <p className="onboarding-choice-card__title">{option.label}</p>
                    <p className="onboarding-choice-card__description">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </FormField>

          <FormField label="Deposit policy" error={errors.depositValue}>
            <div className="onboarding-radio-list">
              {[
                { value: 'none', label: 'No deposit', description: 'Useful for low-friction walk-ins and simple services.' },
                { value: 'flat', label: 'Flat amount', description: 'Collect a fixed peso amount before confirmation.' },
                { value: 'percentage', label: 'Percentage', description: 'Collect a percentage for higher-value bookings.' },
              ].map((option) => (
                <label key={option.value} className="onboarding-choice-card">
                  <input
                    type="radio"
                    name="depositType"
                    checked={value.depositType === option.value}
                    onChange={() => onFieldChange('depositType', option.value as PaymentPreferencesDraft['depositType'])}
                  />
                  <div>
                    <p className="onboarding-choice-card__title">{option.label}</p>
                    <p className="onboarding-choice-card__description">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </FormField>
        </div>

        {value.depositType !== 'none' && (
          <div className="owner-form-grid">
            <FormField
              label={value.depositType === 'percentage' ? 'Deposit percentage' : 'Deposit amount'}
              htmlFor="onboarding-deposit-value"
              error={errors.depositValue}
            >
              <input
                id="onboarding-deposit-value"
                className="input"
                type="number"
                min="0"
                step={value.depositType === 'percentage' ? '5' : '50'}
                value={value.depositValue}
                onChange={(event) => onFieldChange('depositValue', event.target.value)}
              />
            </FormField>

            <FormField label="When to require it">
              <select
                className="input"
                value={value.requireDepositFor}
                onChange={(event) => onFieldChange('requireDepositFor', event.target.value as PaymentPreferencesDraft['requireDepositFor'])}
              >
                <option value="all-bookings">All bookings</option>
                <option value="high-value-only">High-value only</option>
                <option value="manual-review">Manual review</option>
              </select>
            </FormField>
          </div>
        )}

        <FormField label="Accepted methods" error={errors.acceptedMethods}>
          <div className="onboarding-checkbox-grid">
            {PAYMENT_METHOD_OPTIONS.map((method) => (
              <label key={method} className="onboarding-check-pill">
                <input
                  type="checkbox"
                  checked={value.acceptedMethods.includes(method)}
                  onChange={(event) =>
                    onFieldChange(
                      'acceptedMethods',
                      event.target.checked
                        ? [...value.acceptedMethods, method]
                        : value.acceptedMethods.filter((item) => item !== method)
                    )
                  }
                />
                <span>{method}</span>
              </label>
            ))}
          </div>
        </FormField>

        <Textarea
          id="onboarding-payment-instructions"
          label="Internal instructions"
          rows={4}
          value={value.instructions}
          error={errors.instructions}
          onChange={(event) => onFieldChange('instructions', event.target.value)}
          placeholder="Explain how staff should verify payment, when to follow up, and how to mark manual confirmations."
        />
      </SectionCard>
    </div>
  );
}
