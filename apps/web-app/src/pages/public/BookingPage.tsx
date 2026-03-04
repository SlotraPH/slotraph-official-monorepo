import { AppShell } from '@/app/components/AppShell';
import { BookingFlow } from './booking/BookingFlow';

export function BookingPage() {
  return (
    <AppShell>
      <BookingFlow />
    </AppShell>
  );
}
