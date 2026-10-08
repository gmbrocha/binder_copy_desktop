import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeAuth } from './nativeAuth';
import { colors as c, type as t } from '../design/tokens';

export default function AuthGate({ auth, children }: { auth: NativeAuth; children: (userId: string) => React.ReactNode }) {
  const [identity, setIdentity] = useState<string | null | undefined>(undefined);
  const [email, setEmail] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const [error, setError] = useState('');
  const [retryAt, setRetryAt] = useState(0);
  useEffect(() => {
    const { data: { subscription } } = auth.client.auth.onAuthStateChange((_event, session) => setIdentity(session?.user.id ?? null));
    void auth.client.auth.getSession().then(({ data, error }) => {
      if (error) { setError('Sign-in could not be restored. Please sign in again.'); setIdentity(null); }
      else setIdentity(data.session?.user.id ?? null);
    }).catch(() => { setError('Secure storage is unavailable.'); setIdentity(null); });
    const update = (state: string) => { if (state === 'active') auth.client.auth.startAutoRefresh(); else auth.client.auth.stopAutoRefresh(); };
    update(AppState.currentState);
    const lifecycle = AppState.addEventListener('change', update);
    return () => { subscription.unsubscribe(); lifecycle.remove(); auth.client.auth.stopAutoRefresh(); };
  }, [auth]);
  const run = async (action: () => Promise<void>) => {
    if (pending.current || busy) return;
    pending.current = true;
    setBusy(true); setError('');
    try { await action(); } catch { setError(sentTo ? 'That code could not be verified. Check it or request another.' : 'Could not send a code. Check your email and try again.'); }
    finally { pending.current = false; setBusy(false); }
  };
  const send = () => run(async () => {
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) { setError('Enter your email address.'); return; }
    if (Date.now() < retryAt) { setError('Please wait a minute before requesting another code.'); return; }
    await auth.sendCode(normalized); setSentTo(normalized); setCode(''); setRetryAt(Date.now() + 60_000);
  });
  if (identity === undefined) return <View style={s.center}><ActivityIndicator color={c.accent} /></View>;
  if (identity) return <React.Fragment key={identity}>{children(identity)}</React.Fragment>;
  return <KeyboardAvoidingView style={s.center} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <View style={s.form}>
      <Image source={require('../../assets/brand/wordmark.png')} accessibilityLabel="BinderCopy" style={{ width: 240, height: 58, alignSelf: 'center' }} resizeMode="contain" />
      <Text style={s.title}>{sentTo ? 'Check your email' : 'Sign in'}</Text>
      {sentTo ? <><Text style={s.body}>{sentTo}</Text><TextInput accessibilityLabel="Email code" placeholder="Email code" placeholderTextColor={c.muted} value={code} onChangeText={setCode} textContentType="oneTimeCode" keyboardType="number-pad" autoComplete="one-time-code" maxLength={10} style={s.input} onSubmitEditing={() => run(() => auth.verifyCode(sentTo, code.trim()))} /></> : <TextInput accessibilityLabel="Email address" placeholder="Email address" placeholderTextColor={c.muted} value={email} onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} textContentType="emailAddress" keyboardType="email-address" style={s.input} onSubmitEditing={send} />}
      {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
      <Pressable accessibilityRole="button" disabled={busy} onPress={sentTo ? () => run(() => auth.verifyCode(sentTo, code.trim())) : send} style={[s.button, busy && { opacity: 0.5 }]}><Text style={s.label}>{busy ? 'Please wait…' : sentTo ? 'Sign in' : 'Send code'}</Text></Pressable>
      {!!sentTo && <View style={s.row}><Pressable accessibilityRole="button" disabled={busy} onPress={() => { setSentTo(''); setError(''); setCode(''); }} style={s.secondary}><Text style={s.body}>Change email</Text></Pressable><Pressable accessibilityRole="button" disabled={busy} onPress={send} style={s.secondary}><Text style={s.body}>Resend code</Text></Pressable></View>}
    </View>
  </KeyboardAvoidingView>;
}
const s = StyleSheet.create({ center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: c.background }, form: { width: '100%', maxWidth: 380, gap: 20 }, title: { ...t.title, color: c.text }, body: { ...t.body, color: c.secondary }, input: { ...t.body, color: c.text, minHeight: 48, borderWidth: 1, borderColor: c.border, borderRadius: 8, paddingHorizontal: 14 }, button: { minHeight: 48, backgroundColor: c.accent, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }, label: { ...t.label, color: c.onAccent }, error: { ...t.body, color: c.danger }, row: { flexDirection: 'row', justifyContent: 'space-between' }, secondary: { paddingVertical: 12 } });
