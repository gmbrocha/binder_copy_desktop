import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createNativeAuth } from '../src/auth/nativeAuth';

const url = 'https://test-project.supabase.co';
const publicKey = 'sb_publishable_test_fixture';
const user = { id: '74f8f984-454b-4847-b64f-4c69d22b48a0', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: '2026-10-07T00:00:00Z' };
const session = (expires: number, refresh = 'fixture-refresh') => ({ access_token: 'fixture-access', refresh_token: refresh, token_type: 'bearer', expires_in: 3600, expires_at: expires, user });
function store(initial?: unknown) {
  const values = new Map<string, string>(initial ? [['bindercopy.session', JSON.stringify(initial)]] : []);
  return { values, getItem: async (key: string) => values.get(key) ?? null, setItem: async (key: string, value: string) => { values.set(key, value); }, removeItem: async (key: string) => { values.delete(key); } };
}
test('native config rejects server credentials and insecure origins before any network request', () => {
  assert.throws(() => createNativeAuth(url, 'sb_secret_fixture', store()));
  assert.throws(() => createNativeAuth('http://test-project.supabase.co', publicKey, store()));
  assert.throws(() => createNativeAuth('https://test-project.supabase.co@attacker.test', publicKey, store()));
});
test('concurrent artwork and API requests share one refresh and persist its rotated token', async () => {
  const storage = store(session(Math.floor(Date.now() / 1000) - 10));
  let rotations = 0;
  const auth = createNativeAuth(url, publicKey, storage, async (input, init) => {
    assert.match(String(input), /\/auth\/v1\/token\?grant_type=refresh_token/);
    assert.equal(JSON.parse(String(init?.body)).refresh_token, 'fixture-refresh');
    rotations++;
    await new Promise(resolve => setTimeout(resolve, 30));
    return new Response(JSON.stringify(session(Math.floor(Date.now() / 1000) + 3600, 'rotated-fixture')), { status: 200, headers: { 'Content-Type': 'application/json' } });
  });
  const tokens = await Promise.all(Array.from({ length: 12 }, () => auth.accessToken()));
  assert.ok(tokens.every(token => token === 'fixture-access'));
  assert.equal(rotations, 1);
  assert.equal(JSON.parse(storage.values.get('bindercopy.session')!).refresh_token, 'rotated-fixture');
  auth.client.auth.stopAutoRefresh();
});
test('sign out removes secure storage and never logs out other devices', async () => {
  const storage = store(session(Math.floor(Date.now() / 1000) + 3600));
  const auth = createNativeAuth(url, publicKey, storage, async (input) => {
    assert.match(String(input), /\/logout\?scope=local$/);
    return new Response(null, { status: 204 });
  });
  assert.equal(await auth.accessToken(), 'fixture-access');
  await auth.signOut();
  assert.equal(await auth.accessToken(), null);
  assert.equal(storage.values.has('bindercopy.session'), false);
  auth.client.auth.stopAutoRefresh();
});


test('password sign-in uses the provider grant and persists only the resulting session', async () => {
  const storage = store();
  const auth = createNativeAuth(url, publicKey, storage, async (input, init) => {
    assert.match(String(input), /\/token\?grant_type=password$/);
    const body = JSON.parse(String(init?.body));
    assert.equal(body.email, 'review@example.invalid');
    assert.equal(body.password, 'fixture-password-only');
    return new Response(JSON.stringify(session(Math.floor(Date.now()/1000)+3600)), {status:200,headers:{'Content-Type':'application/json'}});
  });
  await auth.signInWithPassword('review@example.invalid','fixture-password-only');
  assert.equal(await auth.accessToken(),'fixture-access');
  assert.ok([...storage.values.values()].every(value => !value.includes('fixture-password-only')));
  auth.client.auth.stopAutoRefresh();
});

test('rejected password creates no authenticated session', async () => {
  const storage = store();
  const auth = createNativeAuth(url, publicKey, storage, async () => new Response(JSON.stringify({error:'invalid_grant',error_description:'Invalid login credentials'}),{status:400,headers:{'Content-Type':'application/json'}}));
  await assert.rejects(auth.signInWithPassword('review@example.invalid','wrong-fixture'));
  assert.equal(await auth.accessToken(),null);
  assert.equal(storage.values.has('bindercopy.session'),false);
  auth.client.auth.stopAutoRefresh();
});
