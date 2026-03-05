import { CheckCircle2, Circle, ExternalLink, Rocket, Share2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BrandButton, Card, useBrandToast } from '@/ui';

interface ReadinessItem {
  id: string;
  label: string;
  status: 'done' | 'blocked';
  note: string;
}

const READINESS_ITEMS: ReadinessItem[] = [
  {
    id: 'domain',
    label: 'Domain connected and verified',
    status: 'done',
    note: 'SSL is provisioning and no DNS conflicts were found.',
  },
  {
    id: 'services',
    label: 'Service catalog reviewed',
    status: 'done',
    note: 'All public services have updated duration and pricing copy.',
  },
  {
    id: 'schedule',
    label: 'Availability and blackout rules checked',
    status: 'blocked',
    note: 'One blackout date overlaps an extended-hours override.',
  },
  {
    id: 'payments',
    label: 'Payment policy confirmed',
    status: 'blocked',
    note: 'Deposit policy still marked as draft for first-time customers.',
  },
];

export function PublishSettingsPage() {
  const toast = useBrandToast();
  const [published, setPublished] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const shareLink = 'https://businessname.slotraph.com';

  const blockers = useMemo(() => READINESS_ITEMS.filter((item) => item.status === 'blocked'), []);
  const completed = READINESS_ITEMS.length - blockers.length;

  function handleCopyShareLink() {
    void navigator.clipboard?.writeText(shareLink);
    setShareCopied(true);
    toast.success({
      title: 'Share link copied',
      description: 'You can send this booking URL to your first customer cohort.',
    });
    setTimeout(() => setShareCopied(false), 2000);
  }

  function handleGoLive() {
    setPublished(true);
    toast.success({
      title: 'Workspace published',
      description: 'Your booking page is now marked as live in this workspace preview.',
    });
  }

  function handleReviewBlockers() {
    toast.error({
      title: 'Resolve blockers first',
      description: 'Update scheduling conflicts and payment policy drafts before go-live.',
    });
  }

  return (
    <div className="settings-workspace-grid">
      <Card className="settings-surface-card" padding={5}>
        <div className="settings-surface-card__header">
          <div>
            <span className="settings-surface-card__eyebrow">Release control</span>
            <h2 className="settings-surface-card__title">Publish checklist and go-live actions</h2>
            <p className="settings-surface-card__description">
              Final pass before opening bookings publicly. Blocked items stay visible until resolved.
            </p>
          </div>
          <span className={`settings-status-pill ${blockers.length === 0 ? 'settings-status-pill--success' : 'settings-status-pill--warning'}`}>
            {completed}/{READINESS_ITEMS.length} ready
          </span>
        </div>

        <div className="publish-checklist">
          {READINESS_ITEMS.map((item) => (
            <div key={item.id} className={`publish-checklist__item publish-checklist__item--${item.status}`}>
              <span className="publish-checklist__icon" aria-hidden="true">
                {item.status === 'done' ? <CheckCircle2 size={15} /> : <Circle size={15} />}
              </span>
              <div>
                <p className="publish-checklist__label">{item.label}</p>
                <p className="publish-checklist__note">{item.note}</p>
              </div>
              <span className={`publish-chip publish-chip--${item.status}`}>
                {item.status === 'done' ? 'Ready' : 'Blocked'}
              </span>
            </div>
          ))}
        </div>

        <div className="settings-button-row">
          {blockers.length === 0 ? (
            <BrandButton startIcon={<Rocket size={14} />} onClick={handleGoLive}>Go live now</BrandButton>
          ) : (
            <BrandButton startIcon={<Rocket size={14} />} onClick={handleReviewBlockers}>Review blockers</BrandButton>
          )}
          <BrandButton variant="secondary" startIcon={<ExternalLink size={14} />}>Preview public booking page</BrandButton>
        </div>
      </Card>

      <Card className="settings-surface-card" padding={5}>
        <div className="settings-surface-card__header settings-surface-card__header--compact">
          <div>
            <span className="settings-surface-card__eyebrow">Blockers</span>
            <h2 className="settings-surface-card__title">Issues preventing release</h2>
          </div>
        </div>

        <div className="publish-blockers">
          {blockers.map((blocker) => (
            <span key={blocker.id} className="publish-chip publish-chip--blocked">{blocker.label}</span>
          ))}
        </div>
      </Card>

      <Card className="settings-surface-card" padding={5}>
        <div className="settings-surface-card__header settings-surface-card__header--compact">
          <div>
            <span className="settings-surface-card__eyebrow">Share link</span>
            <h2 className="settings-surface-card__title">Launch communication card</h2>
          </div>
          <Share2 size={16} aria-hidden="true" />
        </div>

        <div className="publish-share-card">
          <p className="publish-share-card__label">Public booking URL</p>
          <p className="publish-share-card__link">{shareLink}</p>
          <p className="publish-share-card__hint">Use this in social bio, SMS confirmations, and QR printouts.</p>
          <div className="settings-button-row">
            <BrandButton variant="secondary" onClick={handleCopyShareLink}>{shareCopied ? 'Copied' : 'Copy link'}</BrandButton>
          </div>
        </div>
      </Card>

      <Card className="settings-surface-card settings-surface-card--success" padding={5}>
        <div className="settings-surface-card__header settings-surface-card__header--compact">
          <div>
            <span className="settings-surface-card__eyebrow">Post-publish</span>
            <h2 className="settings-surface-card__title">Success state shell</h2>
          </div>
        </div>

        <div className="publish-success-shell">
          <CheckCircle2 size={20} aria-hidden="true" />
          <div>
            <p className="publish-success-shell__title">{published ? 'Booking page is live' : 'Waiting for go-live action'}</p>
            <p className="publish-success-shell__description">
              {published
                ? 'Customers can now access your booking page and submit appointments.'
                : 'This panel switches to a full success confirmation after publish is triggered.'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
