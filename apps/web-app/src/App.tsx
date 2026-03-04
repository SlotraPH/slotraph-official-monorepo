import { AppErrorBoundary } from '@/app/components/AppErrorBoundary';
import { AppRouter } from '@/router';
import { ToastProvider } from '@/ui';

export default function App() {
  return (
    <AppErrorBoundary>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </AppErrorBoundary>
  );
}
