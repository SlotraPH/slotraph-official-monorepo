import { Building2, Mail, MapPin, Phone, Save } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { RouteStateCard } from '@/app/components/RouteStateCard';
import { getOwnerBusinessSettingsResource } from '@/features/owner/data';
import { useUnsavedChangesGuard } from '@/features/forms/useUnsavedChangesGuard';
import { ownerSettingsPersistenceClient } from '@/features/owner/settings/persistenceClient';
import { BrandButton, BrandInput, BrandSelect, BrandTextarea, Card, SaveStateIndicator, useBrandToast, type SaveStateStatus } from '@/ui';

export function BusinessProfilePage() {
  const toast = useBrandToast();
  const resource = getOwnerBusinessSettingsResource();
  const business = resource.status === 'ready' ? resource.data.business : null;
  const timezoneOptions = resource.status === 'ready' ? resource.data.timezoneOptions : ['Asia/Manila'];

  const [phone, setPhone] = useState(() => business?.phone ?? '');
  const [email, setEmail] = useState(() => business?.email ?? '');
  const [address, setAddress] = useState(() => business?.address ?? '');
  const [timezone, setTimezone] = useState(() => business?.timezone ?? 'Asia/Manila');
  const [businessNotes, setBusinessNotes] = useState(() => business?.arrivalNotes ?? '');
  const [saveState, setSaveState] = useState<SaveStateStatus>('saved');
  const [lastSaved, setLastSaved] = useState('Saved');
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useUnsavedChangesGuard(saveState === 'idle' || saveState === 'failed');

  const emailError = useMemo(() => {
    if (!email.trim()) {
      return 'Business email is required.';
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      return 'Use a valid email format.';
    }
    return '';
  }, [email]);

  const phoneError = useMemo(() => (!phone.trim() ? 'Phone is required.' : ''), [phone]);
  const addressError = useMemo(() => (!address.trim() ? 'Address is required.' : ''), [address]);

  function markDirty() {
    setSaveState('idle');
  }

  async function loadBusinessDraft() {
    setLoading(true);
    setLoadingError('');

    try {
      const snapshot = await ownerSettingsPersistenceClient.loadSnapshot();
      setPhone(snapshot.business.phone);
      setEmail(snapshot.business.email);
      setAddress(snapshot.business.address);
      setTimezone(snapshot.business.timezone);
      setBusinessNotes(snapshot.business.arrivalNotes);
      setSaveState('saved');
      setLastSaved('Draft restored');
      setSubmitAttempted(false);
    } catch {
      setLoadingError('Could not load business profile draft. Retry to continue.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadBusinessDraft();
  }, []);

  async function handleSaveProfile() {
    setSubmitAttempted(true);
    if (emailError || phoneError || addressError) {
      setSaveState('failed');
      return;
    }

    setSaveState('saving');
    try {
      await ownerSettingsPersistenceClient.saveBusiness({
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        timezone,
        arrivalNotes: businessNotes.trim(),
      });
      setLastSaved(`Saved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      setSaveState('saved');
      toast.success({
        title: 'Business profile saved',
        description: 'Contact details and operations notes were updated in this workspace draft.',
      });
    } catch {
      setSaveState('failed');
      toast.error({
        title: 'Save failed',
        description: 'Business profile was not saved. Retry to keep your latest changes.',
      });
    }
  }

  if (loading) {
    return <RouteStateCard title="Loading business settings" description="Preparing your saved business profile draft." variant="loading" />;
  }

  if (loadingError) {
    return <RouteStateCard title="Business settings unavailable" description={loadingError} variant="error" onRetry={() => void loadBusinessDraft()} />;

  function markDirty() {
    setSaveState('idle');
  }

  function handleSaveProfile() {
    setSaveState('saving');
    setLastSaved(`Saved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    setSaveState('saved');
    toast.success({
      title: 'Business profile saved',
      description: 'Contact details and operations notes were updated in this workspace draft.',
    });
  }

  return (
    <div className="settings-workspace-grid">
      <Card className="settings-surface-card" padding={5}>
        <div className="settings-surface-card__header settings-surface-card__header--compact">
          <div>
            <span className="settings-surface-card__eyebrow">Business profile</span>
            <h2 className="settings-surface-card__title">Core contact and location details</h2>
            <p className="settings-surface-card__description">
              Keep information consistent across booking pages, notifications, and staff operations.
            </p>
          </div>
          <Building2 size={16} aria-hidden="true" />
        </div>

        <div className="settings-form-grid settings-form-grid--two">
          <BrandInput
            label="Phone"
            value={phone}
            onChange={(event) => { setPhone(event.target.value); markDirty(); }}
            error={submitAttempted ? phoneError || undefined : undefined}
            helperText="Used in reminder templates and customer support cards."
            leadingIcon={Phone}
          />
          <BrandInput
            label="Email"
            value={email}
            onChange={(event) => { setEmail(event.target.value); markDirty(); }}
            error={submitAttempted ? emailError || undefined : undefined}
            helperText="Primary owner inbox for escalations and receipts."
            leadingIcon={Mail}
          />
          <BrandInput
            label="Address"
            value={address}
            onChange={(event) => { setAddress(event.target.value); markDirty(); }}
            error={submitAttempted ? addressError || undefined : undefined}
            helperText="Displayed on booking confirmation summaries."
            leadingIcon={MapPin}
          />
          <BrandSelect
            label="Timezone"
            value={timezone}
            onChange={(event) => { setTimezone(event.target.value); markDirty(); }}
            helperText="Used for booking windows and notification schedules."
          >
            {timezoneOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </BrandSelect>
        </div>

        <BrandTextarea
          label="Arrival notes"
          rows={3}
          value={businessNotes}
          onChange={(event) => { setBusinessNotes(event.target.value); markDirty(); }}
          helperText="Add parking, landmark, or check-in notes shown before checkout."
        />

        <div className="settings-button-row settings-button-row--end">
          <SaveStateIndicator status={saveState} savedLabel={lastSaved} onRetry={() => void handleSaveProfile()} />
          <BrandButton startIcon={<Save size={14} />} onClick={() => void handleSaveProfile()} disabled={saveState === 'saving'}>Save business profile</BrandButton>
          <SaveStateIndicator status={saveState} savedLabel={lastSaved} onRetry={handleSaveProfile} />
          <BrandButton startIcon={<Save size={14} />} onClick={handleSaveProfile}>Save business profile</BrandButton>
        </div>
      </Card>
    </div>
  );
}
