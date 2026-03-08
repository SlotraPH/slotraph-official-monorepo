import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Mail,
  MapPin,
  NotebookText,
  Phone,
  UserRound,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { RouteStateCard } from '@/app/components/RouteStateCard';
import type {
  BookingConfirmationRecord,
  BookingCustomerDetails,
  BookingDateOption,
  BookingDraft,
  BookingSlot,
} from '@/domain/booking/types';
import { formatCurrency, formatDuration } from '@/domain/service/formatters';
import { trackWebEvent } from '@/features/analytics/trackWebEvent';
import { publicBookingIntegrationClient } from '@/features/public-booking/integrationClient';
import { mockPublicBookingRouteClient } from '@/features/public-booking/routeClient';
import { FlowActions, FlowLayout, FlowSection, FlowStepper, ReviewBlock } from '@/modules/shared/flow/FlowScaffolds';
import { formatSelectedDate } from '@/pages/public/booking/availability';
import {
  getBookingStepValidationError,
  getBookingSteps,
  isBookingStepAccessible,
  isBookingStepComplete,
} from '@/pages/public/booking/flowState';
import type { BookingStepId } from '@/pages/public/booking/types';
import { BrandButton, BrandInput, BrandTextarea, Card, colors, radii, spacing, typography } from '@/ui';
import { validateBookingCustomerField, validateBookingCustomerForm } from './validation';

const STAGE_COPY: Record<BookingStepId, { eyebrow: string; title: string; description: string }> = {
  service: {
    eyebrow: 'Booking intake',
    title: 'Choose a service first',
    description: 'Service selection drives which specialists and time windows are available in the preview.',
  },
  staff: {
    eyebrow: 'Specialist match',
    title: 'Assign the right staff member',
    description: 'Only services that require a named specialist show this step.',
  },
  date: {
    eyebrow: 'Availability',
    title: 'Pick an open day',
    description: 'Sold-out and closed dates stay visible so the customer sees real constraints.',
  },
  time: {
    eyebrow: 'Time slot',
    title: 'Choose an appointment time',
    description: 'Available slots stay grouped in one responsive grid for keyboard and pointer users.',
  },
  details: {
    eyebrow: 'Customer details',
    title: 'Capture contact details cleanly',
    description: 'Validation happens on blur and clears immediately once the entry becomes valid again.',
  },
  review: {
    eyebrow: 'Final review',
    title: 'Confirm the booking request',
    description: 'Double-check the service, availability, and follow-up information before submitting.',
  },
};

interface IntegrationListState<T> {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: T[];
  message?: string;
}

function createReference() {
  return `SLT-${Math.floor(Date.now() % 1000000).toString().padStart(6, '0')}`;
}

function selectCardStyle(selected: boolean, disabled?: boolean) {
  return {
    background: selected ? 'rgba(46,49,146,0.06)' : '#ffffff',
    border: `1px solid ${selected ? colors.brand : colors.border}`,
    borderRadius: radii.lg,
    color: colors.navy,
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'grid',
    gap: spacing[2],
    opacity: disabled ? 0.5 : 1,
    padding: spacing[4],
    textAlign: 'left' as const,
    width: '100%',
  };
}

function SelectionGrid({
  children,
  columns = 'repeat(auto-fit, minmax(220px, 1fr))',
}: {
  children: ReactNode;
  columns?: string;
}) {
  return <div style={{ display: 'grid', gap: spacing[3], gridTemplateColumns: columns }}>{children}</div>;
}

