import { AppErrorBoundary } from '@/app/components/AppErrorBoundary';
import { AppRouter } from '@/router';

export default function App() {
  return (
    <AppErrorBoundary>
      <AppRouter />
    </AppErrorBoundary>
  );
}
