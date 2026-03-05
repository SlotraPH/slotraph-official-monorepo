import {
  getDefaultOwnerOnboardingSeed,
  getOwnerBusinessSettingsResource,
  getOwnerCustomersResource,
  getOwnerDashboardResource,
  getOwnerIntegrationsResource,
  getOwnerPaymentsResource,
  getOwnerServicesResource,
  getOwnerTeamResource,
  type OwnerBusinessSettingsData,
  type OwnerCustomersData,
  type OwnerDashboardData,
  type OwnerIntegrationsData,
  type OwnerPaymentsData,
  type OwnerServicesData,
  type OwnerOnboardingSeed,
  type OwnerTeamData,
} from '@/features/owner/data';
import { toRouteQueryState } from '@/features/route-query/adapters';
import type { ResolvedRouteQueryState } from '@/features/route-query/contracts';

export interface OwnerRouteClient {
  getDashboardQuery(): ResolvedRouteQueryState<OwnerDashboardData>;
  getServicesQuery(): ResolvedRouteQueryState<OwnerServicesData>;
  getCustomersQuery(): ResolvedRouteQueryState<OwnerCustomersData>;
  getTeamQuery(): ResolvedRouteQueryState<OwnerTeamData>;
  getBusinessSettingsQuery(): ResolvedRouteQueryState<OwnerBusinessSettingsData>;
  getPaymentsQuery(): ResolvedRouteQueryState<OwnerPaymentsData>;
  getIntegrationsQuery(): ResolvedRouteQueryState<OwnerIntegrationsData>;
  getOnboardingQuery(): ResolvedRouteQueryState<OwnerOnboardingSeed>;
}

export const mockOwnerRouteClient: OwnerRouteClient = {
  getDashboardQuery() {
    return toRouteQueryState(getOwnerDashboardResource());
  },
  getServicesQuery() {
    return toRouteQueryState(getOwnerServicesResource());
  },
  getCustomersQuery() {
    return toRouteQueryState(getOwnerCustomersResource());
  },
  getTeamQuery() {
    return toRouteQueryState(getOwnerTeamResource());
  },
  getBusinessSettingsQuery() {
    return toRouteQueryState(getOwnerBusinessSettingsResource());
  },
  getPaymentsQuery() {
    return toRouteQueryState(getOwnerPaymentsResource());
  },
  getIntegrationsQuery() {
    return toRouteQueryState(getOwnerIntegrationsResource());
  },
  getOnboardingQuery() {
    return toRouteQueryState(getDefaultOwnerOnboardingSeed());
  },
};
