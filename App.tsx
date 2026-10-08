import 'react-native-url-polyfill/auto';
import React from 'react';
import { NativeModules, Text, View } from 'react-native';
import Workbench from './src/Workbench';
import { ApiClient, ApiError } from './src/api/client';
import { colors } from './src/design/tokens';
import { createNativeAuth } from './src/auth/nativeAuth';
import { authStorage } from './src/auth/storage';
import AuthGate from './src/auth/AuthGate';
import { DesktopDialogHost } from './src/components/DesktopDialog';
const native = NativeModules.BinderCopySystem;
const configured = (value: string) => value && !value.startsWith('$(') ? value : '';
const server = configured(native.apiURL) || (__DEV__ ? 'http://127.0.0.1:4181' : '');
const authURL = configured(native.authURL);
const publishableKey = configured(native.publishableKey);
const auth = authURL && publishableKey ? createNativeAuth(authURL, publishableKey, authStorage) : null;
const api = server ? new ApiClient(server, () => auth?.accessToken() ?? Promise.resolve(null), __DEV__) : null;
const createId = () => native.uuid();
export default function App() {
  const content = api && auth ? <AuthGate auth={auth}>{() => <Workbench api={api} createId={createId} desktop onAccountDeleted={() => auth.signOut()} onSignOut={async () => {
    try { await api.request('/session/logout', 'POST', {}); } catch (e) { if (!(e instanceof ApiError && e.status === 401)) throw e; }
    await auth.signOut();
  }} />}</AuthGate> : api && __DEV__ && /^http:\/\/(localhost|127\.0\.0\.1)/.test(server) ? <Workbench api={api} createId={createId} desktop /> : <Text style={{ color: colors.text, padding: 24 }}>Server configuration required.</Text>;
  return <View style={{ flex: 1, backgroundColor: colors.background }}><DesktopDialogHost>{content}</DesktopDialogHost></View>;
}
