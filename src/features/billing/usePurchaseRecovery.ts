import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import type { ApiClient } from '../../api/client';
import type { BillingOffer, BillingState } from '../../shared/contracts/index';
import { purchaseStore } from '../../platform/purchases';
import { PurchaseCoordinator } from './purchases';

/** No purchase dialogs on launch: recover only evidence already owned by this account. */
export function usePurchaseRecovery(api: ApiClient, accountId: string | undefined, onChanged: () => Promise<void>) {
  const account = useRef(accountId), changed = useRef(onChanged);
  account.current = accountId; changed.current = onChanged;
  useEffect(() => {
    if (!accountId || !purchaseStore) return;
    let active = true, running = false;
    const coordinator = new PurchaseCoordinator(purchaseStore, accountId, () => active ? account.current : undefined,
      evidence => api.request<BillingState>('/billing/apple/sync', 'POST', { signedTransaction: evidence.signedTransaction, environment: evidence.environment }));
    const recover = async () => {
      if (!active || running || account.current !== accountId) return;
      running = true;
      try {
        const offer = await api.request<BillingOffer>('/billing');
        if (offer.purchasingAvailable && active) {
          const result = await coordinator.recover();
          if (result && active) await changed.current();
        }
      } catch { /* Keep unfinished evidence; Settings offers an explicit restore/retry. */ }
      finally { running = false; }
    };
    void recover();
    const subscription = purchaseStore.listen(() => { void recover(); });
    const appState = AppState.addEventListener('change', state => { if (state === 'active') void recover(); });
    const timer = setInterval(() => { if (AppState.currentState === 'active') void recover(); }, 10 * 60_000);
    return () => { active = false; clearInterval(timer); subscription.remove(); appState.remove(); };
  }, [api, accountId]);
}
