import { useState } from 'react';

const INDUSTRIES = [
    'Beauty & Wellness',
    'Health & Fitness',
    'Hair & Barbering',
    'Nail & Spa',
    'Medical & Dental',
    'Tutoring & Education',
    'Legal & Consulting',
    'Photography',
    'Cleaning Services',
    'Pet Care',
    'Auto Services',
    'Events & Entertainment',
    'Other',
];

export function BrandDetailsPage() {
    const [name, setName] = useState('Dheyn\'s Barbershop');
    const [slug, setSlug] = useState('dheyns-barbershop');
    const [industry, setIndustry] = useState('Hair & Barbering');
    const [about, setAbout] = useState(
        'Premium grooming experience in the heart of Manila. Walk-ins welcome, appointments preferred.'
    );
    const [saved, setSaved] = useState(false);

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 2200);
    }

    const aboutChars = about.length;
    const MAX_ABOUT = 280;

    // Generate initials for preview avatar
    const initials = name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="brand-details-layout">
            {/* ── Left: Form ──────────────────────────────────────── */}
            <form className="brand-form" onSubmit={handleSave} noValidate>
                {/* Banner upload zone */}
                <div className="brand-upload-banner-zone" role="button" tabIndex={0} aria-label="Upload banner image">
                    <div className="brand-upload-zone__inner">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="3" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="brand-upload-zone__label">Upload banner image</span>
                        <span className="brand-upload-zone__hint">1400 × 400px recommended</span>
                    </div>

                    {/* Logo overlay zone */}
                    <div className="brand-upload-logo-zone" role="button" tabIndex={0} aria-label="Upload logo" onClick={(e) => e.stopPropagation()}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                        </svg>
                    </div>
                </div>

                {/* Form fields */}
                <div className="brand-form__fields">
                    {/* Business name */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="brand-name">Business Name</label>
                        <input
                            id="brand-name"
                            className="input"
                            type="text"
                            placeholder="e.g. Dheyn's Barbershop"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Slug */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="brand-slug">Booking Page URL</label>
                        <div className="form-prefix-wrap">
                            <span className="form-prefix">slotra.app/book/</span>
                            <input
                                id="brand-slug"
                                className="input form-prefix-input"
                                type="text"
                                placeholder="your-business-slug"
                                value={slug}
                                onChange={(e) =>
                                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))
                                }
                            />
                        </div>
                        <span className="form-hint">Only lowercase letters, numbers, and hyphens.</span>
                    </div>

                    {/* Industry */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="brand-industry">Industry</label>
                        <div className="form-select-wrap">
                            <select
                                id="brand-industry"
                                className="input form-select"
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                            >
                                {INDUSTRIES.map((ind) => (
                                    <option key={ind} value={ind}>
                                        {ind}
                                    </option>
                                ))}
                            </select>
                            <svg className="form-select-caret" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75">
                                <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    {/* About */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="brand-about">
                            About Your Business
                        </label>
                        <div className="form-textarea-wrap">
                            <textarea
                                id="brand-about"
                                className="input form-textarea"
                                placeholder="Tell customers what makes your business unique…"
                                value={about}
                                maxLength={MAX_ABOUT}
                                onChange={(e) => setAbout(e.target.value)}
                                rows={4}
                            />
                            <span className={`form-char-count ${aboutChars >= MAX_ABOUT ? 'form-char-count--limit' : ''}`}>
                                {aboutChars}/{MAX_ABOUT}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="brand-form__actions">
                        <button
                            type="submit"
                            className={`btn btn--primary ${saved ? 'btn--saved' : ''}`}
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
                        </button>
                        <button type="button" className="btn btn--ghost">
                            Discard
                        </button>
                    </div>
                </div>
            </form>

            {/* ── Right: Preview + Help ────────────────────────────── */}
            <aside className="brand-sidebar">
                {/* Booking page preview card */}
                <div className="brand-preview-card card">
                    <div className="brand-preview__label">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75">
                            <path d="M1 12L8 3l7 9H1z" strokeLinejoin="round" />
                        </svg>
                        Booking Page Preview
                    </div>

                    {/* Simulated banner */}
                    <div className="brand-preview__banner">
                        <div className="brand-preview__banner-overlay" />
                    </div>

                    {/* Avatar overlapping banner */}
                    <div className="brand-preview__avatar-wrap">
                        <div className="brand-preview__avatar">{initials || 'S'}</div>
                    </div>

                    {/* Business info */}
                    <div className="brand-preview__body">
                        <p className="brand-preview__biz-name">{name || 'Your Business Name'}</p>
                        <p className="brand-preview__industry">{industry}</p>
                        {about && (
                            <p className="brand-preview__about">
                                {about.length > 90 ? about.slice(0, 90) + '…' : about}
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

                {/* Tips help card */}
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
                            Use a wide banner (1400 × 400px) for the best first impression.
                        </li>
                        <li className="help-card__item">
                            <span className="help-card__bullet" />
                            Keep your slug short and memorable — it's your booking link customers will share.
                        </li>
                        <li className="help-card__item">
                            <span className="help-card__bullet" />
                            Write an About in 1–2 sentences: what you do and where you're located.
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
