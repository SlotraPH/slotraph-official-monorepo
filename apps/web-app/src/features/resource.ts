export type ResourceState<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: T };

export function createReadyResource<T>(data: T): ResourceState<T> {
  return { status: 'ready', data };
}
