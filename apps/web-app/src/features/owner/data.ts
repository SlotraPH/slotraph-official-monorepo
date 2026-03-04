import type { OwnerBusinessProfile } from '@/domain/business/types';
import type { UpcomingBooking } from '@/domain/booking/types';
import type { CustomerRecord } from '@/domain/customer/types';
import type { BusinessHourDraft } from '@/domain/hours/types';
import type {
  BookingPreferencesSettings,
  PaymentChecklistItem,
  PaymentSettings,
} from '@/domain/payments/types';
import type { ServiceRecord } from '@/domain/service/types';
import type { TeamMemberRecord } from '@/domain/staff/types';
import { OWNER_BUSINESS } from '@/mocks/business';
import { OWNER_UPCOMING_BOOKINGS } from '@/mocks/bookings';
import { DASHBOARD_ACTIVITY, DASHBOARD_QUICK_ACTIONS, DASHBOARD_SUMMARY } from '@/mocks/owner/dashboard';
import { INTEGRATION_ROADMAP, INTEGRATION_WORKFLOWS } from '@/mocks/owner/integrations';
import { mockCustomerRepository } from '@/features/owner/customers/mockCustomerRepository';
import { mockOnboardingRepository } from '@/features/owner/onboarding/mockOnboardingRepository';
import { mockSettingsRepository } from '@/features/owner/settings/mockSettingsRepository';
import { mockServiceRepository } from '@/features/owner/services/mockServiceRepository';
import { createReadyResource } from '@/features/resource';
import type { ActivityItem, DashboardSummary, QuickAction } from '@/mocks/owner/dashboard';
import type { IntegrationWorkflow } from '@/mocks/owner/integrations';

interface OwnerDashboardData {
  business: OwnerBusinessProfile;
  summary: DashboardSummary[];
  bookings: UpcomingBooking[];
  quickActions: QuickAction[];
  activity: ActivityItem[];
}

interface OwnerServicesData {
  services: ServiceRecord[];
}

interface OwnerCustomersData {
  customers: CustomerRecord[];
}

interface OwnerTeamData {
  teamMembers: TeamMemberRecord[];
}

interface OwnerBusinessSettingsData {
  business: OwnerBusinessProfile;
  teamMembers: TeamMemberRecord[];
  businessHours: BusinessHourDraft[];
  timezoneOptions: string[];
}

interface OwnerPaymentsData {
  paymentSettings: PaymentSettings;
  bookingPreferences: BookingPreferencesSettings;
  checklist: PaymentChecklistItem[];
  acceptedPaymentMethodOptions: string[];
}

interface OwnerIntegrationsData {
  workflows: IntegrationWorkflow[];
  roadmap: string[];
}

function cloneBusiness(profile: OwnerBusinessProfile): OwnerBusinessProfile {
  return { ...profile };
}

function cloneServices(services: ServiceRecord[]) {
  return services.map<ServiceRecord>((service) => ({
    ...service,
    staffIds: [...service.staffIds],
  }));
}

function cloneTeam(teamMembers: TeamMemberRecord[]) {
  return teamMembers.map<TeamMemberRecord>((member) => ({
    ...member,
    services: [...member.services],
  }));
}

function cloneCustomers(customers: CustomerRecord[]) {
  return customers.map<CustomerRecord>((customer) => ({
    ...customer,
    tags: [...customer.tags],
  }));
}

function cloneBusinessHours(hours: BusinessHourDraft[]) {
  return hours.map<BusinessHourDraft>((slot) => ({ ...slot }));
}

function clonePaymentSettings(settings: PaymentSettings): PaymentSettings {
  return {
    ...settings,
    acceptedMethods: [...settings.acceptedMethods],
  };
}

function cloneBookingPreferences(settings: BookingPreferencesSettings): BookingPreferencesSettings {
  return { ...settings };
}

export function getOwnerDashboardResource() {
  return createReadyResource<OwnerDashboardData>({
    business: cloneBusiness(OWNER_BUSINESS),
    summary: [...DASHBOARD_SUMMARY],
    bookings: [...OWNER_UPCOMING_BOOKINGS],
    quickActions: [...DASHBOARD_QUICK_ACTIONS],
    activity: [...DASHBOARD_ACTIVITY],
  });
}

export function getOwnerServicesResource() {
  return createReadyResource<OwnerServicesData>({
    services: cloneServices(mockServiceRepository.list()),
  });
}

export function getOwnerCustomersResource() {
  return createReadyResource<OwnerCustomersData>({
    customers: cloneCustomers(mockCustomerRepository.list()),
  });
}

export function getOwnerTeamResource() {
  const snapshot = mockSettingsRepository.getSnapshot();

  return createReadyResource<OwnerTeamData>({
    teamMembers: cloneTeam(snapshot.teamMembers),
  });
}

export function getOwnerBusinessSettingsResource() {
  const snapshot = mockSettingsRepository.getSnapshot();

  return createReadyResource<OwnerBusinessSettingsData>({
    business: cloneBusiness(snapshot.business),
    teamMembers: cloneTeam(snapshot.teamMembers),
    businessHours: cloneBusinessHours(snapshot.businessHours),
    timezoneOptions: [...snapshot.timezoneOptions],
  });
}

export function getOwnerPaymentsResource() {
  const snapshot = mockSettingsRepository.getSnapshot();

  return createReadyResource<OwnerPaymentsData>({
    paymentSettings: clonePaymentSettings(snapshot.paymentSettings),
    bookingPreferences: cloneBookingPreferences(snapshot.bookingPreferences),
    checklist: [...snapshot.paymentChecklist],
    acceptedPaymentMethodOptions: [...snapshot.paymentMethodOptions],
  });
}

export function getOwnerIntegrationsResource() {
  return createReadyResource<OwnerIntegrationsData>({
    workflows: [...INTEGRATION_WORKFLOWS],
    roadmap: [...INTEGRATION_ROADMAP],
  });
}

export function getDefaultOwnerOnboardingSeed() {
  const seed = mockOnboardingRepository.getSeed();

  return createReadyResource({
    business: cloneBusiness(seed.business),
    services: cloneServices(seed.services),
    teamMembers: cloneTeam(seed.teamMembers),
    businessHours: cloneBusinessHours(seed.businessHours),
    paymentSettings: clonePaymentSettings(seed.paymentSettings),
  });
}
