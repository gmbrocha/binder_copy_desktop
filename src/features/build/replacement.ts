import type { Card, Page } from "../../shared/contracts";
import { fingerprint } from "./generation";
export type Replacement = { target: number; source: string; card?: Card };
export function beginReplacement(
  page: Page,
  target: number,
  card?: Card,
): Replacement {
  if (!page.slots[target] || page.slots[target].locked)
    throw new Error("Unlock this slot first.");
  return { target, source: fingerprint(page), card };
}
export function keepReplacement(page: Page, replacement: Replacement): Page {
  if (replacement.source !== fingerprint(page))
    throw new Error("Your page changed. Choose the replacement again.");
  if (
    !replacement.card ||
    !page.slots[replacement.target] ||
    page.slots[replacement.target].locked
  )
    throw new Error("Choose an unlocked slot and a replacement card.");
  return {
    ...page,
    slots: page.slots.map((slot, i) =>
      i === replacement.target
        ? { ...slot, cardId: replacement.card!.id }
        : slot,
    ),
  };
}
