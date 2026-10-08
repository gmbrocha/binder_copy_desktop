import type { Card, Filters, Page, Tag } from '../shared/contracts/index';
export type Bootstrap = { user: { id: string; name: string; role: string }; capabilities?: { curateTags: boolean; manageCatalog: boolean; paidApi: boolean }; tags: Tag[]; sets: { id: string; name: string }[]; types: { name: string }[]; categories: { name: string }[]; years: { year: string }[]; aiConfigured: boolean; backdropConfigured: boolean; catalog: { count: number; sets: number }; visual: { indexed: number } };
export type Search = { cards: Card[]; ids: string[]; total: number; method?: string; note?: string };
export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export class ApiClient {
  constructor(readonly baseUrl: string, private token: () => Promise<string | null>, private localPreview = false) {
    const secureOrigin = /^https:\/\/[a-zA-Z0-9.-]+(?::\d+)?$/.test(baseUrl);
    const previewOrigin = /^http:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?$/.test(baseUrl);
    if (!secureOrigin && !(localPreview && previewOrigin)) {
      throw new Error('The server must use HTTPS.');
    }
  }
  async request<T>(path: string, method = 'GET', body?: unknown, signal?: AbortSignal): Promise<T> {
    const token = await this.token();
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (signal?.aborted) controller.abort();
    signal?.addEventListener('abort', abort);
    const timeout = setTimeout(abort, path === '/backdrops/generate' ? 150000 : 110000);
    try {
      const response = await fetch(this.baseUrl + '/api' + path, {
        method, signal: controller.signal,
        headers: {
          Accept: 'application/json',
          ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
          ...(token ? { Authorization: 'Bearer ' + token } : {}),
          ...(this.localPreview ? { Origin: this.baseUrl } : {}),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      if (!response.headers.get('content-type')?.includes('application/json')) throw new ApiError(response.status, 'The server returned an unexpected response.');
      const result = await response.json();
      if (!response.ok) throw new ApiError(response.status, result.error || 'Request failed. Please retry.');
      return result as T;
    } finally {
      clearTimeout(timeout);
      signal?.removeEventListener('abort', abort);
    }
  }
  bootstrap() { return this.request<Bootstrap>('/bootstrap'); }
  search(filters: Filters, offset = 0, limit = 48, signal?: AbortSignal) { return this.request<Search>('/cards/search', 'POST', { filters, offset, limit }, signal); }
  pages() { return this.request<{ pages: Page[] }>('/pages'); }
  save(page: Page) { return this.request<Page>('/pages/' + page.id, 'PUT', page); }
  cards(ids: string[]) { return this.request<{ cards: Card[] }>('/cards/batch', 'POST', { ids }); }
  image(id: string) { return this.baseUrl + '/api/art/' + encodeURIComponent(id); }
  async imageSource(id: string) {
    const token = await this.token();
    return { uri: this.image(id), headers: token ? { Authorization: 'Bearer ' + token } : undefined };
  }
  async backgroundSource(id: string) {
    const token = await this.token();
    return { uri: this.baseUrl + '/api/backdrops/' + encodeURIComponent(id), headers: token ? { Authorization: 'Bearer ' + token } : undefined };
  }
  async export(page: Page, format: 'png' | 'csv'): Promise<Uint8Array> {
    const token = await this.token();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000);
    try {
      const response = await fetch(this.baseUrl + '/api/export/' + format, {
        method: 'POST', signal: controller.signal,
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}), ...(this.localPreview ? { Origin: this.baseUrl } : {}) },
        body: JSON.stringify(page),
      });
      if (!response.ok) throw new ApiError(response.status, 'Export failed. Please try again.');
      if (!response.headers.get('content-type')?.includes(format === 'png' ? 'image/png' : 'text/csv')) throw new Error('Unexpected export format.');
      return new Uint8Array(await response.arrayBuffer());
    } finally { clearTimeout(timeout); }
  }
  ownership(id: string, owned: boolean) { return this.request<{ owned: boolean }>('/ownership/' + encodeURIComponent(id), 'PUT', { owned }); }
}
