import React, { createContext, useContext, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, TextInput, View, type ModalProps, type ViewProps } from 'react-native';
import { colors } from '../design/tokens';

type Entry = { id: string; content: React.ReactNode; close?: ModalProps['onRequestClose']; compact?: boolean };
type Registry = { update: (entry: Entry) => void; remove: (id: string) => void };
const Dialogs = createContext<Registry | null>(null);
type MacKeyEvent = { nativeEvent: { key: string }; stopPropagation: () => void };
// These View props are supplied by react-native-macos, not upstream RN's types.
const KeyboardView = View as React.ComponentType<ViewProps & { onKeyDown?: (event: MacKeyEvent) => void; keyDownEvents?: { key: string }[] }>;

/** AppKit-backed RN views; avoids the unsupported Fabric Modal host on macOS. */
export function DesktopDialogHost({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const registry = useMemo<Registry>(() => ({
    update: entry => setEntries(previous => {
      const index = previous.findIndex(item => item.id === entry.id);
      if (index < 0) return [...previous, entry];
      if (previous[index].content === entry.content && previous[index].close === entry.close && previous[index].compact === entry.compact) return previous;
      return previous.map(item => item.id === entry.id ? entry : item);
    }),
    remove: id => setEntries(previous => previous.some(item => item.id === id) ? previous.filter(item => item.id !== id) : previous),
  }), []);
  const top = entries.at(-1);
  return <Dialogs.Provider value={registry}>
    <KeyboardView style={styles.root} keyDownEvents={top ? [{ key: 'Escape' }] : []} onKeyDown={event => {
      if (top && event.nativeEvent.key === 'Escape') { event.stopPropagation(); top.close?.(event as never); }
    }}>
      <View style={styles.root} pointerEvents={top ? 'none' : 'auto'} accessibilityElementsHidden={!!top} importantForAccessibility={top ? 'no-hide-descendants' : 'auto'}>{children}</View>
      {entries.map((entry, index) => <View key={entry.id} style={[styles.overlay, index !== entries.length - 1 && styles.hidden]} pointerEvents={index === entries.length - 1 ? 'auto' : 'none'} accessibilityElementsHidden={index !== entries.length - 1} accessibilityViewIsModal>
        <View style={[styles.panel, entry.compact && styles.compact]}>{entry.content}</View>
      </View>)}
    </KeyboardView>
  </Dialogs.Provider>;
}

export default function DesktopDialog({ visible = true, children, onRequestClose, onShow, compact = false }: ModalProps & { compact?: boolean }) {
  const registry = useContext(Dialogs);
  if (!registry) throw new Error('Desktop dialogs require DesktopDialogHost.');
  const id = useId();
  const wasVisible = useRef(false);
  useLayoutEffect(() => {
    if (visible) {
      if (!wasVisible.current) {
        TextInput.State.currentlyFocusedInput()?.blur();
        onShow?.({} as never);
      }
      registry.update({ id, content: children, close: onRequestClose, compact });
    } else registry.remove(id);
    wasVisible.current = visible;
  }, [registry, id, visible, children, onRequestClose, onShow, compact]);
  useLayoutEffect(() => () => registry.remove(id), [registry, id]);
  return null;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#0009', padding: 24, alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  panel: { width: '100%', maxWidth: 900, height: '100%', borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, overflow: 'hidden' },
  compact: { height: undefined, maxHeight: '100%', maxWidth: 640 },
  hidden: { display: 'none' },
});
