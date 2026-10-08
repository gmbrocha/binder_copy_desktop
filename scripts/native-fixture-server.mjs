import http from 'node:http';
import fs from 'node:fs';
// Isolated UI-test data only. Never imported by the application or deployed backend.
const art = fs.readFileSync(new URL('../assets/brand/icon.png', import.meta.url));
const cards = Array.from({ length: 12 }, (_, i) => ({ id: `fixture-${i + 1}`, name: `Fixture ${i + 1}`, setId: 'demo', setName: 'Demo set', number: String(i + 1), image: '', releaseDate: '2026-01-01', category: 'Pokemon', rarity: 'Demo', artist: 'Fixture', types: ['Water'], dexIds: [], art: 'full', tags: ['blue'], owned: false, curated: false, curationRevision: 0 }));
const contrastImage = fs.readFileSync(new URL('./fixtures/contrast.png', import.meta.url));
const contrastPage = { id: '11111111-1111-4111-8111-111111111111', name: 'Contrast test', size: 2, revision: 1, palette: 'ocean', backdropMode: 'art', filters: { q: '', tags: [], themeTags: [], art: 'all', ownership: 'all' }, slots: cards.slice(0,4).map(c => ({cardId:c.id,locked:false})), backdrop: { kind:'generated',assetId:'22222222-2222-4222-8222-222222222222',sourceHash:'a'.repeat(64),layoutVersion:1 } };
const pages = new Map([[contrastPage.id,contrastPage]]);
const server = http.createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://127.0.0.1').pathname;
  process.stdout.write(`${req.method} ${pathname}\n`);
  const send = (value, status = 200) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(value)); };
  try {
    let raw = ''; for await (const chunk of req) { raw += chunk; if (raw.length > 100000) throw new Error('Oversized fixture request'); }
    const body = raw ? JSON.parse(raw) : {};
    if (pathname === '/api/page-overlays') return send({title:'cream',logo:'dark'});
    if (pathname.startsWith('/api/backdrops/')) { res.writeHead(200, { 'Content-Type': 'image/png' }); return res.end(contrastImage); }
    if (pathname === '/api/health') return send({ ok: true });
    if (pathname === '/api/billing') return send({ state: { tier: 'free', environment: null, expiresAt: null, needsRefresh: false, period: '2026-10', allowanceMicroUsd: 0, committedMicroUsd: 0, remainingMicroUsd: 0, halted: false, paidApi: false }, productIds: [], purchasingAvailable: false });
    if (pathname === '/api/export/png') { res.writeHead(200, { 'Content-Type': 'image/png' }); return res.end(art); }
    if (pathname === '/api/bootstrap') return send({ user: { id: 'native-ui-fixture', name: 'UI test', role: 'user' }, capabilities: { curateTags: false, manageCatalog: false, paidApi: false }, aiConfigured: false, backdropConfigured: false, tags: [{ id: 'blue', label: 'Blue', category: 'color', aliases: [] }], sets: [{ id: 'demo', name: 'Demo set' }], types: [{ name: 'Water' }], categories: [{ name: 'Pokemon' }], years: [{ year: '2026' }], catalog: { count: 12, sets: 1 }, visual: { indexed: 12 } });
    if (pathname.startsWith('/api/art/')) { res.writeHead(200, { 'Content-Type': 'image/png' }); return res.end(art); }
    if (pathname === '/api/cards/search') { const found = cards.filter(card => (!body.filters.q || card.name.toLowerCase().includes(body.filters.q.toLowerCase())) && (body.filters.ownership !== 'owned' || card.owned) && (body.filters.ownership !== 'needed' || !card.owned)); return send({ cards: found.slice(body.offset, body.offset + body.limit), ids: found.map(c => c.id), total: found.length }); }
    if (pathname === '/api/cards/similar') return send({ cards: cards.filter(c => c.id !== body.seedCardId) });
    if (pathname === '/api/cards/batch') return send({ cards: cards.filter(c => body.ids.includes(c.id)) });
    if (/^\/api\/cards\/fixture-\d+$/.test(pathname)) return send(cards.find(c => c.id === pathname.split('/').pop()));
    if (pathname.startsWith('/api/ownership/')) { const card = cards.find(c => c.id === pathname.split('/').pop()); card.owned = body.owned; return send({ owned: card.owned }); }
    if (pathname === '/api/pages') return send({ pages: [...pages.values()] });
    if (pathname.startsWith('/api/pages/')) {
      const id = pathname.split('/').pop(); const current = pages.get(id);
      if (current && body.revision !== current.revision) return send({ error: 'Page changed elsewhere.' }, 409);
      if (req.method === 'DELETE') { pages.delete(id); return send({ ok: true }); }
      const saved = { ...body, revision: (current?.revision ?? 0) + 1 }; pages.set(id, saved); return send(saved);
    }
    if (pathname === '/api/generate' || pathname === '/api/colors/generate') {
      if (pathname === '/api/colors/generate' && (!Array.isArray(body.colors) || !body.colors.length || body.colors.some(color => !/^#[a-f0-9]{6}$/i.test(color)) || Object.keys(body).some(key => !['slots', 'filters', 'colors'].includes(key)))) return send({ error: 'Only extracted colors may be uploaded.' }, 400);
      if (Number.isInteger(body.target)) {
        const candidate = cards.find(card => !body.slots.some(slot => slot.cardId === card.id));
        return send({ slots: body.slots.map((slot, i) => i === body.target && !slot.locked && candidate ? { cardId: candidate.id, locked: false } : slot), cards });
      }
      return send({ slots: body.slots.map((slot, i) => slot.locked ? slot : { cardId: cards[i % cards.length].id, locked: false }), cards, palette: 'ocean' });
    }
    if (pathname === '/api/palette') return send({ palette: 'ocean' });
    if (pathname === '/api/colors/from-card') return send({ colors: ['#123456'] });
    if (pathname === '/api/interpret') return send({ tags: ['blue'], remaining: '', recognized: ['blue'], note: '', source: 'rules' });
    return send({ error: 'Fixture route not implemented.' }, 404);
  } catch { return send({ error: 'Fixture request failed.' }, 500); }
});
server.listen(4181, '127.0.0.1', () => process.stdout.write('Local UI fixture ready; no external API calls.\n'));
