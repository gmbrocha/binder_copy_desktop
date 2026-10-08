import type { BillingState } from '../../shared/contracts/index';

export type StoreProduct = { id: string; name: string; description: string; displayPrice: string; periodValue: number; periodUnit: string; type?: 'subscription' | 'consumable' };
export type PurchaseEvidence = { transactionId: string; signedTransaction: string; environment: 'Production' | 'Sandbox' | 'Xcode'; productId: string };
export type PurchaseResult = { status: 'cancelled' | 'pending' } | { status: 'purchased'; transaction: PurchaseEvidence };
export interface PurchaseStore {
  products(ids: string[]): Promise<StoreProduct[]>;
  purchase(id: string, token: string): Promise<PurchaseResult>;
  pending(token: string): Promise<PurchaseEvidence[]>;
  restore(token: string): Promise<PurchaseEvidence[]>;
  finish(id: string, token: string): Promise<void>;
  listen(changed: () => void): { remove(): void };
}

/** This instance belongs to one signed-in account. Recreate it after account switching. */
export class PurchaseCoordinator {
  private busy = false;
  constructor(private store: PurchaseStore, readonly accountId: string,
    private currentAccount: () => string | undefined,
    private verify: (evidence: PurchaseEvidence) => Promise<BillingState>) {}

  private assertAccount() {
    if (this.currentAccount() !== this.accountId) throw new Error('Your account changed. Please try again.');
  }
  private async reconcile(evidence: PurchaseEvidence) {
    this.assertAccount();
    if (evidence.environment === 'Xcode') throw new Error('Local StoreKit purchases cannot activate a live account.');
    const state = await this.verify(evidence);
    this.assertAccount();
    await this.store.finish(evidence.transactionId, this.accountId);
    return state;
  }
  private async exclusive<T>(work: () => Promise<T>): Promise<T> {
    if (this.busy) throw new Error('A purchase check is already in progress.');
    this.assertAccount();
    this.busy = true;
    try { return await work(); } finally { this.busy = false; }
  }
  purchase(id: string) {
    return this.exclusive(async () => {
      const result = await this.store.purchase(id, this.accountId);
      if (result.status !== 'purchased') return { status: result.status };
      return { status: 'purchased' as const, state: await this.reconcile(result.transaction) };
    });
  }
  recover(restore = false) {
    return this.exclusive(async () => {
      const evidence = await (restore ? this.store.restore(this.accountId) : this.store.pending(this.accountId));
      let state: BillingState | undefined;
      for (const item of evidence) state = await this.reconcile(item);
      return state;
    });
  }
}
