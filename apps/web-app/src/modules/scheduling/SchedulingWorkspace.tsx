import { useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Plus } from 'lucide-react';
import { AppPill, PageIntro } from '@/app/components/PageTemplates';
import { RouteStateCard } from '@/app/components/RouteStateCard';
import { getOwnerBusinessSettingsResource, getOwnerDashboardResource } from '@/features/owner/data';
import { FlowLayout, FlowSection, ReviewBlock } from '@/modules/shared/flow/FlowScaffolds';
import { BrandButton, BrandSelect, Card, colors, radii, spacing, typography, useBrandToast } from '@/ui';
import { type AvailabilityDraft, validateAvailabilityField, validateAvailabilityForm } from './validation';

const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

export function SchedulingWorkspace() {
  const dashboardResource = getOwnerDashboardResource();
  const businessResource = getOwnerBusinessSettingsResource();
  const toast = useBrandToast();
  const [selectedDayId, setSelectedDayId] = useState<string | null>(
    () => (businessResource.status === 'ready' ? businessResource.data.businessHours[0]?.id ?? null : null),
  );
  const [draft, setDraft] = useState<AvailabilityDraft>(() => {
    if (businessResource.status !== 'ready') {
      return {
        day: '',
        isOpen: true,
        openTime: '09:00',
        closeTime: '18:00',
      };
    }

    const initialDay = businessResource.data.businessHours[0];
    return {
      day: initialDay?.day ?? '',
      isOpen: initialDay?.isOpen ?? true,
      openTime: initialDay?.openTime ?? '09:00',
      closeTime: initialDay?.closeTime ?? '18:00',
    };
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  if (dashboardResource.status !== 'ready' || businessResource.status !== 'ready') {
    return <RouteStateCard title="Loading calendar" description="Preparing the weekly calendar and availability defaults." variant="loading" />;
  }

  const { bookings } = dashboardResource.data;
  const { businessHours, teamMembers } = businessResource.data;

  const daySummary = businessHours.map((item) => ({
    label: item.day,
    value: item.isOpen ? `${item.openTime} - ${item.closeTime}` : 'Closed',
  }));

  function syncDraft(dayId: string) {
    const nextDay = businessHours.find((item) => item.id === dayId);
    setSelectedDayId(dayId);
    if (!nextDay) {
      return;
    }
    setDraft({
      day: nextDay.day,
      isOpen: nextDay.isOpen,
      openTime: nextDay.openTime,
      closeTime: nextDay.closeTime,
    });
    setErrors({});
  }

  function setField<K extends keyof AvailabilityDraft>(field: K, value: AvailabilityDraft[K]) {
    const nextDraft = { ...draft, [field]: value };
    setDraft(nextDraft);
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: validateAvailabilityField(nextDraft, field),
    }));
  }

  function handleBlur(field: keyof AvailabilityDraft) {
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: validateAvailabilityField(draft, field),
    }));
  }

  function handleSave() {
    const nextErrors = validateAvailabilityForm(draft);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    toast.success({
      title: 'Availability rules updated',
      description: `${draft.day} now runs ${draft.isOpen ? `${draft.openTime} to ${draft.closeTime}` : 'as closed'} in the local preview.`,
    });
  }

  return (
    <div className="owner-page-stack">
      <PageIntro
        eyebrow="Scheduling"
        title="Availability management"
        description="Review the current week, scan upcoming bookings, and adjust the local availability rules from one branded scheduling surface."
        actions={(
          <div className="owner-page-intro__actions-row">
            <BrandButton size="nav" variant="secondary">Today</BrandButton>
            <BrandButton size="nav" variant="secondary" startIcon={<ChevronLeft size={15} />}>Previous</BrandButton>
            <BrandButton size="nav" variant="secondary" endIcon={<ChevronRight size={15} />}>Next</BrandButton>
            <BrandButton size="nav" startIcon={<Plus size={15} />}>New appointment</BrandButton>
          </div>
        )}
        pills={(
          <>
            <AppPill tone="accent">Week of March 4, 2026</AppPill>
            <AppPill>{teamMembers.length} staff scheduled</AppPill>
          </>
        )}
      />

      <FlowLayout
        sidebar={(
          <>
            <FlowSection eyebrow="Availability rules" title="Daily operating window" description="Validation runs on blur for the editable fields and clears as soon as the rule becomes valid again.">
              <div style={{ display: 'grid', gap: spacing[4] }}>
                <BrandSelect
                  error={errors.day}
                  label="Day"
                  value={selectedDayId ?? ''}
                  onBlur={() => handleBlur('day')}
                  onChange={(event) => syncDraft(event.target.value)}
                >
                  {businessHours.map((item) => (
                    <option key={item.id} value={item.id}>{item.day}</option>
                  ))}
                </BrandSelect>
                <BrandSelect
                  label="Booking status"
                  value={draft.isOpen ? 'open' : 'closed'}
                  onChange={(event) => setField('isOpen', event.target.value === 'open')}
                >
                  <option value="open">Accept bookings</option>
                  <option value="closed">Closed</option>
                </BrandSelect>
                <BrandSelect
                  disabled={!draft.isOpen}
                  error={errors.openTime}
                  label="Open time"
                  value={draft.openTime}
                  onBlur={() => handleBlur('openTime')}
                  onChange={(event) => setField('openTime', event.target.value)}
                >
                  {HOURS.map((hour) => <option key={hour} value={hour}>{hour}</option>)}
                </BrandSelect>
                <BrandSelect
                  disabled={!draft.isOpen}
                  error={errors.closeTime}
                  label="Close time"
                  value={draft.closeTime}
                  onBlur={() => handleBlur('closeTime')}
                  onChange={(event) => setField('closeTime', event.target.value)}
                >
                  {HOURS.map((hour) => <option key={hour} value={hour}>{hour}</option>)}
                </BrandSelect>
                <BrandButton startIcon={<Clock3 size={15} />} onClick={handleSave}>
                  Save availability
                </BrandButton>
              </div>
            </FlowSection>
            <FlowSection eyebrow="Weekly baseline" title="Current week at a glance" description="This mirrors the availability defaults that the public booking preview reads today.">
              <ReviewBlock items={daySummary} title="Business hours" />
            </FlowSection>
          </>
        )}
      >
        <FlowSection eyebrow="Upcoming bookings" title="This week's active schedule" description="The booking grid keeps the operational snapshot visible while availability is being edited.">
          <div style={{ display: 'grid', gap: spacing[3] }}>
            {bookings.map((booking) => (
              <Card key={booking.id} padding={4} surfaceStyle={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,248,250,0.96) 100%)' }}>
                <div style={{ alignItems: 'center', display: 'grid', gap: spacing[3], gridTemplateColumns: 'minmax(0, 1.5fr) repeat(3, minmax(120px, 1fr))' }}>
                  <div style={{ display: 'grid', gap: 2 }}>
                    <strong style={{ color: colors.navy, fontFamily: typography.fontFamily }}>{booking.customerName}</strong>
                    <span style={{ color: colors.secondary, fontFamily: typography.fontFamily, ...typography.bodySmall }}>
                      {booking.serviceName} with {booking.staffName}
                    </span>
                  </div>
                  <Cell icon={CalendarDays} text={booking.startTime} />
                  <Cell icon={Clock3} text={booking.duration} />
                  <Tag text={booking.status} />
                </div>
              </Card>
            ))}
          </div>
        </FlowSection>
      </FlowLayout>
    </div>
  );
}

function Cell({ icon: Icon, text }: { icon: typeof CalendarDays; text: string }) {
  return (
    <div style={{ alignItems: 'center', color: colors.secondary, display: 'flex', gap: spacing[2], fontFamily: typography.fontFamily }}>
      <Icon size={15} />
      <span style={typography.bodySmall}>{text}</span>
    </div>
  );
}

function Tag({ text }: { text: string }) {
  return (
    <span
      style={{
        background: 'rgba(46,49,146,0.08)',
        borderRadius: radii.full,
        color: colors.brand,
        display: 'inline-flex',
        fontFamily: typography.fontFamily,
        fontSize: typography.label.fontSize,
        fontWeight: 600,
        justifyContent: 'center',
        padding: '6px 10px',
      }}
    >
      {text}
    </span>
  );
}
