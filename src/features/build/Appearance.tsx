import Modal from '../../components/DesktopDialog';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ApiClient } from '../../api/client';
import type { Card, Page } from '../../shared/contracts';
import { paletteSchema } from '../../shared/contracts';
import { palettes } from '../../shared/domain/palettes';
import { colors as c, type as typography } from '../../design/tokens';
import PageSheet from '../../components/PageSheet';
import type { PageSession } from './pageSession';
import { backgroundSource, beginBackground, keepBackground, requestBackground, type BackgroundAttempt, type BackgroundProposal } from './background';

export default function Appearance({ api, session, cards, createId, canGenerate, onBusy, blocked }: { api: ApiClient; session: PageSession; cards: Record<string, Card>; createId: () => string; canGenerate: boolean; onBusy: (busy: boolean) => void; blocked: boolean }) {
  const [colorsOpen, setColorsOpen] = useState(false);
  const [proposal, setProposal] = useState<BackgroundProposal | null>(null);
  const [attempt, setAttempt] = useState<BackgroundAttempt | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const pending = useRef(false);
  const page = session.page;
  const hasCards = page.slots.some(slot => slot.cardId);
  const run = async (fn: () => Promise<void>) => { if (pending.current || blocked) return; pending.current = true; setBusy(true); onBusy(true); setError(''); try { await fn(); } catch (e) { setError(e instanceof Error ? e.message : 'Request failed.'); } finally { pending.current = false; setBusy(false); onBusy(false); } };
  const button = (label: string, action: () => void, disabled = false) => <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy || blocked || disabled }} disabled={busy || blocked || disabled} onPress={action} style={[s.button, (busy || blocked || disabled) && { opacity: 0.4 }]}><Text style={s.label}>{label}</Text></Pressable>;
  const generate = () => run(async () => {
    const next = attempt ?? beginBackground(session.page, createId());
    setAttempt(next);
    const result = await requestBackground(api, next);
    setAttempt(null);
    keepBackground(session.page, result); // Reject changed layouts before showing an obsolete preview.
    setProposal(result);
  });
  const suggest = () => run(async () => {
    const source = backgroundSource(session.page);
    const result = await api.request<{ palette: unknown }>('/palette', 'POST', { ids: session.page.slots.flatMap(slot => slot.cardId ? [slot.cardId] : []) });
    if (source !== backgroundSource(session.page)) throw new Error('Your page changed. Suggest colors again.');
    const palette = paletteSchema.parse(result.palette);
    session.edit(p => ({ ...p, palette }));
  });
  const preview = proposal && proposal.source === backgroundSource(page) ? { ...page, backdrop: proposal.backdrop, backdropMode: 'art' as const } : null;
  return <View style={{ gap: 8 }}>
    <Text style={s.heading}>Appearance</Text>
    {page.backdrop && <View style={{ flexDirection: 'row', gap: 8 }}>{button('Color', () => session.edit(p => ({ ...p, backdropMode: 'color' })))}{button('Art', () => session.edit(p => ({ ...p, backdropMode: 'art' })))}</View>}
    {button(`Page color · ${palettes[page.palette ?? 'forge'].label} ▾`, () => setColorsOpen(true))}
    {button('Suggest from artwork', suggest, !hasCards)}
    {canGenerate && button(attempt ? 'Check background' : 'Create background', generate, !hasCards && !attempt)}
    {page.backdrop && button('Reset background', () => session.edit(p => ({ ...p, backdrop: undefined, backdropMode: 'color' })))}
    {busy && <ActivityIndicator color={c.accent} />}
    {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
    <Modal visible={colorsOpen} presentationStyle="pageSheet" animationType="slide" onRequestClose={() => setColorsOpen(false)}><ScrollView style={s.modal}><Text style={s.heading}>Page color</Text>{Object.entries(palettes).map(([id, palette]) => <Pressable key={id} accessibilityRole="radio" accessibilityState={{ checked: page.palette === id }} onPress={() => { session.edit(p => ({ ...p, palette: id as Page['palette'] })); setColorsOpen(false); }} style={[s.button, { flexDirection: 'row', gap: 12, marginTop: 10 }]}><View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: palette.bg, borderWidth: 1, borderColor: palette.line }} /><Text style={s.label}>{palette.label}</Text></Pressable>)}{button('Done', () => setColorsOpen(false))}</ScrollView></Modal>
    <Modal visible={!!proposal} presentationStyle="pageSheet" animationType="slide" onRequestClose={() => setProposal(null)}><ScrollView style={s.modal}><Text style={s.heading}>Background</Text>{preview ? <PageSheet api={api} page={preview} cards={cards} titleFont="Audiowide" /> : <Text style={s.error}>Your page changed. This preview is out of date.</Text>}{!!error && <Text style={s.error}>{error}</Text>}<View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>{button('Cancel', () => setProposal(null))}{button('Keep background', () => { try { if (proposal) session.edit(p => keepBackground(p, proposal)); setProposal(null); } catch (e) { setError((e as Error).message); } }, !preview)}</View></ScrollView></Modal>
  </View>;
}
const s = StyleSheet.create({ heading: { ...typography.heading, color: c.text }, label: { ...typography.label, color: c.text }, button: { minHeight: 44, padding: 10, borderWidth: 1, borderColor: c.border, borderRadius: 6, alignItems: 'center', justifyContent: 'center' }, modal: { flex: 1, padding: 20, backgroundColor: c.background }, error: { ...typography.body, color: c.danger } });
