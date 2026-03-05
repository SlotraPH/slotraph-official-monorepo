import type { CustomerRecord, CustomerStatus } from '@/domain/customer/types';
import { getOwnerCustomersResource } from '@/features/owner/data';
import type { ClientIntakeDraft } from '@/modules/clients/validation';

export interface CustomerActionResult {
  customer: CustomerRecord;
  previousStatus: CustomerStatus;
  savedAt: string;
}

export interface CustomerIntakeSaveResult {
  customer: CustomerRecord;
  savedAt: string;
}

export interface CustomerPersistenceSnapshot {
  customers: CustomerRecord[];
  intakeDraftCount: number;
}

export interface CustomerPersistenceClient {
  load(): Promise<CustomerPersistenceSnapshot>;
  saveIntakeDraft(draft: ClientIntakeDraft): Promise<CustomerIntakeSaveResult>;
  updateCustomerStatus(customerId: string, nextStatus: CustomerStatus): Promise<CustomerActionResult>;
  restoreDefaults(): Promise<CustomerPersistenceSnapshot>;
}

const CUSTOMER_STORAGE_KEY = 'slotra.owner.customers.v1';
const CUSTOMER_INTAKE_STORAGE_KEY = 'slotra.owner.customers.intake-count.v1';

function wait(durationMs: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, durationMs);
  });
}

function cloneCustomer(customer: CustomerRecord): CustomerRecord {
  return {
    ...customer,
    tags: [...customer.tags],
  };
}

function cloneCustomers(customers: CustomerRecord[]) {
  return customers.map(cloneCustomer);
}

function createDefaultCustomers() {
  const resource = getOwnerCustomersResource();
  const customers = resource.status === 'ready' ? resource.data.customers : [];
  return cloneCustomers(customers);
}

function readCustomersFromStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.sessionStorage.getItem(CUSTOMER_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as CustomerRecord[];
    if (!Array.isArray(parsed)) {
      return null;
    }
    return cloneCustomers(parsed);
  } catch {
    return null;
  }
}

function writeCustomersToStorage(customers: CustomerRecord[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customers));
}

function readIntakeCountFromStorage() {
  if (typeof window === 'undefined') {
    return 0;
  }

  const raw = window.sessionStorage.getItem(CUSTOMER_INTAKE_STORAGE_KEY);
  if (!raw) {
    return 0;
  }

  const parsed = Number.parseInt(raw, 10);
  return Number.isNaN(parsed) ? 0 : Math.max(parsed, 0);
}

function writeIntakeCountToStorage(count: number) {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(CUSTOMER_INTAKE_STORAGE_KEY, String(Math.max(0, count)));
}

function loadCustomers() {
  return readCustomersFromStorage() ?? createDefaultCustomers();
}

export const ownerCustomerPersistenceClient: CustomerPersistenceClient = {
  async load() {
    await wait(170);
    return {
      customers: loadCustomers(),
      intakeDraftCount: readIntakeCountFromStorage(),
    };
  },
  async saveIntakeDraft(draft) {
    await wait(210);

    const customers = loadCustomers();
    const nextCustomer: CustomerRecord = {
      id: `cus-draft-${Date.now()}`,
      name: draft.fullName.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      status: 'New',
      lastVisit: 'No visits yet',
      totalVisits: 0,
      totalSpend: 0,
      upcomingBooking: '—',
      source: 'Intake draft',
      notes: draft.notes.trim() || 'No notes captured',
      tags: ['Intake draft'],
    };

    const nextCustomers = [nextCustomer, ...customers];
    writeCustomersToStorage(nextCustomers);
    writeIntakeCountToStorage(readIntakeCountFromStorage() + 1);

    return {
      customer: cloneCustomer(nextCustomer),
      savedAt: new Date().toISOString(),
    };
  },
  async updateCustomerStatus(customerId, nextStatus) {
    await wait(180);

    const customers = loadCustomers();
    const customerIndex = customers.findIndex((item) => item.id === customerId);
    if (customerIndex < 0) {
      throw new Error('Customer record was not found. Refresh and retry this action.');
    }

    const current = customers[customerIndex];
    if (!current) {
      throw new Error('Customer record was not found. Refresh and retry this action.');
    }

    if (current.status === nextStatus) {
      throw new Error(`${current.name} is already tagged as ${nextStatus}. Choose a different status.`);
    }

    const updated: CustomerRecord = {
      ...current,
      status: nextStatus,
    };

    const nextCustomers = [...customers];
    nextCustomers[customerIndex] = updated;
    writeCustomersToStorage(nextCustomers);

    return {
      customer: cloneCustomer(updated),
      previousStatus: current.status,
      savedAt: new Date().toISOString(),
    };
  },
  async restoreDefaults() {
    await wait(160);
    const defaults = createDefaultCustomers();
    writeCustomersToStorage(defaults);
    writeIntakeCountToStorage(0);

    return {
      customers: defaults,
      intakeDraftCount: 0,
    };
  },
};
