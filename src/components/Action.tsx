import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors as c, type as t } from '../design/tokens';
export default function Action({ label, onPress, disabled = false, primary = false }: { label: string; onPress: () => void; disabled?: boolean; primary?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [s.button, primary && s.primary, disabled && { opacity: 0.4 }, pressed && { opacity: 0.7 }]}><Text style={[s.text, primary && { color: c.onAccent }]}>{label}</Text></Pressable>;
}
const s = StyleSheet.create({ button: { minHeight: 44, borderWidth: 1, borderColor: c.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 1 }, primary: { borderColor: c.accent, backgroundColor: c.accent }, text: { ...t.label, color: c.text } });
