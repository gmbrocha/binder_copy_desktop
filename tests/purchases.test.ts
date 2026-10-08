import test from 'node:test';
import assert from 'node:assert/strict';
import { PurchaseCoordinator, type PurchaseStore, type PurchaseEvidence, type PurchaseResult } from '../src/features/billing/purchases';
import type { BillingState } from '../src/shared/contracts/index';

const state: BillingState = { tier: 'paid', environment: 'Sandbox', expiresAt: 100, needsRefresh: false, period: '2026-10', allowanceMicroUsd: 0, committedMicroUsd: 0, remainingMicroUsd: 0, halted: false, paidApi: false };
function setup() {
  const evidence: PurchaseEvidence = { transactionId: '123', signedTransaction: 'signed', environment: 'Sandbox', productId: 'monthly' };
  const events: string[] = [];
  let result: PurchaseResult = { status: 'purchased', transaction: evidence }, account = 'account-a';
  let verify = async () => { events.push('verify'); return state; };
  const store: PurchaseStore = {
    products: async () => [], purchase: async () => result,
    pending: async () => [evidence], restore: async () => { events.push('restore'); return [evidence]; },
    finish: async () => { events.push('finish'); }, listen: () => ({ remove() {} }),
  };
  const coordinator = new PurchaseCoordinator(store, account, () => account, () => verify());
  return { coordinator, events, evidence, setResult: (value: PurchaseResult) => { result = value; },
    switchAccount: () => { account = 'account-b'; }, verifyWith: (fn: typeof verify) => { verify = fn; } };
}
test('purchase finishes only after backend validation, and pending/cancelled do not grant access', async () => {
  const f = setup();
  assert.equal((await f.coordinator.purchase('monthly')).status, 'purchased');
  assert.deepEqual(f.events, ['verify', 'finish']);
  f.events.length = 0;
  f.setResult({ status: 'pending' });
  assert.equal((await f.coordinator.purchase('monthly')).status, 'pending');
  f.setResult({ status: 'cancelled' });
  assert.equal((await f.coordinator.purchase('monthly')).status, 'cancelled');
  assert.deepEqual(f.events, []);
});
test('interrupted verification leaves transaction unfinished for launch recovery or restore', async () => {
  const f = setup();
  f.verifyWith(async () => { throw new Error('offline'); });
  await assert.rejects(f.coordinator.purchase('monthly'), /offline/);
  assert.deepEqual(f.events, []);
  f.verifyWith(async () => { f.events.push('verify'); return state; });
  await f.coordinator.recover();
  assert.deepEqual(f.events, ['verify', 'finish']);
  f.events.length = 0;
  await f.coordinator.recover(true);
  assert.deepEqual(f.events, ['restore', 'verify', 'finish']);
});
test('switching accounts mid-verification never finishes the previous account purchase', async () => {
  const f = setup();
  f.verifyWith(async () => { f.switchAccount(); return state; });
  await assert.rejects(f.coordinator.purchase('monthly'), /account changed/);
  assert.deepEqual(f.events, []);
});
test('simultaneous purchase actions and local Xcode evidence cannot activate live access', async () => {
  const f = setup();
  let complete!: (state: BillingState) => void;
  f.verifyWith(() => new Promise(resolve => { complete = resolve; }));
  const first = f.coordinator.purchase('monthly');
  await assert.rejects(f.coordinator.purchase('monthly'), /already in progress/);
  complete(state);
  await first;
  f.evidence.environment = 'Xcode';
  await assert.rejects(f.coordinator.recover(), /cannot activate/);
});
