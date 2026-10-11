import React, {useEffect, useRef, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import PageSheet from '../../components/PageSheet';
import {useLoading} from '../../components/Loading';
import type {ApiClient} from '../../api/client';
import type {Card} from '../../shared/contracts';
import type {PageSession} from './pageSession';
import {backgroundSource} from './background';
import {keepSurround, surroundPage, type SurroundJob} from './surround';
import {colors as c, type as typography} from '../../design/tokens';

/** Hosted inside the builder's existing dialog; uses the unchanged loading animation. */
export default function CardSurround({api, session, cards, cardId, createId, blocked, onBusy, onClose}: {
  api: ApiClient; session: PageSession; cards: Record<string, Card>; cardId: string;
  createId: () => string; blocked: boolean; onBusy: (busy: boolean) => void; onClose: () => void;
}) {
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  const [job, setJob] = useState<SurroundJob | null>(() => session.page.surround?.cardId === cardId && session.page.backdrop ? {id:session.page.backdrop.assetId,cardId,status:'complete',backdrop:session.page.backdrop} : null);
  const captured = useRef(backgroundSource(session.page));
  const started = useRef(!!job), pending = useRef(false), attempt = useRef<string | null>(null);
  const loading = useLoading();
  const launch = async (recover = false) => {
    if (pending.current || blocked) return;
    pending.current = true; setBusy(true); onBusy(true); setError('');
    try {
      await loading('action', async () => {
        let next: SurroundJob | undefined;
        if (recover && !attempt.current) {
          const latest = (await api.request<{job: SurroundJob | null}>('/surrounds')).job;
          if (latest?.cardId === cardId && ['running', 'blocked', 'complete'].includes(latest.status)) {
            next = latest; attempt.current = latest.id;
          }
        }
        if (!next || next.status === 'blocked') {
          attempt.current ??= createId();
          next = await api.request<SurroundJob>('/surrounds', 'POST', {requestId: attempt.current, cardId});
        }
        const began = Date.now();
        while (next.status === 'running') {
          setJob(next);
          if (Date.now() - began > 15 * 60 * 1000) throw new Error('Still working. Check again shortly.');
          await new Promise<void>(resolve => setTimeout(resolve, 2000));
          next = await api.request<SurroundJob>(`/surrounds/${attempt.current}`);
        }
        if (next.status === 'complete') surroundPage(session.page, next);
        setJob(next);
        if (next.status === 'failed') { attempt.current = null; throw new Error(next.error || 'Surround could not finish.'); }
        if (next.status === 'blocked') throw new Error(next.error || 'Not enough allowance for the next pass.');
      });
    } catch (e) { setError((e as Error).message); }
    finally { pending.current = false; setBusy(false); onBusy(false); }
  };
  useEffect(() => { if (!blocked && !started.current) { started.current = true; void launch(true); } }, [blocked]);
  const button = (label: string, action: () => void, primary = false) => <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{disabled:busy || blocked}} disabled={busy || blocked} onPress={action} style={[s.button, primary && s.primary, (busy || blocked) && {opacity:.4}]}><Text style={[s.label,primary && {color:c.onAccent}]}>{label}</Text></Pressable>;
  const preview = job?.status === 'complete' ? surroundPage(session.page, job) : null;
  return <View style={s.modal}>
    <View style={s.row}><Text style={[s.heading,{flex:1}]}>A card’s art (bg surround)</Text>{button('Close',onClose)}</View>
    <ScrollView contentContainerStyle={{gap:16,paddingVertical:16}}>
      <Text style={s.label}>{cards[cardId]?.name ?? 'Card art'}</Text>
      {preview && <PageSheet api={api} page={preview} cards={cards} titleFont="Audiowide"/>}
      {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
    </ScrollView>
    {preview ? <View style={s.row}>
      <View style={{flex:1}}>{button('New surround',()=>{attempt.current=null;setJob(null);void launch();})}</View>
      <View style={{flex:1}}>{button('Keep this page',()=>{try { session.edit(p=>keepSurround(p,captured.current,job!)); onClose(); } catch(e){setError((e as Error).message);}},true)}</View>
    </View> : button(attempt.current ? 'Check surround' : 'Generate surround',()=>void launch(true))}
  </View>;
}
const s=StyleSheet.create({row:{flexDirection:'row',gap:8,alignItems:'center'},modal:{flex:1,padding:16,backgroundColor:c.background},button:{minHeight:44,padding:10,borderWidth:1,borderColor:c.border,borderRadius:6,alignItems:'center',justifyContent:'center'},primary:{backgroundColor:c.accent,borderColor:c.accent},heading:{...typography.heading,color:c.text},label:{...typography.label,color:c.text},error:{...typography.body,color:c.danger}});
