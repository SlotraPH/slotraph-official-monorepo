import { beforeEach, describe, expect, it } from 'vitest';
import { ownerCustomerPersistenceClient } from './persistenceClient';

describe('ownerCustomerPersistenceClient', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('loads default customer snapshot', async () => {
    const snapshot = await ownerCustomerPersistenceClient.load();

    expect(snapshot.customers.length).toBeGreaterThan(0);
    expect(snapshot.intakeDraftCount).toBe(0);
  });

  it('saves intake draft and persists count', async () => {
    const save = await ownerCustomerPersistenceClient.saveIntakeDraft({
      fullName: 'Test Client',
      email: 'test@example.com',
      phone: '09171234567',
      notes: 'Retention note',
    });

    expect(save.customer.name).toBe('Test Client');
    const snapshot = await ownerCustomerPersistenceClient.load();
    expect(snapshot.intakeDraftCount).toBe(1);
    expect(snapshot.customers[0]?.name).toBe('Test Client');
  });

  it('updates customer status with previous status metadata', async () => {
    const initial = await ownerCustomerPersistenceClient.load();
    const target = initial.customers[0];
    expect(target).toBeTruthy();
    if (!target) {
      throw new Error('Expected default customer seed');
    }

    const result = await ownerCustomerPersistenceClient.updateCustomerStatus(target.id, 'Active');

    expect(result.previousStatus).toBe(target.status);
    expect(result.customer.status).toBe('Active');
  });
});
