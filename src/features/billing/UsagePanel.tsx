import React, { useEffect, useRef, useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import type { ApiClient } from '../../api/client';
import type { BillingOffer } from '../../shared/contracts/index';
import Action from '../../components/Action';
import { colors as c, type as t } from '../../design/tokens';

export default function UsagePanel({ api, accountId, blocked }: {
  api: ApiClient; accountId: string; blocked: boolean;
}) {
  const [offer, setOffer] = useState<BillingOffer>();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const generation = useRef(0);
  async function load() {
    const token = ++generation.current;
    setBusy(true); setError('');
    try {
      const result = await api.request<BillingOffer>('/billing');
      if (generation.current === token) setOffer(result);
    } catch { if (generation.current === token) setError('Could not load usage.'); }
    finally { if (generation.current === token) setBusy(false); }
  }
  useEffect(() => { setOffer(undefined); void load(); return () => { generation.current++; }; }, [api, accountId]);
  async function open(url: string) {
    try { await Linking.openURL(url); } catch { setError('Could not open the link.'); }
  }
  const dollars = (micro: number) => `$${(micro / 1_000_000).toFixed(2)}`;
  return <View style={s.panel}>
    <Text style={s.heading}>Generation usage</Text>
    {offer?.state.distribution === 'unlisted' && <Text style={s.body}>
      {offer.state.unlimitedUsage ? 'No monthly limit' : `${dollars(offer.state.remainingMicroUsd)} of $5 available this month`}
    </Text>}
    {offer?.state.halted && <Text style={s.body}>Generation temporarily unavailable</Text>}
    {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
    {!!error && <Action label="Retry" disabled={busy || blocked} onPress={() => { void load(); }} />}
    {offer?.privacyUrl && <Action label="Privacy" disabled={blocked} onPress={() => { void open(offer.privacyUrl!); }} />}
    {offer?.termsUrl && <Action label="Terms" disabled={blocked} onPress={() => { void open(offer.termsUrl!); }} />}
  </View>;
}
const s = StyleSheet.create({
  panel: { padding: 16, borderWidth: 1, borderColor: c.line, borderRadius: 8, gap: 12 },
  heading: { ...t.heading, color: c.text }, body: { ...t.body, color: c.secondary },
  error: { ...t.body, color: c.danger },
});
