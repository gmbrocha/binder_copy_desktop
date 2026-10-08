import { createClient, type Session, type SupportedStorage } from '@supabase/supabase-js';

export function createNativeAuth(url: string, publishableKey: string, storage: SupportedStorage, transport: typeof fetch = fetch) {
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url) || !/^sb_publishable_[A-Za-z0-9_-]+$/.test(publishableKey)) {
    throw new Error('Sign-in configuration is unavailable.');
  }
  const client = createClient(url, publishableKey, { global: { fetch: transport }, auth: {
    storage, storageKey: 'bindercopy.session', persistSession: true,
    autoRefreshToken: false, detectSessionInUrl: false, flowType: 'pkce',
  }});
  let refreshing: Promise<Session | null> | undefined;
  return {
    client,
    async accessToken(): Promise<string | null> {
      const { data, error } = await client.auth.getSession();
      if (error) throw error;
      if (!data.session) return null;
      if ((data.session.expires_at ?? 0) * 1000 > Date.now() + 60_000) return data.session.access_token;
      // One rotation for concurrent API and artwork requests.
      if (!refreshing) refreshing = client.auth.refreshSession().then(({ data, error }) => {
        if (error) throw error;
        return data.session;
      }).finally(() => { refreshing = undefined; });
      return (await refreshing)?.access_token ?? null;
    },
    async sendCode(email: string) {
      const { error } = await client.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
      if (error) throw error;
    },
    async verifyCode(email: string, token: string) {
      const { error } = await client.auth.verifyOtp({ email, token, type: 'email' });
      if (error) throw error;
    },
    async signOut() {
      const { error } = await client.auth.signOut({ scope: 'local' });
      if (error) throw error;
    },
  };
}
export type NativeAuth = ReturnType<typeof createNativeAuth>;
