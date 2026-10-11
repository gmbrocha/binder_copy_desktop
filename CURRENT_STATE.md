# Current state — BinderCopy macOS

## Objective

Approved generic card-art surround pipeline delivered to iPhone and macOS TestFlight **1.1.0 (14)**. Owner accepts current visual quality, including occasional repeated elements, and defers further refinement to local work after this release. Preserve the UI/loading animation, cached artwork and account limits.

## Verified state

- Both build-14 packages are VALID / IN_BETA_TESTING in internal group ba56be7f-b9ef-4031-b191-a677f79a0edd. iPhone Apple build c01ebe94-5eba-4414-875f-821adf7816e1; Mac ee6d51a2-3001-4c3a-8e19-ec030f62aa64.
- iPhone runtime 3981ed0: archive 38178886589 and UI 38178888585. Mac runtime 377435c: universal archive 38178890422 and signed UI 38178892369. Both native interaction workflows passed; screenshots inspected and exactly one generation POST verified across creation and reopening.
- Backend **88fea1b9bc692eae712ce189be8340dad7d0a1e0** is live at https://bindercopy-api.clearpathsystems.tools. Application enables background-plan-v4-bounded-tiles analysis, six original image passes and continuous-reconciliation-v3 masked-canvas final repair. Every card uses the same pipeline; catalog names/subject captions are not positive generation context.
- Source analysis uses gpt-4.1-mini; images use gpt-image-2.5-flare-2026-09-08. No new paid image calls for this release. Five earlier real API samples and all failed attempts remain in backend docs/SURROUND_SEAM_TESTS.md and the durable evidence archive.
- Blank safe-snippet evidence conceals all original source pixels and uses the background-only description. It does not substitute unsafe card fragments. Missing artwork or provider failures leave the page unchanged; no unconditional visual-quality guarantee.
- Version metadata uses an additive side table, retaining old nine-column job-table compatibility for rollback. New selections do not silently recover obsolete completed jobs. Existing saved surrounds retain their original assets. Known requests are checked with GET; blocked allowance resumes with the same ID, and uncertain calls are not repeated automatically.
- Original artwork/vision cache remains restored: prior warmup verified 19,665 thumbnails and 19,663 originals from 19,666 supported URLs; catalog 21,256. Missing upstream artwork remains explicit. Post-deployment 40-card cached batches measured 989 ms / 73 ms from the VPS, not phone network/render timing.
- Admitted users retain USD 5/person/UTC-month allowance; unlimited only for verified Sagar. Purchases off. Authenticated capability/allowance and anonymous denial verified. No identity or membership grants changed in this release.
- Layout contract/domain snapshot remains 0.2.5 at backend b2042b2; original rounded center geometry, private saved pages, Keep and Undo preserved. Status metadata is additive; no page-layout migration.

## Active work

Release complete. Await owner testing. Further unique-element duplication and source-edge registration work is local follow-up, not a reason to hold this accepted beta. No automatic new paid experiment.

## Blockers

No release blocker. Generated artwork can still repeat scene elements or change form scale; Umbreon's second moon is documented. Owner accepted these limitations for now. Apple public/unlisted review state and Sagar's identity-binding state were not re-audited.

## Next actions

Install 1.1.0 (14) on both platforms. Start from → A card's art (bg surround) uses the updated backend. View surround retains saved artwork; New surround explicitly generates another result. Further refinement should address generic unique-anchor exclusion and edge registration, preserving the accepted Moltres checkpoint and five-card comparison.

Do not change App Review submissions, unlisted distribution, payments or PWA/tunnel/Cloudflare retirement without a separate instruction.

## Verification

Backend typecheck and 123 tests passed locally, staging and production. iPhone 31 tests; Mac 32 tests; both typechecks, boundary/docs checks and native archive/UI runs passed. Signed archives verified release settings, credentials boundary and entitlements; Mac arm64/x86_64 verified. Physical-device acceptance is not claimed.

Backup services and isolated restore rehearsal passed before production cutover. Catalog, deletion refusal, unrelated page, settled/reserved spending and budget halt preserved; source DB unchanged and restored copy never promoted. No active surround job at the pre-deployment check. Health and cache probes made zero paid calls.

Release evidence: backend docs/SURROUND_BUILD_14.md; local release/UI artifacts and Apple beta evidence. Server restore: /var/backups/bindercopy/surround-build14-restore-20261011. Server probes: /var/lib/bindercopy/monitor/surround-build14-release.json and art-surround-release-check.json.

## Last checkpoint

October 11, 2026: backend deployed; both 1.1.0 (14) builds available internally. Source/release documentation checkpoint committed and pushed across all three repositories. Shared delivery budget USD 420.020594 counted/reserved, USD 79.979406 unreserved; USD 9 iPhone archive/UI reservation retained pending billing reconciliation. Public standard Mac runners included.

Preserve historical handoffs and experiment archives. Unrelated edits remain untouched: backend docs/NATIVE_USER_GUIDE.md, both clients' docs/UI_PARITY.md and iPhone MINOR_TODO_AND_IDEAS.txt. Provider keys and operator upload journals stay ignored.
