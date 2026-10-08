import { test } from 'node:test';
import assert from 'node:assert/strict';
import { beginBackground, keepBackground, requestBackground } from '../src/features/build/background';
import { newPage } from '../src/features/build/pageSession';
import type { ApiClient } from '../src/api/client';
const id = 'fe9d30c4-5e36-44d6-9a33-f8c9dd53530c';
const backdrop = { kind: 'generated' as const, assetId: id, sourceHash: 'a'.repeat(64), layoutVersion: 1 as const };
test('uncertain background retry reuses id and captured payload; stale layout cannot keep it', async () => {
  const page = newPage(id); page.slots[0].cardId = 'sv1-1';
  const attempt = beginBackground(page, id);
  const bodies: any[] = [];
  const api: Pick<ApiClient, 'request'> = { request: async <T>(_path: string, _method?: string, body?: unknown) => { bodies.push(body); if (bodies.length === 1) throw new Error('timeout'); return { backdrop } as T; } };
  await assert.rejects(requestBackground(api, attempt), /timeout/);
  page.slots[0].cardId = 'sv1-2';
  const proposal = await requestBackground(api, attempt);
  assert.deepEqual(bodies[0], bodies[1]); assert.equal(bodies[1].requestId, id); assert.equal(bodies[1].slots[0].cardId, 'sv1-1');
  assert.throws(() => keepBackground(page, proposal), /changed/);
  const kept = keepBackground({ ...attempt.page, name: 'Renamed', revision: 5 }, proposal);
  assert.equal(kept.name, 'Renamed'); assert.equal(kept.revision, 5); assert.equal(kept.backdropMode, 'art');
});
test('empty page and missing asset responses are rejected', async () => {
  const page = newPage(id);
  assert.throws(() => beginBackground(page, id), /Add cards/);
  page.slots[0].cardId = 'sv1-1';
  await assert.rejects(requestBackground({ request: async <T>() => ({}) as T }, beginBackground(page, id)), /not returned/);
});
