import { beforeEach, describe, expect, it } from 'vitest';
import { ownerPaymentsPersistenceClient } from './persistenceClient';

describe('ownerPaymentsPersistenceClient', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('loads payment snapshot with activity rows', async () => {
    const snapshot = await ownerPaymentsPersistenceClient.load();

    expect(snapshot.operations.length).toBeGreaterThan(0);
    expect(snapshot.policy.collectionMethod).toBeTruthy();
  });

  it('saves payment policy', async () => {
    const result = await ownerPaymentsPersistenceClient.savePolicy({
      collectionMethod: 'manual-transfer',
      depositType: 'flat',
      depositValue: '1000',
      requireDepositFor: 'all-bookings',
      instructions: 'Collect payment proof before confirmation.',
    });

    expect(result.policy.collectionMethod).toBe('manual-transfer');

    const snapshot = await ownerPaymentsPersistenceClient.load();
    expect(snapshot.policy.depositValue).toBe('1000');
  });

  it('rejects invalid operation transition', async () => {
    const snapshot = await ownerPaymentsPersistenceClient.load();
    const paidOperation = snapshot.operations.find((item) => item.status === 'paid');

    expect(paidOperation).toBeTruthy();
    await expect(
      ownerPaymentsPersistenceClient.transitionOperation(paidOperation!.id, 'failed'),
    ).rejects.toThrow('Paid payments can only transition to refunded.');
  });
});
