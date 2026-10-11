# Current state — BinderCopy macOS

## Objective

October 11 owner instruction: replace “A card’s colors” with **Start from → A card’s art (bg surround)**, restore the original persistent catalog-artwork cache for responsiveness, and ship both native TestFlight betas. Preserve the loading animation and accepted design. This explicitly resumes the October 10 pause for these changes only.

## Verified state

- Backend **32598ee4c5126a670b85a6fcd1da6976becd369b** is live at https://bindercopy-api.clearpathsystems.tools. Staging and production each passed typecheck and 115 tests. Restore rehearsal preserved deletion denial, unrelated pages, metering and catalog; no restored DB was promoted.
- Art-surround API is enabled in production. Authenticated owner bootstrap advertises it, anonymous job access returns 401, purchases remain off, and the normal monthly allowance remains USD 5/person; only verified Sagar is unlimited.
- Restored original artwork/vision-image disk cache, indexed-original reuse, thumbnails and concurrent request coalescing. Recovered 19,663 original images and 1,278 artwork files from frozen PWA data without editing that source. Warmup finished for all 19,666 supported image URLs (21,256 catalog records): 19,665 thumbnails and 19,663 high-resolution files cached. dc1-1 has neither size upstream; ex14-97 and sv03.5-163 have thumbnails only.
- Authenticated public 40-card parallel request batches completed in 828 ms and 142 ms from the VPS probe. This measures server-side retrieval, not a physical phone's network/render latency. Public privacy page now discloses cached catalog artwork; Apple build-12 submitted metadata was not edited.
- iPhone source **17dbb3a**, Mac source **15bb73b**: art entry replaces card-color generation, six-stage API runner previews before Keep, page identity/name preserved, Undo/recovery retained. New grid generation clears incompatible surround layout. Existing legacy card-color pages remain readable. Loading component and animation are unchanged.
- Contract **0.2.5**, pinned domain/contracts source **b2042b2eb530977e1b511d57d8590ccf47973d45**, unchanged in this release.
- Local iPhone 30 tests / Mac 31 tests, both typechecks, boundary and documentation checks passed. Backend loading/cache targeted tests also passed after bounded-download guards were retained.

## Active work

Native iPhone art selection/loading/preview/keep check passed (38156104127), and screenshots were inspected. A retained grid-only subtitle/disabled button was found after Keep; corrected to View surround with no slot-replacement copy. Replacement archive/native check pending before beta upload; no build 13 uploaded yet.

Build **1.1.0 (13)** for both platforms and focused native UI checks are running. Do not call this TestFlight availability until uploads are VALID and internally assigned.

- iPhone archive 38156101587; native UI 38156104127.
- Mac archive 38156106405; native UI 38156108538.
- Shared budget: USD **409.627252** counted/reserved, **90.372748** unreserved. Includes USD 9 reserved before these two private iPhone workflows. Mac public standard runners remain included. No paid image calls this checkpoint.

## Blockers

No implementation/access blocker currently. Final native checks and Apple package processing are still pending. Cache population is complete except verified unavailable upstream sizes. Sagar's unlimited role still requires verified identity binding if not completed since the prior checkpoint; do not grant by email alone. No current external Apple review status is inferred from earlier evidence.

## Next actions

Inspect actual native UI evidence, resolve any failures, verify/upload signed packages and attach build 13 to the existing internal group. Cache coverage is recorded in /var/cache/bindercopy/api/artwork-coverage.json. Update release evidence and all three repositories; preserve unrelated user edits.

## Verification

Backend restore evidence: /var/backups/bindercopy/art-surround-restore-20261011. Production probe: /var/lib/bindercopy/monitor/art-surround-release-check.json. Cache progress: /var/cache/bindercopy/api/artwork-warmup.json, service bindercopy-artwork-warmup-20261011. Deployment logs: /tmp/art-surround-staging.log and /tmp/art-surround-production.log.

Six-pass provider compatibility was already proven October 10 (USD 0.151994, about 79 seconds), with known remaining inset-seam variation; see backend docs/CARD_SURROUND_API_CHECK.md. This is not a promise of pixel-perfect output on arbitrary cards. Current native fixture checks do not spend on image generation.

## Last checkpoint

October 11: feature source committed/pushed; backend deployed with backups and restore verification; live surround capability and cached reads confirmed. Native archives/UI still running. Last confirmed available TestFlight builds remain **1.1.0 (12)** for iPhone and Mac. Build-12 App Review and the separate unlisted request were left untouched; their previously recorded state was waiting for review, not rechecked in this task. PWA/tunnel/Cloudflare retirement remains deferred until owner-approved native availability/distribution; no sunset action this task.

Retain HANDOFF_PAUSED.md as the earlier checkpoint and backend docs/CARD_SURROUND.md for the runner. Preserve pre-existing backend docs/NATIVE_USER_GUIDE.md, both docs/UI_PARITY.md, and iPhone MINOR_TODO_AND_IDEAS.txt. Never commit credentials/operator artifacts.

October 11 final source correction: saved surrounds now reopen directly from their saved asset without a new job request; View surround replaces the inactive grid regeneration button and obsolete slot subtitle. Native fixtures assert exactly one POST across creation and reopening. Replacement archive/UI reservations recorded before dispatch; earlier iPhone archive 13 is withheld, not uploaded.
