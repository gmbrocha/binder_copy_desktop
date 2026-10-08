import { useEffect, useState } from 'react';
import type { ApiClient } from '../api/client';
import { hasImageBackground, solidOverlays, type OverlayPage, type PageOverlays } from '../shared/domain/overlays';

// Cache is scoped to the authenticated API client, never shared across accounts.
const cache = new WeakMap<ApiClient, Map<string, Promise<PageOverlays>>>();
export default function usePageOverlays(api: ApiClient, page: OverlayPage) {
  const input: OverlayPage = { size: page.size, name: page.name, palette: page.palette,
    customColor: page.customColor, backdrop: page.backdrop, backdropMode: page.backdropMode };
  const key = JSON.stringify(input);
  const image = hasImageBackground(page);
  const [result, setResult] = useState<{ key: string; value: PageOverlays }>();
  const [loaded, setLoaded] = useState<string>();
  const [failed, setFailed] = useState<string>();
  useEffect(() => {
    if (!image) return;
    let active = true;
    let entries = cache.get(api);
    if (!entries) { entries = new Map(); cache.set(api, entries); }
    let request = entries.get(key);
    if (!request) {
      if (entries.size >= 64) entries.delete(entries.keys().next().value!);
      request = api.request<PageOverlays>('/page-overlays', 'POST', input);
      entries.set(key, request);
      const current = request;
      void request.catch(() => { if (entries!.get(key) === current) entries!.delete(key); });
    }
    void request.then(value => {
      if (!['dark', 'cream'].includes(value.title) || !['dark', 'cream'].includes(value.logo)) throw Error('Invalid overlay colors');
      if (active) setResult({ key, value });
    }).catch(() => { if (active) setFailed(key); });
    return () => { active = false; };
  }, [api, key, image]);
  const ready = image && result?.key === key && failed !== key;
  const visible = ready && loaded === key;
  return { key, ready, visible, failed: failed === key,
    overlays: visible ? result!.value : solidOverlays(page),
    onLoad: () => setLoaded(key), onError: () => setFailed(key) };
}
