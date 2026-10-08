import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ApiClient, ApiError } from '../../api/client';
import type { Card, CardPrices, Tag } from '../../shared/contracts';
import CardImage from '../../components/CardImage';
import Action from '../../components/Action';
import { colors as c, type as t } from '../../design/tokens';

type History = { entries: { revision: number; actor: string; createdAt: string; kind: string }[] };
export default function CardDetails({ api, initial, tags, canCurate, onUpdate, onClose }: { api: ApiClient; initial: Card; tags: Tag[]; canCurate: boolean; onUpdate: (card: Card) => void; onClose: () => void }) {
  const [card, setCard] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string[]>(initial.tags);
  const [art, setArt] = useState(initial.art);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [conflict, setConflict] = useState(false);
  const [prices, setPrices] = useState<CardPrices>();
  const [history, setHistory] = useState<History>();
  const [ready, setReady] = useState(false);
  const path = '/cards/' + encodeURIComponent(card.id);
  const update = (next: Card) => { setCard(next); onUpdate(next); };
  useEffect(() => {
    let active = true;
    void api.request<Card>(path).then(next => { if (active) { update(next); setDraft(next.tags); setArt(next.art); setReady(true); } }).catch(() => { if (active) setError('Could not refresh this card.'); });
    return () => { active = false; };
  }, [api, path]);
  const run = async (action: () => Promise<void>) => {
    if (busy) return;
    setBusy(true); setError('');
    try { await action(); } catch (e) { setError(e instanceof Error ? e.message : 'Could not complete this action.'); if (e instanceof ApiError && e.status === 409) setConflict(true); }
    finally { setBusy(false); }
  };
  const reload = () => run(async () => {
    const next = await api.request<Card>(path); update(next); setDraft(next.tags); setArt(next.art); setConflict(false); setHistory(undefined); setReady(true);
  });
  const save = () => run(async () => {
    const next = await api.request<Card>('/admin/cards/' + encodeURIComponent(card.id), 'PUT', { tags: draft, art, revision: card.curationRevision ?? 0 });
    update(next); setEditing(false); setConflict(false); setHistory(undefined);
  });
  const tagById = new Map(tags.map(tag => [tag.id, tag]));
  return <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
    <View style={s.row}><Text style={[s.heading, { flex: 1 }]}>{editing ? 'Edit tags' : 'Card details'}</Text><Action label="Done" disabled={busy} onPress={onClose} /></View>
    {busy && <ActivityIndicator color={c.accent} />}
    {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
    {!!error && !ready && <Action label="Reload card" disabled={busy} onPress={reload} />}
    <CardImage api={api} id={card.id} accessibilityLabel={card.name} style={{ height: 340, width: '100%' }} />
    <Text style={s.title}>{card.name}</Text>
    <Text style={s.body}>{card.setName} · {card.number}</Text>
    <Text style={s.caption}>{[card.rarity, card.artist].filter(Boolean).join(' · ')}</Text>
    <Action label={card.owned ? 'Remove from collection' : 'Add to collection'} disabled={busy || !ready} onPress={() => run(async () => { const result = await api.ownership(card.id, !card.owned); update({ ...card, owned: result.owned }); })} />
    {!editing && <>
      <View style={s.row}><Text style={[s.heading, { flex: 1 }]}>Tags</Text>{canCurate && <Action label="Edit tags" disabled={!ready || busy} onPress={() => { setDraft(card.tags); setArt(card.art); setEditing(true); }} />}</View>
      <View style={s.chips}>{card.tags.map(tag => <Text key={tag} style={s.chip}>{tagById.get(tag)?.label ?? tag}</Text>)}</View>
      {!card.tags.length && <Text style={s.body}>No tags yet.</Text>}
      {!!card.annotation?.description && <Text style={s.body}>{card.annotation.description}</Text>}
      <Action label={prices ? 'Refresh prices' : 'Check prices'} disabled={busy} onPress={() => run(async () => setPrices(await api.request<CardPrices>(path + '/prices')))} />
      {prices && <View style={{ gap: 8 }}><Text style={s.caption}>{prices.source} · USD{prices.updatedAt ? ` · ${new Date(prices.updatedAt).toLocaleDateString()}` : ''}</Text>{prices.variants.length ? prices.variants.map(variant => <View key={variant.name} style={s.row}><View style={{ flex: 1 }}><Text style={s.body}>{variant.name}</Text><Text style={s.caption}>Market {variant.market == null ? '—' : '$' + variant.market.toFixed(2)} · Low {variant.low == null ? '—' : '$' + variant.low.toFixed(2)}</Text></View>{variant.url && /^https:\/\/(?:www\.)?tcgplayer\.com\//.test(variant.url) && <Action label="View" onPress={() => run(async () => { await Linking.openURL(variant.url!); })} />}</View>) : <Text style={s.body}>No prices available for this card.</Text>}</View>}
    </>}
    {editing && <>
      <Text style={s.caption}>Shared catalog</Text>
      <View style={s.row}>{(['full', 'standard', 'unknown'] as const).map(value => <Action key={value} label={{ full: 'Full art', standard: 'Common art', unknown: 'Unknown' }[value]} primary={art === value} disabled={busy} onPress={() => setArt(value)} />)}</View>
      <TextInput accessibilityLabel="Filter tags" placeholder="Filter tags" placeholderTextColor={c.muted} value={query} onChangeText={setQuery} style={s.input} />
      <View style={s.tagGrid}>{tags.filter(tag => [tag.label, ...tag.aliases].some(value => value.toLowerCase().includes(query.toLowerCase()))).map(tag => <Pressable key={tag.id} accessibilityRole="checkbox" accessibilityState={{ checked: draft.includes(tag.id) }} disabled={busy} onPress={() => setDraft(previous => previous.includes(tag.id) ? previous.filter(id => id !== tag.id) : [...previous, tag.id])} style={s.tagOption}><View style={[s.check, draft.includes(tag.id) && { backgroundColor: c.accent }]}><Text style={{ color: c.onAccent }}>{draft.includes(tag.id) ? '✓' : ''}</Text></View><Text style={[s.body, { flex: 1 }]}>{tag.label}</Text></Pressable>)}</View>
      {conflict ? <Action label="Reload current tags" disabled={busy} onPress={reload} /> : <View style={s.row}><Action label="Cancel" disabled={busy} onPress={() => setEditing(false)} /><Action label="Save tags" primary disabled={busy} onPress={save} /></View>}
      <Action label="History" disabled={busy} onPress={() => run(async () => setHistory(await api.request<History>(path + '/history')))} />
      {history && <View style={{ gap: 8 }}>{history.entries.map(entry => <Text style={s.caption} key={entry.revision}>{entry.kind} · {entry.actor} · {new Date(entry.createdAt).toLocaleString()}</Text>)}{history.entries[0]?.kind === 'edit' && <Action label="Undo last edit" disabled={busy || conflict} onPress={() => run(async () => { const next = await api.request<Card>('/admin/cards/' + encodeURIComponent(card.id) + '/undo', 'POST', { revision: card.curationRevision ?? 0 }); update(next); setDraft(next.tags); setArt(next.art); setHistory(undefined); })} />}</View>}
    </>}
  </ScrollView>;
}
const s = StyleSheet.create({ content: { padding: 20, paddingBottom: 40, gap: 16, width: '100%', maxWidth: 760, alignSelf: 'center' }, row: { flexDirection: 'row', alignItems: 'center', gap: 8 }, title: { ...t.title, color: c.text }, heading: { ...t.heading, color: c.text }, body: { ...t.body, color: c.secondary }, caption: { ...t.caption, color: c.muted }, error: { ...t.body, color: c.danger }, chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 }, chip: { ...t.caption, color: c.text, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, backgroundColor: c.raised }, input: { ...t.body, minHeight: 44, color: c.text, borderWidth: 1, borderColor: c.border, borderRadius: 8, paddingHorizontal: 12 }, tagGrid: { flexDirection: 'row', flexWrap: 'wrap' }, tagOption: { width: '50%', flexDirection: 'row', alignItems: 'center', minHeight: 44, gap: 10, paddingRight: 8 }, check: { width: 22, height: 22, borderRadius: 4, borderColor: c.border, borderWidth: 1, alignItems: 'center', justifyContent: 'center' } });
