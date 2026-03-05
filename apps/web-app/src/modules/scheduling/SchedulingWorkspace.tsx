import { useEffect, useState } from 'react';
import { AlertTriangle, CalendarDays, ChevronLeft, ChevronRight, Clock3, Globe2, Plus, Save } from 'lucide-react';
import { AppPill, OwnerPageScaffold, PageIntro } from '@/app/components/PageTemplates';
import { RouteStateCard } from '@/app/components/RouteStateCard';
import type { BusinessHourDraft } from '@/domain/hours/types';
import { mockOwnerRouteClient } from '@/features/owner/routeClient';
import {
  SCHEDULING_OVERRIDE_STATUSES,
  ownerSchedulingPersistenceClient,
  type SchedulingOverrideDraft,
  type SchedulingOverrideStatus,
  type SchedulingPersistenceSnapshot,
} from '@/features/owner/scheduling/persistenceClient';
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

interface ConflictHint {
  id: string;
  message: string;
  action: string;
}

export function SchedulingWorkspace() {
  const dashboardResource = mockOwnerRouteClient.getDashboardQuery();
  const businessResource = mockOwnerRouteClient.getBusinessSettingsQuery();
  const toast = useBrandToast();

  const [sessionStatus, setSessionStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [sessionMessage, setSessionMessage] = useState('Loading scheduling data contracts...');

  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [draft, setDraft] = useState<AvailabilityDraft>({
    day: '',
    isOpen: true,
    openTime: '09:00',
    closeTime: '18:00',
  });
  const [weeklyHours, setWeeklyHours] = useState(() => businessResource.status === 'success' ? businessResource.data.businessHours : []);
  const [timezone, setTimezone] = useState(() => businessResource.status === 'success' ? businessResource.data.business.timezone : 'Asia/Manila');
  const [dateOverrides, setDateOverrides] = useState<SchedulingOverrideDraft[]>([]);
  const [blackoutDates, setBlackoutDates] = useState<string[]>([]);
  const [newOverrideDate, setNewOverrideDate] = useState('');
  const [newOverrideStatus, setNewOverrideStatus] = useState<SchedulingOverrideStatus>('closed');
  const [newOverrideOpenTime, setNewOverrideOpenTime] = useState('10:00');
  const [newOverrideCloseTime, setNewOverrideCloseTime] = useState('19:00');
  const [newOverrideNote, setNewOverrideNote] = useState('');
  const [newBlackoutDate, setNewBlackoutDate] = useState('');
  const [saveState, setSaveState] = useState<SaveStateStatus>('saved');
  const [lastSavedLabel, setLastSavedLabel] = useState('Waiting for first save');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [pendingSavePayload, setPendingSavePayload] = useState<SchedulingPersistenceSnapshot | null>(null);

  useEffect(() => {
    let canceled = false;

    async function hydrate() {
      setSessionStatus('loading');
      setSessionMessage('Loading scheduling data contracts...');

      try {
        const snapshot = await ownerSchedulingPersistenceClient.load();

        if (canceled) {
          return;
        }

        setWeeklyHours(snapshot.weeklyHours);
        setTimezone(snapshot.timezone);
        setDateOverrides(snapshot.overrides);
        setBlackoutDates(snapshot.blackoutDates);
        setSelectedDayId(snapshot.weeklyHours[0]?.id ?? null);
        setDraft(getDraftFromHours(snapshot.weeklyHours, snapshot.weeklyHours[0]?.id ?? null));
        setSaveState('saved');
        setLastSavedLabel('Scheduling draft restored');
        setSessionStatus('ready');
      } catch {
        if (canceled) {
          return;
        }

        setSessionStatus('error');
        setSessionMessage('Could not load scheduling data. Retry to restore calendar rules.');
      }
    }

    void hydrate();

    return () => {
      canceled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedDayId) {
      if (weeklyHours[0]) {
        setSelectedDayId(weeklyHours[0].id);
        setDraft(getDraftFromHours(weeklyHours, weeklyHours[0].id));
      }
      return;
    }

    if (!weeklyHours.some((item) => item.id === selectedDayId)) {
      const fallback = weeklyHours[0] ?? null;
      setSelectedDayId(fallback?.id ?? null);
      setDraft(getDraftFromHours(weeklyHours, fallback?.id ?? null));
    }
  }, [selectedDayId, weeklyHours]);

  if (dashboardResource.status === 'loading' || businessResource.status === 'loading' || sessionStatus === 'loading') {
    return <RouteStateCard title="Loading calendar" description="Preparing availability, overrides, and blackout state contracts." variant="loading" />;
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

  if (sessionStatus === 'error') {
    return (
      <RouteStateCard
        title="Scheduling draft unavailable"
        description={sessionMessage}
        variant="error"
        onRetry={retryLoadSnapshot}
      />
    );
  }

  if (weeklyHours.length === 0) {
    return (
      <RouteStateCard
        title="No availability baseline yet"
        description="Start by loading a weekly template so overrides and blackout rules can be evaluated safely."
        variant="empty"
        actions={<BrandButton variant="secondary" onClick={restoreDefaults}>Load default schedule</BrandButton>}
      />
    );
  }

  const { bookings } = dashboardResource.data;
  const { business, teamMembers, timezoneOptions } = businessResource.data;

  const daySummary = weeklyHours.map((item) => ({
    label: item.day,
    value: item.isOpen ? `${item.openTime} - ${item.closeTime}` : 'Closed',
  }));

  const conflictHints: ConflictHint[] = (() => {
    const hints: ConflictHint[] = [];
    const overrideDates = dateOverrides.map((override) => override.date);
    const duplicateOverrideDates = overrideDates.filter((date, index) => overrideDates.indexOf(date) !== index);
    const overlapWithBlackouts = dateOverrides.filter((override) => blackoutDates.includes(override.date));

    if (timezone !== business.timezone) {
      hints.push({
        id: 'timezone-drift',
        message: `Timezone preview changed to ${timezone}. Existing records were configured in ${business.timezone}.`,
        action: `Before publishing, confirm staff calendars and reminders are migrated to ${timezone}.`,
      });
    }

    if (duplicateOverrideDates.length > 0) {
      hints.push({
        id: 'duplicate-overrides',
        message: `Duplicate override rules found for ${[...new Set(duplicateOverrideDates)].join(', ')}.`,
        action: 'Keep one override policy per date to avoid conflicting open/close windows.',
      });
    }

    if (overlapWithBlackouts.length > 0) {
      hints.push({
        id: 'blackout-overlap',
        message: `Override rules overlap with blackout dates on ${overlapWithBlackouts.map((item) => formatDateLabel(item.date)).join(', ')}.`,
        action: 'Remove either the override or blackout entry so booking visibility is deterministic.',
      });
    }

    return hints;
  })();

  function getCurrentSnapshot(overrides: SchedulingOverrideDraft[] = dateOverrides, blackout: string[] = blackoutDates, hours = weeklyHours, zone = timezone) {
    return {
      timezone: zone,
      weeklyHours: hours,
      overrides,
      blackoutDates: blackout,
    } satisfies SchedulingPersistenceSnapshot;
  }

  function syncDraft(dayId: string) {
    setSelectedDayId(dayId);
    setDraft(getDraftFromHours(weeklyHours, dayId));
    setErrors({});
  }

  function markDirty() {
    setSaveState('idle');
  }

  function setField<K extends keyof AvailabilityDraft>(field: K, value: AvailabilityDraft[K]) {
    const nextDraft = { ...draft, [field]: value };
    setDraft(nextDraft);
    markDirty();
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

  async function saveSnapshot(snapshot: SchedulingPersistenceSnapshot, successMessage: string) {
    setSaveState('saving');
    setPendingSavePayload(snapshot);

    try {
      const result = await ownerSchedulingPersistenceClient.save(snapshot);
      const savedTimeLabel = new Date(result.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setSaveState('saved');
      setPendingSavePayload(null);
      setLastSavedLabel(`Saved at ${savedTimeLabel}`);
      toast.success({
        title: 'Scheduling updates saved',
        description: successMessage,
      });
    } catch {
      setSaveState('failed');
      toast.error({
        title: 'Save failed',
        description: 'Retry to persist availability, overrides, and blackout rules.',
      });
    }
  }

  function handleSaveAvailability() {
    const nextErrors = validateAvailabilityForm(draft);
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    if (!selectedDayId) {
      return;
    }

    const nextWeeklyHours = weeklyHours.map((item) => (item.id === selectedDayId ? { ...item, ...draft } : item));
    setWeeklyHours(nextWeeklyHours);

    void saveSnapshot(
      getCurrentSnapshot(dateOverrides, blackoutDates, nextWeeklyHours, timezone),
      `${draft.day} now runs ${draft.isOpen ? `${draft.openTime} to ${draft.closeTime}` : 'as closed'} in ${timezone}.`,
    );
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

    const nextOverride: SchedulingOverrideDraft = {
      id: `ovr-${Date.now()}`,
      date: newOverrideDate,
      status: newOverrideStatus,
      openTime: newOverrideOpenTime,
      closeTime: newOverrideCloseTime,
      note: newOverrideNote.trim() || 'No note added',
    };

    const nextOverrides = [...dateOverrides, nextOverride];
    setDateOverrides(nextOverrides);
    setNewOverrideDate('');
    setNewOverrideNote('');
    markDirty();
    toast.info({
      title: 'Override draft added',
      description: `${formatDateLabel(nextOverride.date)} is queued and ready to save.`,
    });
  }

  function handleRemoveOverride(overrideId: string) {
    const nextOverrides = dateOverrides.filter((override) => override.id !== overrideId);
    setDateOverrides(nextOverrides);
    markDirty();
  }

  function handleAddBlackoutDate() {
    if (!newBlackoutDate || blackoutDates.includes(newBlackoutDate)) {
      return;
    }

    const nextDates = [...blackoutDates, newBlackoutDate];
    setBlackoutDates(nextDates);
    setNewBlackoutDate('');
    markDirty();
  }

  function handleRemoveBlackoutDate(date: string) {
    const nextDates = blackoutDates.filter((entry) => entry !== date);
    setBlackoutDates(nextDates);
    markDirty();
  }

  function handleTimezoneChange(nextTimezone: string) {
    setTimezone(nextTimezone);
    markDirty();
  }

  function handleSaveAll() {
    void saveSnapshot(
      getCurrentSnapshot(),
      `Timezone, overrides, and blackout rules are now aligned to ${timezone}.`,
    );
  }

  function retrySave() {
    if (!pendingSavePayload) {
      return;
    }

    void saveSnapshot(
      pendingSavePayload,
      `Scheduling rules are now aligned to ${pendingSavePayload.timezone}.`,
    );
  }

  function restoreDefaults() {
    const defaults = ownerSchedulingPersistenceClient.createDefaultSnapshot();
    setWeeklyHours(defaults.weeklyHours);
    setTimezone(defaults.timezone);
    setDateOverrides(defaults.overrides);
    setBlackoutDates(defaults.blackoutDates);
    setSelectedDayId(defaults.weeklyHours[0]?.id ?? null);
    setDraft(getDraftFromHours(defaults.weeklyHours, defaults.weeklyHours[0]?.id ?? null));
    setSaveState('idle');
    setLastSavedLabel('Default schedule loaded');
  }

  function retryLoadSnapshot() {
    setSessionStatus('loading');
    setSessionMessage('Retrying scheduling contract load...');
    setTimeout(() => {
      window.location.reload();
    }, 10);
  }

  return (
    <OwnerPageScaffold>
      <PageIntro
        eyebrow="Scheduling"
        title="Availability management"
        description="Manage weekly hours, date overrides, and blackout rules through integration-facing scheduling contracts."
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
            <AppPill>Timezone: {timezone}</AppPill>
            <SaveStateIndicator status={saveState} savedLabel={lastSavedLabel} onRetry={retrySave} />
          </>
        )}
      />

      <div className="schedule-workspace-grid">
        <FlowSection eyebrow="Weekly schedule" title="Operations grid" description={`Scan weekday windows and edit each day with ${timezone} booking context.`}>
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

        <FlowSection eyebrow="Availability rules" title="Daily operating window" description="Validation is deterministic and save outcomes always report explicit success or failure.">
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
            <BrandButton startIcon={<Clock3 size={15} />} onClick={handleSaveAvailability}>
              Save availability
            </BrandButton>
          </div>
        </FlowSection>

        <FlowSection eyebrow="Upcoming bookings" title="This week's active schedule" description="Keep active booking context visible while updating availability rules.">
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

        <FlowSection eyebrow="Date overrides" title="Special date windows" description="Override entries now use integration-facing state and are saved together with weekly hours.">
          <div className="schedule-overrides-shell">
            <div className="schedule-overrides-shell__form">
              <BrandInput label="Date" type="date" value={newOverrideDate} onChange={(event) => setNewOverrideDate(event.target.value)} />
              <BrandSelect label="Status" value={newOverrideStatus} onChange={(event) => setNewOverrideStatus(event.target.value as SchedulingOverrideStatus)}>
                {SCHEDULING_OVERRIDE_STATUSES.map((status) => (
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
                  <BrandButton size="nav" variant="secondary" onClick={() => handleRemoveOverride(override.id)}>Remove</BrandButton>
                </div>
              ))}
            </div>
          </div>
        </FlowSection>

        <FlowSection eyebrow="Blackout dates" title="Block booking acceptance" description={`These dates prevent slot publishing in ${timezone} until removed.`}>
          <div className="schedule-blackout-shell">
            <div className="schedule-blackout-shell__form">
              <BrandInput label="Blackout date" type="date" value={newBlackoutDate} onChange={(event) => setNewBlackoutDate(event.target.value)} />
              <BrandButton size="nav" variant="secondary" onClick={handleAddBlackoutDate}>Add date</BrandButton>
            </div>
            <div className="schedule-blackout-shell__list">
              {blackoutDates.map((date) => (
                <button key={date} type="button" className="schedule-blackout-shell__tag" onClick={() => handleRemoveBlackoutDate(date)}>
                  {formatDateLabel(date)}
                </button>
              ))}
            </div>
          </div>
        </FlowSection>

        <FlowSection eyebrow="Timezone and conflicts" title="Calendar safeguards" description="Conflict guidance now includes concrete actions before publish.">
          <div className="schedule-conflict-shell">
            <BrandSelect label="Booking timezone" value={timezone} onChange={(event) => handleTimezoneChange(event.target.value)}>
              {timezoneOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </BrandSelect>
            <ReviewBlock items={daySummary} title="Weekly baseline" />
            {conflictHints.length > 0 ? (
              <div className="schedule-conflict-shell__alerts" role="status" aria-live="polite">
                {conflictHints.map((hint) => (
                  <div key={hint.id} className="schedule-conflict-shell__alert">
                    <AlertTriangle size={16} />
                    <div className="schedule-conflict-shell__alert-copy">
                      <strong>{hint.message}</strong>
                      <span>{hint.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="schedule-conflict-shell__healthy">
                <Globe2 size={16} />
                <span>No scheduling conflicts detected for {timezone}.</span>
              </div>
            )}
            <BrandButton startIcon={<Save size={14} />} onClick={handleSaveAll}>Save all scheduling updates</BrandButton>
          </div>
        </FlowSection>
      </div>
    </OwnerPageScaffold>
  );
}

function getDraftFromHours(hours: BusinessHourDraft[], dayId: string | null): AvailabilityDraft {
  const selected = dayId ? hours.find((item) => item.id === dayId) : hours[0];

  return {
    day: selected?.day ?? '',
    isOpen: selected?.isOpen ?? true,
    openTime: selected?.openTime ?? '09:00',
    closeTime: selected?.closeTime ?? '18:00',
  };
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



