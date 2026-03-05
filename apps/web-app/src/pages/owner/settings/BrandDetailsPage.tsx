import { useEffect, useMemo, useState } from 'react';
import { Button, FormField, Select, Textarea } from '@slotra/ui';
import { RouteStateCard } from '@/app/components/RouteStateCard';
import { useUnsavedChangesGuard } from '@/features/forms/useUnsavedChangesGuard';
import { ownerSettingsPersistenceClient } from '@/features/owner/settings/persistenceClient';
import { SaveStateIndicator, useBrandToast, type SaveStateStatus } from '@/ui';
import {
  BRAND_INDUSTRIES,
  getBusinessInitials,
  MAX_BRAND_ABOUT_LENGTH,
  sanitizeBookingSlug,
} from './brandDetailsShared';

export function BrandDetailsPage() {
  const toast = useBrandToast();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [industry, setIndustry] = useState('');
  const [about, setAbout] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState('');
  const [saveState, setSaveState] = useState<SaveStateStatus>('saved');
  const [lastSaved, setLastSaved] = useState('Waiting for first save');
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touched, setTouched] = useState<Record<'name' | 'slug' | 'industry' | 'about', boolean>>({
    name: false,
    slug: false,
    industry: false,
    about: false,
  });

  useUnsavedChangesGuard(saveState === 'idle' || saveState === 'failed');

  async function loadBrandDraft() {
    setLoading(true);
    setLoadingError('');

    try {
      const snapshot = await ownerSettingsPersistenceClient.loadSnapshot();
      setName(snapshot.brand.name);
      setSlug(snapshot.brand.slug);
      setIndustry(snapshot.brand.industry);
      setAbout(snapshot.brand.about);
      setSaveState('saved');
      setLastSaved('Draft restored');
      setSubmitAttempted(false);
      setTouched({ name: false, slug: false, industry: false, about: false });
    } catch {
      setLoadingError('Could not load brand settings draft. Retry to continue editing.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadBrandDraft();
  }, []);

  const nameError = useMemo(() => (!name.trim() ? 'Business name is required.' : ''), [name]);
  const slugError = useMemo(() => {
    if (!slug.trim()) {
      return 'Booking URL is required.';
    }
    if (slug.trim().length < 3) {
      return 'Booking URL should be at least 3 characters.';
    }
    return '';
  }, [slug]);
  const industryError = useMemo(() => (!industry.trim() ? 'Select your business industry.' : ''), [industry]);
  const aboutError = useMemo(() => {
    if (!about.trim()) {
      return 'Add a short business description.';
    }
    if (about.trim().length < 20) {
      return 'Business description should be at least 20 characters.';
    }
    return '';
  }, [about]);

  const showNameError = (touched.name || submitAttempted) && nameError;
  const showSlugError = (touched.slug || submitAttempted) && slugError;
  const showIndustryError = (touched.industry || submitAttempted) && industryError;
  const showAboutError = (touched.about || submitAttempted) && aboutError;
  const aboutChars = about.length;
  const initials = getBusinessInitials(name);

  function markDirty() {
    setSaveState('idle');
  }

  async function saveBrandDraft() {
    setSubmitAttempted(true);

    if (nameError || slugError || industryError || aboutError) {
      setSaveState('failed');
      return;
    }

    setSaveState('saving');
    try {
      await ownerSettingsPersistenceClient.saveBrand({
        name: name.trim(),
        slug: sanitizeBookingSlug(slug),
        industry: industry.trim(),
        about: about.trim(),
      });
      const savedLabel = `Saved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      setLastSaved(savedLabel);
      setSaveState('saved');
      toast.success({
        title: 'Brand settings saved',
        description: 'Brand profile and booking URL draft were persisted for this workspace.',
      });
    } catch {
      setSaveState('failed');
      toast.error({
        title: 'Save failed',
        description: 'Brand settings were not saved. Retry to keep your latest changes.',
      });
    }
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    await saveBrandDraft();
  }

  async function handleDiscard() {
    await loadBrandDraft();
    toast.success({
      title: 'Unsaved changes discarded',
      description: 'Brand settings were restored from the latest saved draft.',
    });
  }

  if (loading) {
    return <RouteStateCard title="Loading brand settings" description="Preparing your persisted branding draft." variant="loading" />;
  }

  if (loadingError) {
    return <RouteStateCard title="Brand settings unavailable" description={loadingError} variant="error" onRetry={() => void loadBrandDraft()} />;
  }

  return (
    <div className="brand-details-layout">
      <form className="brand-form" onSubmit={(event) => void handleSave(event)} noValidate>
        <div className="brand-upload-banner-zone" role="button" tabIndex={0} aria-label="Upload banner image">
          <div className="brand-upload-zone__inner">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="brand-upload-zone__label">Upload banner image</span>
            <span className="brand-upload-zone__hint">1400 x 400px recommended</span>
          </div>

          <div className="brand-upload-logo-zone" role="button" tabIndex={0} aria-label="Upload logo" onClick={(event) => event.stopPropagation()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className="brand-form__fields">
          <FormField label="Business Name" htmlFor="brand-name" error={showNameError || undefined}>
            <input
              id="brand-name"
              className="input"
              type="text"
              placeholder="e.g. Dheyn's Barbershop"
              value={name}
              onBlur={() => setTouched((current) => ({ ...current, name: true }))}
              onChange={(event) => {
                setName(event.target.value);
                markDirty();
              }}
            />
          </FormField>

          <FormField
            label="Booking Page URL"
            hint="Only lowercase letters, numbers, and hyphens."
            htmlFor="brand-slug"
            error={showSlugError || undefined}
          >
            <div className="form-prefix-wrap">
              <span className="form-prefix">slotra.app/book/</span>
              <input
                id="brand-slug"
                className="input form-prefix-input"
                type="text"
                placeholder="your-business-slug"
                value={slug}
                onBlur={() => setTouched((current) => ({ ...current, slug: true }))}
                onChange={(event) => {
                  setSlug(sanitizeBookingSlug(event.target.value));
                  markDirty();
                }}
              />
            </div>
          </FormField>

          <Select
            id="brand-industry"
            label="Industry"
            value={industry}
            error={showIndustryError || undefined}
            onBlur={() => setTouched((current) => ({ ...current, industry: true }))}
            onChange={(event) => {
              setIndustry(event.target.value);
              markDirty();
            }}
          >
            {BRAND_INDUSTRIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>

          <Textarea
            id="brand-about"
            label="About Your Business"
            placeholder="Tell customers what makes your business unique..."
            value={about}
            maxLength={MAX_BRAND_ABOUT_LENGTH}
            error={showAboutError || undefined}
            onBlur={() => setTouched((current) => ({ ...current, about: true }))}
            onChange={(event) => {
              setAbout(event.target.value);
              markDirty();
            }}
            rows={4}
            footer={(
              <span className={`form-char-count ${aboutChars >= MAX_BRAND_ABOUT_LENGTH ? 'form-char-count--limit' : ''}`}>
                {aboutChars}/{MAX_BRAND_ABOUT_LENGTH}
              </span>
            )}
          />

          <div className="brand-form__actions">
            <SaveStateIndicator status={saveState} savedLabel={lastSaved} idleLabel="Unsaved brand changes" onRetry={() => void saveBrandDraft()} />
            <Button className={saveState === 'saved' ? 'btn--saved' : ''} type="submit" disabled={saveState === 'saving'}>
              {saveState === 'saving' ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => void handleDiscard()} disabled={saveState === 'saving'}>
              Discard
            </Button>
          </div>
        </div>
      </form>

      <aside className="brand-sidebar">
        <div className="brand-preview-card card">
          <div className="brand-preview__label">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M1 12L8 3l7 9H1z" strokeLinejoin="round" />
            </svg>
            Booking Page Preview
          </div>

          <div className="brand-preview__banner">
            <div className="brand-preview__banner-overlay" />
          </div>

          <div className="brand-preview__avatar-wrap">
            <div className="brand-preview__avatar">{initials || 'S'}</div>
          </div>

          <div className="brand-preview__body">
            <p className="brand-preview__biz-name">{name || 'Your Business Name'}</p>
            <p className="brand-preview__industry">{industry}</p>
            {about ? (
              <p className="brand-preview__about">
                {about.length > 90 ? `${about.slice(0, 90)}...` : about}
              </p>
            ) : null}
            <div className="brand-preview__url">
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M9 3h4v4M13 3L7 9" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 5H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V9" strokeLinecap="round" />
              </svg>
              slotra.app/book/{slug || 'your-business'}
            </div>
          </div>
        </div>

        <div className="help-card">
          <div className="help-card__header">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75">
              <circle cx="10" cy="10" r="8" />
              <path d="M7.5 7.5a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4" strokeLinecap="round" />
              <circle cx="10" cy="15" r=".75" fill="currentColor" stroke="none" />
            </svg>
            Tips for a great profile
          </div>
          <ul className="help-card__list">
            <li className="help-card__item">
              <span className="help-card__bullet" />
              Use a wide banner (1400 x 400px) for the best first impression.
            </li>
            <li className="help-card__item">
              <span className="help-card__bullet" />
              Keep your slug short and memorable - it&apos;s your booking link customers will share.
            </li>
            <li className="help-card__item">
              <span className="help-card__bullet" />
              Write an About in 1-2 sentences: what you do and where you&apos;re located.
            </li>
            <li className="help-card__item">
              <span className="help-card__bullet" />
              Choose the most specific industry to improve discoverability.
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
