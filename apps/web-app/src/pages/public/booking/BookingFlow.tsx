import { useState } from 'react';
import { Badge, Button, Card, SectionCard } from '@slotra/ui';
import { RouteStateCard } from '@/app/components/RouteStateCard';
import { formatCurrency, formatDuration } from '@/domain/service/formatters';
import {
  createInitialBookingDraft,
  getBookingDateOptions,
  getBookingSlots,
  getPublicBookingResource,
  savePublicBookingConfirmation,
} from '@/features/public-booking/data';
import { bookingCustomerValidationService } from '@/features/public-booking/validation';
import { Link, useNavigate } from 'react-router-dom';
import { formatSelectedDate } from './availability';
import { BusinessHeader } from './components/BusinessHeader';
import { BookingProgress } from './components/BookingProgress';
import { CustomerDetailsForm } from './components/CustomerDetailsForm';
import { DateSelector } from './components/DateSelector';
import { ReviewPanel } from './components/ReviewPanel';
import { ServicePicker } from './components/ServicePicker';
import { StaffPicker } from './components/StaffPicker';
import { TimeSlotPicker } from './components/TimeSlotPicker';
import type {
  BookingConfirmationRecord,
  BookingCustomerDetails,
  BookingCustomerErrors,
  BookingDraft,
  BookingService,
  BookingSlot,
  BookingStaffMember,
  BookingStepId,
} from './types';

const STAGE_TITLES: Record<BookingStepId, string> = {
  service: 'Select a service',
  staff: 'Choose your staff member',
  date: 'Pick a date',
  time: 'Choose a time slot',
  details: 'Enter customer details',
  review: 'Review the booking',
};

const STAGE_DESCRIPTIONS: Record<BookingStepId, string> = {
  service: 'Start with the service so the booking flow can filter staff and availability.',
  staff: 'Staff selection is only shown when the selected service needs a named specialist.',
  date: 'Availability is mocked locally for now, but structured to be replaced with API data later.',
  time: 'Unavailable slots stay visible so the current state is honest.',
  details: 'Capture the minimum customer details needed for confirmation follow-up.',
  review: 'Verify the final selection before creating the local confirmation record.',
};

function createReference() {
  return `SLT-${Math.floor(Date.now() % 1000000)
    .toString()
    .padStart(6, '0')}`;
}

