import { colors, typography } from '@/ui';

export function SetupProgressRing({
  label = 'Setup completion',
  percentage,
}: {
  label?: string;
  percentage: number;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(percentage)));

  return (
    <div
      aria-label={`${label}: ${clamped}%`}
      role="img"
      style={{
        background: `conic-gradient(#2e3192 ${clamped * 3.6}deg, #ecedf9 ${clamped * 3.6}deg 360deg)`,
        borderRadius: '50%',
        display: 'grid',
        height: 124,
        placeItems: 'center',
        position: 'relative',
        width: 124,
      }}
    >
      <div
        style={{
          alignItems: 'center',
          background: '#ffffff',
          border: `1px solid ${colors.border}`,
          borderRadius: '50%',
          display: 'grid',
          gap: 2,
          height: 96,
          justifyItems: 'center',
          width: 96,
        }}
      >
        <strong style={{ color: colors.navy, fontFamily: typography.fontFamily, fontSize: 26, lineHeight: 1 }}>
          {clamped}%
        </strong>
        <span style={{ color: colors.muted, fontFamily: typography.fontFamily, ...typography.overline }}>
          Setup
        </span>
      </div>
    </div>
  );
}

export function SetupProgressMeta({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  return (
    <p
      style={{
        color: colors.secondary,
        fontFamily: typography.fontFamily,
        margin: 0,
        lineHeight: 1.6,
      }}
    >
      {completed} of {total} launch checks completed.
    </p>
  );
}
