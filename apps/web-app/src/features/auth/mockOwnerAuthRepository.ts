import { appConfig } from '@/config/env';
import type { OwnerAuthRepository } from './contracts';

export const mockOwnerAuthRepository: OwnerAuthRepository = {
  getSession() {
    if (appConfig.ownerAuthMode === 'mock-session') {
      return {
        status: 'anonymous',
        ownerId: null,
        businessId: null,
      };
    }

    return {
      status: 'authenticated',
      ownerId: 'owner-demo',
      businessId: 'business-dheyns-barbershop',
    };
  },
};
