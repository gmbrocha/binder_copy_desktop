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

Native iPhone art selection/loading/preview/keep check passed (38156104127), and screenshots were inspected. A retained grid-only subtitle/disabled button was found after Keep; corrected to View surround with no slot-replacement copy. Replacement archive/native check pending before beta upload; iPhone build 13 uploaded; Apple processing pending.

iPhone **1.1.0 (13)** is VALID and IN_BETA_TESTING in the existing internal group (verified October 11 17:01 UTC). Apple build ID f5d9a8b2-d288-4321-a5ce-416278b99aab. Final archive 38156888448 and native UI 38156927755 passed; screenshots inspected, exactly one POST across generation and reopening. Mac final archive 38156891980 and UI 38156932920 are running. Do not claim TestFlight availability until VALID and internally assigned.

- Final iPhone runtime 6e27f7f; UI workflow fix 5e43994 changes no app source. Signed IPA SHA256 2db4a3c162db0a8b84926c3e4baa8cb56edcb7ada22d402ddf6db1419c61f34d.
- Final Mac runtime 50450af; UI workflow fix 445b577 changes no app source. Initial Mac archive/UI were cancelled before upload in favor of final sources.
- Shared budget: USD **409.627252** counted/reserved, **90.372748** unreserved. Includes USD 18 reserved before the initial and final private iPhone archive/UI workflows. Mac public standard runners remain included. No paid image calls this checkpoint.

## Blockers

No implementation/access blocker currently. Final native checks and Apple package processing are still pending. Cache population is complete except verified unavailable upstream sizes. Sagar's unlimited role still requires verified identity binding if not completed since the prior checkpoint; do not grant by email alone. No current external Apple review status is inferred from earlier evidence.

## Next actions

Inspect actual native UI evidence, resolve any failures, verify/upload signed packages and attach build 13 to the existing internal group. Cache coverage is recorded in /var/cache/bindercopy/api/artwork-coverage.json. Update release evidence and all three repositories; preserve unrelated user edits.

## Verification

Backend restore evidence: /var/backups/bindercopy/art-surround-restore-20261011. Production probe: /var/lib/bindercopy/monitor/art-surround-release-check.json. Cache progress: /var/cache/bindercopy/api/artwork-warmup.json, service bindercopy-artwork-warmup-20261011. Deployment logs: /tmp/art-surround-staging.log and /tmp/art-surround-production.log.

Six-pass provider compatibility was already proven October 10 (USD 0.151994, about 79 seconds), with known remaining inset-seam variation; see backend docs/CARD_SURROUND_API_CHECK.md. This is not a promise of pixel-perfect output on arbitrary cards. Current native fixture checks do not spend on image generation.

## Last checkpoint

October 11: feature source committed/pushed; backend deployed with backups and restore verification; live surround capability and cached reads confirmed. Native archives/UI still running. Last confirmed available TestFlight builds: **iPhone 1.1.0 (13)**; Mac remains **1.1.0 (12)** until its final checks/upload finish. Build-12 App Review and the separate unlisted request were left untouched; their previously recorded state was waiting for review, not rechecked in this task. PWA/tunnel/Cloudflare retirement remains deferred until owner-approved native availability/distribution; no sunset action this task.

Retain HANDOFF_PAUSED.md as the earlier checkpoint and backend docs/CARD_SURROUND.md for the runner. Preserve pre-existing backend docs/NATIVE_USER_GUIDE.md, both docs/UI_PARITY.md, and iPhone MINOR_TODO_AND_IDEAS.txt. Never commit credentials/operator artifacts.

October 11 final source correction: saved surrounds now reopen directly from their saved asset without a new job request; View surround replaces the inactive grid regeneration button and obsolete slot subtitle. Native fixtures assert exactly one POST across creation and reopening. Replacement archive/UI reservations recorded before dispatch; earlier iPhone archive 13 is withheld, not uploaded.

Native UI workflow syntax corrected before dispatch; the rejected dispatch ran no job and consumed no reservation. Runtime sources and signed archive inputs are unchanged.

October 11 17:01 UTC: iPhone 13 assigned and IN_BETA_TESTING, with release notes. Mac final jobs still running. No App Review draft or distribution change.

Mac native UI 38156932920 failed before generation: XCTest could not find an automatic ScrollView hit point for the visibly rendered first card. Screenshot inspected; corrected test to click within the card frame without auto-scroll. Removed the transient spinner timing assertion from Mac (iPhone already verified it); still checks full preview/Keep/reopen and exactly one job POST. Application runtime/archive 50450af unchanged. Public-runner retry pending; iPhone remains available.
