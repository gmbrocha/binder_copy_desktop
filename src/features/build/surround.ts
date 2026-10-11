import type { Page } from '../../shared/contracts';
import { pageSchema } from '../../shared/contracts';
import { backgroundSource } from './background';
export type SurroundJob = {
    id: string;
    cardId: string;
    status: string;
    stage?: string;
    currentPipeline?: boolean;
    pipelineVersion?: string;
    error?: string;
    backdrop?: Page['backdrop'];
};
export function surroundPage(page: Page, job: SurroundJob): Page {
    if (job.status !== 'complete' || !job.backdrop)
        throw new Error('The surround is not ready.');
    return pageSchema.parse({ ...page, size: 3, slots: Array.from({ length: 9 }, (_, i) => ({ cardId: i === 4 ? job.cardId : null, locked: i === 4 })),
        seedCardId: undefined, colorInspiration: undefined, themeSource: undefined,
        surround: { version: 'michi-staged-v1', cardId: job.cardId }, backdrop: job.backdrop, backdropMode: 'art' });
}
export function keepSurround(page: Page, source: string, job: SurroundJob) {
    if (backgroundSource(page) !== source)
        throw new Error('Your page changed. Open the surround again before keeping it.');
    return surroundPage(page, job);
}

/** Reopening a saved page bypasses this recovery path and retains its original asset. */
export async function recoverSurround(request: <T>(path: string) => Promise<T>, cardId: string, attemptId: string | null): Promise<SurroundJob | undefined> {
    if (attemptId) {
        const job = await request<SurroundJob>('/surrounds/' + encodeURIComponent(attemptId));
        if (job.cardId !== cardId) throw new Error('This surround belongs to another card.');
        return job;
    }
    const latest = (await request<{job: SurroundJob | null}>('/surrounds')).job;
    if (latest?.cardId === cardId && (['running', 'blocked'].includes(latest.status) || (latest.status === 'complete' && latest.currentPipeline === true))) return latest;
    return undefined;
}
