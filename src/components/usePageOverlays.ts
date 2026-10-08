import { useLoadingMedia } from './Loading';
import { useEffect, useRef, useState } from 'react';
import type { ApiClient } from '../api/client';
import { hasImageBackground, solidOverlays, type OverlayPage, type PageOverlays } from '../shared/domain/overlays';

export default function usePageOverlays(api: ApiClient, page: OverlayPage) {
  // AuthGate remounts the page tree on identity changes. Never retain private
  // page names/art IDs in a module cache: the API client itself spans accounts.
  const cache = useRef({ api, entries: new Map<string, Promise<PageOverlays>>() });
  const input: OverlayPage = { size: page.size, name: page.name, palette: page.palette,
    customColor: page.customColor, backdrop: page.backdrop, backdropMode: page.backdropMode };
  const key = JSON.stringify(input);
  const image = hasImageBackground(page);
  const rendered = useLoadingMedia(key);
  const [result, setResult] = useState<{ key: string; value: PageOverlays }>();
  const [loaded, setLoaded] = useState<string>();
  const [failed, setFailed] = useState<string>();
  useEffect(() => {
    if (!image) { rendered(); return; }
    let active = true;
    if (cache.current.api !== api) cache.current = { api, entries: new Map() };
    const entries = cache.current.entries;
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
      if (active) { setResult({ key, value }); rendered(); }
    }).catch(() => { if (active) { setFailed(key); rendered(); } });
    return () => { active = false; };
  }, [api, key, image]);
  const ready = image && result?.key === key && failed !== key;
  const visible = ready && loaded === key;
  return { key, ready, visible, failed: failed === key,
    overlays: visible ? result!.value : solidOverlays(page),
    onLoad: () => setLoaded(key), onError: () => setFailed(key) };
}
