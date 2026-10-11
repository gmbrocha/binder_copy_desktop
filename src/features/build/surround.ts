import type { Page } from '../../shared/contracts';
import { pageSchema } from '../../shared/contracts';
import { backgroundSource } from './background';
export type SurroundJob = {
    id: string;
    cardId: string;
    status: string;
    stage?: string;
    error?: string;
    backdrop?: Page['backdrop'];
};
export function surroundPage(page: Page, job: SurroundJob): Page {
    if (job.status !== 'complete' || !job.backdrop)
        throw new Error('The surround is not ready.');
    return pageSchema.parse({ ...page, size: 3, slots: Array.from({ length: 9 }, (_, i) => ({ cardId: i === 4 ? job.cardId : null, locked: i === 4 })),
        surround: { version: 'michi-staged-v1', cardId: job.cardId }, backdrop: job.backdrop, backdropMode: 'art' });
}
export function keepSurround(page: Page, source: string, job: SurroundJob) {
    if (backgroundSource(page) !== source)
        throw new Error('Your page changed. Open the surround again before keeping it.');
    return surroundPage(page, job);
}
