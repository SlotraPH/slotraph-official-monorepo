import { CheckCircle2, CircleDashed, Clock3, Globe, TriangleAlert } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BrandButton, BrandInput, Card, useBrandToast } from '@/ui';

interface DomainMilestone {
  id: string;
  title: string;
  description: string;
  status: 'done' | 'current' | 'pending';
  timestamp: string;
}

interface TroubleshootingItem {
  id: string;
  question: string;
  answer: string;
}

const DOMAIN_SUFFIX = '.slotraph.com';

const VERIFICATION_TIMELINE: DomainMilestone[] = [
  {
    id: 'dns-records',
    title: 'DNS records detected',
    description: 'Slotra found your CNAME and started propagation checks.',
    status: 'done',
    timestamp: 'Today, 10:08 AM',
  },
  {
    id: 'ssl',
    title: 'SSL certificate issued',
    description: 'Certificate provisioning is in progress and usually finishes within 15-20 minutes.',
    status: 'current',
    timestamp: 'In progress',
  },
  {
    id: 'live',
    title: 'Domain live for customers',
    description: 'Your booking URL starts serving branded traffic once SSL is active globally.',
    status: 'pending',
    timestamp: 'Estimated today',
  },
];

const TROUBLESHOOTING_ITEMS: TroubleshootingItem[] = [
  {
    id: 'propagation',
    question: 'Why is verification taking too long?',
    answer: 'Most DNS updates complete in under an hour, but some providers can take up to 24 hours. Keep the CNAME value exact and recheck after your DNS TTL window.',
  },
  {
    id: 'cloudflare',
    question: 'Cloudflare is enabled and verification fails',
    answer: 'Set the CNAME to DNS-only while verifying. Proxied records can block direct validation and delay SSL issuance.',
  },
  {
    id: 'root-domain',
    question: 'Can I connect a root domain instead?',
    answer: 'This MVP flow supports subdomains only. You can use `book.yourdomain.com` and point it to the Slotra target shown below.',
  },
];

function sanitizeSubdomain(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
    .slice(0, 32);
}

