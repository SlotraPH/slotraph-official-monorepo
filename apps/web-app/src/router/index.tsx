import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { RouteStateCard } from '@/app/components/RouteStateCard';
import { OwnerRouteGuard } from '@/app/routes/OwnerRouteGuard';
import { OwnerLayout } from '@/app/layouts/OwnerLayout';

const SandboxPage = lazy(() => import('@/pages/SandboxPage').then((module) => ({ default: module.SandboxPage })));
const CalendarPage = lazy(() => import('@/pages/owner/CalendarPage').then((module) => ({ default: module.CalendarPage })));
const CustomersPage = lazy(() => import('@/pages/owner/CustomersPage').then((module) => ({ default: module.CustomersPage })));
const DashboardPage = lazy(() => import('@/pages/owner/DashboardPage').then((module) => ({ default: module.DashboardPage })));
const IntegrationsPage = lazy(() => import('@/pages/owner/IntegrationsPage').then((module) => ({ default: module.IntegrationsPage })));
const OnboardingPage = lazy(() => import('@/pages/owner/OnboardingPage').then((module) => ({ default: module.OnboardingPage })));
const PaymentsPage = lazy(() => import('@/pages/owner/PaymentsPage').then((module) => ({ default: module.PaymentsPage })));
const ServicesPage = lazy(() => import('@/pages/owner/ServicesPage').then((module) => ({ default: module.ServicesPage })));
const SettingsPage = lazy(() => import('@/pages/owner/SettingsPage').then((module) => ({ default: module.SettingsPage })));
const BookingPreferencesPage = lazy(() => import('@/pages/owner/settings/BookingPreferencesPage').then((module) => ({ default: module.BookingPreferencesPage })));
const BrandDetailsPage = lazy(() => import('@/pages/owner/settings/BrandDetailsPage').then((module) => ({ default: module.BrandDetailsPage })));
const BusinessProfilePage = lazy(() => import('@/pages/owner/settings/BusinessProfilePage').then((module) => ({ default: module.BusinessProfilePage })));
const DomainSettingsPage = lazy(() => import('@/pages/owner/settings/DomainSettingsPage').then((module) => ({ default: module.DomainSettingsPage })));
const NotificationsSettingsPage = lazy(() => import('@/pages/owner/settings/NotificationsSettingsPage').then((module) => ({ default: module.NotificationsSettingsPage })));
const PublishSettingsPage = lazy(() => import('@/pages/owner/settings/PublishSettingsPage').then((module) => ({ default: module.PublishSettingsPage })));
const TeamSettingsPage = lazy(() => import('@/pages/owner/settings/TeamSettingsPage').then((module) => ({ default: module.TeamSettingsPage })));
const BookingConfirmationPage = lazy(() => import('@/pages/public/BookingConfirmationPage').then((module) => ({ default: module.BookingConfirmationPage })));
const BookingPage = lazy(() => import('@/pages/public/BookingPage').then((module) => ({ default: module.BookingPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));

function RouterFallback() {
  return <RouteStateCard title="Loading route" description="Preparing the next Slotra surface." variant="loading" />;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouterFallback />}>
        <Routes>
          <Route path="/" element={<Navigate replace to="/owner/onboarding" />} />

          <Route path="/owner" element={<OwnerRouteGuard><OwnerLayout /></OwnerRouteGuard>}>
            <Route index element={<Navigate replace to="/owner/onboarding" />} />
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
              <Route path="domain" element={<DomainSettingsPage />} />
              <Route path="booking" element={<BookingPreferencesPage />} />
              <Route path="publish" element={<PublishSettingsPage />} />
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
      </Suspense>
    </BrowserRouter>
  );
}
