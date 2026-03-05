import { RefreshCcw } from 'lucide-react';
import { BrandButton } from './BrandButton';

export type SaveStateStatus = 'idle' | 'saving' | 'saved' | 'failed';

interface SaveStateIndicatorProps {
  status: SaveStateStatus;
  savedLabel?: string;
  idleLabel?: string;
  onRetry?: () => void;
}

function getSaveStateLabel(status: SaveStateStatus, savedLabel: string, idleLabel: string) {
  if (status === 'saving') {
    return 'Saving...';
  }

  if (status === 'saved') {
    return savedLabel;
  }

  if (status === 'failed') {
    return 'Failed';
  }

  return idleLabel;
}

export function SaveStateIndicator({
  status,
  savedLabel = 'Saved',
  idleLabel = 'Unsaved changes',
  onRetry,
}: SaveStateIndicatorProps) {
  const label = getSaveStateLabel(status, savedLabel, idleLabel);

  return (
    <div className={`save-state-indicator save-state-indicator--${status}`} role="status" aria-live="polite">
      <span>{label}</span>
      {status === 'failed' && onRetry ? (
        <BrandButton size="nav" startIcon={<RefreshCcw size={13} />} variant="secondary" onClick={onRetry}>
          Retry
        </BrandButton>
      ) : null}
    </div>
  );
}
