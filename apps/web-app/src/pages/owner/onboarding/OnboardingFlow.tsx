import { useEffect, useState } from 'react';
import { Badge, Button, Card, PageHeader } from '@slotra/ui';
import { RouteStateCard } from '@/app/components/RouteStateCard';
import { OwnerPageScaffold } from '@/app/components/PageTemplates';
import type { ServiceRecord } from '@/domain/service/types';
import type { TeamMemberRecord } from '@/domain/staff/types';
import { trackWebEvent } from '@/features/analytics/trackWebEvent';
import { getDefaultOwnerOnboardingSeed } from '@/features/owner/data';
import { mockOnboardingRepository } from '@/features/owner/onboarding/mockOnboardingRepository';
import { sanitizeBookingSlug } from '../settings/brandDetailsShared';
import { createDefaultOnboardingDraft } from './mockData';
import {
  canAccessOnboardingStep,
  getFurthestOnboardingStepIndex,
  getOnboardingProgressPercent,
  ONBOARDING_STEPS,
} from './progression';
import { BusinessHoursStep } from './steps/BusinessHoursStep';
import { BusinessInfoStep } from './steps/BusinessInfoStep';
import { BookingSlugStep } from './steps/BookingSlugStep';
import { CompletionStep } from './steps/CompletionStep';
import { PaymentPreferencesStep } from './steps/PaymentPreferencesStep';
import { ServicesSetupStep } from './steps/ServicesSetupStep';
import { TeamSetupStep } from './steps/TeamSetupStep';
import type { OnboardingDraft, OnboardingStepId } from './types';
import { validateOnboardingStep } from './validation';

