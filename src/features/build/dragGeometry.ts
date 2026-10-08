import type { Page } from '../../shared/contracts';
export type Rect = { left: number; top: number; width: number; height: number };
/** Match the PWA: dragged center must enter the inner 60% of an unlocked slot. */
export function swapTarget(from: number, dx: number, dy: number, rects: Rect[], slots: Page['slots']): number | null {
  const source = rects[from];
  if (!source || !slots[from]?.cardId || slots[from].locked) return null;
  const x = source.left + source.width / 2 + dx, y = source.top + source.height / 2 + dy;
  const index = rects.findIndex((rect, i) => i !== from && !slots[i]?.locked && x >= rect.left + rect.width * 0.2 && x <= rect.left + rect.width * 0.8 && y >= rect.top + rect.height * 0.2 && y <= rect.top + rect.height * 0.8);
  return index < 0 ? null : index;
}
export function swapSlots(page: Page, from: number, to: number): Page {
  if (from === to || !page.slots[from]?.cardId || !page.slots[to] || page.slots[from].locked || page.slots[to].locked) return page;
  const slots = page.slots.map(slot => ({ ...slot }));
  [slots[from], slots[to]] = [slots[to], slots[from]];
  return { ...page, slots };
}