export function BookingFlowScreen() {
  const navigate = useNavigate();
  const resource = mockPublicBookingRouteClient.getBookingRouteQuery();

  const [draft, setDraft] = useState<BookingDraft>(() => mockPublicBookingRouteClient.createDraft(''));
  const [currentStep, setCurrentStep] = useState<BookingStepId>('service');
  const [customerErrors, setCustomerErrors] = useState<Record<string, string | undefined>>({});
  const [stepError, setStepError] = useState<string | null>(null);
  const [dateOptionsState, setDateOptionsState] = useState<IntegrationListState<BookingDateOption>>({ status: 'idle', data: [] });
  const [slotState, setSlotState] = useState<IntegrationListState<BookingSlot>>({ status: 'idle', data: [] });
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'failed'>('idle');
  const [pendingConfirmation, setPendingConfirmation] = useState<BookingConfirmationRecord | null>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

  const bookingData = resource.status === 'success' ? resource.data : null;
  const selectedService = bookingData && draft.serviceId ? bookingData.servicesById[draft.serviceId] ?? null : null;
  const selectedStaff = bookingData && draft.staffId ? bookingData.staffById[draft.staffId] ?? null : null;
  const staffRequired = selectedService?.staffSelectionMode === 'required';
  const availableStaff = selectedService && bookingData
    ? bookingData.staff.filter((member) => selectedService.staffIds.includes(member.id))
    : [];
  const slots = slotState.data;
  const selectedSlot = slots.find((slot) => slot.id === draft.slotId) ?? null;

  const steps = getBookingSteps(selectedService).map((step) => ({
    id: step,
    label: STAGE_COPY[step].title,
    description: STAGE_COPY[step].eyebrow,
  }));

  const stepIds = steps.map((step) => step.id as BookingStepId);
  const currentStepIndex = stepIds.indexOf(currentStep);
  const context = { draft, selectedService, selectedStaff, selectedSlot };
  const previousStep = currentStepIndex > 0 ? stepIds[currentStepIndex - 1] : null;

  useEffect(() => {
    if (!selectedService) {
      setDateOptionsState({ status: 'idle', data: [] });
      return;
    }

    if (staffRequired && !draft.staffId) {
      setDateOptionsState({ status: 'idle', data: [] });
      return;
    }

    const service = selectedService;
    let canceled = false;

    async function loadDateOptions() {
      setDateOptionsState({ status: 'loading', data: [] });

      try {
        const options = await publicBookingIntegrationClient.loadDateOptions(service, staffRequired ? draft.staffId : null);

        if (canceled) {
          return;
        }

        setDateOptionsState({ status: 'success', data: options });
      } catch {
        if (canceled) {
          return;
        }

        setDateOptionsState({
          status: 'error',
          data: [],
          message: 'Unable to load available dates. Retry to continue this booking.',
        });
      }
    }

    void loadDateOptions();

    return () => {
      canceled = true;
    };
  }, [draft.staffId, selectedService, staffRequired]);

  useEffect(() => {
    if (!selectedService || !draft.date) {
      setSlotState({ status: 'idle', data: [] });
      return;
    }

    if (staffRequired && !draft.staffId) {
      setSlotState({ status: 'idle', data: [] });
      return;
    }

    const service = selectedService;
    const bookingDate = draft.date;
    let canceled = false;

    async function loadSlots() {
      setSlotState({ status: 'loading', data: [] });

      try {
        const nextSlots = await publicBookingIntegrationClient.loadSlots(service, bookingDate, staffRequired ? draft.staffId : null);

        if (canceled) {
          return;
        }

        setSlotState({ status: 'success', data: nextSlots });
      } catch {
        if (canceled) {
          return;
        }

        setSlotState({
          status: 'error',
          data: [],
          message: 'Could not load time slots for this date. Retry before selecting a slot.',
        });
      }
    }

    void loadSlots();

    return () => {
      canceled = true;
    };
  }, [draft.date, draft.staffId, selectedService, staffRequired]);

  useEffect(() => {
    if (!bookingData?.business.id) {
      return;
    }

    setDraft((current) => (current.businessId ? current : mockPublicBookingRouteClient.createDraft(bookingData.business.id)));
  }, [bookingData?.business.id]);

  const summaryItems = useMemo(() => [
    { label: 'Service', value: selectedService ? `${selectedService.name} (${formatCurrency(selectedService.price)})` : 'Not selected yet' },
    { label: 'Staff', value: staffRequired ? selectedStaff?.name ?? 'Choose a staff member' : selectedService ? 'Next available' : 'Depends on service' },
    { label: 'Date', value: draft.date ? formatSelectedDate(draft.date) : 'Choose a date' },
    { label: 'Time', value: selectedSlot ? `${selectedSlot.startLabel} to ${selectedSlot.endLabel}` : 'Choose a slot' },
    { label: 'Customer', value: draft.customer.fullName || 'Add contact details' },
  ], [draft.customer.fullName, draft.date, selectedService, selectedSlot, selectedStaff?.name, staffRequired]);
  const assistiveStatusMessage = useMemo(() => {
    const stage = STAGE_COPY[currentStep].title;
    const dateStatus = dateOptionsState.status === 'loading'
      ? 'Date availability is loading.'
      : dateOptionsState.status === 'error'
        ? (dateOptionsState.message ?? 'Date availability failed to load.')
        : dateOptionsState.status === 'success'
          ? `${dateOptionsState.data.length} date options loaded.`
          : '';
    const slotStatus = slotState.status === 'loading'
      ? 'Time slots are loading.'
      : slotState.status === 'error'
        ? (slotState.message ?? 'Time slots failed to load.')
        : slotState.status === 'success'
          ? `${slotState.data.length} slot options loaded.`
          : '';
    const submitStatus = submitState === 'submitting'
      ? 'Submitting booking confirmation.'
      : submitState === 'failed'
        ? 'Booking confirmation failed. Retry is available.'
        : '';

    return [stage, dateStatus, slotStatus, submitStatus].filter(Boolean).join(' ');
  }, [currentStep, dateOptionsState.data.length, dateOptionsState.message, dateOptionsState.status, slotState.data.length, slotState.message, slotState.status, submitState]);

  useEffect(() => {
    stepHeadingRef.current?.focus();
  }, [currentStep]);

  if (resource.status === 'loading') {
    return <RouteStateCard title="Loading booking flow" description="Preparing service, staff, and availability contracts." variant="loading" />;
  }

  if (resource.status === 'error') {
    return <RouteStateCard title="Booking flow unavailable" description={resource.message} variant="error" onRetry={() => window.location.reload()} />;
  }

  if (!bookingData || !bookingData.bookingEnabled) {
    return <RouteStateCard title="Booking not enabled" description="This public route is still guarded until booking is ready to open." variant="empty" />;
  }

  const { business, services } = bookingData;

  function updateDraft(nextDraft: Partial<BookingDraft>) {
    setDraft((currentDraft) => ({ ...currentDraft, ...nextDraft }));
  }

  function setCustomerField<K extends keyof BookingCustomerDetails>(field: K, value: BookingCustomerDetails[K]) {
    const nextCustomer = { ...draft.customer, [field]: value };

    setDraft((currentDraft) => ({
      ...currentDraft,
      customer: nextCustomer,
    }));

    setCustomerErrors((currentErrors) => ({
      ...currentErrors,
      [field]: validateBookingCustomerField(nextCustomer, field),
    }));
  }

  function handleFieldBlur(field: keyof BookingCustomerDetails) {
    setCustomerErrors((currentErrors) => ({
      ...currentErrors,
      [field]: validateBookingCustomerField(draft.customer, field),
    }));
  }

  function moveToStep(stepId: BookingStepId) {
    if (!isBookingStepAccessible(stepId, stepIds, currentStepIndex, context)) {
      return;
    }

    setCurrentStep(stepId);
    setStepError(null);
  }

  function showAllCustomerErrors() {
    setCustomerErrors(validateBookingCustomerForm(draft.customer));
  }

  function handleContinue() {
    if (currentStep === 'date' && dateOptionsState.status === 'loading') {
      setStepError('Availability is still syncing. Wait for dates to finish loading.');
      return;
    }

    if (currentStep === 'date' && dateOptionsState.status === 'error') {
      setStepError(dateOptionsState.message ?? 'Retry date availability before continuing.');
      return;
    }

    if (currentStep === 'time' && slotState.status === 'loading') {
      setStepError('Time slots are still loading. Wait for the latest availability.');
      return;
    }

    if (currentStep === 'time' && slotState.status === 'error') {
      setStepError(slotState.message ?? 'Retry slot availability before continuing.');
      return;
    }

    const validationError = getBookingStepValidationError(currentStep, context);
    if (validationError) {
      if (currentStep === 'details') {
        showAllCustomerErrors();
      }
      setStepError(validationError);
      return;
    }

    const nextStep = stepIds[currentStepIndex + 1];
    if (nextStep) {
      setCurrentStep(nextStep);
      setStepError(null);
    }
  }

  async function commitConfirmation(confirmation: BookingConfirmationRecord) {
    setSubmitState('submitting');
    setPendingConfirmation(confirmation);

    try {
      await publicBookingIntegrationClient.saveConfirmation(confirmation);
      trackWebEvent('booking_confirmation_saved', {
        reference: confirmation.reference,
        serviceId: selectedService?.id ?? 'unknown',
        staffId: selectedStaff?.id ?? 'next-available',
      });
      navigate('/book/confirmation');
    } catch {
      setSubmitState('failed');
      setStepError('Temporary issue while saving your booking confirmation. Retry submission.');
    }
  }

  function handleSubmit() {
    if (!selectedService || !selectedSlot || !draft.date) {
      return;
    }

    const errors = validateBookingCustomerForm(draft.customer);
    if (Object.keys(errors).length > 0) {
      setCurrentStep('details');
      setCustomerErrors(errors);
      setStepError('Complete the customer details before reviewing the booking.');
      return;
    }

    const confirmation: BookingConfirmationRecord = {
      reference: createReference(),
      createdAt: new Date().toISOString(),
      statusLabel: 'Pending staff confirmation',
      businessName: business.name,
      businessCity: business.city,
      serviceName: selectedService.name,
      serviceDurationLabel: formatDuration(selectedService.durationMinutes),
      servicePriceLabel: formatCurrency(selectedService.price),
      staffName: selectedStaff?.name ?? 'Next available staff member',
      dateLabel: formatSelectedDate(draft.date),
      timeLabel: `${selectedSlot.startLabel} to ${selectedSlot.endLabel}`,
      customer: draft.customer,
      followUpNote: 'Staff confirms the appointment manually after reviewing availability and payment instructions.',
    };

    void commitConfirmation(confirmation);
    mockPublicBookingRouteClient.saveConfirmation(confirmation);
    trackWebEvent('booking_confirmation_saved', {
      reference: confirmation.reference,
      serviceId: selectedService.id,
      staffId: selectedStaff?.id ?? 'next-available',
    });
    navigate('/book/confirmation');
  }

  function retrySubmit() {
    if (!pendingConfirmation) {
      return;
    }

    void commitConfirmation(pendingConfirmation);
  }

  function retryDateOptions() {
    if (!selectedService) {
      return;
    }

    setDateOptionsState({ status: 'loading', data: [] });
    setStepError(null);

    void publicBookingIntegrationClient
      .loadDateOptions(selectedService, staffRequired ? draft.staffId : null)
      .then((options) => {
        setDateOptionsState({ status: 'success', data: options });
      })
      .catch(() => {
        setDateOptionsState({ status: 'error', data: [], message: 'Unable to load available dates. Retry to continue this booking.' });
      });
  }

  function retrySlots() {
    if (!selectedService || !draft.date) {
      return;
    }

    setSlotState({ status: 'loading', data: [] });
    setStepError(null);

    void publicBookingIntegrationClient
      .loadSlots(selectedService, draft.date, staffRequired ? draft.staffId : null)
      .then((nextSlots) => {
        setSlotState({ status: 'success', data: nextSlots });
      })
      .catch(() => {
        setSlotState({ status: 'error', data: [], message: 'Could not load time slots for this date. Retry before selecting a slot.' });
      });
  }

  return (
    <div style={{ display: 'grid', gap: spacing[5], padding: `${spacing[6]}px ${spacing[8]}px ${spacing[8]}px` }}>
      <FlowLayout
        sidebar={(
          <>
            <FlowStepper
              currentStep={currentStep}
              isStepAccessible={(stepId) => isBookingStepAccessible(stepId as BookingStepId, stepIds, currentStepIndex, context)}
              isStepComplete={(stepId) => isBookingStepComplete(stepId as BookingStepId, context)}
              onStepSelect={(stepId) => moveToStep(stepId as BookingStepId)}
              steps={steps}
            />
            <FlowSection eyebrow="Booking summary" title="Current request" description="The review rail updates as soon as the customer changes any choice.">
              <ReviewBlock items={summaryItems} title="Selection overview" />
            </FlowSection>
          </>
        )}
      >
        <Card surfaceStyle={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,248,250,0.96) 100%)' }}>
          <div style={{ display: 'grid', gap: spacing[4] }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[4], justifyContent: 'space-between' }}>
              <div style={{ display: 'grid', gap: 8 }}>
                <span style={{ color: colors.muted, fontFamily: typography.fontFamily, ...typography.overline }}>Public booking</span>
                <h1 style={{ color: colors.navy, fontFamily: typography.fontFamily, margin: 0, ...typography.sectionHeading }}>{business.name}</h1>
                <p style={{ color: colors.secondary, fontFamily: typography.fontFamily, margin: 0, ...typography.body }}>{business.description}</p>
              </div>
              <div style={{ display: 'grid', gap: spacing[2], minWidth: 220 }}>
                <MetaRow icon={BriefcaseBusiness} text={business.category} />
                <MetaRow icon={MapPin} text={business.city} />
                <MetaRow icon={CalendarDays} text={`${business.reviewCount ?? 0} customer reviews`} />
              </div>
            </div>
          </div>
        </Card>

        <FlowSection
          eyebrow={STAGE_COPY[currentStep].eyebrow}
          title={STAGE_COPY[currentStep].title}
          description={STAGE_COPY[currentStep].description}
          headingRef={stepHeadingRef}
          headingTabIndex={-1}
        >
          <p
            aria-live="polite"
            role="status"
            style={{
              border: 0,
              clip: 'rect(0 0 0 0)',
              height: 1,
              margin: -1,
              overflow: 'hidden',
              padding: 0,
              position: 'absolute',
              width: 1,
            }}
          >
            {assistiveStatusMessage}
          </p>
          {stepError ? (
            <div
              role="alert"
              style={{
                background: 'rgba(229,62,62,0.08)',
                border: `1px solid rgba(229,62,62,0.24)`,
                borderRadius: radii.lg,
                color: colors.error,
                fontFamily: typography.fontFamily,
                padding: spacing[3],
              }}
            >
              {stepError}
            </div>
          ) : null}

          {currentStep === 'service' ? (
            <SelectionGrid>
              {services.map((service) => {
                const selected = draft.serviceId === service.id;
                return (
                  <button
                    key={service.id}
                    aria-pressed={selected}
                    type="button"
                    onClick={() => {
                      const nextStaffId = service.staffSelectionMode === 'required' && service.staffIds.length === 1 ? service.staffIds[0] ?? null : null;
                      setDraft((currentDraft) => ({
                        ...currentDraft,
                        serviceId: service.id,
                        staffId: nextStaffId,
                        date: null,
                        slotId: null,
                      }));
                      setStepError(null);
                      trackWebEvent('booking_service_selected', { serviceId: service.id, staffSelectionMode: service.staffSelectionMode });
                    }}
                    style={selectCardStyle(selected)}
                  >
                    <span style={{ color: colors.muted, fontFamily: typography.fontFamily, ...typography.overline }}>{service.category}</span>
                    <strong style={{ fontFamily: typography.fontFamily, fontSize: typography.body.fontSize }}>{service.name}</strong>
                    <span style={{ color: colors.secondary, fontFamily: typography.fontFamily, ...typography.bodySmall }}>{service.description}</span>
                    <span style={{ color: colors.secondary, fontFamily: typography.fontFamily, ...typography.label }}>
                      {formatDuration(service.durationMinutes)} | {formatCurrency(service.price)}
                    </span>
                  </button>
                );
              })}
            </SelectionGrid>
          ) : null}

          {currentStep === 'staff' ? (
            <SelectionGrid>
              {availableStaff.map((member) => {
                const selected = draft.staffId === member.id;
                return (
                  <button
                    key={member.id}
                    aria-pressed={selected}
                    type="button"
                    onClick={() => {
                      updateDraft({ staffId: member.id, date: null, slotId: null });
                      setStepError(null);
                    }}
                    style={selectCardStyle(selected)}
                  >
                    <span style={{ color: colors.muted, fontFamily: typography.fontFamily, ...typography.overline }}>{member.role}</span>
                    <strong style={{ fontFamily: typography.fontFamily, fontSize: typography.body.fontSize }}>{member.name}</strong>
                    <span style={{ color: colors.secondary, fontFamily: typography.fontFamily, ...typography.bodySmall }}>{member.bio}</span>
                    <span style={{ color: colors.secondary, fontFamily: typography.fontFamily, ...typography.label }}>{member.schedule}</span>
                  </button>
                );
              })}
            </SelectionGrid>
          ) : null}

          {currentStep === 'date' ? (
            <div style={{ display: 'grid', gap: spacing[3] }}>
              {dateOptionsState.status === 'loading' ? (
                <Card padding={4}>
                  <p style={{ color: colors.secondary, fontFamily: typography.fontFamily, margin: 0, ...typography.bodySmall }}>
                    Loading date availability...
                  </p>
                </Card>
              ) : null}

              {dateOptionsState.status === 'error' ? (
                <Card padding={4}>
                  <div style={{ display: 'grid', gap: spacing[3] }}>
                    <p style={{ color: colors.error, fontFamily: typography.fontFamily, margin: 0, ...typography.bodySmall }}>
                      {dateOptionsState.message}
                    </p>
                    <BrandButton size="nav" variant="secondary" onClick={retryDateOptions}>Retry dates</BrandButton>
                  </div>
                </Card>
              ) : null}

              {dateOptionsState.status === 'success' && dateOptionsState.data.length === 0 ? (
                <Card padding={4}>
                  <p style={{ color: colors.secondary, fontFamily: typography.fontFamily, margin: 0, ...typography.bodySmall }}>
                    No open dates are available for this service yet.
                  </p>
                </Card>
              ) : null}

              {dateOptionsState.status === 'success' && dateOptionsState.data.length > 0 ? (
                <SelectionGrid columns="repeat(auto-fit, minmax(160px, 1fr))">
                  {dateOptionsState.data.map((option) => {
                    const selected = draft.date === option.value;
                    return (
                      <button
                        key={option.value}
                        aria-pressed={selected}
                        disabled={!option.isAvailable}
                        type="button"
                        onClick={() => {
                          updateDraft({ date: option.value, slotId: null });
                          setStepError(null);
                        }}
                        style={selectCardStyle(selected, !option.isAvailable)}
                      >
                        <span style={{ color: colors.muted, fontFamily: typography.fontFamily, ...typography.overline }}>{option.weekdayLabel}</span>
                        <strong style={{ fontFamily: typography.fontFamily, fontSize: '24px' }}>{option.dayLabel}</strong>
                        <span style={{ color: colors.secondary, fontFamily: typography.fontFamily, ...typography.bodySmall }}>{option.monthLabel}</span>
                        <span style={{ color: option.isAvailable ? colors.brand : colors.muted, fontFamily: typography.fontFamily, ...typography.label }}>{option.availabilityLabel}</span>
                      </button>
                    );
                  })}
                </SelectionGrid>
              ) : null}
            </div>
          ) : null}

          {currentStep === 'time' ? (
            <div style={{ display: 'grid', gap: spacing[3] }}>
              {slotState.status === 'loading' ? (
                <Card padding={4}>
                  <p style={{ color: colors.secondary, fontFamily: typography.fontFamily, margin: 0, ...typography.bodySmall }}>
                    Loading available slots...
                  </p>
                </Card>
              ) : null}

              {slotState.status === 'error' ? (
                <Card padding={4}>
                  <div style={{ display: 'grid', gap: spacing[3] }}>
                    <p style={{ color: colors.error, fontFamily: typography.fontFamily, margin: 0, ...typography.bodySmall }}>
                      {slotState.message}
                    </p>
                    <BrandButton size="nav" variant="secondary" onClick={retrySlots}>Retry slots</BrandButton>
                  </div>
                </Card>
              ) : null}

              {slotState.status === 'success' && slotState.data.length === 0 ? (
                <Card padding={4}>
                  <p style={{ color: colors.secondary, fontFamily: typography.fontFamily, margin: 0, ...typography.bodySmall }}>
                    This date has no slots for the selected service and staff.
                  </p>
                </Card>
              ) : null}

              {slotState.status === 'success' && slotState.data.length > 0 ? (
                <SelectionGrid columns="repeat(auto-fit, minmax(180px, 1fr))">
                  {slotState.data.map((slot) => {
                    const selected = draft.slotId === slot.id;
                    return (
                      <button
                        key={slot.id}
                        aria-pressed={selected}
                        disabled={!slot.available}
                        type="button"
                        onClick={() => {
                          updateDraft({ slotId: slot.id });
                          setStepError(null);
                        }}
                        style={selectCardStyle(selected, !slot.available)}
                      >
                        <span style={{ color: colors.muted, fontFamily: typography.fontFamily, ...typography.overline }}>
                          {slot.available ? 'Available' : 'Unavailable'}
                        </span>
                        <strong style={{ fontFamily: typography.fontFamily, fontSize: typography.body.fontSize }}>{slot.startLabel}</strong>
                        <span style={{ color: colors.secondary, fontFamily: typography.fontFamily, ...typography.bodySmall }}>{slot.endLabel}</span>
                      </button>
                    );
                  })}
                </SelectionGrid>
              ) : null}
            </div>
          ) : null}

          {currentStep === 'details' ? (
            <div style={{ display: 'grid', gap: spacing[4] }}>
              <div style={{ display: 'grid', gap: spacing[4], gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                <BrandInput
                  id="booking-full-name"
                  autoComplete="name"
                  error={customerErrors.fullName}
                  label="Full name"
                  leadingIcon={UserRound}
                  value={draft.customer.fullName}
                  onBlur={() => handleFieldBlur('fullName')}
                  onChange={(event) => setCustomerField('fullName', event.target.value)}
                />
                <BrandInput
                  id="booking-phone"
                  autoComplete="tel"
                  error={customerErrors.phone}
                  label="Mobile number"
                  leadingIcon={Phone}
                  value={draft.customer.phone}
                  onBlur={() => handleFieldBlur('phone')}
                  onChange={(event) => setCustomerField('phone', event.target.value)}
                />
              </div>
              <BrandInput
                id="booking-email"
                autoComplete="email"
                error={customerErrors.email}
                label="Email"
                leadingIcon={Mail}
                value={draft.customer.email}
                onBlur={() => handleFieldBlur('email')}
                onChange={(event) => setCustomerField('email', event.target.value)}
              />
              <BrandTextarea
                id="booking-notes"
                helperText="Optional notes for staff, allergies, or arrival context."
                label="Notes"
                leadingIcon={NotebookText}
                value={draft.customer.notes}
                onBlur={() => handleFieldBlur('notes')}
                onChange={(event) => setCustomerField('notes', event.target.value)}
              />
            </div>
          ) : null}

          {currentStep === 'review' && selectedService && selectedSlot ? (
            <div style={{ display: 'grid', gap: spacing[4] }}>
              <div style={{ display: 'grid', gap: spacing[4], gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                <ReviewBlock
                  items={[
                    { label: 'Service', value: selectedService.name },
                    { label: 'Duration', value: formatDuration(selectedService.durationMinutes) },
                    { label: 'Price', value: formatCurrency(selectedService.price) },
                  ]}
                  title="Service"
                />
                <ReviewBlock
                  items={[
                    { label: 'Staff', value: selectedStaff?.name ?? 'Next available staff member' },
                    { label: 'Date', value: formatSelectedDate(draft.date ?? '') },
                    { label: 'Time', value: `${selectedSlot.startLabel} to ${selectedSlot.endLabel}` },
                  ]}
                  title="Appointment"
                />
                <ReviewBlock
                  items={[
                    { label: 'Customer', value: draft.customer.fullName },
                    { label: 'Phone', value: draft.customer.phone },
                    { label: 'Email', value: draft.customer.email },
                  ]}
                  title="Customer"
                />
              </div>
              <Card padding={4} surfaceStyle={{ background: 'rgba(46,49,146,0.04)' }}>
                <div style={{ display: 'grid', gap: spacing[2] }}>
                  <span style={{ color: colors.muted, fontFamily: typography.fontFamily, ...typography.overline }}>Before you submit</span>
                  <p style={{ color: colors.secondary, fontFamily: typography.fontFamily, margin: 0, ...typography.bodySmall }}>
                    Booking confirmation is currently manual. Staff still verifies availability and payment instructions before final approval.
                  </p>
                </div>
              </Card>
            </div>
          ) : null}

          <FlowActions
            secondaryAction={(
              <Link to="/" style={{ textDecoration: 'none' }}>
                <BrandButton variant="secondary">Cancel</BrandButton>
              </Link>
            )}
            primaryAction={(
              <>
                {previousStep ? (
                  <BrandButton startIcon={<ArrowLeft size={15} />} variant="secondary" onClick={() => setCurrentStep(previousStep)}>
                    Back
                  </BrandButton>
                ) : null}
                {currentStep !== 'review' ? (
                  <BrandButton endIcon={<ArrowRight size={15} />} onClick={handleContinue}>
                    Continue
                  </BrandButton>
                ) : (
                  <>
                    <BrandButton endIcon={<CheckCircle2 size={15} />} disabled={submitState === 'submitting'} onClick={handleSubmit}>
                      {submitState === 'submitting' ? 'Confirming...' : 'Confirm booking'}
                    </BrandButton>
                    {submitState === 'failed' ? (
                      <BrandButton variant="secondary" onClick={retrySubmit}>Retry confirmation</BrandButton>
                    ) : null}
                  </>
                )}
              </>
            )}
          />
        </FlowSection>
      </FlowLayout>
    </div>
  );
}

function MetaRow({ icon: Icon, text }: { icon: typeof CalendarDays; text: string }) {
  return (
    <div style={{ alignItems: 'center', color: colors.secondary, display: 'flex', gap: spacing[2], fontFamily: typography.fontFamily }}>
      <Icon size={15} />
      <span style={typography.bodySmall}>{text}</span>
    </div>
  );
}

