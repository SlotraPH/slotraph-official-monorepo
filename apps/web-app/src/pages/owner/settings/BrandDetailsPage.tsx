import { useState } from 'react';
import { Button, FormField, Select, Textarea } from '@slotra/ui';
import { getOwnerBusinessSettingsResource } from '@/features/owner/data';
import {
    BRAND_INDUSTRIES,
    getBusinessInitials,
    MAX_BRAND_ABOUT_LENGTH,
    sanitizeBookingSlug,
} from './brandDetailsShared';

export function BrandDetailsPage() {
    const resource = getOwnerBusinessSettingsResource();
    const business = resource.status === 'ready' ? resource.data.business : null;
    const [name, setName] = useState(() => business?.name ?? '');
    const [slug, setSlug] = useState(() => business?.bookingSlug ?? '');
    const [industry, setIndustry] = useState(() => business?.industry ?? '');
    const [about, setAbout] = useState(() => business?.description ?? '');
    const [saved, setSaved] = useState(false);

    function handleSave(event: React.FormEvent) {
        event.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 2200);
    }

    const aboutChars = about.length;
    const initials = getBusinessInitials(name);

    return (
        <div className="brand-details-layout">
            <form className="brand-form" onSubmit={handleSave} noValidate>
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
                    <FormField label="Business Name" htmlFor="brand-name">
                        <input
                            id="brand-name"
                            className="input"
                            type="text"
                            placeholder="e.g. Dheyn's Barbershop"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </FormField>

                    <FormField
                        label="Booking Page URL"
                        hint="Only lowercase letters, numbers, and hyphens."
                        htmlFor="brand-slug"
                    >
                        <div className="form-prefix-wrap">
                            <span className="form-prefix">slotra.app/book/</span>
                            <input
                                id="brand-slug"
                                className="input form-prefix-input"
                                type="text"
                                placeholder="your-business-slug"
                                value={slug}
                                onChange={(event) => setSlug(sanitizeBookingSlug(event.target.value))}
                            />
                        </div>
                    </FormField>

                    <Select
                        id="brand-industry"
                        label="Industry"
                        value={industry}
                        onChange={(event) => setIndustry(event.target.value)}
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
                        onChange={(event) => setAbout(event.target.value)}
                        rows={4}
                        footer={(
                            <span className={`form-char-count ${aboutChars >= MAX_BRAND_ABOUT_LENGTH ? 'form-char-count--limit' : ''}`}>
                                {aboutChars}/{MAX_BRAND_ABOUT_LENGTH}
                            </span>
                        )}
                    />

                    <div className="brand-form__actions">
                        <Button
                            className={saved ? 'btn--saved' : ''}
                            type="submit"
                        >
                            {saved ? (
                                <>
                                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" width="14" height="14">
                                        <path d="M3 8l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Saved!
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                        <Button type="button" variant="ghost">
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
                        {about && (
                            <p className="brand-preview__about">
                                {about.length > 90 ? `${about.slice(0, 90)}...` : about}
                            </p>
                        )}
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
