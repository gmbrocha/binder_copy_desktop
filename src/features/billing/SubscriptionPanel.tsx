import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet, Text, View } from 'react-native';
import type { ApiClient } from '../../api/client';
import type { BillingOffer, BillingState } from '../../shared/contracts/index';
import Action from '../../components/Action';
import { colors as c, type as t } from '../../design/tokens';
import { purchaseStore } from '../../platform/purchases';
import { PurchaseCoordinator, type StoreProduct } from './purchases';

export default function SubscriptionPanel({ api, accountId, blocked, onChanged }: {
  api: ApiClient; accountId: string; blocked: boolean; onChanged: () => Promise<void>;
}) {
  const [offer, setOffer] = useState<BillingOffer>();
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const account = useRef<string | undefined>(accountId);
  account.current = accountId;
  const pending = useRef(false);
  const coordinator = purchaseStore ? new PurchaseCoordinator(purchaseStore, accountId, () => account.current,
    evidence => api.request<BillingState>('/billing/apple/sync', 'POST', { signedTransaction: evidence.signedTransaction, environment: evidence.environment })) : null;
  async function load() {
    const current = await api.request<BillingOffer>('/billing');
    if (account.current !== accountId) return;
    setOffer(current);
    if (current.purchasingAvailable && purchaseStore) {
      const available = await purchaseStore.products(current.productIds);
      if (account.current === accountId) setProducts(available);
    }
  }
  useEffect(() => {
    account.current = accountId;
    let active = true;
    void load().catch(() => { if (active) setError('Could not load your plan.'); });
    return () => { active = false; account.current = undefined; };
  }, [api, accountId]);
  async function run(work: () => Promise<void>) {
    if (pending.current || blocked) return;
    pending.current = true; setBusy(true); setError(''); setMessage('');
    try { await work(); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not complete the purchase.'); }
    finally { pending.current = false; setBusy(false); }
  }
  const unavailable = busy || blocked || !coordinator;
  return <View style={s.panel}>
    <Text style={s.heading}>Plan</Text>
    {offer && <Text style={s.body}>{offer.state.tier === 'complimentary' ? 'Complimentary' : offer.state.tier === 'paid' ? 'Plus' : 'Free'}</Text>}
    {busy && <ActivityIndicator color={c.accent} />}
    {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
    {!!message && <Text accessibilityRole="alert" style={s.body}>{message}</Text>}
    {offer?.state.credits && <View style={s.product}>
      <Text style={s.body}>Backgrounds: {offer.state.credits.includedImages} included · {offer.state.credits.purchasedImages} purchased</Text>
      <Text style={s.body}>Theme lookups: {offer.state.credits.includedThemes}</Text>
    </View>}
    {offer?.purchasingAvailable && products.filter(product => product.type === 'consumable' || offer.state.tier === 'free').map(product => <View key={product.id} style={s.product}>
      <Text style={s.body}>{product.description}</Text>
      <Action label={product.type === 'consumable' ? `${product.name} · ${product.displayPrice}` : `Upgrade · ${product.displayPrice} / ${product.periodValue > 1 ? `${product.periodValue} ` : ''}${product.periodUnit}`}
        disabled={unavailable} onPress={() => run(async () => {
          const result = await coordinator!.purchase(product.id);
          if (result.status === 'pending') setMessage('Awaiting approval from Apple.');
          if (result.status === 'purchased') { await load(); await onChanged(); }
        })} />
      <Text style={s.caption}>{product.type === 'consumable' ? 'One-time purchase. Purchased credits do not expire.' : 'Renews automatically until canceled in your Apple subscriptions.'}</Text>
    </View>)}
    {offer?.purchasingAvailable && <Action label="Restore purchases" disabled={unavailable} onPress={() => run(async () => {
      const restored = await coordinator!.recover(true);
      await load(); await onChanged();
      setMessage(restored ? 'Purchases synced.' : 'Account balances refreshed. No additional purchase was found.');
    })} />}
    {offer?.state.tier === 'paid' && <Action label="Manage subscription" disabled={busy || blocked}
      onPress={() => run(async () => { await Linking.openURL('https://apps.apple.com/account/subscriptions'); })} />}
    {!!error && <Action label="Retry" disabled={busy || blocked} onPress={() => run(load)} />}
    {offer?.privacyUrl && <Action label="Privacy" disabled={busy || blocked} onPress={() => run(async () => { await Linking.openURL(offer.privacyUrl!); })} />}
    {offer?.termsUrl && <Action label="Terms" disabled={busy || blocked} onPress={() => run(async () => { await Linking.openURL(offer.termsUrl!); })} />}
  </View>;
}
const s = StyleSheet.create({
  panel: { padding: 16, borderWidth: 1, borderColor: c.line, borderRadius: 8, gap: 12 },
  product: { gap: 10 }, heading: { ...t.heading, color: c.text }, body: { ...t.body, color: c.secondary },
  caption: { ...t.caption, color: c.muted }, error: { ...t.body, color: c.danger },
});
