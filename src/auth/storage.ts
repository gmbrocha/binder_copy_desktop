import { NativeModules } from 'react-native';
const keychain = NativeModules.BinderCopySystem;
export const authStorage = {
  getItem: (key: string): Promise<string | null> => keychain.getSecret(key),
  setItem: (key: string, value: string): Promise<void> => keychain.setSecret(key, value),
  removeItem: (key: string): Promise<void> => keychain.removeSecret(key),
};
