import React, { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Modal from '../../components/DesktopDialog';
import PageSheet from '../../components/PageSheet';
import { useLoading } from '../../components/Loading';
import type { ApiClient } from '../../api/client';
import type { Card } from '../../shared/contracts';
import type { PageSession } from './pageSession';
import { backgroundSource } from './background';
import { keepSurround, surroundPage, type SurroundJob } from './surround';
import { colors as c, type as typography } from '../../design/tokens';
export default function CardSurround({ api, session, cards, cardId, createId, blocked, onBusy }: {
    api: ApiClient;
    session: PageSession;
    cards: Record<string, Card>;
    cardId?: string;
    createId: () => string;
    blocked: boolean;
    onBusy: (busy: boolean) => void;
}) {
    const [open, setOpen] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState('');
    const [job, setJob] = useState<SurroundJob | null>(null);
    const [recoveredCards, setRecoveredCards] = useState<Record<string, Card>>({});
    const [captured, setCaptured] = useState('');
    const pending = useRef(false), attempt = useRef<{
        id: string;
        cardId: string;
    } | null>(null);
    const loading = useLoading();
    const act = async (fn: () => Promise<void>) => {
        if (pending.current || blocked)
            return;
        pending.current = true;
        setBusy(true);
        onBusy(true);
        setError('');
        try {
            await loading('action', fn);
        }
        catch (e) {
            setError((e as Error).message);
        }
        finally {
            pending.current = false;
            setBusy(false);
            onBusy(false);
        }
    };
    const launch = () => void act(async () => {
        if (!attempt.current) {
            if (!cardId)
                throw new Error('Select a card on your page first.');
            attempt.current = { id: createId(), cardId };
        }
        const chosen = attempt.current;
        let next = await api.request<SurroundJob>('/surrounds', 'POST', { requestId: chosen.id, cardId: chosen.cardId });
        const started = Date.now();
        while (next.status === 'running') {
            setJob(next);
            if (Date.now() - started > 15 * 60 * 1000)
                throw new Error('Still working. Check the surround again shortly.');
            await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));
            next = await api.request<SurroundJob>(`/surrounds/${chosen.id}`);
        }
        if (next.status === 'complete') surroundPage(session.page, next);
        setJob(next);
        if (next.status === 'failed') {
            attempt.current = null;
            throw new Error(next.error || 'Surround could not finish.');
        }
        if (next.status === 'blocked')
            throw new Error(next.error || 'Not enough allowance for the next pass.');
    });
    const button = (label: string, fn: () => void, disabled = false) => <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={busy || disabled} onPress={fn} style={[s.button, (busy || disabled) && { opacity: .4 }]}><Text style={s.label}>{label}</Text></Pressable>;
    const preview = job?.status === 'complete' ? surroundPage(session.page, job) : null;
    return <>
    {button('Card surround', () => void act(async () => {
            setCaptured(backgroundSource(session.page));
            setOpen(true);
            const existing = await api.request<{
                job: SurroundJob | null;
            }>('/surrounds');
            if (existing.job && ['running', 'blocked', 'complete'].includes(existing.job.status)) {
                if (existing.job.status === 'complete') surroundPage(session.page, existing.job);
                setJob(existing.job);
                attempt.current = { id: existing.job.id, cardId: existing.job.cardId };
                if (!cards[existing.job.cardId]) {
                    const data = await api.cards([existing.job.cardId]);
                    setRecoveredCards(Object.fromEntries(data.cards.map(card => [card.id, card])));
                }
            }
            else {
                setJob(null);
                attempt.current = null;
            }
        }), blocked)}
    <Modal visible={open} presentationStyle="pageSheet" animationType="slide" onRequestClose={() => { if (!busy)
        setOpen(false); }}>
      <View style={s.modal}><View style={s.row}><Text style={[s.heading, { flex: 1 }]}>Card surround</Text>{button('Close', () => setOpen(false))}</View>
        <ScrollView contentContainerStyle={{ gap: 16, paddingVertical: 16 }}>
          <Text style={s.caption}>One center card, eight art panels.</Text>
          <Text style={s.label}>{({ ...recoveredCards, ...cards })[job?.cardId ?? cardId ?? '']?.name ?? 'Select a card on your page.'}</Text>
          {preview && <PageSheet api={api} page={preview} cards={{ ...recoveredCards, ...cards }} titleFont="Audiowide"/>}
          {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
        </ScrollView>
        {preview ? <View style={s.row}><View style={{ flex: 1 }}>{button('New surround', () => { setJob(null); attempt.current = null; })}</View><View style={{ flex: 1 }}>{button('Keep surround', () => { try {
            session.edit(p => keepSurround(p, captured, job!));
            setOpen(false);
        }
        catch (e) {
            setError((e as Error).message);
        } })}</View></View>
            : button(attempt.current ? 'Check surround' : 'Create surround', launch, !attempt.current && !cardId)}
      </View>
    </Modal>
  </>;
}
const s = StyleSheet.create({ row: { flexDirection: 'row', gap: 8, alignItems: 'center' }, modal: { flex: 1, padding: 16, backgroundColor: c.background }, button: { minHeight: 44, padding: 10, borderWidth: 1, borderColor: c.border, borderRadius: 6, alignItems: 'center', justifyContent: 'center' }, heading: { ...typography.heading, color: c.text }, label: { ...typography.label, color: c.text }, caption: { ...typography.caption, color: c.secondary }, error: { ...typography.body, color: c.danger } });
