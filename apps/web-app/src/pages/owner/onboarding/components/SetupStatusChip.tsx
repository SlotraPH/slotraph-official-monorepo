import { colors, radii, spacing, typography } from '@/ui';
import type { SetupChecklistStatus } from './setupTypes';

const STATUS_LABELS: Record<SetupChecklistStatus, string> = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  done: 'Done',
};

function resolveSurface(status: SetupChecklistStatus) {
  if (status === 'done') {
    return {
      background: 'linear-gradient(180deg, #f4faf7 0%, #eef8f2 100%)',
      border: '1px solid #cde8da',
      color: '#255f45',
    };
  }

  if (status === 'in-progress') {
    return {
      background: 'linear-gradient(180deg, #f4f5ff 0%, #ecedf9 100%)',
      border: `1px solid ${colors.brandLight}`,
      color: colors.brand,
    };
  }

  return {
    background: 'linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%)',
    border: `1px solid ${colors.inputBorderDefault}`,
    color: colors.secondary,
  };
}

export function SetupStatusChip({ status }: { status: SetupChecklistStatus }) {
  return (
    <span
      style={{
        alignItems: 'center',
        borderRadius: radii.full,
        display: 'inline-flex',
        fontFamily: typography.fontFamily,
        fontSize: '12px',
        fontWeight: 600,
        gap: spacing[2],
        justifyContent: 'center',
        letterSpacing: '0.01em',
        minHeight: 28,
        paddingInline: spacing[3],
        ...resolveSurface(status),
      }}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
