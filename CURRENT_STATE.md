# Current state — BinderCopy macOS

## Objective

October 11 requested scope is delivered: card-art surround replaces the card-colors start flow; the original server artwork cache is restored; both native apps have new TestFlight betas. Preserve the accepted UI and loading animation. Earlier public/unlisted review and PWA-retirement work remains paused unless separately authorized.

## Verified state

- **iPhone and Mac 1.1.0 (13): VALID and IN_BETA_TESTING**, assigned to existing internal group ba56be7f-b9ef-4031-b191-a677f79a0edd with updated release notes.
- iPhone Apple build f5d9a8b2-d288-4321-a5ce-416278b99aab; Mac Apple build e99530f1-ce13-45d2-aa7e-3d6db5917c91.
- Final iPhone runtime 6e27f7f: archive 38156888448, native UI 38156927755 at workflow correction 5e43994. Final Mac runtime 50450af: archive 38156891980, native UI 38159162730 at test correction 80e7fb9. Those workflow/test corrections change no application source.
- Native checks passed creation/preview/Keep/reopening; iPhone also verified the loading animation, and asserted exactly one generation POST across creation and reopening. Screenshots inspected. Archive verification covered signing, release endpoints, secret boundary and required entitlements; Mac supports Apple Silicon and Intel. Physical-device acceptance is not claimed.
- Backend 32598ee4c5126a670b85a6fcd1da6976becd369b remains live at https://bindercopy-api.clearpathsystems.tools with SURROUND enabled. Staging and production passed typecheck and 115 tests; isolated restore drill preserved deletion denial, unrelated pages, metering and catalog. No restored DB was promoted.
- Original disk artwork/vision cache, thumbnails, indexed-original reuse and request coalescing restored. Full warmup of 19,666 supported image URLs completed: **19,665 thumbnails / 19,663 high-resolution images**. Catalog has 21,256 total records. dc1-1 has no upstream artwork; ex14-97 and sv03.5-163 lack high resolution but have cached thumbnails. Sources without URLs cannot be cached.
- Authenticated 40-card parallel batches measured 828 ms / 142 ms from the VPS probe; phone network/render latency was not measured. Anonymous job requests return 401. Privacy page now discloses catalog image caching.
- All admitted accounts retain generation under the existing USD 5/person/UTC-month policy; only verified Sagar is unlimited. Purchases remain disabled. No new paid image calls in this release task.
- Contract/domain snapshot remains **0.2.5**, pinned to backend b2042b2eb530977e1b511d57d8590ccf47973d45.

## Active work

None remaining in the requested beta delivery. Await owner testing/next instruction. No automatic expansion into distribution, payment, legal, new design or PWA retirement.

## Blockers

No release blocker remains for these betas. Known quality limitation: generated surroundings can retain inset-scale/seam variation; the prior six-pass real API check is technical compatibility, not a guarantee of pixel-perfect matches on every card. Missing upstream images above are catalog-provider gaps, not unfilled available cache entries.

Sagar's unlimited admission still requires exact verified identity binding if not completed since the prior checkpoint; do not grant by email alone. Existing Apple review/unlisted status was not rechecked or changed by this task.

## Next actions

Owner installs **1.1.0 (13)** through TestFlight on each platform and tests Start from → A card’s art (bg surround). Older clients do not understand the surround layout faithfully; update both before editing surround pages across devices. View surround reopens saved artwork without generation; New surround explicitly requests another result. Preserve the current private Library and Undo behavior.

Do not replace App Review submissions, change distribution, retire the PWA/tunnel/Cloudflare setup, or trigger paid experiments without a new task. Maintain the existing operational services and budgets.

## Verification

Backend 115 tests; iPhone 30 tests; Mac 31 tests; all relevant typechecks, source-boundary/docs checks and native release/UI workflows passed. Loading animation source/assets were unchanged. Initial iPhone UI passed but screenshot inspection caught obsolete grid-only copy, corrected before final upload. Initial Mac jobs were cancelled; use the final runs above.

Backend docs/ART_SURROUND_BETA.md contains package hashes and release evidence. Server evidence: /var/backups/bindercopy/art-surround-restore-20261011, /var/lib/bindercopy/monitor/art-surround-release-check.json, /var/cache/bindercopy/api/artwork-coverage.json. Operator warmup script now attempts both qualities independently and serializes atomic progress writes; this post-deployment script improvement is tracked, while the deployed request-serving runtime remains 32598ee.

## Last checkpoint

October 11, 2026: both betas available. Feature/cache implementation and release records committed/pushed. Shared delivery budget **USD 409.627252 counted/reserved; USD 90.372748 unreserved**, including USD 18 reserved for initial/final iPhone archive/UI jobs; Mac standard public runners included. Retain holds pending actual billing reconciliation. Prior surround API experiment USD 0.151994 was already included; do not count it again.

Preserve historical HANDOFF_PAUSED.md and backend docs/CARD_SURROUND.md plus CARD_SURROUND_API_CHECK.md. Unrelated existing edits remain untouched: backend docs/NATIVE_USER_GUIDE.md, both docs/UI_PARITY.md, and iPhone MINOR_TODO_AND_IDEAS.txt. Secrets/operator journals remain ignored.
