import type { ServiceRecord } from '@/domain/service/types';
import { OWNER_SERVICES } from '@/mocks/services';
import type { ServiceRepository, ServiceSaveInput } from './contracts';

function cloneServices(items: ServiceRecord[]) {
  return items.map<ServiceRecord>((service) => ({
    ...service,
    staffIds: [...service.staffIds],
  }));
}

export const mockServiceRepository: ServiceRepository = {
  list() {
    return cloneServices(OWNER_SERVICES);
  },
  save(input: ServiceSaveInput) {
    return {
      id: input.id ?? `svc-${Date.now()}`,
      name: input.name,
      category: input.category,
      durationMinutes: input.durationMinutes,
      price: input.price,
      visibility: input.visibility,
      status: input.status,
      description: input.description,
      bookings: 0,
      staffSelectionMode: 'required',
      staffIds: [],
      leadNote: 'Prepared through the mock owner repository.',
    };
  },
  setStatus(serviceId, status) {
    return cloneServices(OWNER_SERVICES).map((service) =>
      service.id === serviceId
        ? {
            ...service,
            status,
          }
        : service
    );
  },
};