export function BookingFlow() {
  const navigate = useNavigate();
  const resource = getPublicBookingResource();
  const [draft, setDraft] = useState<BookingDraft>(() =>
    resource.status === 'ready' ? createInitialBookingDraft(resource.data.business.id) : createInitialBookingDraft('')
  );
  const [currentStep, setCurrentStep] = useState<BookingStepId>('service');
  const [customerErrors, setCustomerErrors] = useState<BookingCustomerErrors>({});
  const [stepError, setStepError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (resource.status === 'loading') {
    return <RouteStateCard title="Loading booking flow" description="Preparing the public business profile, services, and staff." variant="loading" />;
  }

  if (resource.status === 'error') {
    return <RouteStateCard title="Booking flow unavailable" description={resource.message} variant="error" />;
  }

  const {
    bookingEnabled,
    business: bookingBusiness,
    services: bookingServices,
    servicesById: bookingServicesById,
    staff: bookingStaff,
    staffById: bookingStaffById,
  } = resource.data;

  if (!bookingEnabled) {
    return <RouteStateCard title="Booking not enabled" description="This public route is still guarded until the booking experience is ready to open." variant="empty" />;
  }

  if (bookingServices.length === 0) {
    return <RouteStateCard title="No bookable services yet" description="The public booking route is connected, but the service catalog is currently empty." variant="empty" />;
  }

  const selectedService = draft.serviceId ? bookingServicesById[draft.serviceId] ?? null : null;
  const staffRequired = selectedService?.staffSelectionMode === 'required';
  const availableStaff = selectedService
    ? bookingStaff.filter((member) => selectedService.staffIds.includes(member.id))
    : [];
  const selectedStaff = draft.staffId ? bookingStaffById[draft.staffId] ?? null : null;
  const dateOptions = selectedService
    ? getBookingDateOptions(selectedService, staffRequired ? draft.staffId : null)
    : [];
  const slots = selectedService && draft.date
    ? getBookingSlots(selectedService, draft.date, staffRequired ? draft.staffId : null)
    : [];
  const selectedSlot = slots.find((slot) => slot.id === draft.slotId) ?? null;

  const steps: { id: BookingStepId; label: string; description: string }[] = [
    { id: 'service', label: 'Service', description: 'Choose what you need' },
    ...(staffRequired
      ? [{ id: 'staff' as BookingStepId, label: 'Staff', description: 'Pick your preferred specialist' }]
      : []),
    { id: 'date', label: 'Date', description: 'Find an open day' },
    { id: 'time', label: 'Time', description: 'Choose a slot' },
    { id: 'details', label: 'Details', description: 'Add contact info' },
    { id: 'review', label: 'Review', description: 'Check before sending' },
  ];

  const stepIds = steps.map((step) => step.id);
  const currentStepIndex = stepIds.indexOf(currentStep);

  function updateDraft(nextDraft: Partial<BookingDraft>) {
    setDraft((currentDraft) => ({ ...currentDraft, ...nextDraft }));
  }

  function handleServiceSelect(serviceId: string) {
    const service = bookingServicesById[serviceId];
    if (!service) {
      return;
    }

    const nextStaffId =
      service.staffSelectionMode === 'required' && service.staffIds.length === 1
        ? service.staffIds[0] ?? null
        : null;

    setDraft((currentDraft) => ({
      ...currentDraft,
      serviceId,
      staffId: nextStaffId,
      date: null,
      slotId: null,
    }));
    setCustomerErrors({});
    setStepError(null);
  }

  function handleStaffSelect(staffId: string) {
    updateDraft({ staffId, date: null, slotId: null });
    setStepError(null);
  }

  function handleDateSelect(date: string) {
    updateDraft({ date, slotId: null });
    setStepError(null);
  }

  function handleCustomerChange(field: keyof BookingCustomerDetails, value: string) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      customer: {
        ...currentDraft.customer,
        [field]: value,
      },
    }));
    setCustomerErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  }

  function getCustomerErrors(customer: BookingCustomerDetails) {
    return bookingCustomerValidationService.validate(customer).errors;
  }

  function isStepComplete(stepId: BookingStepId) {
    switch (stepId) {
      case 'service':
        return Boolean(selectedService);
      case 'staff':
        return !staffRequired || Boolean(selectedStaff);
      case 'date':
        return Boolean(draft.date);
      case 'time':
        return Boolean(selectedSlot);
      case 'details':
        return Object.keys(getCustomerErrors(draft.customer)).length === 0
          && Boolean(draft.customer.fullName || draft.customer.email || draft.customer.phone);
      case 'review':
        return false;
      default:
        return false;
    }
  }

  function getStepValidationError(stepId: BookingStepId) {
    switch (stepId) {
      case 'service':
        return selectedService ? null : 'Choose a service before continuing.';
      case 'staff':
        return !staffRequired || selectedStaff
          ? null
          : 'Select a staff member before choosing a date.';
      case 'date':
        return draft.date ? null : 'Choose an available date before continuing.';
      case 'time':
        return selectedSlot ? null : 'Choose an available time slot before continuing.';
      case 'details':
        return Object.keys(getCustomerErrors(draft.customer)).length === 0
          ? null
          : 'Complete the customer details before reviewing the booking.';
      case 'review':
        return null;
      default:
        return null;
    }
  }

  function getFirstIncompleteStepIndex() {
    const index = stepIds.findIndex((stepId) => !isStepComplete(stepId));
    return index === -1 ? stepIds.length - 1 : index;
  }

  function isStepAccessible(stepId: BookingStepId) {
    const targetIndex = stepIds.indexOf(stepId);
    return targetIndex <= Math.max(currentStepIndex, getFirstIncompleteStepIndex());
  }

  function moveToStep(stepId: BookingStepId) {
    if (!isStepAccessible(stepId)) {
      return;
    }

    setCurrentStep(stepId);
    setStepError(null);
  }

  function handleContinue() {
    const validationError = getStepValidationError(currentStep);
    if (validationError) {
      if (currentStep === 'details') {
        setCustomerErrors(getCustomerErrors(draft.customer));
      }
      setStepError(validationError);
      return;
    }

    const nextStepId = stepIds[currentStepIndex + 1];
    if (nextStepId) {
      setCurrentStep(nextStepId);
      setStepError(null);
    }
  }

  function handleSubmit() {
    if (!selectedService || !draft.date || !selectedSlot) {
      return;
    }

    const errors = getCustomerErrors(draft.customer);
    if (Object.keys(errors).length > 0) {
      setCustomerErrors(errors);
      setCurrentStep('details');
      setStepError('Complete the customer details before reviewing the booking.');
      return;
    }

    setIsSubmitting(true);

    const confirmation: BookingConfirmationRecord = {
      reference: createReference(),
      createdAt: new Date().toISOString(),
      statusLabel: 'Pending staff confirmation',
      businessName: bookingBusiness.name,
      businessCity: bookingBusiness.city,
      serviceName: selectedService.name,
      serviceDurationLabel: formatDuration(selectedService.durationMinutes),
      servicePriceLabel: formatCurrency(selectedService.price),
      staffName: selectedStaff?.name ?? 'Next available therapist',
      dateLabel: formatSelectedDate(draft.date),
      timeLabel: `${selectedSlot.startLabel} to ${selectedSlot.endLabel}`,
      customer: draft.customer,
      followUpNote:
        'A backend confirmation, reminders, and payment collection flow are intentionally deferred to later phases.',
    };

    savePublicBookingConfirmation(confirmation);
    navigate('/book/confirmation');
  }

  const summaryItems = [
    {
      label: 'Service',
      value: selectedService
        ? `${selectedService.name} • ${formatCurrency(selectedService.price)}`
        : 'Not selected yet',
    },
    {
      label: 'Staff',
      value: staffRequired
        ? selectedStaff?.name ?? 'Choose a staff member'
        : selectedService
          ? 'Next available therapist'
          : 'Depends on service',
    },
    {
      label: 'Date',
      value: draft.date ? formatSelectedDate(draft.date) : 'Choose a date',
    },
    {
      label: 'Time',
      value: selectedSlot ? `${selectedSlot.startLabel} to ${selectedSlot.endLabel}` : 'Choose a slot',
    },
    {
      label: 'Customer',
      value: draft.customer.fullName || 'Add customer details',
    },
  ];
  const previousStepId = currentStepIndex > 0 ? stepIds[currentStepIndex - 1] ?? null : null;

  return (
    <main className="public-page booking-page">
      <div className="booking-shell">
        <BusinessHeader business={bookingBusiness} />

        <div className="booking-layout">
          <div className="booking-main">
            <Card className="booking-progress-card">
              <div className="booking-progress-card__header">
                <div>
                  <p className="booking-progress-card__eyebrow">Public booking</p>
                  <h2>Finish the booking in clear stages</h2>
                </div>
                <Badge variant="default">Local mock flow</Badge>
              </div>
              <BookingProgress
                steps={steps}
                currentStep={currentStep}
                isStepComplete={isStepComplete}
                isStepAccessible={isStepAccessible}
                onStepSelect={moveToStep}
              />
            </Card>

            <SectionCard
              className="booking-stage-card"
              title={STAGE_TITLES[currentStep]}
              description={STAGE_DESCRIPTIONS[currentStep]}
            >
              {stepError ? <div className="booking-error-banner">{stepError}</div> : null}

              {currentStep === 'service' ? (
                <ServicePicker
                  services={bookingServices}
                  selectedServiceId={draft.serviceId}
                  error={stepError ?? undefined}
                  onSelect={handleServiceSelect}
                />
              ) : null}

              {currentStep === 'staff' && selectedService ? (
                <StaffPicker
                  service={selectedService}
                  staffMembers={availableStaff}
                  selectedStaffId={draft.staffId}
                  error={stepError ?? undefined}
                  onSelect={handleStaffSelect}
                />
              ) : null}

              {currentStep === 'date' && selectedService ? (
                <DateSelector
                  dateOptions={dateOptions}
                  selectedDate={draft.date}
                  error={stepError ?? undefined}
                  onSelect={handleDateSelect}
                />
              ) : null}

              {currentStep === 'time' ? (
                <TimeSlotPicker
                  slots={slots}
                  selectedSlotId={draft.slotId}
                  error={stepError ?? undefined}
                  onSelect={(slotId) => {
                    updateDraft({ slotId });
                    setStepError(null);
                  }}
                />
              ) : null}

              {currentStep === 'details' ? (
                <CustomerDetailsForm
                  customer={draft.customer}
                  errors={customerErrors}
                  onChange={handleCustomerChange}
                />
              ) : null}

              {currentStep === 'review' && selectedService && selectedSlot ? (
                <ReviewPanel
                  business={bookingBusiness}
                  service={selectedService as BookingService}
                  staff={selectedStaff as BookingStaffMember | null}
                  dateLabel={formatSelectedDate(draft.date ?? '')}
                  slot={selectedSlot as BookingSlot}
                  customer={draft.customer}
                  onConfirm={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              ) : null}

              <div className="booking-stage-card__footer">
                <div className="booking-stage-card__footer-links">
                  <Link className="button-link button-link--secondary" to="/">
                    Cancel
                  </Link>
                </div>
                <div className="booking-stage-card__footer-actions">
                  {previousStepId ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(previousStepId)}
                    >
                      Back
                    </Button>
                  ) : null}
                  {currentStep !== 'review' ? (
                    <Button type="button" onClick={handleContinue}>
                      Continue
                    </Button>
                  ) : null}
                </div>
              </div>
            </SectionCard>
          </div>

          <aside className="booking-sidebar">
            <SectionCard
              className="booking-summary-card"
              title="Booking summary"
              description="Selections stay local but follow a clean draft structure for later API work."
            >
              <div className="booking-summary-list">
                {summaryItems.map((item) => (
                  <div key={item.label} className="booking-summary-list__item">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
              {selectedService ? (
                <div className="booking-summary-note">
                  <p className="booking-summary-note__eyebrow">Selected service</p>
                  <h3>{selectedService.name}</h3>
                  <p>{selectedService.description}</p>
                </div>
              ) : null}
            </SectionCard>
          </aside>
        </div>
      </div>
    </main>
  );
}
