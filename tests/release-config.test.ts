import test from 'node:test';
import assert from 'node:assert/strict';
// @ts-expect-error Standalone JS build guard is also used before npm/native setup.
import { checkReleaseConfig } from '../scripts/check-release-config.mjs';
test('store builds reject preview origins, secrets and missing build identifiers', () => {
  const env = { BINDERCOPY_API_URL: 'https://api.example.com', BINDERCOPY_AUTH_URL: 'https://fixture.supabase.co', BINDERCOPY_PUBLISHABLE_KEY: 'sb_publishable_fixture', BINDERCOPY_BUILD_NUMBER: '1' };
  assert.doesNotThrow(() => checkReleaseConfig(env));
  for (const origin of ['http://127.0.0.1:4181', 'https://localhost', 'https://api.invalid', 'https://user:password@api.example.com', 'https://api.example.com/path', 'https://api.example.com?token=secret']) assert.throws(() => checkReleaseConfig({ ...env, BINDERCOPY_API_URL: origin }));
  assert.throws(() => checkReleaseConfig({ ...env, BINDERCOPY_PUBLISHABLE_KEY: 'sb_secret_example' }));
  assert.throws(() => checkReleaseConfig({ ...env, BINDERCOPY_BUILD_NUMBER: '' }));
});
