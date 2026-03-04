import type { ServiceRecord, ServiceStatus } from '@/domain/service/types';

export interface ServiceSaveInput {
  id?: string;
  name: string;
  category: string;
  durationMinutes: number;
  price: number;
  visibility: ServiceRecord['visibility'];
  status: ServiceStatus;
  description: string;
}

export interface ServiceRepository {
  list(): ServiceRecord[];
  save(input: ServiceSaveInput): ServiceRecord;
  setStatus(serviceId: string, status: ServiceStatus): ServiceRecord[];
}
