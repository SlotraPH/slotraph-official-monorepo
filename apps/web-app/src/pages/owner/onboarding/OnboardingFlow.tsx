import { useEffect, useState } from 'react';
import { Badge, Button, PageHeader } from '@slotra/ui';
import { RouteStateCard } from '@/app/components/RouteStateCard';
import { OwnerPageScaffold } from '@/app/components/PageTemplates';
import type { ServiceRecord } from '@/domain/service/types';
import type { TeamMemberRecord } from '@/domain/staff/types';
import { trackWebEvent } from '@/features/analytics/trackWebEvent';
import { useUnsavedChangesGuard } from '@/features/forms/useUnsavedChangesGuard';
import { mockOwnerRouteClient } from '@/features/owner/routeClient';
import { ownerOnboardingPersistenceClient } from '@/features/owner/onboarding/persistenceClient';
import type { PersistedOnboardingState } from '@/features/owner/onboarding/contracts';
import { BrandButton, Card, SaveStateIndicator, colors, typography, type SaveStateStatus } from '@/ui';
import { mockOnboardingRepository } from '@/features/owner/onboarding/mockOnboardingRepository';
import { sanitizeBookingSlug } from '../settings/brandDetailsShared';
import { createDefaultOnboardingDraft } from './mockData';
import {
  canAccessOnboardingStep,
  getFurthestOnboardingStepIndex,
  ONBOARDING_STEPS,
} from './progression';
import { SetupChecklistCard } from './components/SetupChecklistCard';
import { SetupProgressMeta, SetupProgressRing } from './components/SetupProgressRing';
import { SetupReadinessPanel } from './components/SetupReadinessPanel';
import type { SetupChecklistItem, SetupChecklistStatus } from './components/setupTypes';
import { BusinessHoursStep } from './steps/BusinessHoursStep';
import { BusinessInfoStep } from './steps/BusinessInfoStep';
import { BookingSlugStep } from './steps/BookingSlugStep';
import { CompletionStep } from './steps/CompletionStep';
import { PaymentPreferencesStep } from './steps/PaymentPreferencesStep';
import { ServicesSetupStep } from './steps/ServicesSetupStep';
import { TeamSetupStep } from './steps/TeamSetupStep';
import type { OnboardingDraft, OnboardingStepId } from './types';
import { validateOnboardingStep } from './validation';

function resolveSetupStatus(completedCount: number, totalCount: number): SetupChecklistStatus {
  if (completedCount <= 0) {
    return 'not-started';
  }

  if (completedCount >= totalCount) {
    return 'done';
  }

  return 'in-progress';
}

function isFilled(value: string) {
  return value.trim().length > 0;
}

