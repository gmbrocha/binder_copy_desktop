import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { ApiClient, type Bootstrap } from './api/client';
import CardImage from './components/CardImage';
import { emptyFilters, type Card, type Page } from './shared/contracts/index';
import { palettes } from './shared/domain/palettes';
import { newPage, PageSession } from './features/build/pageSession';
import { colors as c, type as typography } from './design/tokens';

function Button({ label, onPress, disabled = false, primary = false }: { label: string; onPress: () => void; disabled?: boolean; primary?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [s.button, primary && s.primary, disabled && s.disabled, pressed && s.pressed]}><Text style={[s.buttonText, primary && { color: c.onAccent }]}>{label}</Text></Pressable>;
}
export default function Workbench({ api, createId, desktop = false, onSignOut }: { api: ApiClient; createId: () => string; desktop?: boolean; onSignOut?: () => Promise<void> }) {
  const { width } = useWindowDimensions();
  const [tab, setTab] = useState<'Build' | 'Cards' | 'Library'>('Build');
  const [bootstrap, setBootstrap] = useState<Bootstrap>();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [, render] = useState(0);
  const [session, setSession] = useState(() => new PageSession(newPage(createId()), p => api.save(p), () => render(n => n + 1)));
  const [selected, setSelected] = useState(0);
  const [cards, setCards] = useState<Record<string, Card>>({});
  const [results, setResults] = useState<Card[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [ownedOnly, setOwnedOnly] = useState(false);
  const [pages, setPages] = useState<Page[]>([]);
  const [library, setLibrary] = useState<'Pages' | 'Collection'>('Pages');
  const [picker, setPicker] = useState<'manual' | 'favorite' | null>(null);
  const [detail, setDetail] = useState<Card | null>(null);
  const [settings, setSettings] = useState(false);
  const [proposal, setProposal] = useState<Page | null>(null);
  const searchVersion = useRef(0);
  const page = session.page;
  const remember = (items: Card[]) => setCards(existing => ({ ...existing, ...Object.fromEntries(items.map(card => [card.id, card])) }));
  const report = (e: unknown) => setError(e instanceof Error ? e.message : 'Something went wrong.');
  const run = async (fn: () => Promise<void>) => { setBusy(true); setError(''); try { await fn(); } catch (e) { report(e); } finally { setBusy(false); } };
  useEffect(() => { void api.bootstrap().then(setBootstrap).catch(report); }, [api]);
  const searchActive = tab === 'Cards' || (tab === 'Library' && library === 'Collection') || !!picker;
  const onlyOwned = (tab === 'Library' && !picker) || ownedOnly;
  useEffect(() => {
    if (!searchActive) return;
    const version = ++searchVersion.current;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      const filters = { ...emptyFilters(), q: query, ownership: onlyOwned ? 'owned' as const : 'all' as const };
      void api.search(filters, 0, desktop ? 80 : 48, controller.signal).then(result => {
        if (version !== searchVersion.current) return;
        remember(result.cards); setResults(result.cards); setTotal(result.total);
      }).catch(e => { if (!controller.signal.aborted) report(e); });
    }, 200);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [api, query, searchActive, onlyOwned, desktop]);
  useEffect(() => { if (tab === 'Library' && library === 'Pages') void api.pages().then(r => setPages(r.pages)).catch(report); }, [api, tab, library]);
  useEffect(() => {
    if (!session.dirty || session.error || !bootstrap || (!page.revision && page.name === 'Untitled page' && !page.slots.some(x => x.cardId))) return;
    const timer = setTimeout(() => { void session.save().catch(report); }, 700);
    return () => clearTimeout(timer);
  }, [session, JSON.stringify(page), bootstrap, session.error]);
  const openPage = async (next: Page) => {
    if (session.dirty && (page.revision || page.name !== 'Untitled page' || page.slots.some(x => x.cardId))) await session.save();
    const loaded = await api.cards(next.slots.flatMap(slot => slot.cardId ? [slot.cardId] : []));
    remember(loaded.cards);
    setSession(new PageSession(next, p => api.save(p), () => render(n => n + 1)));
    setSelected(0); setTab('Build');
  };
  const choose = async (card: Card) => {
    if (picker === 'favorite') {
      const slots = page.slots.map((slot, i) => i === selected ? { cardId: card.id, locked: true } : slot);
      const result = await api.request<{ slots: Page['slots']; cards: Card[]; palette?: Page['palette'] }>('/generate', 'POST', { filters: page.filters, slots, seedCardId: card.id });
      remember(result.cards);
      setProposal({ ...page, slots: result.slots, seedCardId: card.id, palette: result.palette ?? page.palette });
    } else {
      session.edit(p => ({ ...p, slots: p.slots.map((slot, i) => i === selected ? { ...slot, cardId: card.id } : slot) }));
    }
    setPicker(null);
  };
  const more = () => run(async () => {
    const version = searchVersion.current;
    const result = await api.search({ ...emptyFilters(), q: query, ownership: onlyOwned ? 'owned' : 'all' }, results.length, desktop ? 80 : 48);
    if (version !== searchVersion.current) return;
    remember(result.cards); setResults(current => [...current, ...result.cards]); setTotal(result.total);
  });
  const columns = desktop ? Math.max(3, Math.floor((width - 48) / 160)) : 3;
  const cardGrid = (select: (card: Card) => void) => <View style={{ flex: 1 }}>
    <View style={s.row}><TextInput accessibilityLabel="Search cards" placeholder="Search cards" placeholderTextColor={c.muted} value={query} onChangeText={setQuery} style={[s.input, { flex: 1 }]} /><Button label={ownedOnly ? 'Owned' : 'All cards'} onPress={() => setOwnedOnly(v => !v)} /></View>
    <FlatList key={columns} numColumns={columns} data={results} keyExtractor={card => card.id} contentContainerStyle={{ gap: 12, paddingVertical: 16 }} columnWrapperStyle={{ gap: 12 }} renderItem={({ item }) => <Pressable accessibilityRole="button" accessibilityLabel={item.name + ', ' + item.setName} style={{ width: `${(100 - (columns - 1) * 1) / columns}%`, flex: 1, maxWidth: `${100 / columns}%` }} onPress={() => select(item)}><CardImage api={api} id={item.id} style={s.cardArt} resizeMode="contain" /><Text numberOfLines={1} style={s.caption}>{item.name}</Text></Pressable>} ListEmptyComponent={<Text style={s.muted}>No cards found.</Text>} ListFooterComponent={results.length < total ? <Button label="More cards" onPress={more} disabled={busy} /> : null} />
  </View>;
  const sheet = (shown: Page, interactive: boolean) => <View style={[s.sheet, { backgroundColor: palettes[shown.palette ?? 'forge'].bg }]}>
    <Text style={[s.heading, { textAlign: 'center', color: palettes[shown.palette ?? 'forge'].text, marginBottom: 12 }]}>{shown.name}</Text>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{shown.slots.map((slot, i) => <View key={i} style={{ width: `${100 / shown.size}%`, padding: 3 }}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Slot ${i + 1}${slot.cardId ? ', ' + (cards[slot.cardId]?.name ?? 'Card') : ', empty'}`} onPress={() => interactive && setSelected(i)} style={[s.slot, interactive && selected === i && { borderColor: c.accent }]}>
        {slot.cardId ? <CardImage api={api} id={slot.cardId} style={{ width: '100%', height: '100%' }} resizeMode="contain" /> : <Text style={s.muted}>{i + 1}</Text>}
      </Pressable>
      {interactive && slot.cardId && <Pressable accessibilityRole="button" accessibilityLabel={`${slot.locked ? 'Unlock' : 'Lock'} slot ${i + 1}`} hitSlop={8} style={s.lock} onPress={() => session.edit(p => ({ ...p, slots: p.slots.map((x, n) => n === i ? { ...x, locked: !x.locked } : x) }))}><Text style={s.caption}>{slot.locked ? 'Locked' : 'Open'}</Text></Pressable>}
    </View>)}</View>
  </View>;
  const navigation = <View accessibilityRole="tablist" style={s.tabs}>{(['Build', 'Cards', 'Library'] as const).map(name => <Pressable key={name} accessibilityRole="tab" accessibilityState={{ selected: tab === name }} onPress={() => setTab(name)} style={[s.tab, tab === name && s.activeTab]}><Text style={[s.buttonText, tab === name && { color: c.accent }]}>{name}</Text></Pressable>)}</View>;
  return <View style={s.root}>
    <View style={s.header}><Image accessibilityLabel="BinderCopy" source={require('../assets/brand/wordmark.png')} style={{ width: 176, height: 38 }} resizeMode="contain" /><Button label="Settings" onPress={() => setSettings(true)} /></View>
    {desktop && navigation}
    {!!error && <Pressable accessibilityRole="button" accessibilityLabel="Dismiss error" onPress={() => setError('')} style={s.error}><Text style={{ color: c.danger }}>{error}</Text></Pressable>}
    {busy && <ActivityIndicator color={c.accent} />}
    <View style={s.body}>
      {tab === 'Build' && <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 24, alignItems: 'center' }}>
        <View style={{ width: '100%', maxWidth: desktop ? 1240 : 580, gap: 16 }}>
          <View style={s.row}><TextInput accessibilityLabel="Page name" style={[s.input, { flex: 1 }]} value={page.name} onChangeText={name => session.edit(p => ({ ...p, name }))} onEndEditing={() => { if (!page.name.trim()) session.edit(p => ({ ...p, name: 'Untitled page' })); }} /><Button label="+ New" onPress={() => run(() => openPage(newPage(createId())))} /></View>
          <View style={[desktop && { flexDirection: 'row', gap: 24 }]}>
            <View style={{ width: desktop ? 290 : '100%', gap: 12, marginBottom: 16 }}>
              <Text style={s.heading}>Build a page</Text>
              <View style={s.row}><Button label="From a card" onPress={() => { setQuery(''); setPicker('favorite'); }} /><Button label={`Fill slot ${selected + 1}`} onPress={() => { setQuery(''); setPicker('manual'); }} disabled={page.slots[selected]?.locked} /></View>
              <View style={s.row}>{([2, 3, 4, ...(desktop ? [5] : [])] as Page['size'][]).map(size => <Button key={size} label={`${size} × ${size}`} primary={page.size === size} onPress={() => { session.edit(p => ({ ...p, size, slots: Array.from({ length: size * size }, (_, i) => p.slots[i] ?? { cardId: null, locked: false }) })); setSelected(0); }} />)}</View>
              <Text style={s.heading}>Appearance</Text>
              <View style={[s.row, { flexWrap: 'wrap' }]}>{Object.entries(palettes).map(([id, palette]) => <Button key={id} label={palette.label} primary={page.palette === id} onPress={() => session.edit(p => ({ ...p, palette: id as Page['palette'] }))} />)}</View>
            </View>
            <View style={{ flex: 1 }}>{sheet(page, true)}</View>
          </View>
          <View style={s.row}><Button label="Undo" disabled={!session.history.length} onPress={() => session.undo()} /><Button label={session.saving ? 'Saving…' : 'Save page'} primary onPress={() => run(() => session.save())} disabled={session.saving} /></View>
        </View>
      </ScrollView>}
      {tab === 'Cards' && cardGrid(setDetail)}
      {tab === 'Library' && <View style={{ flex: 1, gap: 12 }}>
        <View style={s.row}><Button label="My pages" primary={library === 'Pages'} onPress={() => setLibrary('Pages')} /><Button label="My collection" primary={library === 'Collection'} onPress={() => setLibrary('Collection')} /></View>
        {library === 'Collection' ? cardGrid(setDetail) : <ScrollView><Text style={s.title}>My pages</Text><View style={{ gap: 12, paddingVertical: 16 }}>{pages.map(saved => <Pressable key={saved.id} accessibilityRole="button" onPress={() => run(() => openPage(saved))} style={s.panel}><Text style={s.heading}>{saved.name}</Text><Text style={s.caption}>{saved.size} × {saved.size} · {saved.slots.filter(slot => slot.cardId).length} cards</Text></Pressable>)}</View></ScrollView>}
      </View>}
    </View>
    {!desktop && navigation}
    <Modal visible={!!picker} animationType="slide" onRequestClose={() => setPicker(null)} presentationStyle="pageSheet"><View style={s.modal}><View style={s.row}><Text style={[s.heading, { flex: 1 }]}>{picker === 'favorite' ? 'Choose a favorite' : `Choose a card · Slot ${selected + 1}`}</Text><Button label="Done" onPress={() => setPicker(null)} /></View>{cardGrid(card => run(() => choose(card)))}</View></Modal>
    <Modal visible={!!proposal} animationType="slide" onRequestClose={() => setProposal(null)} presentationStyle="pageSheet"><ScrollView style={s.modal}>{proposal && sheet(proposal, false)}<View style={[s.row, { marginTop: 16 }]}><Button label="Cancel" onPress={() => setProposal(null)} /><Button primary label="Keep this page" onPress={() => { if (proposal) session.edit(p => ({ ...p, slots: proposal.slots, seedCardId: proposal.seedCardId, palette: proposal.palette })); setProposal(null); }} /></View></ScrollView></Modal>
    <Modal visible={!!detail} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setDetail(null)}><ScrollView style={s.modal}><Button label="Done" onPress={() => setDetail(null)} />{detail && <View style={{ gap: 16, paddingTop: 16 }}><CardImage api={api} id={detail.id} style={{ height: 340, width: '100%' }} resizeMode="contain" /><Text style={s.title}>{detail.name}</Text><Text style={s.muted}>{detail.setName} · {detail.number}</Text><Button label={detail.owned ? 'Remove from collection' : 'Add to collection'} onPress={() => run(async () => { const result = await api.ownership(detail.id, !detail.owned); const updated = { ...detail, owned: result.owned }; remember([updated]); setDetail(updated); })} /><Text style={s.heading}>Tags</Text><Text style={s.muted}>{detail.tags.join(' · ') || 'No tags yet'}</Text></View>}</ScrollView></Modal>
    <Modal visible={settings} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSettings(false)}><View style={s.modal}><Button label="Done" onPress={() => setSettings(false)} /><Text style={[s.title, { marginVertical: 16 }]}>Settings</Text><Text style={s.heading}>{bootstrap?.user.name}</Text><Text style={s.muted}>{bootstrap?.catalog?.count ?? 0} cards · {bootstrap?.visual?.indexed ?? 0} indexed</Text>{onSignOut && <Button label="Sign out" disabled={busy} onPress={() => run(async () => { if (session.dirty && page.revision) await session.save(); await onSignOut(); })} />}</View></Modal>
  </View>;
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: c.background }, header: { paddingHorizontal: 16, height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: c.line, borderBottomWidth: 1 },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 16 }, row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  button: { minHeight: 44, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: c.border, borderRadius: 6, alignItems: 'center', justifyContent: 'center', flexShrink: 1 }, buttonText: { ...typography.label, color: c.text },
  primary: { backgroundColor: c.accent, borderColor: c.accent }, disabled: { opacity: 0.4 }, pressed: { opacity: 0.7 },
  input: { minHeight: 44, color: c.text, fontSize: 16, borderWidth: 1, borderColor: c.border, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8 },
  title: { ...typography.title, color: c.text }, heading: { ...typography.heading, color: c.text }, caption: { ...typography.caption, color: c.secondary }, muted: { ...typography.body, color: c.secondary },
  tabs: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: c.line }, tab: { flex: 1, height: 54, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' }, activeTab: { borderBottomColor: c.accent },
  cardArt: { width: '100%', aspectRatio: 0.716, borderRadius: 6, backgroundColor: c.sunken }, panel: { padding: 16, borderWidth: 1, borderColor: c.line, borderRadius: 8, gap: 4 },
  sheet: { padding: 12, borderRadius: 10, width: '100%', maxWidth: 760, alignSelf: 'center' }, slot: { width: '100%', aspectRatio: 0.716, borderRadius: 5, borderWidth: 2, borderColor: c.line, backgroundColor: c.sunken, alignItems: 'center', justifyContent: 'center' }, lock: { position: 'absolute', right: 5, bottom: 5, padding: 4, borderRadius: 4, backgroundColor: c.surface },
  modal: { flex: 1, padding: 20, backgroundColor: c.background }, error: { padding: 12, backgroundColor: c.surface },
});
