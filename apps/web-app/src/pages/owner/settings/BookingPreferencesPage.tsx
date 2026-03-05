import { ArrowDown, ArrowUp, Monitor, Save, Smartphone } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { RouteStateCard } from '@/app/components/RouteStateCard';
import { getOwnerBusinessSettingsResource, getOwnerPaymentsResource } from '@/features/owner/data';
import { useUnsavedChangesGuard } from '@/features/forms/useUnsavedChangesGuard';
import { ownerSettingsPersistenceClient } from '@/features/owner/settings/persistenceClient';
import { BrandButton, BrandInput, BrandSelect, BrandTextarea, Card, SaveStateIndicator, useBrandToast, type SaveStateStatus } from '@/ui';

interface BuilderSection {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface IntakeField {
  id: string;
  label: string;
  placeholder: string;
  enabled: boolean;
  required: boolean;
}

export function BookingPreferencesPage() {
  const toast = useBrandToast();
  const paymentsResource = getOwnerPaymentsResource();
  const businessResource = getOwnerBusinessSettingsResource();
  const preferences = paymentsResource.status === 'ready' ? paymentsResource.data.bookingPreferences : null;
  const businessName = businessResource.status === 'ready' ? businessResource.data.business.name : 'Your business';
  const [leadTime, setLeadTime] = useState(() => preferences?.leadTime ?? '2 hours');
  const [cancellationWindow, setCancellationWindow] = useState(() => preferences?.cancellationWindow ?? '12 hours');
  const [bookingApproval, setBookingApproval] = useState(() => preferences?.bookingApproval ?? 'Manual review');
  const [heroHeadline, setHeroHeadline] = useState(`Book with ${businessName}`);
  const [heroSubcopy, setHeroSubcopy] = useState('Fast confirmations, clear policies, and a branded checkout experience.');
  const [saveState, setSaveState] = useState<SaveStateStatus>('saved');
  const [lastSaved, setLastSaved] = useState('Auto-saved 3m ago');
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [heroHeadlineTouched, setHeroHeadlineTouched] = useState(false);
  const [heroSubcopyTouched, setHeroSubcopyTouched] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [sections, setSections] = useState<BuilderSection[]>([
    { id: 'hero', label: 'Hero', description: 'Headline, trust badges, and CTA.', enabled: true },
    { id: 'services', label: 'Services', description: 'Service cards and durations.', enabled: true },
    { id: 'policies', label: 'Policies', description: 'Lead time, cancellation, and no-show policy.', enabled: true },
    { id: 'faq', label: 'FAQ', description: 'Common booking questions before checkout.', enabled: true },
    { id: 'staff', label: 'Staff highlight', description: 'Optional staff profiles and specialties.', enabled: false },
  ]);
  const [intakeFields, setIntakeFields] = useState<IntakeField[]>([
    { id: 'full-name', label: 'Full name', placeholder: 'Enter your full name', enabled: true, required: true },
    { id: 'mobile', label: 'Mobile number', placeholder: '09xx xxx xxxx', enabled: true, required: true },
    { id: 'email', label: 'Email address', placeholder: 'name@email.com', enabled: true, required: false },
    { id: 'notes', label: 'Booking notes', placeholder: 'Allergies, preferences, or requests', enabled: true, required: false },
  ]);

  const enabledSections = useMemo(() => sections.filter((section) => section.enabled), [sections]);
  const heroHeadlineError = useMemo(() => (!heroHeadline.trim() ? 'Hero headline is required.' : ''), [heroHeadline]);
  const heroSubcopyError = useMemo(() => {
    if (!heroSubcopy.trim()) {
      return 'Hero subcopy is required.';
    }
    if (heroSubcopy.trim().length < 24) {
      return 'Hero subcopy should be at least 24 characters.';
    }
    return '';
  }, [heroSubcopy]);

  function markDirty() {
    setSaveState('idle');
  }

  useUnsavedChangesGuard(saveState === 'idle' || saveState === 'failed');

  async function loadBookingDraft() {
    setLoading(true);
    setLoadingError('');

    try {
      const snapshot = await ownerSettingsPersistenceClient.loadSnapshot();
      setLeadTime(snapshot.booking.leadTime);
      setCancellationWindow(snapshot.booking.cancellationWindow);
      setBookingApproval(snapshot.booking.bookingApproval);
      setHeroHeadline(snapshot.booking.heroHeadline);
      setHeroSubcopy(snapshot.booking.heroSubcopy);
      setSections(snapshot.booking.sections);
      setIntakeFields(snapshot.booking.intakeFields);
      setSaveState('saved');
      setLastSaved('Draft restored');
      setSubmitAttempted(false);
      setHeroHeadlineTouched(false);
      setHeroSubcopyTouched(false);
    } catch {
      setLoadingError('Could not load booking settings draft. Retry to continue.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadBookingDraft();
  }, []);

  function moveSection(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= sections.length) {
      return;
    }
    const nextSections = [...sections];
    const [moved] = nextSections.splice(index, 1);
    if (!moved) {
      return;
    }
    nextSections.splice(nextIndex, 0, moved);
    setSections(nextSections);
    markDirty();
  }

  function toggleSectionEnabled(sectionId: string) {
    setSections((currentSections) => currentSections.map((section) => (
      section.id === sectionId ? { ...section, enabled: !section.enabled } : section
    )));
    markDirty();
  }

  function updateIntakeField(fieldId: string, patch: Partial<IntakeField>) {
    setIntakeFields((currentFields) => currentFields.map((field) => (
      field.id === fieldId ? { ...field, ...patch } : field
    )));
    markDirty();
  }

  async function handleSave() {
    setSubmitAttempted(true);
    if (heroHeadlineError || heroSubcopyError) {
      setSaveState('failed');
      return;
    }

    setSaveState('saving');
    try {
      await ownerSettingsPersistenceClient.saveBooking({
        leadTime,
        cancellationWindow,
        bookingApproval,
        heroHeadline: heroHeadline.trim(),
        heroSubcopy: heroSubcopy.trim(),
        sections,
        intakeFields,
      });
      setLastSaved(`Saved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      setSaveState('saved');
      toast.success({
        title: 'Booking page draft saved',
        description: 'Section order, intake fields, and preview copy were saved in this local workspace.',
      });
    } catch {
      setSaveState('failed');
      toast.error({
        title: 'Save failed',
        description: 'Booking settings were not saved. Retry to keep your latest changes.',
      });
    }
  }

  if (loading) {
    return <RouteStateCard title="Loading booking settings" description="Preparing booking page builder drafts." variant="loading" />;
  }

  if (loadingError) {
    return <RouteStateCard title="Booking settings unavailable" description={loadingError} variant="error" onRetry={() => void loadBookingDraft()} />;
  }

  return (
    <div className="booking-builder-layout">
      <div className="booking-builder-main">
        <Card className="booking-builder-card">
          <div className="booking-builder-card__header">
            <div>
              <span className="booking-builder-card__eyebrow">Booking page sections</span>
              <h2 className="booking-builder-card__title">Toggle and reorder content blocks</h2>
              <p className="booking-builder-card__description">
                Manage the customer-facing structure for hero, services, policies, FAQ, and optional staff sections.
              </p>
            </div>
            <SaveStateIndicator status={saveState} savedLabel={lastSaved} onRetry={() => void handleSave()} />
          </div>
          <div className="booking-builder-section-list">
            {sections.map((section, index) => (
              <div key={section.id} className="booking-builder-section-row">
                <div className="booking-builder-section-row__main">
                  <input
                    checked={section.enabled}
                    className="booking-builder-checkbox"
                    type="checkbox"
                    onChange={() => toggleSectionEnabled(section.id)}
                  />
                  <div>
                    <strong>{section.label}</strong>
                    <p>{section.description}</p>
                  </div>
                </div>
                <div className="booking-builder-section-row__actions">
                  <BrandButton
                    aria-label={`Move ${section.label} up`}
                    disabled={index === 0}
                    size="nav"
                    variant="secondary"
                    onClick={() => moveSection(index, -1)}
                  >
                    <ArrowUp size={14} />
                  </BrandButton>
                  <BrandButton
                    aria-label={`Move ${section.label} down`}
                    disabled={index === sections.length - 1}
                    size="nav"
                    variant="secondary"
                    onClick={() => moveSection(index, 1)}
                  >
                    <ArrowDown size={14} />
                  </BrandButton>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="booking-builder-card">
          <div className="booking-builder-card__header">
            <div>
              <span className="booking-builder-card__eyebrow">Intake form</span>
              <h2 className="booking-builder-card__title">Configure customer fields</h2>
              <p className="booking-builder-card__description">Adjust labels, visibility, and required rules for booking intake.</p>
            </div>
          </div>
          <div className="booking-builder-intake-list">
            {intakeFields.map((field) => (
              <div key={field.id} className="booking-builder-intake-row">
              <BrandInput
                label="Label"
                value={field.label}
                onChange={(event) => updateIntakeField(field.id, { label: event.target.value })}
              />
                <BrandInput
                  label="Placeholder"
                  value={field.placeholder}
                  onChange={(event) => updateIntakeField(field.id, { placeholder: event.target.value })}
                />
                <label className="booking-builder-toggle">
                  <input
                    checked={field.enabled}
                    className="booking-builder-checkbox"
                    type="checkbox"
                    onChange={(event) => updateIntakeField(field.id, { enabled: event.target.checked })}
                  />
                  <span>Visible</span>
                </label>
                <label className="booking-builder-toggle">
                  <input
                    checked={field.required}
                    className="booking-builder-checkbox"
                    type="checkbox"
                    onChange={(event) => updateIntakeField(field.id, { required: event.target.checked })}
                  />
                  <span>Required</span>
                </label>
              </div>
            ))}
          </div>
        </Card>

        <Card className="booking-builder-card">
          <div className="booking-builder-card__header">
            <div>
              <span className="booking-builder-card__eyebrow">Copy and policies</span>
              <h2 className="booking-builder-card__title">Booking page text controls</h2>
            </div>
          </div>
          <div className="booking-builder-copy-grid">
            <BrandInput
              label="Hero headline"
              value={heroHeadline}
              onBlur={() => setHeroHeadlineTouched(true)}
              error={(heroHeadlineTouched || submitAttempted) ? heroHeadlineError || undefined : undefined}
              onChange={(event) => {
                setHeroHeadline(event.target.value);
                markDirty();
              }}
            />
            <BrandTextarea
              label="Hero subcopy"
              value={heroSubcopy}
              onBlur={() => setHeroSubcopyTouched(true)}
              error={(heroSubcopyTouched || submitAttempted) ? heroSubcopyError || undefined : undefined}
              onChange={(event) => {
                setHeroSubcopy(event.target.value);
                markDirty();
              }}
            />
            <BrandSelect
              label="Minimum lead time"
              value={leadTime}
              onChange={(event) => {
                setLeadTime(event.target.value);
                markDirty();
              }}
            >
              <option value="2 hours">2 hours</option>
              <option value="6 hours">6 hours</option>
              <option value="1 day">1 day</option>
            </BrandSelect>
            <BrandSelect
              label="Cancellation window"
              value={cancellationWindow}
              onChange={(event) => {
                setCancellationWindow(event.target.value);
                markDirty();
              }}
            >
              <option value="12 hours">12 hours</option>
              <option value="24 hours">24 hours</option>
              <option value="48 hours">48 hours</option>
            </BrandSelect>
            <BrandSelect
              label="Approval flow"
              value={bookingApproval}
              onChange={(event) => {
                setBookingApproval(event.target.value);
                markDirty();
              }}
            >
              <option value="Manual review">Manual review</option>
              <option value="Auto-approve public slots">Auto-approve public slots</option>
            </BrandSelect>
          </div>
          <div className="booking-builder-actions">
            <BrandButton startIcon={<Save size={14} />} onClick={() => void handleSave()} disabled={saveState === 'saving'}>Save booking page draft</BrandButton>
          </div>
        </Card>
      </div>

      <Card className="booking-builder-preview-card">
        <div className="booking-builder-card__header">
          <div>
            <span className="booking-builder-card__eyebrow">Preview</span>
            <h2 className="booking-builder-card__title">Customer-facing shell</h2>
          </div>
          <div className="booking-builder-preview-mode">
            <BrandButton
              size="nav"
              variant={previewMode === 'desktop' ? 'primary' : 'secondary'}
              onClick={() => setPreviewMode('desktop')}
            >
              <Monitor size={14} />
            </BrandButton>
            <BrandButton
              size="nav"
              variant={previewMode === 'mobile' ? 'primary' : 'secondary'}
              onClick={() => setPreviewMode('mobile')}
            >
              <Smartphone size={14} />
            </BrandButton>
          </div>
        </div>
        <div className={`booking-builder-preview-shell booking-builder-preview-shell--${previewMode}`}>
          <div className="booking-builder-preview-shell__hero">
            <strong>{heroHeadline}</strong>
            <span>{heroSubcopy}</span>
          </div>
          <div className="booking-builder-preview-shell__section-list">
            {enabledSections.map((section) => (
              <span key={section.id}>{section.label}</span>
            ))}
          </div>
          <div className="booking-builder-preview-shell__intake">
            {intakeFields.filter((field) => field.enabled).map((field) => (
              <div key={field.id} className="booking-builder-preview-shell__field">
                <strong>{field.label}</strong>
                <span>{field.placeholder}{field.required ? ' *' : ''}</span>
              </div>
            ))}
          </div>
          <p className="booking-builder-preview-shell__policy">
            Lead time: {leadTime} | Cancellation: {cancellationWindow} | Approval: {bookingApproval}
          </p>
        </div>
      </Card>
    </div>
  );
}
