import test from 'node:test';
import assert from 'node:assert/strict';
import { PageSession, newPage } from '../src/features/build/pageSession.ts';
import type { Page } from '../src/shared/contracts/index.ts';
test('Undo during delayed save is persisted with the acknowledged revision', async () => {
  const pending: { page: Page; resolve: (page: Page) => void }[] = [];
  const session = new PageSession(newPage('draft'), page => new Promise(resolve => pending.push({ page, resolve })), () => {});
  session.edit(p => ({ ...p, name: 'Moonlit forest' }));
  const saving = session.save();
  session.undo();
  pending[0].resolve({ ...pending[0].page, revision: 1 });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(pending[1].page.name, 'Untitled page');
  assert.equal(pending[1].page.revision, 1);
  pending[1].resolve({ ...pending[1].page, revision: 2 });
  await saving;
  assert.equal(session.page.name, 'Untitled page');
  assert.equal(session.page.revision, 2);
  assert.equal(session.dirty, false);
});
test('keeping a generated proposal preserves named draft identity and conflicts preserve local work', async () => {
  const session = new PageSession(newPage('saved-draft'), async () => { throw new Error('Conflict'); }, () => {});
  session.edit(p => ({ ...p, name: 'My page' }));
  session.edit(p => ({ ...p, slots: p.slots.map((s, i) => i ? s : { cardId: 'card-1', locked: true }) }));
  await assert.rejects(session.save(), /Conflict/);
  assert.equal(session.page.id, 'saved-draft');
  assert.equal(session.page.name, 'My page');
  assert.equal(session.page.slots[0].cardId, 'card-1');
  assert.equal(session.dirty, true);
});


test('Library reopening waits for autosave and uses the latest local revision', async () => {
  const shown = { ...newPage('saved'), name: 'Before', revision: 1 };
  let complete!: (page: Page) => void;
  const session = new PageSession(shown, page => new Promise(resolve => { complete = resolve; }), () => {});
  session.edit(p => ({ ...p, name: 'After', slots: p.slots.map((slot, i) => i ? slot : { cardId: 'new-card', locked: true }) }));
  const saving = session.save();
  let opened = false;
  const opening = session.prepareOpen(shown).then(page => { opened = true; return page; });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(opened, false);
  complete({ ...session.page, revision: 2 });
  await saving;
  const result = await opening;
  assert.equal(result.name, 'After');
  assert.equal(result.slots[0].cardId, 'new-card');
  assert.equal(result.revision, 2);
  result.name = 'Independent snapshot';
  assert.equal(session.page.name, 'After');
});

test('Library keeps newer remote snapshots and refuses navigation after a failed save', async () => {
  const shown = { ...newPage('saved'), revision: 2, name: 'Remote edit' };
  const session = new PageSession({ ...shown, revision: 1 }, async () => { throw new Error('Offline'); }, () => {});
  assert.equal((await session.prepareOpen(shown)).revision, 2);
  session.edit(p => ({ ...p, name: 'Unsaved edit' }));
  await assert.rejects(session.prepareOpen(newPage('different')), /Offline/);
  assert.equal(session.page.name, 'Unsaved edit');
  assert.equal(session.dirty, true);
});


test('custom color survives saving and reopening; preset selection and Undo restore it', async () => {
  let saved: Page | undefined;
  const session = new PageSession(newPage('colors'), async page => { saved = {...page,revision:page.revision+1}; return saved; }, () => {});
  session.edit(p => ({...p,customColor:'#345678',backdropMode:'color'}));
  await session.save();
  assert.equal(saved?.customColor,'#345678');
  session.edit(p => ({...p,palette:'ocean',customColor:undefined}));
  session.undo();
  assert.equal(session.page.customColor,'#345678');
  await session.save();
  assert.equal((await session.prepareOpen(saved!)).customColor,'#345678');
});
