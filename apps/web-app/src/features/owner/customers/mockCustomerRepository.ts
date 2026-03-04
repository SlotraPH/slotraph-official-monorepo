import type { CustomerRecord } from '@/domain/customer/types';
import { OWNER_CUSTOMERS } from '@/mocks/customers';
import type { CustomerRepository } from './contracts';

export const mockCustomerRepository: CustomerRepository = {
  list() {
    return OWNER_CUSTOMERS.map<CustomerRecord>((customer) => ({
      ...customer,
      tags: [...customer.tags],
    }));
  },
  getById(customerId) {
    const customer = OWNER_CUSTOMERS.find((item) => item.id === customerId);

    return customer
      ? {
          ...customer,
          tags: [...customer.tags],
        }
      : null;
  },
};
