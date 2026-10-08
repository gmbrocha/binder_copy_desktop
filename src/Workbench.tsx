import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { ApiClient, ApiError, type Bootstrap } from './api/client';
import CardImage from './components/CardImage';
import PageSheet from './components/PageSheet';
import Icon from './components/Icon';
import { swapSlots } from './features/build/dragGeometry';
import CardDetails from './features/catalog/CardDetails';
import { emptyFilters, type Card, type Page } from './shared/contracts/index';
import Appearance from './features/build/Appearance';
import PagesLibrary from './features/library/PagesLibrary';
import SearchControls from './features/catalog/SearchControls';
import TagManager from './features/catalog/TagManager';
import { DraftJournal } from './features/build/draftJournal';
import { authStorage } from './auth/storage';
import { newPage, PageSession } from './features/build/pageSession';
import { propose, keepProposal, fingerprint, type Inspiration, type Proposal } from './features/build/generation';
import { pickPhotoColors, saveExport } from './platform/media';
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
  const [dragging, setDragging] = useState(false);
  const [moveFrom, setMoveFrom] = useState<number | null>(null);
  const [cards, setCards] = useState<Record<string, Card>>({});
  const [results, setResults] = useState<Card[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(emptyFilters);
  const [searching, setSearching] = useState(false);
  const [searchEpoch, setSearchEpoch] = useState(0);
  const [gridWidth, setGridWidth] = useState(width - 32);
  const [draftReady, setDraftReady] = useState(false);
  const [recovery, setRecovery] = useState<Page | null>(null);
  const journal = useRef<DraftJournal | null>(null);
  const journalHasDraft = useRef(false);
  const [confirm, setConfirm] = useState<{ title: string; label: string; action: () => Promise<void> } | null>(null);
  const [library, setLibrary] = useState<'Pages' | 'Collection'>('Pages');
  const [picker, setPicker] = useState<'manual' | 'favorite' | 'colors' | null>(null);
  const [detail, setDetail] = useState<Card | null>(null);
  const [settings, setSettings] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [themeOpen, setThemeOpen] = useState(false);
  const [theme, setTheme] = useState('');
  const [preview, setPreview] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const busyRef = useRef(false);
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const searchVersion = useRef(0);
  const page = session.page;
  const remember = (items: Card[]) => setCards(existing => ({ ...existing, ...Object.fromEntries(items.map(card => [card.id, card])) }));
  const report = (e: unknown) => setError(e instanceof Error ? e.message : 'Something went wrong.');
  const run = async (fn: () => Promise<void>) => { if (busyRef.current) return; busyRef.current = true; setBusy(true); setError(''); try { await fn(); } catch (e) { report(e); } finally { busyRef.current = false; setBusy(false); } };
  useEffect(() => { void api.bootstrap().then(setBootstrap).catch(report); }, [api]);
  useEffect(() => {
    if (!bootstrap) return;
    let active = true;
    const next = new DraftJournal(authStorage, bootstrap.user.id); journal.current = next;
    void next.read().then(draft => { if (active) { journalHasDraft.current = !!draft; setRecovery(draft); setDraftReady(true); } }).catch(report);
    return () => { active = false; };
  }, [bootstrap?.user.id]);
  useEffect(() => {
    if (!draftReady || recovery || !journal.current || !page.name.trim()) return;
    const meaningful = page.revision || page.name !== 'Untitled page' || page.slots.some(slot => slot.cardId);
    const persistDraft = () => {
      if (session.dirty && meaningful) { journalHasDraft.current = true; void journal.current!.write(page).catch(report); }
      else if (!session.dirty && journalHasDraft.current) { journalHasDraft.current = false; void journal.current!.clear().catch(report); }
    };
    const timer = setTimeout(persistDraft, 150);
    const lifecycle = AppState.addEventListener('change', state => { if (state !== 'active') { clearTimeout(timer); persistDraft(); } });
    return () => { clearTimeout(timer); lifecycle.remove(); };
  }, [session, JSON.stringify(page), session.dirty, draftReady, recovery]);
  const searchActive = tab === 'Cards' || (tab === 'Library' && library === 'Collection') || !!picker;
  const collectionSearch = tab === 'Library' && !picker;
  const activeFilters = { ...filters, q: query, ownership: collectionSearch ? 'owned' as const : filters.ownership };
  useEffect(() => {
    if (!searchActive) return;
    const version = ++searchVersion.current;
    setSearching(true); setResults([]); setTotal(0);
    const controller = new AbortController();
    const timer = setTimeout(() => {
      void api.search(activeFilters, 0, desktop ? 80 : 48, controller.signal).then(result => {
        if (version !== searchVersion.current) return;
        remember(result.cards); setResults(result.cards); setTotal(result.total);
      }).catch(e => { if (!controller.signal.aborted) report(e); }).finally(() => { if (version === searchVersion.current) setSearching(false); });
    }, 200);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [api, JSON.stringify(activeFilters), searchActive, desktop, searchEpoch]);
  useEffect(() => {
    if (!draftReady || recovery || !page.name.trim() || !session.dirty || session.error || !bootstrap || (!page.revision && page.name === 'Untitled page' && !page.slots.some(x => x.cardId))) return;
    const timer = setTimeout(() => { void session.save().catch(report); }, 700);
    return () => clearTimeout(timer);
  }, [session, JSON.stringify(page), bootstrap, session.error, draftReady, recovery]);
  const replaceSession = (next: Page, recovered = false) => {
    setSession(new PageSession(next, p => api.save(p), () => render(n => n + 1), recovered));
    setMoveFrom(null); setSelected(0); setTab('Build'); setError('');
  };
  const openPage = async (next: Page) => {
    if (session.dirty && (page.revision || page.name !== 'Untitled page' || page.slots.some(x => x.cardId))) await session.save();
    await journal.current?.clear(); journalHasDraft.current = false;
    const loaded = await api.cards(next.slots.flatMap(slot => slot.cardId ? [slot.cardId] : []));
    remember(loaded.cards);
    replaceSession(next);
  };
  const resize = (size: Page['size']) => {
    const apply = async () => { session.edit(p => ({ ...p, size, backdrop: undefined, backdropMode: 'color', slots: Array.from({ length: size * size }, (_, i) => p.slots[i] ?? { cardId: null, locked: false }) })); setMoveFrom(null); setSelected(0); };
    if (size < page.size && page.slots.slice(size * size).some(slot => slot.cardId)) setConfirm({ title: 'Remove cards outside the smaller page?', label: 'Resize page', action: apply });
    else void apply();
  };
  const recoverDraft = () => run(async () => {
    if (!recovery) return;
    const draft = recovery;
    replaceSession(draft, true); setRecovery(null);
    void api.cards(draft.slots.flatMap(slot => slot.cardId ? [slot.cardId] : [])).then(result => remember(result.cards)).catch(report);
  });
  const saveCopy = () => run(async () => {
    const copied = await api.save({ ...session.page, id: createId(), revision: 0, name: `${session.page.name.slice(0, 93)} (copy)` });
    replaceSession(copied);
  });
  const reloadSaved = () => setConfirm({ title: 'Replace local changes with the saved page?', label: 'Reload saved', action: async () => {
    const result = await api.pages(); const saved = result.pages.find(p => p.id === session.page.id);
    if (!saved) throw new Error('This page was deleted. Save a copy to keep your changes.');
    const loaded = await api.cards(saved.slots.flatMap(slot => slot.cardId ? [slot.cardId] : [])); remember(loaded.cards); replaceSession(saved);
  } });
  const generate = async (inspiration: Inspiration, input = session.page, source = fingerprint(session.page)) => {
    const result = await propose(api, input, inspiration);
    if (sessionRef.current !== session || source !== fingerprint(session.page)) throw new Error('Your page changed. Generate another preview.');
    remember(result.cards); setProposal({ ...result, source }); setPicker(null); setThemeOpen(false);
  };
  const choose = async (card: Card) => {
    remember([card]);
    if (picker === 'favorite' || picker === 'colors') await generate({ kind: picker === 'favorite' ? 'favorite' : 'card-colors', card }, { ...session.page, filters: activeFilters });
    else {
      if (session.page.slots[selected]?.locked) throw new Error('Unlock this slot first.');
      session.edit(p => ({ ...p, slots: p.slots.map((slot, i) => i === selected ? { ...slot, cardId: card.id } : slot) }));
      setPicker(null);
    }
  };
  const fromPhoto = () => run(async () => {
    const source = fingerprint(session.page);
    const colors = await pickPhotoColors();
    if (!colors) return;
    if (sessionRef.current !== session || source !== fingerprint(session.page)) throw new Error('Your page changed. Choose the photo again.');
    await generate({ kind: 'photo', colors });
  });
  const exportPage = (format: 'png' | 'csv') => run(async () => {
    if (!page.slots.some(slot => slot.cardId)) throw new Error('Add a card to export.');
    const data = await api.export(session.page, format);
    await saveExport(data, format); setExportOpen(false);
  });
  const more = () => run(async () => {
    const version = searchVersion.current;
    const result = await api.search(activeFilters, results.length, desktop ? 80 : 48);
    if (version !== searchVersion.current) return;
    remember(result.cards); setResults(current => [...current, ...result.cards]); setTotal(result.total);
  });
  const columns = desktop ? Math.max(3, Math.floor((gridWidth + 12) / 172)) : 3;
  const cardWidth = Math.max(1, (gridWidth - (columns - 1) * 12) / columns);
  const cardGrid = (select: (card: Card) => void) => <View style={{ flex: 1 }} onLayout={event => setGridWidth(event.nativeEvent.layout.width)}>
    <SearchControls api={api} bootstrap={bootstrap} query={query} onQuery={setQuery} filters={filters} onFilters={setFilters} collection={collectionSearch} showInterpretIcon={!!picker} />
    {searching ? <ActivityIndicator color={c.accent} /> : <Text style={s.caption}>{total.toLocaleString()} cards</Text>}
    <FlatList key={columns} numColumns={columns} data={results} keyExtractor={card => card.id} contentContainerStyle={{ gap: 12, paddingVertical: 16 }} columnWrapperStyle={{ gap: 12 }} renderItem={({ item }) => <Pressable accessibilityRole="button" accessibilityLabel={item.name + ', ' + item.setName} style={{ width: cardWidth }} onPress={() => select(item)}><CardImage api={api} id={item.id} style={s.cardArt} resizeMode="contain" /><Text numberOfLines={1} style={s.caption}>{item.name}</Text></Pressable>} ListEmptyComponent={searching ? null : <Text style={s.muted}>No cards found.</Text>} ListFooterComponent={results.length < total ? <Button label="More cards" onPress={more} disabled={busy || searching} /> : null} />
  </View>;
  const sheet = (shown: Page, interactive: boolean) => <PageSheet api={api} page={shown} cards={cards} titleFont="Audiowide" selected={interactive ? selected : -1} onDragging={interactive ? setDragging : undefined} onSelect={interactive ? i => {
    if (moveFrom !== null) { if (session.page.slots[i].locked) { setError('Unlock this slot first.'); return; } session.edit(p => swapSlots(p, moveFrom, i)); setMoveFrom(null); }
    setSelected(i);
  } : undefined} onLock={interactive ? i => session.edit(p => ({ ...p, slots: p.slots.map((slot, index) => index === i ? { ...slot, locked: !slot.locked } : slot) })) : undefined} onSwap={interactive && !busy ? (from, to) => session.edit(p => swapSlots(p, from, to)) : undefined} />;
  const modalStatus = <>{busy && <ActivityIndicator color={c.accent} />}{!!error && <Pressable accessibilityRole="button" accessibilityLabel="Dismiss error" onPress={() => setError('')} style={s.error}><Text style={{ color: c.danger }}>{error}</Text></Pressable>}</>;
  const navigation = <View accessibilityRole="tablist" style={s.tabs}>{(['Build', 'Cards', 'Library'] as const).map(name => <Pressable key={name} accessibilityRole="tab" accessibilityState={{ selected: tab === name, disabled: busy }} disabled={busy} onPress={() => setTab(name)} style={[s.tab, tab === name && s.activeTab]}><Text style={[s.buttonText, tab === name && { color: c.accent }]}>{name}</Text></Pressable>)}</View>;
  if (!draftReady || recovery) return <View style={[s.root, { padding: 24, justifyContent: 'center', gap: 16 }]}>{modalStatus}{recovery ? <><Text style={s.title}>Unsaved page</Text><Text style={s.heading}>{recovery.name}</Text><Button label="Restore page" primary disabled={busy} onPress={recoverDraft} /><Button label="Discard draft" disabled={busy} onPress={() => run(async () => { await journal.current?.clear(); journalHasDraft.current = false; setRecovery(null); })} /></> : <>{!error && <ActivityIndicator color={c.accent} />}{!!error && <><Button label="Retry" onPress={() => run(async () => { if (!bootstrap) setBootstrap(await api.bootstrap()); else { const draft = await journal.current!.read(); setRecovery(draft); setDraftReady(true); } })} />{bootstrap && <Button label="Discard unreadable draft" onPress={() => run(async () => { await journal.current?.clear(); setDraftReady(true); })} />}</>}</>}</View>;
  return <View style={s.root}>
    <View style={s.header}><Image accessibilityLabel="BinderCopy" source={require('../assets/brand/wordmark.png')} style={{ width: 176, height: 38 }} resizeMode="contain" /><Pressable accessibilityRole="button" accessibilityLabel="Settings" onPress={() => setSettings(true)} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}><Icon name="gear" size={22} /></Pressable></View>
    {desktop && navigation}
    {!!error && <Pressable accessibilityRole="button" accessibilityLabel="Dismiss error" onPress={() => setError('')} style={s.error}><Text style={{ color: c.danger }}>{error}</Text></Pressable>}
    {busy && <ActivityIndicator color={c.accent} />}
    <View style={s.body}>
      {tab === 'Build' && <ScrollView scrollEnabled={!dragging} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 24, alignItems: 'center' }}>
        <View style={{ width: '100%', maxWidth: desktop ? 1240 : 580, gap: 16 }}>
          <View style={s.row}><TextInput accessibilityLabel="Page name" style={[s.input, { flex: 1 }]} value={page.name} maxLength={100} onChangeText={name => session.edit(p => ({ ...p, name }))} onEndEditing={() => { if (!page.name.trim()) session.edit(p => ({ ...p, name: 'Untitled page' })); }} /><Button label="+ New" disabled={busy} onPress={() => run(() => openPage(newPage(createId())))} /></View>
          {!!session.error && <View style={[s.row, { flexWrap: 'wrap' }]}><Button label="Retry save" disabled={busy} onPress={() => run(() => session.save())} /><Button label="Save a copy" disabled={busy} onPress={saveCopy} />{session.error instanceof ApiError && session.error.status === 409 && <Button label="Reload saved" disabled={busy} onPress={reloadSaved} />}</View>}
          <View style={[desktop && { flexDirection: 'row-reverse', gap: 24 }]}>
            <View style={{ width: desktop ? 290 : '100%', gap: 12, marginBottom: 16 }}>
              <Text style={s.heading}>Build a page</Text>
              <View style={[s.row, { flexWrap: 'wrap' }]}><Button label="A favorite card" disabled={busy} onPress={() => { setQuery(''); setPicker('favorite'); }} /><Button label="A card’s colors" disabled={busy} onPress={() => { setQuery(''); setPicker('colors'); }} /><Button label="A photo" disabled={busy} onPress={fromPhoto} /><Button label="A theme" disabled={busy} onPress={() => { setTheme(page.themeSource ?? ''); setThemeOpen(true); }} /></View>
              {!!(page.seedCardId || page.colorInspiration || page.themeSource) && <View style={s.row}><Button label="Regenerate" disabled={busy} onPress={() => run(() => generate({ kind: 'repeat' }))} /><Button label="Clear inspiration" disabled={busy} onPress={() => session.edit(p => ({ ...p, seedCardId: undefined, colorInspiration: undefined, themeSource: undefined }))} /></View>}
              <Button label={`${page.slots[selected]?.cardId ? 'Replace card' : 'Fill slot'} · ${selected + 1}`} onPress={() => { setQuery(''); setPicker('manual'); }} disabled={page.slots[selected]?.locked || busy} />
              <View style={s.row}>{([2, 3, 4, ...(desktop ? [5] : [])] as Page['size'][]).map(size => <Button key={size} label={`${size} × ${size}`} primary={page.size === size} disabled={busy} onPress={() => resize(size)} />)}</View>
              {page.slots[selected]?.cardId && <View style={s.row}><Button label="Details" onPress={() => { const card = cards[page.slots[selected].cardId!]; if (card) setDetail(card); }} /><Button label={moveFrom === null ? 'Move card' : 'Cancel move'} disabled={page.slots[selected].locked || busy} onPress={() => setMoveFrom(previous => previous === null ? selected : null)} /><Button label="Remove" disabled={page.slots[selected].locked || busy} onPress={() => session.edit(p => ({ ...p, slots: p.slots.map((slot, i) => i === selected ? { cardId: null, locked: false } : slot) }))} /></View>}
              <Appearance key={page.id} api={api} session={session} cards={cards} createId={createId} blocked={busy} onBusy={active => { busyRef.current = active; setBusy(active); }} canGenerate={!!bootstrap?.backdropConfigured && bootstrap?.capabilities?.paidApi !== false} />
            </View>
            <View style={{ flex: 1 }}>{sheet(page, true)}</View>
          </View>
          <View style={s.row}><View style={{ flex: 1 }}><Button label="Undo" disabled={!session.history.length || busy} onPress={() => session.undo()} /></View><View style={{ flex: 1 }}><Button label={session.saving ? 'Saving…' : 'Save'} primary onPress={() => run(() => session.save())} disabled={session.saving || busy} /></View><View style={{ flex: 1 }}><Button label="Preview" disabled={!page.slots.some(slot => slot.cardId)} onPress={() => setPreview(true)} /></View><View style={{ flex: 1 }}><Button label="Export" onPress={() => { if (page.slots.some(slot => slot.cardId)) setExportOpen(true); else setError('Add a card to export.'); }} /></View></View>
        </View>
      </ScrollView>}
      {tab === 'Cards' && <View style={{ flex: 1 }}>{bootstrap?.capabilities?.curateTags && <View style={[s.row, { justifyContent: 'flex-end', marginBottom: 8 }]}><Button label="Shared tags" onPress={() => setTagsOpen(true)} /></View>}{cardGrid(setDetail)}</View>}
      {tab === 'Library' && <View style={{ flex: 1, gap: 12 }}>
        <View style={s.row}><Button label="My pages" primary={library === 'Pages'} onPress={() => setLibrary('Pages')} /><Button label="My collection" primary={library === 'Collection'} onPress={() => setLibrary('Collection')} /></View>
        {library === 'Collection' ? cardGrid(setDetail) : <PagesLibrary api={api} session={session} createId={createId} onOpen={openPage} onNew={() => openPage(newPage(createId()))} onDeleted={id => { if (id === session.page.id) replaceSession(newPage(createId())); }} />}
      </View>}
    </View>
    {!desktop && navigation}
    <Modal visible={tagsOpen} presentationStyle="pageSheet" animationType="slide" onRequestClose={() => setTagsOpen(false)}><TagManager api={api} tags={bootstrap?.tags ?? []} onTags={tags => setBootstrap(previous => previous ? { ...previous, tags } : previous)} onClose={() => setTagsOpen(false)} /></Modal>
    <Modal visible={!!confirm} presentationStyle="pageSheet" animationType="slide" onRequestClose={() => { if (!busy) setConfirm(null); }}><View style={s.modal}>{modalStatus}<Text style={s.title}>{confirm?.title}</Text><View style={[s.row, { marginTop: 20 }]}><Button label="Cancel" disabled={busy} onPress={() => setConfirm(null)} /><Button label={confirm?.label ?? 'Continue'} disabled={busy} onPress={() => run(async () => { await confirm?.action(); setConfirm(null); })} /></View></View></Modal>
    <Modal visible={!!picker} animationType="slide" onRequestClose={() => setPicker(null)} presentationStyle="pageSheet"><View style={s.modal}>{modalStatus}<View style={s.row}><Text style={[s.heading, { flex: 1 }]}>{picker === 'favorite' ? 'Choose a favorite' : picker === 'colors' ? 'Choose card colors' : `Choose a card · Slot ${selected + 1}`}</Text><Button label="Done" disabled={busy} onPress={() => setPicker(null)} /></View>{cardGrid(card => run(() => choose(card)))}</View></Modal>
    <Modal visible={!!proposal} animationType="slide" onRequestClose={() => setProposal(null)} presentationStyle="pageSheet"><ScrollView style={s.modal}>{modalStatus}{proposal && sheet(proposal.page, false)}<View style={[s.row, { marginTop: 16 }]}><Button label="Cancel" disabled={busy} onPress={() => setProposal(null)} /><Button label="Shuffle" disabled={busy} onPress={() => { if (proposal) void run(() => generate({ kind: 'repeat' }, proposal.input, proposal.source)); }} /><Button primary label="Keep this page" disabled={busy} onPress={() => run(async () => { if (proposal) session.edit(p => keepProposal(p, proposal)); setProposal(null); })} /></View>{!!proposal?.note && <Text style={s.muted}>{proposal.note}</Text>}</ScrollView></Modal>
    <Modal visible={themeOpen} animationType="slide" onRequestClose={() => setThemeOpen(false)} presentationStyle="pageSheet"><View style={s.modal}>{modalStatus}<View style={s.row}><Text style={[s.heading, { flex: 1 }]}>A theme</Text><Button label="Cancel" disabled={busy} onPress={() => setThemeOpen(false)} /></View><TextInput accessibilityLabel="Page theme" placeholder="Moonlit forest" placeholderTextColor={c.muted} value={theme} maxLength={300} onChangeText={setTheme} style={[s.input, { marginVertical: 20 }]} /><Button label="Generate page" primary disabled={busy || !theme.trim()} onPress={() => run(() => generate({ kind: 'theme', query: theme }))} /></View></Modal>
    <Modal visible={preview} animationType="slide" onRequestClose={() => setPreview(false)} presentationStyle="pageSheet"><ScrollView style={s.modal}>{modalStatus}<Button label="Done" onPress={() => setPreview(false)} />{sheet(page, false)}</ScrollView></Modal>
    <Modal visible={exportOpen} animationType="slide" onRequestClose={() => setExportOpen(false)} presentationStyle="pageSheet"><View style={s.modal}>{modalStatus}<Text style={s.title}>Export</Text><Button label="Download image" disabled={busy} onPress={() => exportPage('png')} /><Button label="Missing list (CSV)" disabled={busy} onPress={() => exportPage('csv')} /><Button label="Done" disabled={busy} onPress={() => setExportOpen(false)} /></View></Modal>
    <Modal visible={!!detail} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setDetail(null)}><View style={{ flex: 1, backgroundColor: c.background }}>{detail && <CardDetails key={detail.id} api={api} initial={detail} tags={bootstrap?.tags ?? []} canCurate={bootstrap?.capabilities?.curateTags ?? false} onClose={() => setDetail(null)} onUpdate={next => { remember([next]); setDetail(next); setSearchEpoch(value => value + 1); setResults(previous => previous.map(card => card.id === next.id ? next : card)); }} />}</View></Modal>
    <Modal visible={settings} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSettings(false)}><View style={s.modal}>{modalStatus}<Button label="Done" onPress={() => setSettings(false)} /><Text style={[s.title, { marginVertical: 16 }]}>Settings</Text><Text style={s.heading}>{bootstrap?.user.name}</Text><Text style={s.muted}>{bootstrap?.catalog?.count ?? 0} cards · {bootstrap?.visual?.indexed ?? 0} indexed</Text>{onSignOut && <Button label="Sign out" disabled={busy} onPress={() => run(async () => { if (session.dirty && (page.revision || page.name !== 'Untitled page' || page.slots.some(slot => slot.cardId))) await session.save(); await journal.current?.clear(); await onSignOut(); })} />}</View></Modal>
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
