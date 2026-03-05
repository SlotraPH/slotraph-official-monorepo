import { Bell, Mail, MessageSquare, Save } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { RouteStateCard } from '@/app/components/RouteStateCard';
import { useUnsavedChangesGuard } from '@/features/forms/useUnsavedChangesGuard';
import { ownerSettingsPersistenceClient } from '@/features/owner/settings/persistenceClient';
import { BrandButton, BrandInput, BrandSelect, BrandTextarea, Card, SaveStateIndicator, useBrandToast, type SaveStateStatus } from '@/ui';

interface NotificationTrigger {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const INITIAL_TRIGGERS: NotificationTrigger[] = [
  {
    id: 'confirmations',
    label: 'Booking confirmations',
    description: 'Send confirmation immediately after approval.',
    enabled: true,
  },
  {
    id: 'reminders',
    label: 'Reminder sequence',
    description: 'Send reminders 24 hours and 2 hours before service time.',
    enabled: true,
  },
  {
    id: 'cancellations',
    label: 'Cancellation alerts',
    description: 'Notify staff and customers when booking status changes.',
    enabled: true,
  },
  {
    id: 'daily-digest',
    label: 'Daily owner digest',
    description: 'Summarize bookings, no-shows, and payout status every evening.',
    enabled: false,
  },
];

export function NotificationsSettingsPage() {
  const toast = useBrandToast();
  const [triggers, setTriggers] = useState(INITIAL_TRIGGERS);
  const [channel, setChannel] = useState('Email + SMS');
  const [subject, setSubject] = useState('Your booking with Slotra is confirmed');
  const [message, setMessage] = useState('Hi {{customer_name}}, your appointment for {{service_name}} is confirmed on {{appointment_time}}. Reply if you need to reschedule.');
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState('');
  const [saveState, setSaveState] = useState<SaveStateStatus>('saved');
  const [lastSaved, setLastSaved] = useState('Waiting for first save');
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [subjectTouched, setSubjectTouched] = useState(false);
  const [messageTouched, setMessageTouched] = useState(false);

  useUnsavedChangesGuard(saveState === 'idle' || saveState === 'failed');

  const subjectError = useMemo(() => {
    if (!subject.trim()) {
      return 'Add a subject line so the template can be saved.';
    }
    if (subject.trim().length < 8) {
      return 'Subject should be at least 8 characters.';
    }
    return '';
  }, [subject]);

  const messageError = useMemo(() => {
    if (!message.trim()) {
      return 'Template message cannot be empty.';
    }
    if (message.trim().length < 24) {
      return 'Template message should be at least 24 characters.';
    }
    return '';
  }, [message]);

  function markDirty() {
    setSaveState('idle');
  }

  async function loadNotificationsDraft() {
    setLoading(true);
    setLoadingError('');

    try {
      const snapshot = await ownerSettingsPersistenceClient.loadSnapshot();
      setTriggers(snapshot.notifications.triggers);
      setChannel(snapshot.notifications.channel);
      setSubject(snapshot.notifications.subject);
      setMessage(snapshot.notifications.message);
      setSaveState('saved');
      setLastSaved('Draft restored');
      setSubmitAttempted(false);
      setSubjectTouched(false);
      setMessageTouched(false);
    } catch {
      setLoadingError('Could not load notifications draft. Retry to continue.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadNotificationsDraft();
  }, []);

  function toggleTrigger(triggerId: string) {
    setTriggers((current) => current.map((trigger) => (
      trigger.id === triggerId ? { ...trigger, enabled: !trigger.enabled } : trigger
    )));
    markDirty();
  }

  async function handleSaveTemplates() {
    setSubmitAttempted(true);
    if (subjectError || messageError) {
      setSaveState('failed');
      toast.error({
        title: 'Template not saved',
        description: subjectError || messageError,
      });
      return;
    }

    setSaveState('saving');
    try {
      await ownerSettingsPersistenceClient.saveNotifications({
        triggers,
        channel,
        subject: subject.trim(),
        message: message.trim(),
      });
      setSaveState('saved');
      setLastSaved(`Saved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      toast.success({
        title: 'Notification settings saved',
        description: 'Trigger defaults and template draft were updated in this workspace preview.',
      });
    } catch {
      setSaveState('failed');
      toast.error({
        title: 'Save failed',
        description: 'Notification settings were not saved. Retry to keep your latest changes.',
      });
    }
  }

  if (loading) {
    return <RouteStateCard title="Loading notification settings" description="Preparing trigger and template drafts." variant="loading" />;
  }

  if (loadingError) {
    return <RouteStateCard title="Notification settings unavailable" description={loadingError} variant="error" onRetry={() => void loadNotificationsDraft()} />;
  }

  return (
    <div className="settings-workspace-grid">
      <Card className="settings-surface-card" padding={5}>
        <div className="settings-surface-card__header">
          <div>
            <span className="settings-surface-card__eyebrow">Trigger defaults</span>
            <h2 className="settings-surface-card__title">Control when customer notifications fire</h2>
            <p className="settings-surface-card__description">
              Enable only the event triggers your team can support consistently.
            </p>
          </div>
          <span className="settings-status-pill settings-status-pill--info">{triggers.filter((trigger) => trigger.enabled).length} active</span>
        </div>

        <div className="notification-trigger-list">
          {triggers.map((trigger) => (
            <label key={trigger.id} className="notification-trigger-item">
              <div>
                <p className="notification-trigger-item__label">{trigger.label}</p>
                <p className="notification-trigger-item__description">{trigger.description}</p>
              </div>
              <input
                checked={trigger.enabled}
                className="settings-checkbox"
                type="checkbox"
                onChange={() => toggleTrigger(trigger.id)}
              />
            </label>
          ))}
        </div>
      </Card>

      <Card className="settings-surface-card" padding={5}>
        <div className="settings-surface-card__header settings-surface-card__header--compact">
          <div>
            <span className="settings-surface-card__eyebrow">Template editor</span>
            <h2 className="settings-surface-card__title">Draft message copy by channel</h2>
          </div>
        </div>

        <div className="settings-form-grid settings-form-grid--two">
          <BrandSelect
            label="Channel"
            helperText="Select where this template is used by default."
            value={channel}
            onChange={(event) => {
              setChannel(event.target.value);
              markDirty();
            }}
          >
            <option value="Email + SMS">Email + SMS</option>
            <option value="Email only">Email only</option>
            <option value="SMS only">SMS only</option>
          </BrandSelect>
          <BrandInput
            label="Message subject"
            value={subject}
            onBlur={() => setSubjectTouched(true)}
            onChange={(event) => {
              setSubject(event.target.value);
              markDirty();
            }}
            error={(subjectTouched || submitAttempted) ? subjectError || undefined : undefined}
            helperText="Use placeholders like {{customer_name}} and {{service_name}}."
          />
        </div>

        <BrandTextarea
          label="Template body"
          value={message}
          onBlur={() => setMessageTouched(true)}
          onChange={(event) => {
            setMessage(event.target.value);
            markDirty();
          }}
          error={(messageTouched || submitAttempted) ? messageError || undefined : undefined}
          helperText="Keep the first sentence clear for preview snippets and SMS truncation."
        />

        <div className="settings-button-row settings-button-row--end">
          <SaveStateIndicator status={saveState} savedLabel={lastSaved} onRetry={() => void handleSaveTemplates()} />
          <BrandButton startIcon={<Save size={14} />} onClick={() => void handleSaveTemplates()} disabled={saveState === 'saving'}>Save notification defaults</BrandButton>
        </div>
      </Card>

      <div className="notification-preview-grid">
        <Card className="settings-surface-card notification-preview-card" padding={4}>
          <div className="notification-preview-card__header">
            <Mail size={16} aria-hidden="true" />
            <strong>Email preview</strong>
          </div>
          <p className="notification-preview-card__subject">{subject || 'Subject placeholder'}</p>
          <p className="notification-preview-card__body">{message || 'Template preview appears here when content is added.'}</p>
        </Card>

        <Card className="settings-surface-card notification-preview-card" padding={4}>
          <div className="notification-preview-card__header">
            <MessageSquare size={16} aria-hidden="true" />
            <strong>SMS preview</strong>
          </div>
          <p className="notification-preview-card__body">{message.slice(0, 120)}{message.length > 120 ? '...' : ''}</p>
        </Card>

        <Card className="settings-surface-card notification-preview-card" padding={4}>
          <div className="notification-preview-card__header">
            <Bell size={16} aria-hidden="true" />
            <strong>Owner digest preview</strong>
          </div>
          <p className="notification-preview-card__body">Tomorrow: 8 bookings, 2 deposits due, 1 pending confirmation.</p>
        </Card>
      </div>
    </div>
  );
}
