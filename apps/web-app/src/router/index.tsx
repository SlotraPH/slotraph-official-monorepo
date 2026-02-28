import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { OwnerLayout } from '@/app/layouts/OwnerLayout';
import { HomePage } from '@/pages/HomePage';
import { CustomersPage } from '@/pages/owner/CustomersPage';
import { DashboardPage } from '@/pages/owner/DashboardPage';
import { OnboardingPage } from '@/pages/owner/OnboardingPage';
import { ServicesPage } from '@/pages/owner/ServicesPage';
import { SettingsPage } from '@/pages/owner/SettingsPage';
import { BookingConfirmationPage } from '@/pages/public/BookingConfirmationPage';
import { BookingPage } from '@/pages/public/BookingPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/owner" element={<OwnerLayout />}>
          <Route index element={<Navigate replace to="/owner/dashboard" />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="onboarding" element={<OnboardingPage />} />
        </Route>

        <Route path="/book" element={<BookingPage />} />
        <Route path="/book/confirmation" element={<BookingConfirmationPage />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
