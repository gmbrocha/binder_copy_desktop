import assert from 'node:assert/strict';
import { setTimeout } from 'node:timers/promises';

// Dev-only fixture readiness. Release apps use their embedded bundle and never
// import this script or contact Metro. Compile before XCTest's UI deadlines.
async function waitFor(url, verify) {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(5_000) });
      if (response.ok && verify(await response.text())) return;
    } catch { /* A just-started local process may not yet be listening. */ }
    await setTimeout(1_000);
  }
  throw new Error(`Local native fixture did not become ready: ${url}`);
}
await waitFor('http://127.0.0.1:4181/api/health', text => JSON.parse(text).ok === true);
await waitFor('http://127.0.0.1:8081/status', text => text.trim() === 'packager-status:running');
for (const lazy of ['false', 'true']) {
  const url = new URL('http://127.0.0.1:8081/index.bundle');
  url.search = new URLSearchParams({ platform: 'macos', dev: 'true', lazy, minify: 'false', inlineSourceMap: 'false', modulesOnly: 'false', runModule: 'true', excludeSource: 'true', sourcePaths: 'url-server', app: 'com.clearpathsystems.bindercopy' }).toString();
  const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(240_000) });
  assert.equal(response.status, 200, 'Metro must compile the actual macOS entry bundle before tests');
  const bundle = await response.text();
  assert.ok(bundle.length > 10_000 && bundle.includes('__d('), 'Expected a compiled Metro bundle');
  console.log(`Prepared macOS development bundle (lazy=${lazy}, ${bundle.length} characters).`);
}
console.log('Native fixture and Metro are ready for UI interaction deadlines.');
