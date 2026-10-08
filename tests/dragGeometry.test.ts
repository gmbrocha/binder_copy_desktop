import { test } from 'node:test';
import assert from 'node:assert/strict';
import { swapSlots, swapTarget } from '../src/features/build/dragGeometry';
import { newPage } from '../src/features/build/pageSession';
const rectangles = [{ left: 0, top: 0, width: 100, height: 140 }, { left: 110, top: 0, width: 100, height: 140 }];
test('dragging must cross the target inset; locked destinations and releases outside snap back', () => {
  const slots = [{ cardId: 'one', locked: false }, { cardId: 'two', locked: false }];
  assert.equal(swapTarget(0, 60, 0, rectangles, slots), null);
  assert.equal(swapTarget(0, 79, 0, rectangles, slots), null);
  assert.equal(swapTarget(0, 80, 0, rectangles, slots), 1);
  assert.equal(swapTarget(0, 110, 0, rectangles, slots), 1);
  assert.equal(swapTarget(0, 110, 100, rectangles, slots), null);
  slots[1].locked = true;
  assert.equal(swapTarget(0, 110, 0, rectangles, slots), null);
});
test('swap moves two complete slots without mutation and ignores locked or invalid slots', () => {
  const page = newPage('fe9d30c4-5e36-44d6-9a33-f8c9dd53530c', 2);
  page.slots[0].cardId = 'one'; page.slots[1].cardId = 'two';
  const swapped = swapSlots(page, 0, 1);
  assert.equal(swapped.slots[0].cardId, 'two'); assert.equal(swapped.slots[1].cardId, 'one');
  assert.equal(page.slots[0].cardId, 'one');
  page.slots[1].locked = true;
  assert.equal(swapSlots(page, 0, 1), page); assert.equal(swapSlots(page, 0, 99), page);
});
