import { useState } from 'react';
import { AlertTriangle, CalendarDays, ChevronLeft, ChevronRight, Clock3, Globe2, Plus, Save } from 'lucide-react';
import { AppPill, OwnerPageScaffold, PageIntro } from '@/app/components/PageTemplates';
import { RouteStateCard } from '@/app/components/RouteStateCard';
import { mockOwnerRouteClient } from '@/features/owner/routeClient';
import { FlowSection, ReviewBlock } from '@/modules/shared/flow/FlowScaffolds';
import {
  BrandButton,
  BrandInput,
  BrandSelect,
  Card,
  SaveStateIndicator,
  colors,
  radii,
  spacing,
  typography,
  useBrandToast,
  type SaveStateStatus,
} from '@/ui';
import { type AvailabilityDraft, validateAvailabilityField, validateAvailabilityForm } from './validation';

const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
const OVERRIDE_STATUSES = ['closed', 'custom', 'extended'] as const;

type OverrideStatus = (typeof OVERRIDE_STATUSES)[number];

interface DateOverride {
  id: string;
  date: string;
  status: OverrideStatus;
  openTime: string;
  closeTime: string;
  note: string;
}

export function SchedulingWorkspace() {
  const dashboardResource = mockOwnerRouteClient.getDashboardQuery();
  const businessResource = mockOwnerRouteClient.getBusinessSettingsQuery();
  const toast = useBrandToast();
  const [selectedDayId, setSelectedDayId] = useState<string | null>(
    () => (businessResource.status === 'success' ? businessResource.data.businessHours[0]?.id ?? null : null),
  );
  const [draft, setDraft] = useState<AvailabilityDraft>(() => {
    if (businessResource.status !== 'success') {
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
  const [weeklyHours, setWeeklyHours] = useState(() => businessResource.status === 'success' ? businessResource.data.businessHours : []);
  const [timezone, setTimezone] = useState(() => businessResource.status === 'success' ? businessResource.data.business.timezone : 'Asia/Manila');
  const [dateOverrides, setDateOverrides] = useState<DateOverride[]>([
    {
      id: 'ovr-holiday',
      date: '2026-03-29',
      status: 'closed',
      openTime: '10:00',
      closeTime: '19:00',
      note: 'Staff planning day',
    },
    {
      id: 'ovr-sale',
      date: '2026-03-15',
      status: 'extended',
      openTime: '09:00',
      closeTime: '21:00',
      note: 'Weekend promo window',
    },
  ]);
  const [newOverrideDate, setNewOverrideDate] = useState('');
  const [newOverrideStatus, setNewOverrideStatus] = useState<OverrideStatus>('closed');
  const [newOverrideOpenTime, setNewOverrideOpenTime] = useState('10:00');
  const [newOverrideCloseTime, setNewOverrideCloseTime] = useState('19:00');
  const [newOverrideNote, setNewOverrideNote] = useState('');
  const [blackoutDates, setBlackoutDates] = useState(['2026-04-18']);
  const [newBlackoutDate, setNewBlackoutDate] = useState('');
  const [saveState, setSaveState] = useState<SaveStateStatus>('saved');
  const [lastSavedLabel, setLastSavedLabel] = useState('Auto-saved 2m ago');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  if (dashboardResource.status === 'loading' || businessResource.status === 'loading') {
    return <RouteStateCard title="Loading calendar" description="Preparing the weekly calendar and availability defaults." variant="loading" />;
  }

  if (dashboardResource.status === 'error' || businessResource.status === 'error') {
    const errorMessage = dashboardResource.status === 'error'
      ? dashboardResource.message
      : businessResource.status === 'error'
        ? businessResource.message
        : 'Unable to load calendar data.';

    return (
      <RouteStateCard
        title="Calendar unavailable"
        description={errorMessage}
        variant="error"
        onRetry={() => window.location.reload()}
      />
    );
  }

  const { bookings } = dashboardResource.data;
  const { business, teamMembers, timezoneOptions } = businessResource.data;

  const daySummary = weeklyHours.map((item) => ({
    label: item.day,
    value: item.isOpen ? `${item.openTime} - ${item.closeTime}` : 'Closed',
  }));

  function syncDraft(dayId: string) {
    const nextDay = weeklyHours.find((item) => item.id === dayId);
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
    setSaveState('idle');
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

    if (selectedDayId) {
      setWeeklyHours((currentHours) => currentHours.map((item) => (item.id === selectedDayId ? { ...item, ...draft } : item)));
    }
    setSaveState('saving');
    setSaveState('saved');
    setLastSavedLabel(`Saved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    toast.success({
      title: 'Availability rules updated',
      description: `${draft.day} now runs ${draft.isOpen ? `${draft.openTime} to ${draft.closeTime}` : 'as closed'} in the local preview.`,
    });
  }

  function handleAddOverride() {
    if (!newOverrideDate) {
      return;
    }
    if (newOverrideStatus !== 'closed' && newOverrideCloseTime <= newOverrideOpenTime) {
      toast.error({
        title: 'Check override time window',
        description: 'Closing time must be later than opening time for custom and extended windows.',
      });
      return;
    }

    const nextOverride: DateOverride = {
      id: `ovr-${Date.now()}`,
      date: newOverrideDate,
      status: newOverrideStatus,
      openTime: newOverrideOpenTime,
      closeTime: newOverrideCloseTime,
      note: newOverrideNote.trim() || 'No note added',
    };
    setDateOverrides((currentOverrides) => [...currentOverrides, nextOverride]);
    setNewOverrideDate('');
    setNewOverrideNote('');
    setSaveState('idle');
    toast.info({
      title: 'Override draft added',
      description: `${formatDateLabel(nextOverride.date)} is now queued in this local editor.`,
    });
  }

  function handleAddBlackoutDate() {
    if (!newBlackoutDate || blackoutDates.includes(newBlackoutDate)) {
      return;
    }
    setBlackoutDates((currentDates) => [...currentDates, newBlackoutDate]);
    setNewBlackoutDate('');
    setSaveState('idle');
  }

  const conflictMessages = (() => {
    const messages: string[] = [];
    const overrideDates = dateOverrides.map((override) => override.date);
    const duplicateOverrideDates = overrideDates.filter((date, index) => overrideDates.indexOf(date) !== index);
    const overlapWithBlackouts = dateOverrides.filter((override) => blackoutDates.includes(override.date));

    if (timezone !== business.timezone) {
      messages.push(`Timezone preview changed to ${timezone}. Confirm staff calendars are migrated from ${business.timezone}.`);
    }
    if (duplicateOverrideDates.length > 0) {
      messages.push(`Found duplicate override dates (${[...new Set(duplicateOverrideDates)].join(', ')}). Keep one date policy per day.`);
    }
    if (overlapWithBlackouts.length > 0) {
      messages.push(`Override and blackout overlap on ${overlapWithBlackouts.map((item) => formatDateLabel(item.date)).join(', ')}.`);
    }

    return messages;
  })();

  return (
    <OwnerPageScaffold>
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
            <SaveStateIndicator status={saveState} savedLabel={lastSavedLabel} onRetry={handleSave} />
          </>
        )}
      />

      <div className="schedule-workspace-grid">
        <FlowSection eyebrow="Weekly schedule" title="Operations grid" description="Scan weekday windows and jump into any day editor without leaving this page.">
          <div className="schedule-grid">
            <div className="schedule-grid__header">
              <span>Day</span>
              <span>Status</span>
              <span>Open</span>
              <span>Close</span>
              <span>Action</span>
            </div>
            {weeklyHours.map((item) => {
              const selected = selectedDayId === item.id;
              return (
                <div key={item.id} className={`schedule-grid__row${selected ? ' schedule-grid__row--selected' : ''}`}>
                  <strong>{item.day}</strong>
                  <span>{item.isOpen ? 'Open' : 'Closed'}</span>
                  <span>{item.isOpen ? item.openTime : '-'}</span>
                  <span>{item.isOpen ? item.closeTime : '-'}</span>
                  <BrandButton size="nav" variant="secondary" onClick={() => syncDraft(item.id)}>Edit</BrandButton>
                </div>
              );
            })}
          </div>
        </FlowSection>
        <FlowSection eyebrow="Availability rules" title="Daily operating window" description="Validation runs on blur for editable fields and save state updates consistently across this workspace.">
          <div style={{ display: 'grid', gap: spacing[4] }}>
            <BrandSelect
              error={errors.day}
              label="Day"
              value={selectedDayId ?? ''}
              onBlur={() => handleBlur('day')}
              onChange={(event) => syncDraft(event.target.value)}
            >
              {weeklyHours.map((item) => (
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
        <FlowSection eyebrow="Upcoming bookings" title="This week's active schedule" description="The booking grid keeps the operational snapshot visible while availability is being edited.">
          <div className="schedule-bookings-list">
            {bookings.map((booking) => (
              <Card key={booking.id} padding={4} className="schedule-bookings-list__card" surfaceStyle={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,248,250,0.96) 100%)' }}>
                <div className="schedule-bookings-list__row">
                  <div className="schedule-bookings-list__customer">
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
        <FlowSection eyebrow="Date overrides" title="Special date windows" description="Add one-off operating rules for holidays, promos, and exceptions.">
          <div className="schedule-overrides-shell">
            <div className="schedule-overrides-shell__form">
              <BrandInput label="Date" type="date" value={newOverrideDate} onChange={(event) => setNewOverrideDate(event.target.value)} />
              <BrandSelect label="Status" value={newOverrideStatus} onChange={(event) => setNewOverrideStatus(event.target.value as OverrideStatus)}>
                {OVERRIDE_STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </BrandSelect>
              <BrandSelect
                disabled={newOverrideStatus === 'closed'}
                label="Open time"
                value={newOverrideOpenTime}
                onChange={(event) => setNewOverrideOpenTime(event.target.value)}
              >
                {HOURS.map((hour) => <option key={hour} value={hour}>{hour}</option>)}
              </BrandSelect>
              <BrandSelect
                disabled={newOverrideStatus === 'closed'}
                label="Close time"
                value={newOverrideCloseTime}
                onChange={(event) => setNewOverrideCloseTime(event.target.value)}
              >
                {HOURS.map((hour) => <option key={hour} value={hour}>{hour}</option>)}
              </BrandSelect>
            </div>
            <BrandInput
              helperText="Optional context for front desk handoff."
              label="Note"
              value={newOverrideNote}
              onChange={(event) => setNewOverrideNote(event.target.value)}
            />
            <BrandButton size="nav" startIcon={<Plus size={14} />} variant="secondary" onClick={handleAddOverride}>
              Add override
            </BrandButton>
            <div className="schedule-overrides-shell__list">
              {dateOverrides.map((override) => (
                <div key={override.id} className="schedule-overrides-shell__item">
                  <div className="schedule-overrides-shell__item-top">
                    <strong>{formatDateLabel(override.date)}</strong>
                    <Tag text={override.status} />
                  </div>
                  <span>{override.status === 'closed' ? 'Closed all day' : `${override.openTime} - ${override.closeTime}`}</span>
                  <span>{override.note}</span>
                </div>
              ))}
            </div>
          </div>
        </FlowSection>
        <FlowSection eyebrow="Blackout dates" title="Block booking acceptance" description="Reserve dates where no public booking slots should appear.">
          <div className="schedule-blackout-shell">
            <div className="schedule-blackout-shell__form">
              <BrandInput label="Blackout date" type="date" value={newBlackoutDate} onChange={(event) => setNewBlackoutDate(event.target.value)} />
              <BrandButton size="nav" variant="secondary" onClick={handleAddBlackoutDate}>Add date</BrandButton>
            </div>
            <div className="schedule-blackout-shell__list">
              {blackoutDates.map((date) => (
                <span key={date} className="schedule-blackout-shell__tag">{formatDateLabel(date)}</span>
              ))}
            </div>
          </div>
        </FlowSection>
        <FlowSection eyebrow="Timezone and conflicts" title="Calendar safeguards" description="Use this rail to catch timezone drift and date policy conflicts before publish.">
          <div className="schedule-conflict-shell">
            <BrandSelect label="Booking timezone" value={timezone} onChange={(event) => setTimezone(event.target.value)}>
              {timezoneOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </BrandSelect>
            <ReviewBlock items={daySummary} title="Weekly baseline" />
            {conflictMessages.length > 0 ? (
              <div className="schedule-conflict-shell__alerts" role="status">
                {conflictMessages.map((message) => (
                  <div key={message} className="schedule-conflict-shell__alert">
                    <AlertTriangle size={16} />
                    <span>{message}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="schedule-conflict-shell__healthy">
                <Globe2 size={16} />
                <span>No scheduling conflicts detected in this local preview.</span>
              </div>
            )}
            <BrandButton startIcon={<Save size={14} />} onClick={handleSave}>Save all scheduling updates</BrandButton>
          </div>
        </FlowSection>
      </div>
    </OwnerPageScaffold>
  );
}

function formatDateLabel(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }
  return parsed.toLocaleDateString(undefined, { day: 'numeric', month: 'short', weekday: 'short' });
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
