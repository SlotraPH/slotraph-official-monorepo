import { createReadyResource } from '@/features/resource';
import { mockOwnerAuthRepository } from './mockOwnerAuthRepository';

export function getOwnerRouteAccessResource() {
  return createReadyResource({
    session: mockOwnerAuthRepository.getSession(),
  });
}
