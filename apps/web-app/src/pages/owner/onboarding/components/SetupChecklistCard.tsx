import { CircleCheckBig, CircleDashed, CircleDot } from 'lucide-react';
import { BrandButton, Card, colors, spacing, typography } from '@/ui';
import { SetupStatusChip } from './SetupStatusChip';
import type { SetupChecklistItem } from './setupTypes';

const STATUS_ICON = {
  'not-started': CircleDashed,
  'in-progress': CircleDot,
  done: CircleCheckBig,
} as const;

export function SetupChecklistCard({
  item,
  onOpen,
}: {
  item: SetupChecklistItem;
  onOpen: (item: SetupChecklistItem) => void;
}) {
  const Icon = STATUS_ICON[item.status];

  return (
    <Card className="setup-checklist-card" padding={4}>
      <div className="setup-checklist-card__header">
        <div className="setup-checklist-card__title-wrap">
          <span className="setup-checklist-card__icon">
            <Icon size={16} />
          </span>
          <h3 className="setup-checklist-card__title">{item.title}</h3>
        </div>
        <SetupStatusChip status={item.status} />
      </div>

      <p
        style={{
          color: colors.secondary,
          fontFamily: typography.fontFamily,
          margin: 0,
          ...typography.bodySmall,
        }}
      >
        {item.description}
      </p>

      <div className="setup-checklist-card__meta">
        <span>{item.progressLabel}</span>
        <span>{item.blocker}</span>
      </div>

      <BrandButton
        size="nav"
        variant={item.status === 'done' ? 'secondary' : 'primary'}
        onClick={() => onOpen(item)}
        surfaceStyle={{
          alignSelf: 'start',
          marginTop: spacing[2],
        }}
      >
        {item.status === 'done' ? 'Review' : 'Continue'}
      </BrandButton>
    </Card>
  );
}