export function OnboardingFlow() {
  const resource = mockOwnerRouteClient.getOnboardingQuery();
  const [draft, setDraft] = useState<OnboardingDraft>(createDefaultOnboardingDraft);
  const [currentStepId, setCurrentStepId] = useState<OnboardingStepId>('business-info');
  const [completedStepIds, setCompletedStepIds] = useState<OnboardingStepId[]>([]);
  const [showStepEditor, setShowStepEditor] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveMessage, setSaveMessage] = useState('Draft changes are saved to this browser session');
  const [hydrated, setHydrated] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [sessionMessage, setSessionMessage] = useState('Loading your onboarding draft...');
  const [saveState, setSaveState] = useState<SaveStateStatus>('saved');
  const [lastSavedLabel, setLastSavedLabel] = useState('Waiting for first save');
  const [pendingSavePayload, setPendingSavePayload] = useState<PersistedOnboardingState | null>(null);
  const [pendingSavePartial, setPendingSavePartial] = useState(true);

  useUnsavedChangesGuard(saveState === 'idle' || saveState === 'failed');

  useEffect(() => {
    let canceled = false;

    async function loadPersistedDraft() {
      setSessionStatus('loading');
      setSessionMessage('Loading your onboarding draft...');

      try {
        const persisted = await ownerOnboardingPersistenceClient.load();

        if (canceled) {
          return;
        }

        if (persisted) {
          setDraft(persisted.draft);
          setCurrentStepId(persisted.currentStepId);
          setCompletedStepIds(persisted.completedStepIds);
          setSaveMessage('Resumed your saved onboarding draft');
          setLastSavedLabel('Draft restored');
        }

        setSessionStatus('ready');
        setHydrated(true);
      } catch {
        if (canceled) {
          return;
        }

        setSessionStatus('error');
        setSessionMessage('Could not load your onboarding draft. Retry to restore saved progress.');
        setHydrated(true);
      }
    }

    void loadPersistedDraft();

    return () => {
      canceled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void persistState({
        draft,
        currentStepId,
        completedStepIds,
      }, true);
    }, 450);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [completedStepIds, currentStepId, draft, hydrated]);

  if (resource.status === 'loading') {
    return <RouteStateCard title="Loading onboarding" description="Preparing business, service, hours, and payment seed data." variant="loading" />;
  }

  if (resource.status === 'error') {
    return <RouteStateCard title="Onboarding unavailable" description={resource.message} variant="error" onRetry={() => window.location.reload()} />;
  }

  const currentStepIndex = ONBOARDING_STEPS.findIndex((step) => step.id === currentStepId);
  const safeCurrentStepIndex = currentStepIndex >= 0 ? currentStepIndex : 0;
  const currentStep = ONBOARDING_STEPS[safeCurrentStepIndex]!;
  const furthestStepIndex = getFurthestOnboardingStepIndex(currentStepId, completedStepIds);
  const businessFields = [
    draft.businessInfo.name,
    draft.businessInfo.industry,
    draft.businessInfo.phone,
    draft.businessInfo.email,
    draft.businessInfo.address,
    draft.businessInfo.about,
  ];
  const brandingCompletedFields = businessFields.filter((value) => isFilled(value)).length;
  const brandingStatus = resolveSetupStatus(brandingCompletedFields, businessFields.length);
  const configuredServices = draft.services.filter((service) => isFilled(service.name) && service.durationMinutes > 0).length;
  const servicesStatus = draft.services.length === 0
    ? 'not-started'
    : resolveSetupStatus(configuredServices, draft.services.length);
  const enabledHours = draft.businessHours.filter((slot) => slot.isOpen);
  const enabledHoursConfigured = enabledHours.filter((slot) => isFilled(slot.openTime) && isFilled(slot.closeTime)).length;
  const availabilityStatus = enabledHours.length === 0
    ? 'not-started'
    : resolveSetupStatus(enabledHoursConfigured, enabledHours.length);
  const sanitizedSlug = sanitizeBookingSlug(draft.bookingSlug);
  const domainStatus: SetupChecklistStatus = !isFilled(draft.bookingSlug)
    ? 'not-started'
    : sanitizedSlug === draft.bookingSlug && draft.bookingSlug.length >= 3
      ? 'done'
      : 'in-progress';
  const checklistWithoutPublish: SetupChecklistItem[] = [
    {
      id: 'branding',
      title: 'Branding',
      description: 'Business profile, contact details, and industry details.',
      status: brandingStatus,
      blocker: brandingStatus === 'done' ? 'Ready for customers.' : 'Business details still missing.',
      progressLabel: `${brandingCompletedFields}/${businessFields.length} profile fields complete`,
      targetStepId: 'business-info',
    },
    {
      id: 'services',
      title: 'Services',
      description: 'Add services, duration, and visibility before publishing.',
      status: servicesStatus,
      blocker: servicesStatus === 'done' ? 'At least one offer is ready.' : 'Add and configure service offerings.',
      progressLabel: draft.services.length === 0
        ? 'No services configured yet'
        : `${configuredServices}/${draft.services.length} services configured`,
      targetStepId: 'services',
    },
    {
      id: 'availability',
      title: 'Availability',
      description: 'Set opening days and staff-ready booking windows.',
      status: availabilityStatus,
      blocker: availabilityStatus === 'done' ? 'Open hours are configured.' : 'Operating hours need setup.',
      progressLabel: enabledHours.length === 0
        ? 'No open schedule set'
        : `${enabledHoursConfigured}/${enabledHours.length} open days configured`,
      targetStepId: 'hours',
    },
    {
      id: 'domain',
      title: 'Domain',
      description: 'Reserve your public booking slug and verify URL identity.',
      status: domainStatus,
      blocker: domainStatus === 'done' ? 'Booking URL is publish-ready.' : 'Finalize booking slug format.',
      progressLabel: domainStatus === 'done' ? `slotra.ph/book/${draft.bookingSlug}` : 'Booking slug not finalized',
      targetStepId: 'booking-slug',
    },
  ];
  const publishPrerequisitesDone = checklistWithoutPublish.every((item) => item.status === 'done');
  const publishDone = completedStepIds.includes('completion') || currentStepId === 'completion';
  const publishStatus: SetupChecklistStatus = publishPrerequisitesDone
    ? (publishDone ? 'done' : 'in-progress')
    : 'not-started';
  const checklistItems: SetupChecklistItem[] = [
    ...checklistWithoutPublish,
    {
      id: 'publish',
      title: 'Publish',
      description: 'Review all setup sections, then publish your booking workspace.',
      status: publishStatus,
      blocker: publishStatus === 'done' ? 'Workspace is publish-ready.' : 'Complete setup review and publish.',
      progressLabel: publishDone ? 'Completion review finished' : 'Awaiting final review',
      targetStepId: 'completion',
    },
  ];
  const completedChecklistCount = checklistItems.filter((item) => item.status === 'done').length;
  const progressPercent = Math.round((completedChecklistCount / checklistItems.length) * 100);
  const setupState = sessionStatus === 'loading' || !hydrated
    ? 'loading'
    : completedChecklistCount === 0
      ? 'empty'
      : completedChecklistCount === checklistItems.length
        ? 'success'
        : 'ready';
  const unresolvedItems = checklistItems.filter((item) => item.status !== 'done');
  const blockerMessages = unresolvedItems.map((item) => item.blocker);

  async function persistState(nextState: PersistedOnboardingState, partial: boolean) {
    setSaveState('saving');
    setPendingSavePayload(nextState);
    setPendingSavePartial(partial);

    try {
      const result = await ownerOnboardingPersistenceClient.save(nextState, { partial });
      const savedTimeLabel = new Date(result.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setPendingSavePayload(null);
      setSaveState('saved');
      setLastSavedLabel(result.partial ? `Partial draft saved at ${savedTimeLabel}` : `Saved at ${savedTimeLabel}`);
      setSaveMessage(result.partial ? 'Partial progress saved so you can continue later' : 'Saved. You can continue later from this browser');
    } catch {
      setSaveState('failed');
      setSaveMessage('Save failed. Retry to keep your latest onboarding progress.');
    }
  }

  function persistManually() {
    void persistState({
      draft,
      currentStepId,
      completedStepIds,
    }, false);
  }

  function retrySave() {
    if (!pendingSavePayload) {
      return;
    }

    void persistState(pendingSavePayload, pendingSavePartial);
  }

  function retrySessionLoad() {
    setSessionStatus('loading');
    setSessionMessage('Retrying onboarding draft load...');
    setHydrated(false);
    setTimeout(() => {
      window.location.reload();
    }, 10);
  }

  function markDraftDirty(message = 'Unsaved changes in this step') {
    setSaveState('idle');
    setSaveMessage(message);
  }

  function markStepComplete(stepId: OnboardingStepId) {
    setCompletedStepIds((current) => (current.includes(stepId) ? current : [...current, stepId]));
  }

  function goToStep(stepId: OnboardingStepId) {
    if (canAccessOnboardingStep(stepId, currentStepId, completedStepIds)) {
      setCurrentStepId(stepId);
    }
  }

  function openStepEditor(stepId: OnboardingStepId) {
    const firstAvailable = ONBOARDING_STEPS.slice(0, furthestStepIndex + 2).at(-1)?.id ?? 'business-info';
    const targetStepId = canAccessOnboardingStep(stepId, currentStepId, completedStepIds) ? stepId : firstAvailable;
    setCurrentStepId(targetStepId);
    setShowStepEditor(true);
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
      setSaveState('saved');
      setSaveMessage('Step complete. Continue to the next setup task.');
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

  function handleLaunchpadContinue() {
    const nextChecklist = checklistItems.find((item) => item.status !== 'done');
    openStepEditor(nextChecklist?.targetStepId ?? 'completion');
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
    markDraftDirty('Unsaved business profile updates');
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
    markDraftDirty('Unsaved service edits');
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
    markDraftDirty('Unsaved service updates');
  }

  function removeService(serviceId: string) {
    setDraft((current) => ({
      ...current,
      services: current.services.filter((service) => service.id !== serviceId),
    }));
    markDraftDirty('Unsaved service updates');
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
    markDraftDirty('Unsaved team updates');
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
    markDraftDirty('Unsaved team updates');
  }

  function removeTeamMember(memberId: string) {
    setDraft((current) => ({
      ...current,
      team: current.team.filter((member) => member.id !== memberId),
    }));
    markDraftDirty('Unsaved team updates');
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
    markDraftDirty('Unsaved availability updates');
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
    markDraftDirty('Unsaved payment preference changes');
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
              markDraftDirty('Unsaved booking slug updates');
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
        title="Setup launchpad"
        subtitle="Complete branding, services, availability, and domain configuration before accepting bookings."
        actions={(
          <>
            <Badge variant="info">{progressPercent}% complete</Badge>
            <SaveStateIndicator
              status={saveState}
              savedLabel={lastSavedLabel}
              idleLabel="Unsaved onboarding changes"
              onRetry={retrySave}
            />
            <Button type="button" variant="outline" onClick={persistManually} disabled={saveState === 'saving'}>
              Save & continue later
            </Button>
          </>
        )}
      />

      <div className="setup-launchpad-layout">
        <section className="setup-launchpad-main">
          <Card className="setup-launchpad-hero">
            <div className="setup-launchpad-hero__copy">
              <p className="setup-launchpad-hero__eyebrow">Workspace setup</p>
              <h2 className="setup-launchpad-hero__title">Launchpad readiness overview</h2>
              <SetupProgressMeta completed={completedChecklistCount} total={checklistItems.length} />
              <p style={{ color: colors.muted, fontFamily: typography.fontFamily, margin: 0 }}>
                {saveMessage}
              </p>
              <div className="setup-launchpad-hero__actions">
                <BrandButton onClick={handleLaunchpadContinue}>Continue setup</BrandButton>
                <BrandButton variant="secondary" onClick={() => setShowStepEditor((current) => !current)}>
                  {showStepEditor ? 'Hide step editor' : 'Open step editor'}
                </BrandButton>
              </div>
            </div>
            <SetupProgressRing percentage={progressPercent} />
          </Card>

          {sessionStatus === 'error' ? (
            <Card className="setup-state-card setup-state-card--empty">
              <p className="setup-state-card__title">Onboarding draft unavailable</p>
              <p className="setup-state-card__description">{sessionMessage}</p>
              <div className="settings-button-row">
                <BrandButton variant="secondary" onClick={retrySessionLoad}>Retry loading draft</BrandButton>
              </div>
            </Card>
          ) : null}

          {setupState === 'loading' ? (
            <Card className="setup-state-card setup-state-card--loading">
              <p className="setup-state-card__title">Loading setup progress...</p>
              <p className="setup-state-card__description">{sessionMessage}</p>
            </Card>
          ) : null}

          {setupState === 'empty' ? (
            <Card className="setup-state-card setup-state-card--empty">
              <p className="setup-state-card__title">No setup progress yet</p>
              <p className="setup-state-card__description">Start with branding and services to unlock your booking workspace.</p>
            </Card>
          ) : null}

          {setupState === 'success' ? (
            <Card className="setup-state-card setup-state-card--success">
              <p className="setup-state-card__title">Setup complete</p>
              <p className="setup-state-card__description">All launch checks are done. Review completion and publish when ready.</p>
            </Card>
          ) : null}

          <div className="setup-checklist-grid">
            {checklistItems.map((item) => (
              <SetupChecklistCard
                key={item.id}
                item={item}
                onOpen={(selected) => openStepEditor(selected.targetStepId)}
              />
            ))}
          </div>
        </section>

        <aside className="setup-launchpad-rail">
          <SetupReadinessPanel
            blockers={blockerMessages}
            completed={completedChecklistCount}
            onNextAction={handleLaunchpadContinue}
          />
        </aside>
      </div>

      {showStepEditor ? (
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
              <div className="onboarding-stage-card__footer-actions">
                <Button type="button" variant="ghost" onClick={handleBack} disabled={safeCurrentStepIndex === 0}>
                  Back
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowStepEditor(false)}>
                  Back to launchpad
                </Button>
              </div>
              <div className="onboarding-stage-card__footer-actions">
                {currentStepId !== 'completion' ? (
                  <Button type="button" onClick={handleNext}>
                    {safeCurrentStepIndex === ONBOARDING_STEPS.length - 2 ? 'Finish onboarding' : 'Next step'}
                  </Button>
                ) : (
                  <Button type="button" variant="outline" onClick={() => goToStep('business-info')}>
                    Revisit setup
                  </Button>
                )}
                <Button type="button" variant="outline" onClick={persistManually} disabled={saveState === 'saving'}>
                  Save now
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ) : null}
    </OwnerPageScaffold>
  );
}
