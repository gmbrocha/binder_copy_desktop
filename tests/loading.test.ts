import test from 'node:test';
import assert from 'node:assert/strict';
import { LoadingClock } from '../src/components/loadingClock';
test('loading waits 750ms, includes rendered media, and clears only after every action settles', t => {
  t.mock.timers.enable({apis: ['setTimeout']});
  let now = 0;
  const clock = new LoadingClock(() => {}, () => now);
  const finish = clock.begin('generate');
  now = 749; t.mock.timers.tick(749); assert.equal(clock.visible, false);
  const rendered = clock.begin('image', true);
  finish();
  now = 750; t.mock.timers.tick(1); assert.equal(clock.visible, true);
  now = 1200; rendered(); assert.equal(clock.visible, false);
  assert.deepEqual(clock.measurements, [{operation: 'generate', durationMs: 1200}]);
  rendered(); assert.equal(clock.measurements.length, 1);
});
test('fast work never flashes, passive images do not start a loader, and disposal cancels pending timers', t => {
  t.mock.timers.enable({apis: ['setTimeout']});
  const clock = new LoadingClock(() => {}, () => 0);
  clock.begin('passive', true)(); assert.equal(clock.active, false);
  clock.begin('fast')(); t.mock.timers.tick(750); assert.equal(clock.visible, false);
  clock.begin('cancel'); clock.dispose(); t.mock.timers.tick(750); assert.equal(clock.visible, false);
});
