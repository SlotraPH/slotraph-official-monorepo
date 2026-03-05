import { useEffect } from 'react';

export function useUnsavedChangesGuard(hasUnsavedChanges: boolean) {
  useEffect(() => {
    if (!hasUnsavedChanges || typeof window === 'undefined') {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);
}
