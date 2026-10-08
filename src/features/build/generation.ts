import type { ApiClient } from '../../api/client';
import { colorsSchema, pageSchema, type Card, type Page } from '../../shared/contracts/index';

export type Inspiration = { kind: 'favorite'; card: Card } | { kind: 'card-colors'; card: Card } | { kind: 'photo'; colors: string[] } | { kind: 'theme'; query: string } | { kind: 'repeat' };
export type Proposal = { source: string; input: Page; page: Page; cards: Card[]; note: string };
export const fingerprint = (page: Page) => JSON.stringify({ ...page, revision: 0 });
export async function propose(api: Pick<ApiClient, 'request'>, current: Page, inspiration: Inspiration): Promise<Proposal> {
  const input: Page = JSON.parse(JSON.stringify(current));
  if (input.slots.every(slot => slot.locked)) throw new Error('Unlock a card first.');
  if (inspiration.kind !== 'repeat') {
    input.seedCardId = undefined; input.themeSource = undefined; input.colorInspiration = undefined;
    input.filters = { ...input.filters, q: '', themeTags: [] };
    input.backdrop = undefined; input.backdropMode = 'color';
  }
  if (inspiration.kind === 'favorite') {
    input.seedCardId = inspiration.card.id;
    const center = input.size % 2 === 1 ? Math.floor(input.slots.length / 2) : 0;
    const target = input.slots[center].locked ? input.slots.findIndex(slot => !slot.locked) : center;
    input.slots[target] = { cardId: inspiration.card.id, locked: true };
  } else if (inspiration.kind === 'card-colors') {
    const result = await api.request<{ colors: string[] }>('/colors/from-card', 'POST', { cardId: inspiration.card.id });
    input.colorInspiration = { source: 'card', cardId: inspiration.card.id, colors: colorsSchema.parse(result.colors) };
    if (input.size % 2 && input.slots.every(slot => !slot.cardId && !slot.locked)) input.slots[Math.floor(input.slots.length / 2)] = { cardId: inspiration.card.id, locked: true };
  } else if (inspiration.kind === 'photo') input.colorInspiration = { source: 'photo', colors: colorsSchema.parse(inspiration.colors) };
  else if (inspiration.kind === 'theme') {
    if (!inspiration.query.trim() || inspiration.query.length > 300) throw new Error('Enter a theme of up to 300 characters.');
    input.themeSource = inspiration.query.trim();
    input.filters = { ...input.filters, q: input.themeSource, mode: 'visual' };
  }
  const result = await api.request<{ slots: Page['slots']; cards: Card[]; palette?: Page['palette']; note?: string }>(input.colorInspiration ? '/colors/generate' : '/generate', 'POST', {
    slots: input.slots, filters: input.filters,
    ...(input.colorInspiration ? { colors: input.colorInspiration.colors } : { seedCardId: input.seedCardId }),
  });
  const generated = pageSchema.parse({ ...input, slots: result.slots, palette: result.palette ?? input.palette });
  input.slots.forEach((slot, i) => { if (slot.locked && (generated.slots[i].cardId !== slot.cardId || !generated.slots[i].locked)) throw new Error('The response changed a locked card. Your page is unchanged.'); });
  return { source: fingerprint(current), input, page: generated, cards: result.cards, note: result.note ?? '' };
}
export function keepProposal(current: Page, proposal: Proposal): Page {
  if (proposal.source !== fingerprint(current)) throw new Error('Your page changed. Generate another preview before keeping it.');
  return { ...proposal.page, id: current.id, name: current.name, revision: current.revision };
}
