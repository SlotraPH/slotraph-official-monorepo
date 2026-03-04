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
import { OWNER_BUSINESS_HOURS } from '@/mocks/businessHours';
import { OWNER_CUSTOMERS } from '@/mocks/customers';
import { DASHBOARD_ACTIVITY, DASHBOARD_QUICK_ACTIONS, DASHBOARD_SUMMARY } from '@/mocks/owner/dashboard';
import { INTEGRATION_ROADMAP, INTEGRATION_WORKFLOWS } from '@/mocks/owner/integrations';
import {
  OWNER_BOOKING_PREFERENCES,
  OWNER_PAYMENT_CHECKLIST,
  OWNER_PAYMENT_SETTINGS,
  PAYMENT_METHOD_OPTIONS,
  TIMEZONE_OPTIONS,
} from '@/mocks/payments';
import { OWNER_SERVICES } from '@/mocks/services';
import { OWNER_TEAM_MEMBERS } from '@/mocks/staff';
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
    services: cloneServices(OWNER_SERVICES),
  });
}

export function getOwnerCustomersResource() {
  return createReadyResource<OwnerCustomersData>({
    customers: cloneCustomers(OWNER_CUSTOMERS),
  });
}

export function getOwnerTeamResource() {
  return createReadyResource<OwnerTeamData>({
    teamMembers: cloneTeam(OWNER_TEAM_MEMBERS),
  });
}

export function getOwnerBusinessSettingsResource() {
  return createReadyResource<OwnerBusinessSettingsData>({
    business: cloneBusiness(OWNER_BUSINESS),
    teamMembers: cloneTeam(OWNER_TEAM_MEMBERS),
    businessHours: cloneBusinessHours(OWNER_BUSINESS_HOURS),
    timezoneOptions: [...TIMEZONE_OPTIONS],
  });
}

export function getOwnerPaymentsResource() {
  return createReadyResource<OwnerPaymentsData>({
    paymentSettings: clonePaymentSettings(OWNER_PAYMENT_SETTINGS),
    bookingPreferences: cloneBookingPreferences(OWNER_BOOKING_PREFERENCES),
    checklist: [...OWNER_PAYMENT_CHECKLIST],
    acceptedPaymentMethodOptions: [...PAYMENT_METHOD_OPTIONS],
  });
}

export function getOwnerIntegrationsResource() {
  return createReadyResource<OwnerIntegrationsData>({
    workflows: [...INTEGRATION_WORKFLOWS],
    roadmap: [...INTEGRATION_ROADMAP],
  });
}

export function getDefaultOwnerOnboardingSeed() {
  return createReadyResource({
    business: cloneBusiness(OWNER_BUSINESS),
    services: cloneServices(OWNER_SERVICES),
    teamMembers: cloneTeam(OWNER_TEAM_MEMBERS),
    businessHours: cloneBusinessHours(OWNER_BUSINESS_HOURS),
    paymentSettings: clonePaymentSettings(OWNER_PAYMENT_SETTINGS),
  });
}
