import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { customColorSchema } from '../../shared/contracts';
import { colorText } from '../../shared/domain/palettes';
import { colors as c, type as t } from '../../design/tokens';

const choices = ['#FFFFFF', '#F5F0E6', '#E5F1F8', '#E8F2E5', '#FBEDE3', '#F0EAF8',
  '#FFD1DC', '#FFE6A7', '#C2E7DA', '#B9DAF1', '#D7C2F0', '#D3D8DF',
  '#C94E50', '#D89336', '#488768', '#396FA5', '#81549B', '#171A1F'];
export default function CustomColor({ value, disabled, onApply }: {
  value?: string; disabled: boolean; onApply: (hex: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value ?? '#FFFFFF');
  const valid = customColorSchema.safeParse(draft);
  const toggle = () => { if (!open) setDraft(value ?? '#FFFFFF'); setOpen(!open); };
  const apply = () => { if (valid.success && !disabled) { onApply(valid.data); setOpen(false); } };
  return <View style={{ gap: 10 }}>
    <Pressable accessibilityRole="button" accessibilityLabel="Custom color" accessibilityState={{ expanded: open, disabled }}
      disabled={disabled} onPress={toggle} style={[s.button, s.row]}>
      <View style={[s.preview, { backgroundColor: value ?? '#FFFFFF' }]} />
      <Text style={s.label}>Custom</Text>
      {!!value && <Text style={[s.label, { marginLeft: 'auto', color: c.secondary }]}>{value}</Text>}
    </Pressable>
    {open && <View style={{ gap: 10 }}>
      {[0, 6, 12].map(start => <View key={start} style={s.row}>
        {choices.slice(start, start + 6).map(hex => <Pressable key={hex} accessibilityRole="radio"
          accessibilityLabel={`Color ${hex}`} accessibilityState={{ checked: draft.toUpperCase() === hex, disabled }}
          disabled={disabled} onPress={() => setDraft(hex)} style={[s.choice, { backgroundColor: hex }]}>
          {draft.toUpperCase() === hex && <Text style={[s.label, { color: colorText(hex) }]}>✓</Text>}
        </Pressable>)}
      </View>)}
      <View style={s.row}>
        <TextInput accessibilityLabel="Hex color" value={draft} onChangeText={setDraft}
          editable={!disabled} autoCapitalize="characters" autoCorrect={false} maxLength={7}
          placeholder="#RRGGBB" placeholderTextColor={c.muted} returnKeyType="done" onSubmitEditing={apply}
          style={[s.input, { borderColor: valid.success ? c.border : c.danger }]} />
        <Pressable accessibilityRole="button" accessibilityLabel="Apply color" disabled={disabled || !valid.success}
          accessibilityState={{ disabled: disabled || !valid.success }} onPress={apply}
          style={[s.button, { opacity: disabled || !valid.success ? 0.4 : 1 }]}><Text style={s.label}>Apply</Text></Pressable>
      </View>
      {!valid.success && <Text accessibilityRole="alert" style={{ ...t.caption, color: c.danger }}>Use # and six color digits.</Text>}
    </View>}
  </View>;
}
const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { ...t.label, color: c.text },
  button: { minHeight: 44, borderWidth: 1, borderColor: c.border, borderRadius: 6, padding: 10, justifyContent: 'center' },
  preview: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: c.border },
  choice: { flex: 1, minHeight: 44, borderRadius: 6, borderWidth: 1, borderColor: c.border, alignItems: 'center', justifyContent: 'center' },
  input: { ...t.body, flex: 1, minWidth: 0, minHeight: 44, borderWidth: 1, borderRadius: 6, padding: 10, color: c.text },
});
