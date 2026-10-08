import type { ApiClient } from '../../api/client';
import { pageSchema, type Page } from '../../shared/contracts';

export const backgroundSource = (page: Page) => JSON.stringify([page.id, page.size, page.palette ?? 'forge', page.customColor ?? null, page.slots.map(slot => slot.cardId)]);
export type BackgroundAttempt = { requestId: string; source: string; page: Page };
export type BackgroundProposal = { source: string; backdrop: NonNullable<Page['backdrop']> };
export function beginBackground(page: Page, requestId: string): BackgroundAttempt {
  if (!page.slots.some(slot => slot.cardId)) throw new Error('Add cards first.');
  return { requestId, source: backgroundSource(page), page: JSON.parse(JSON.stringify(page)) };
}
/** A failed/uncertain request is retried only with its original id. The server owns reservations. */
export async function requestBackground(api: Pick<ApiClient, 'request'>, attempt: BackgroundAttempt): Promise<BackgroundProposal> {
  const { page, requestId, source } = attempt;
  const result = await api.request<{ backdrop: Page['backdrop'] }>('/backdrops/generate', 'POST', { slots: page.slots, size: page.size, palette: page.palette ?? 'forge', requestId });
  const checked = pageSchema.parse({ ...page, backdrop: result.backdrop });
  if (!checked.backdrop) throw new Error('Background was not returned.');
  return { source, backdrop: checked.backdrop };
}
export function keepBackground(page: Page, proposal: BackgroundProposal): Page {
  if (backgroundSource(page) !== proposal.source) throw new Error('Your cards or colors changed. This background belongs to the previous layout.');
  return { ...page, backdrop: proposal.backdrop, backdropMode: 'art' };
}
