import React from 'react';
import { NativeModules, View } from 'react-native';
import Workbench from './src/Workbench';
import { ApiClient } from './src/api/client';
import { colors } from './src/design/tokens';
// Loopback is development-only. Public auth is a required release gate.
const api = new ApiClient('http://127.0.0.1:4181', async () => null, true);
export default function App() {
  return <View style={{ flex: 1, backgroundColor: colors.background }}><Workbench api={api} createId={() => NativeModules.BinderCopySystem.uuid()} desktop /></View>;
}