export function OnboardingFlow() {
  const resource = getDefaultOwnerOnboardingSeed();
  const [draft, setDraft] = useState<OnboardingDraft>(createDefaultOnboardingDraft);
  const [currentStepId, setCurrentStepId] = useState<OnboardingStepId>('business-info');
  const [completedStepIds, setCompletedStepIds] = useState<OnboardingStepId[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveMessage, setSaveMessage] = useState('Autosaved in this browser session');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const persisted = mockOnboardingRepository.loadSession();

    if (persisted) {
      setDraft(persisted.draft);
      setCurrentStepId(persisted.currentStepId);
      setCompletedStepIds(persisted.completedStepIds);
      setSaveMessage('Resumed from this browser session');
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    mockOnboardingRepository.saveSession({
      draft,
      currentStepId,
      completedStepIds,
    });
  }, [completedStepIds, currentStepId, draft, hydrated]);

  if (resource.status === 'loading') {
    return <RouteStateCard title="Loading onboarding" description="Preparing business, service, hours, and payment seed data." variant="loading" />;
  }

  if (resource.status === 'error') {
    return <RouteStateCard title="Onboarding unavailable" description={resource.message} variant="error" />;
  }

  const currentStepIndex = ONBOARDING_STEPS.findIndex((step) => step.id === currentStepId);
  const safeCurrentStepIndex = currentStepIndex >= 0 ? currentStepIndex : 0;
  const currentStep = ONBOARDING_STEPS[safeCurrentStepIndex]!;
  const progressPercent = getOnboardingProgressPercent(currentStepId);
  const furthestStepIndex = getFurthestOnboardingStepIndex(currentStepId, completedStepIds);

  function persistManually() {
    mockOnboardingRepository.saveSession({
      draft,
      currentStepId,
      completedStepIds,
    });
    setSaveMessage('Saved. You can continue later in this browser session');
  }

  function markStepComplete(stepId: OnboardingStepId) {
    setCompletedStepIds((current) => (current.includes(stepId) ? current : [...current, stepId]));
  }

  function goToStep(stepId: OnboardingStepId) {
    if (canAccessOnboardingStep(stepId, currentStepId, completedStepIds)) {
      setCurrentStepId(stepId);
    }
  }

  function handleNext() {
    const validation = validateOnboardingStep(currentStepId, draft);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    markStepComplete(currentStepId);

    const nextStep = ONBOARDING_STEPS[safeCurrentStepIndex + 1];

    if (nextStep) {
      setCurrentStepId(nextStep.id);
      setSaveMessage('Step saved in this browser session');
      trackWebEvent('owner_onboarding_step_completed', {
        stepId: currentStepId,
        nextStepId: nextStep.id,
      });
    }
  }

  function handleBack() {
    const previousStep = ONBOARDING_STEPS[safeCurrentStepIndex - 1];

    if (previousStep) {
      setCurrentStepId(previousStep.id);
      setErrors({});
    }
  }

  function updateBusinessInfo<K extends keyof OnboardingDraft['businessInfo']>(
    field: K,
    value: OnboardingDraft['businessInfo'][K]
  ) {
    setDraft((current) => {
      const nextBusinessInfo = {
        ...current.businessInfo,
        [field]: value,
      };

      const shouldRefreshSlug = field === 'name' && current.bookingSlug === sanitizeBookingSlug(current.businessInfo.name);

      return {
        ...current,
        businessInfo: nextBusinessInfo,
        bookingSlug: shouldRefreshSlug ? sanitizeBookingSlug(String(value)) : current.bookingSlug,
      };
    });
    setSaveMessage('Autosaved in this browser session');
  }

  function updateService<K extends keyof ServiceRecord>(serviceId: string, field: K, value: ServiceRecord[K]) {
    setDraft((current) => ({
      ...current,
      services: current.services.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              [field]: value,
            }
          : service
      ),
    }));
    setSaveMessage('Autosaved in this browser session');
  }

  function addService() {
    setDraft((current) => ({
      ...current,
      services: [
        ...current.services,
        {
          id: `svc-${current.services.length + 1}`,
          name: '',
          category: '',
          durationMinutes: 30,
          price: 0,
          visibility: 'Public',
          status: 'Active',
          bookings: 0,
          description: '',
          staffSelectionMode: 'required',
          staffIds: [],
          leadNote: '',
        },
      ],
    }));
    setSaveMessage('Autosaved in this browser session');
  }

  function removeService(serviceId: string) {
    setDraft((current) => ({
      ...current,
      services: current.services.filter((service) => service.id !== serviceId),
    }));
    setSaveMessage('Autosaved in this browser session');
  }

  function updateTeamMember<K extends keyof TeamMemberRecord>(memberId: string, field: K, value: TeamMemberRecord[K]) {
    setDraft((current) => ({
      ...current,
      team: current.team.map((member) =>
        member.id === memberId
          ? {
              ...member,
              [field]: value,
            }
          : member
      ),
    }));
    setSaveMessage('Autosaved in this browser session');
  }

  function addTeamMember() {
    setDraft((current) => ({
      ...current,
      team: [
        ...current.team,
        {
          id: `tm-${current.team.length + 1}`,
          name: '',
          role: '',
          bio: '',
          badge: '',
          services: [],
          schedule: '',
          status: 'Invite pending',
        },
      ],
    }));
    setSaveMessage('Autosaved in this browser session');
  }

  function removeTeamMember(memberId: string) {
    setDraft((current) => ({
      ...current,
      team: current.team.filter((member) => member.id !== memberId),
    }));
    setSaveMessage('Autosaved in this browser session');
  }

  function updateBusinessHours(hourId: string, nextValue: Partial<OnboardingDraft['businessHours'][number]>) {
    setDraft((current) => ({
      ...current,
      businessHours: current.businessHours.map((slot) =>
        slot.id === hourId
          ? {
              ...slot,
              ...nextValue,
            }
          : slot
      ),
    }));
    setSaveMessage('Autosaved in this browser session');
  }

  function updatePaymentField<K extends keyof OnboardingDraft['paymentPreferences']>(
    field: K,
    value: OnboardingDraft['paymentPreferences'][K]
  ) {
    setDraft((current) => ({
      ...current,
      paymentPreferences: {
        ...current.paymentPreferences,
        [field]: value,
      },
    }));
    setSaveMessage('Autosaved in this browser session');
  }

  function renderCurrentStep() {
    switch (currentStepId) {
      case 'business-info':
        return (
          <BusinessInfoStep
            value={draft.businessInfo}
            errors={errors}
            onFieldChange={updateBusinessInfo}
          />
        );
      case 'booking-slug':
        return (
          <BookingSlugStep
            businessName={draft.businessInfo.name}
            industry={draft.businessInfo.industry}
            about={draft.businessInfo.about}
            slug={draft.bookingSlug}
            error={errors.bookingSlug}
            onSlugChange={(nextSlug) => {
              setDraft((current) => ({
                ...current,
                bookingSlug: sanitizeBookingSlug(nextSlug),
              }));
              setSaveMessage('Autosaved in this browser session');
            }}
          />
        );
      case 'services':
        return (
          <ServicesSetupStep
            services={draft.services}
            errors={errors}
            onAddService={addService}
            onRemoveService={removeService}
            onServiceChange={updateService}
          />
        );
      case 'team':
        return (
          <TeamSetupStep
            team={draft.team}
            serviceOptions={draft.services.map((service) => service.name).filter(Boolean)}
            errors={errors}
            onAddMember={addTeamMember}
            onRemoveMember={removeTeamMember}
            onMemberChange={updateTeamMember}
          />
        );
      case 'hours':
        return (
          <BusinessHoursStep
            businessHours={draft.businessHours}
            errors={errors}
            onHoursChange={updateBusinessHours}
          />
        );
      case 'payments':
        return (
          <PaymentPreferencesStep
            value={draft.paymentPreferences}
            errors={errors}
            onFieldChange={updatePaymentField}
          />
        );
      case 'completion':
        return <CompletionStep draft={draft} />;
      default:
        return null;
    }
  }

  return (
    <OwnerPageScaffold>
      <PageHeader
        title="Owner onboarding"
        subtitle="Complete the initial business setup before accepting bookings."
        actions={(
          <>
            <Badge variant="info">{progressPercent}% complete</Badge>
            <Button type="button" variant="outline" onClick={persistManually}>
              Save & continue later
            </Button>
          </>
        )}
      />

      <div className="onboarding-layout">
        <aside className="onboarding-sidebar">
          <Card className="onboarding-progress-card">
            <div className="onboarding-progress-card__top">
              <p className="onboarding-progress-card__eyebrow">Setup progress</p>
              <p className="onboarding-progress-card__value">{safeCurrentStepIndex + 1} / {ONBOARDING_STEPS.length}</p>
            </div>
            <div className="onboarding-progress-bar" aria-hidden="true">
              <span style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="onboarding-progress-card__hint">{saveMessage}</p>

            <div className="onboarding-step-list">
              {ONBOARDING_STEPS.map((step, index) => {
                const isCurrent = step.id === currentStepId;
                const isComplete = completedStepIds.includes(step.id);
                const isClickable = index <= furthestStepIndex + 1;

                return (
                  <button
                    key={step.id}
                    type="button"
                    className={[
                      'onboarding-step-link',
                      isCurrent ? 'onboarding-step-link--current' : '',
                      isComplete ? 'onboarding-step-link--complete' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => goToStep(step.id)}
                    disabled={!isClickable}
                  >
                    <span className="onboarding-step-link__index">{index + 1}</span>
                    <span className="onboarding-step-link__body">
                      <span className="onboarding-step-link__title">{step.title}</span>
                      <span className="onboarding-step-link__description">{step.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>
        </aside>

        <div className="onboarding-main">
          <Card className="onboarding-stage-card">
            <div className="onboarding-stage-card__header">
              <div>
                <p className="onboarding-stage-card__eyebrow">{currentStep.title}</p>
                <h2 className="onboarding-stage-card__title">{currentStep.description}</h2>
              </div>
              {currentStepId !== 'completion' && <Badge variant="default">Step-by-step setup</Badge>}
            </div>

            {renderCurrentStep()}

            <div className="onboarding-stage-card__footer">
              <Button type="button" variant="ghost" onClick={handleBack} disabled={safeCurrentStepIndex === 0}>
                Back
              </Button>
              {currentStepId !== 'completion' ? (
                <Button type="button" onClick={handleNext}>
                  {safeCurrentStepIndex === ONBOARDING_STEPS.length - 2 ? 'Finish onboarding' : 'Next step'}
                </Button>
              ) : (
                <Button type="button" variant="outline" onClick={() => goToStep('business-info')}>
                  Revisit setup
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </OwnerPageScaffold>
  );
}
