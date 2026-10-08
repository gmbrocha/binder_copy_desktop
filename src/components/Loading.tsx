import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, type as typography } from '../design/tokens';
import { LoadingClock } from './loadingClock';
const paint = () => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
type State = { clock: LoadingClock; visible: boolean; layers: string[]; layer: (id: string, visible: boolean) => void };
const Loading = createContext<State | null>(null);
export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [, refresh] = useState(0);
  const [layers, setLayers] = useState<string[]>([]);
  const [clock] = useState(() => new LoadingClock(() => refresh(n => n + 1), undefined, sample => { if (__DEV__) console.info("[BinderCopy render timing]", JSON.stringify(sample)); }));
  useEffect(() => () => clock.dispose(), [clock]);
  const layer = React.useCallback((id: string, visible: boolean) => setLayers(list => visible ? list.includes(id) ? list : [...list, id] : list.filter(x => x !== id)), []);
  const value = useMemo(() => ({ clock, visible: clock.visible, layers, layer }), [clock, clock.visible, layers, layer]);
  return <Loading.Provider value={value}>{children}</Loading.Provider>;
}
export function useLoadingVisible() { return !!useContext(Loading)?.visible; }
export function LoadingOverlay({ layer }: { layer?: string }) {
  const state = useContext(Loading);
  if (!state?.visible) return null;
  const top = state.layers.at(-1) === layer;
  return <View testID="loading-overlay" style={s.scrim} accessibilityViewIsModal={top}>
    {top && <Text accessibilityRole="text" accessibilityLiveRegion="polite" style={s.label}>Loading</Text>}
  </View>;
}
export function useLoadingLayer(id: string, visible: boolean) {
  const register = useContext(Loading)?.layer;
  useEffect(() => { register?.(id, visible); return () => register?.(id, false); }, [register, id, visible]);
}
export function useLoading() {
  const clock = useContext(Loading)?.clock;
  return React.useCallback(async <T,>(operation: string, fn: () => Promise<T>): Promise<T> => {
    const finish = clock?.begin(operation);
    try { return await fn(); }
    finally { await paint(); finish?.(); }
  }, [clock]);
}
// Media mounted by a pending action keeps its overlay until native decoding/rendering
// completes. Background scrolling and passive images never start a new overlay.
export function useLoadingMedia(key: string) {
  const clock = useContext(Loading)?.clock;
  const finish = useRef<() => void>(() => {});
  useEffect(() => {
    const end = clock?.begin('render', true);
    let done = false;
    const settle = () => { if (done) return; done = true; clearTimeout(timeout); void paint().then(() => end?.()); };
    const timeout = setTimeout(settle, 25000);
    finish.current = settle;
    return settle;
  }, [clock, key]);
  return React.useCallback(() => finish.current(), []);
}
const s = StyleSheet.create({
  scrim: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: '#0006', alignItems: 'center', justifyContent: 'center', zIndex: 10000, elevation: 10000 },
  label: { ...typography.title, fontFamily: 'Audiowide', fontWeight: '400', color: colors.cream },
});
