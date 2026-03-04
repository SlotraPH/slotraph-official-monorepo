import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { OwnerRouteGuard } from '@/app/routes/OwnerRouteGuard';
import { OwnerLayout } from '@/app/layouts/OwnerLayout';
import { HomePage } from '@/pages/HomePage';
import { SandboxPage } from '@/pages/SandboxPage';
import { CalendarPage } from '@/pages/owner/CalendarPage';
import { CustomersPage } from '@/pages/owner/CustomersPage';
import { DashboardPage } from '@/pages/owner/DashboardPage';
import { IntegrationsPage } from '@/pages/owner/IntegrationsPage';
import { OnboardingPage } from '@/pages/owner/OnboardingPage';
import { PaymentsPage } from '@/pages/owner/PaymentsPage';
import { ServicesPage } from '@/pages/owner/ServicesPage';
import { SettingsPage } from '@/pages/owner/SettingsPage';
import { BookingPreferencesPage } from '@/pages/owner/settings/BookingPreferencesPage';
import { BrandDetailsPage } from '@/pages/owner/settings/BrandDetailsPage';
import { BusinessProfilePage } from '@/pages/owner/settings/BusinessProfilePage';
import { NotificationsSettingsPage } from '@/pages/owner/settings/NotificationsSettingsPage';
import { TeamSettingsPage } from '@/pages/owner/settings/TeamSettingsPage';
import { BookingConfirmationPage } from '@/pages/public/BookingConfirmationPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { BookingPage } from '@/pages/public/BookingPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/owner" element={<OwnerRouteGuard><OwnerLayout /></OwnerRouteGuard>}>
          <Route index element={<Navigate replace to="/owner/calendar" />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="integrations" element={<IntegrationsPage />} />
          <Route path="settings" element={<SettingsPage />}>
            <Route index element={<Navigate replace to="/owner/settings/brand" />} />
            <Route path="brand" element={<BrandDetailsPage />} />
            <Route path="business" element={<BusinessProfilePage />} />
            <Route path="team" element={<TeamSettingsPage />} />
            <Route path="notifications" element={<NotificationsSettingsPage />} />
            <Route path="booking" element={<BookingPreferencesPage />} />
            <Route path="*" element={<NotFoundPage context="owner" />} />
          </Route>
          <Route path="onboarding" element={<OnboardingPage />} />
          <Route path="*" element={<NotFoundPage context="owner" />} />
        </Route>

        <Route path="/book" element={<BookingPage />} />
        <Route path="/book/confirmation" element={<BookingConfirmationPage />} />
        <Route path="/sandbox" element={<SandboxPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
