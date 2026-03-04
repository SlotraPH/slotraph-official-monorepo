import type { CustomerRecord } from '@/domain/customer/types';

export interface CustomerRepository {
  list(): CustomerRecord[];
  getById(customerId: string): CustomerRecord | null;
}
