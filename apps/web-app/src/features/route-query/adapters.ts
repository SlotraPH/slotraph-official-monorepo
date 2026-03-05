import type { ResourceState } from '@/features/resource';
import type { ResolvedRouteQueryState } from './contracts';
import { createErrorRouteQuery, createLoadingRouteQuery, createSuccessRouteQuery } from './contracts';

export function toRouteQueryState<T>(resource: ResourceState<T>): ResolvedRouteQueryState<T> {
  if (resource.status === 'loading') {
    return createLoadingRouteQuery();
  }

  if (resource.status === 'error') {
    return createErrorRouteQuery(resource.message);
  }

  return createSuccessRouteQuery<T>(resource.data);
}
