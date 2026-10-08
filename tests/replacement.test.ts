import test from "node:test";
import assert from "node:assert/strict";
import { newPage } from "../src/features/build/pageSession";
import {
  beginReplacement,
  keepReplacement,
} from "../src/features/build/replacement";
import type { Card } from "../src/shared/contracts";
const candidate = { id: "new-card" } as Card;
test("replacement previews do not edit the source and keep changes only the target", () => {
  const page = newPage("one");
  page.slots[0] = { cardId: "old-card", locked: false };
  page.slots[1] = { cardId: "locked", locked: true };
  const proposal = beginReplacement(page, 0, candidate);
  assert.equal(page.slots[0].cardId, "old-card");
  const kept = keepReplacement(page, proposal);
  assert.equal(kept.slots[0].cardId, "new-card");
  assert.deepEqual(kept.slots.slice(1), page.slots.slice(1));
  assert.equal(kept.id, page.id);
  assert.equal(kept.name, page.name);
});
test("replacement rejects locked slots and stale previews", () => {
  const page = newPage("one");
  const proposal = beginReplacement(page, 0, candidate);
  page.slots[0].locked = true;
  assert.throws(() => beginReplacement(page, 0, candidate), /Unlock/);
  assert.throws(() => keepReplacement(page, proposal), /changed/);
  page.slots[0].locked = false;
  page.name = "Renamed";
  assert.throws(() => keepReplacement(page, proposal), /changed/);
});
