import test from 'node:test';
import assert from 'node:assert/strict';
import { DraftJournal, type DraftStorage } from '../src/features/build/draftJournal';
import { newPage } from '../src/features/build/pageSession';
const id = 'fe9d30c4-5e36-44d6-9a33-f8c9dd53530c';
test('failed chunk write preserves last complete draft and accounts cannot read each other', async () => {
  const data = new Map<string, string>(); let failAfter = Infinity;
  const storage: DraftStorage = { getItem: async key => data.get(key) ?? null, setItem: async (key, value) => { if (--failAfter < 0) throw new Error('Storage full'); data.set(key, value); }, removeItem: async key => { data.delete(key); } };
  const journal = new DraftJournal(storage, 'account-a');
  const page = { ...newPage(id), name: 'Original' };
  await journal.write(page);
  failAfter = 1;
  await assert.rejects(journal.write({ ...page, name: 'Incomplete' }), /Storage full/);
  const reopened = new DraftJournal(storage, 'account-a');
  assert.equal((await reopened.read())?.name, 'Original');
  assert.equal(await new DraftJournal(storage, 'account-b').read(), null);
  failAfter = Infinity; await reopened.write({ ...page, name: 'Recovered' });
  assert.equal((await reopened.read())?.name, 'Recovered');
  await reopened.clear(); assert.equal(await reopened.read(), null); assert.equal(data.size, 0);
});
test('queued draft writes retain caller snapshots in order', async () => {
  const data = new Map<string, string>();
  const storage: DraftStorage = { getItem: async key => data.get(key) ?? null, setItem: async (key, value) => { data.set(key, value); }, removeItem: async key => { data.delete(key); } };
  const journal = new DraftJournal(storage, 'account');
  const page = newPage(id); const first = journal.write(page); page.name = 'Latest'; const second = journal.write(page); page.name = 'Unsubmitted';
  await Promise.all([first, second]); assert.equal((await journal.read())?.name, 'Latest');
});
