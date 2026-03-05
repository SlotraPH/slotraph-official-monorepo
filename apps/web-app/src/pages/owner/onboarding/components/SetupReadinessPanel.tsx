import { AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { BrandButton, Card, colors, spacing, typography } from '@/ui';

export function SetupReadinessPanel({
  blockers,
  completed,
  onNextAction,
}: {
  blockers: string[];
  completed: number;
  onNextAction: () => void;
}) {
  const isReady = blockers.length === 0;

  return (
    <Card className="setup-readiness-card">
      <div className="setup-readiness-card__head">
        {isReady ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
        <div>
          <p className="setup-readiness-card__eyebrow">Readiness</p>
          <h3 className="setup-readiness-card__title">{isReady ? 'Ready to publish' : 'Blocked for launch'}</h3>
        </div>
      </div>

      <p
        style={{
          color: colors.secondary,
          fontFamily: typography.fontFamily,
          margin: 0,
          ...typography.bodySmall,
        }}
      >
        {isReady
          ? 'All setup checks are complete. You can review your booking page and publish.'
          : `${blockers.length} blocker${blockers.length > 1 ? 's' : ''} still need attention before customers can book.`}
      </p>

      <ul className="setup-readiness-card__list">
        {(isReady ? ['Run a final review in completion step and publish.'] : blockers).map((blocker) => (
          <li key={blocker}>{blocker}</li>
        ))}
      </ul>

      <div className="setup-readiness-card__footer">
        <span>{completed} launch checks complete</span>
        <BrandButton
          size="nav"
          variant={isReady ? 'secondary' : 'primary'}
          endIcon={<ArrowRight size={15} />}
          onClick={onNextAction}
          surfaceStyle={{ justifySelf: 'start', marginTop: spacing[2] }}
        >
          {isReady ? 'Review completion' : 'Resolve next blocker'}
        </BrandButton>
      </div>
    </Card>
  );
}