export function DomainSettingsPage() {
  const toast = useBrandToast();
  const [subdomain, setSubdomain] = useState('businessname');
  const [activeIssue, setActiveIssue] = useState<string | null>(TROUBLESHOOTING_ITEMS[0]?.id ?? null);

  const subdomainError = useMemo(() => {
    if (!subdomain) {
      return 'Choose a subdomain before saving this domain setup.';
    }
    if (subdomain.length < 3) {
      return 'Use at least 3 characters for a valid subdomain.';
    }
    if (!/^[a-z0-9-]+$/.test(subdomain)) {
      return 'Subdomain can only include lowercase letters, numbers, and hyphens.';
    }
    return '';
  }, [subdomain]);

  const domainPreview = `${subdomain || 'businessname'}${DOMAIN_SUFFIX}`;

  function handleSaveDomain() {
    if (subdomainError) {
      toast.error({
        title: 'Domain not saved',
        description: subdomainError,
      });
      return;
    }

    toast.success({
      title: 'Domain draft saved',
      description: `${domainPreview} is ready for verification once DNS records are published.`,
    });
  }

  function handleVerifyNow() {
    toast.success({
      title: 'Verification requested',
      description: 'Slotra will retry DNS and SSL checks for this domain in the next few minutes.',
    });
  }

  function handleCopyCname() {
    void navigator.clipboard?.writeText('domains.slotraph.com');
    toast.success({
      title: 'CNAME copied',
      description: 'Paste the target into your DNS provider CNAME value field.',
    });
  }

  return (
    <div className="settings-workspace-grid">
      <Card className="settings-surface-card" padding={5}>
        <div className="settings-surface-card__header">
          <div>
            <span className="settings-surface-card__eyebrow">Domain setup</span>
            <h2 className="settings-surface-card__title">Booking subdomain and DNS verification</h2>
            <p className="settings-surface-card__description">
              Configure the public booking URL customers will use before you publish your workspace.
            </p>
          </div>
          <span className="settings-status-pill settings-status-pill--progress">Verification in progress</span>
        </div>

        <div className="settings-form-grid settings-form-grid--two">
          <BrandInput
            label="Booking subdomain"
            value={subdomain}
            onChange={(event) => setSubdomain(sanitizeSubdomain(event.target.value))}
            helperText="Lowercase letters, numbers, and hyphens only."
            error={subdomainError || undefined}
          />
          <div className="settings-inline-preview" aria-live="polite">
            <p className="settings-inline-preview__label">Live preview</p>
            <p className="settings-inline-preview__value">https://{domainPreview}</p>
            <p className="settings-inline-preview__hint">Use a short name customers can type quickly.</p>
          </div>
        </div>

        <div className="settings-button-row">
          <BrandButton onClick={handleSaveDomain}>Save domain draft</BrandButton>
          <BrandButton variant="secondary" onClick={handleVerifyNow}>Retry verification</BrandButton>
        </div>
      </Card>

      <Card className="settings-surface-card" padding={5}>
        <div className="settings-surface-card__header settings-surface-card__header--compact">
          <div>
            <span className="settings-surface-card__eyebrow">DNS instructions</span>
            <h2 className="settings-surface-card__title">CNAME record requirements</h2>
          </div>
        </div>
        <div className="domain-cname-grid">
          <div className="domain-cname-item">
            <span>Type</span>
            <strong>CNAME</strong>
          </div>
          <div className="domain-cname-item">
            <span>Host</span>
            <strong>{subdomain || 'businessname'}</strong>
          </div>
          <div className="domain-cname-item domain-cname-item--value">
            <span>Value</span>
            <strong>domains.slotraph.com</strong>
          </div>
        </div>
        <div className="settings-button-row settings-button-row--end">
          <BrandButton variant="secondary" onClick={handleCopyCname}>Copy CNAME value</BrandButton>
        </div>
      </Card>

      <Card className="settings-surface-card" padding={5}>
        <div className="settings-surface-card__header settings-surface-card__header--compact">
          <div>
            <span className="settings-surface-card__eyebrow">Verification timeline</span>
            <h2 className="settings-surface-card__title">Current connection status</h2>
          </div>
        </div>

        <div className="domain-timeline" role="list">
          {VERIFICATION_TIMELINE.map((milestone) => (
            <div key={milestone.id} className={`domain-timeline__item domain-timeline__item--${milestone.status}`} role="listitem">
              <span className="domain-timeline__icon" aria-hidden="true">
                {milestone.status === 'done' ? <CheckCircle2 size={15} /> : null}
                {milestone.status === 'current' ? <Clock3 size={15} /> : null}
                {milestone.status === 'pending' ? <CircleDashed size={15} /> : null}
              </span>
              <div>
                <p className="domain-timeline__title">{milestone.title}</p>
                <p className="domain-timeline__description">{milestone.description}</p>
              </div>
              <span className="domain-timeline__time">{milestone.timestamp}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="settings-surface-card" padding={5}>
        <div className="settings-surface-card__header settings-surface-card__header--compact">
          <div>
            <span className="settings-surface-card__eyebrow">Troubleshooting</span>
            <h2 className="settings-surface-card__title">Common verification blockers</h2>
          </div>
          <Globe size={16} aria-hidden="true" />
        </div>

        <div className="settings-accordion-shell">
          {TROUBLESHOOTING_ITEMS.map((issue) => {
            const expanded = activeIssue === issue.id;
            return (
              <section key={issue.id} className={`settings-accordion-shell__item ${expanded ? 'settings-accordion-shell__item--active' : ''}`}>
                <button
                  type="button"
                  className="settings-accordion-shell__trigger"
                  aria-expanded={expanded}
                  onClick={() => setActiveIssue((current) => current === issue.id ? null : issue.id)}
                >
                  <span>{issue.question}</span>
                  <TriangleAlert size={14} aria-hidden="true" />
                </button>
                {expanded ? <p className="settings-accordion-shell__content">{issue.answer}</p> : null}
              </section>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
