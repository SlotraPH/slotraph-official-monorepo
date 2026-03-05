export type RouteQueryStatus = 'idle' | 'loading' | 'success' | 'error';

export type RouteQueryState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };

export type ResolvedRouteQueryState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };

export function createIdleRouteQuery(): { status: 'idle' } {
  return { status: 'idle' };
}

export function createLoadingRouteQuery(): { status: 'loading' } {
  return { status: 'loading' };
}

export function createSuccessRouteQuery<T>(data: T): { status: 'success'; data: T } {
  return { status: 'success', data };
}

export function createErrorRouteQuery(message: string): { status: 'error'; message: string } {
  return { status: 'error', message };
}
