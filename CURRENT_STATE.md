# Current state — BinderCopy macOS

## Objective
Deliver the accepted native 1.1.0 experience and monetization specification while preserving the PWA-derived design. Build 8 is available internally; commercial activation remains gated. Backend docs/MONETIZATION_APPROVED_V1.md is authoritative.

## Verified state

- Both iPhone and Mac **1.1.0 (8)** are VALID / IN_BETA_TESTING in existing private internal group ba56be7f-b9ef-4031-b191-a677f79a0edd, verified October 8 at 22:27 UTC. One tester is confirmed. Prior builds remain available; no public/external release. Physical build-8 acceptance remains pending.
- iPhone runtime ba33d87, archive 37849618998, Apple fa6138c1-fe53-40c7-9d54-91b64346edde. Mac runtime 406b20e, universal archive 37849622968, Apple d20bd397-2523-42a9-a64b-99e171fd1aee. Package hashes and test-source qualifications are in the release record.
- OVH API runtime **1d31475799b1bc772bcf4af5e944ad2d6cff3925** is live at https://bindercopy-api.clearpathsystems.tools after backups, staging and atomic promotion. Later backend commits are documentation only.
- Shared contract snapshot **0.2.3** remains pinned to b6b1ed5. Catalog has 21,256 cards. Private pages/collections, shared tags, auth/deletion and backup/restore remain verified; frozen PWA is untouched.
- Color generation hydrates missing artwork, avoids new duplicates and preserves locked/existing slots when matches are scarce. Empty slots use cream brackets, plus signs and numbers. Explicit slow actions show cream Loading after 750ms until results render. Reapply restores saved art after trying a color without generating again.
- Medium presets, free custom colors, independent title/logo contrast, preview/Library/export consistency and account-confined overlay caching remain implemented.
- Verified owner gmbrocha@gmail.com has founder API testing under one non-renewing $5 global cap. First real Mini test cost $0.013190, leaving $4.986810 immediately after that check; this is historical evidence, not a new balance read. Sagar's native identity and curator assignments remain unverified. Purchases never grant staff permissions.

## Active work

Owner approved the cream Poké Ball mock for the next build. Build 9 replaces only the visible Loading text with a 48-point silhouette rotating clockwise every 1.4 seconds. Existing 750ms delay, dimmed scrim, media/render holds and top-modal layering are retained. Native animation stops on unmount/background and respects Reduce Motion; screen readers retain Loading/busy semantics. Both clients pass typecheck, boundaries and 25/26 tests. Signed archives and focused iPhone native visual verification are next; build 8 remains the released version. No backend runtime changes or paid provider calls.

Customer purchases/provider spending remain unavailable. Commercial plan: Plus $3.99/month or $29.99/year, 10 backgrounds and 50 uncached themes per anchored month; packs 10/$2.99 and 30/$6.99.

The owner requested a supported replacement image-model benchmark as **backlog only**, independent of this build. Backend docs/ROADMAP.md defines a local runner, finite sample budget, reproducible cases, quality/latency, average and tail costs, charged failure/retry economics and full-redemption offer margins. No new paid benchmark or live model switch was performed.

## Blockers

No implementation or internal-release blocker. Commercial activation still requires Apple tax/agreements readiness, actual StoreKit transaction acceptance, reviewed legal/disclosure URLs, and explicit customer/Sandbox operational budgets. Owner handles Finance; do not alter tax certification or banking. Email monitoring belongs to another agent. The development budget is not a recurring customer operations budget.

## Next actions

1. Build/verify both signed build-9 packages, verify the rotating spinner in iPhone simulator, then upload and assign to the existing private internal TestFlight group. Preserve unrelated local changes.
2. Complete Apple commercial/product metadata and reviewed public privacy/support/terms, retention and asset-rights disclosures. Credit packs have USA-only availability.
3. Run actual Apple purchase/renewal/restore/refund/account-switch/cross-platform scenarios from backend docs/STOREKIT_ACCEPTANCE.md when commercial access permits; fixture tests are not transaction acceptance.
4. Confirm Sagar's native account identity before a founder grant. Keep staff permissions separate from subscriptions.
5. Schedule the deferred supported-model benchmark before the existing Mini policy review date, verifying current availability/pricing at execution. Preserve historical ledger prices and allowances; require a versioned replacement policy before live switching. Measure free-user infrastructure and implement actual budget notification delivery before commercial activation.

## Verification

Backend 100 tests/typecheck passed on Windows/staging/production. Live deterministic color runs produced 9 and 25 distinct cards with seed locked (7.450s first / 0.515s warm); free custom colors, PNG/CSV, private boundaries, paid denial and disposable identity cleanup passed.

Final signed archives passed 25 iPhone / 26 Mac tests, typechecks, credential/contract boundaries, compilation/signatures/entitlements and downloaded package inspection. iPhone 13 Pro simulator run 37852188590 passed Loading/Reapply and parity at 416fb50, whose app runtime matches ba33d87. Signed Mac run 37849344941 passed workspace/persistence, photo/custom/export and generated contrast at eb09f79; final 406b20e adds only interpretation/Library loading wrappers. No Mac-specific Reapply assertion or physical StoreKit acceptance is claimed.

Screenshots confirmed cream empty slots on both platforms, and iPhone undimmed centered Loading over a dimmed sheet plus saved-art reapplication. Final iPhone API/rendered timing was 8076ms/8432ms with an intentional 8-second fixture delay. Actual color generation used production deterministic endpoints without paid inference. Earlier failed test timing/tap attempts and canceled archives remain recorded in the release evidence/budget.

Historical pilot: 12 usable image calls cost $0.138840; six theme calls cost $0.003183, without retries. Those small samples do not establish current model availability or reliable tail costs. See backend docs/PAID_LAUNCH_READINESS.md; the newly requested benchmark remains deferred.

## Last checkpoint

2026-10-08: approved spinner implemented; local typecheck/boundary/tests pass in both clients. Build-9 archive/parity workflows reserved before dispatch. Shared ledger **$350.975258 counted/reserved, $149.024742 unreserved**; backend docs/BUDGET.md is authoritative, $65 Actions stop limit separate. Preserve unrelated NATIVE_USER_GUIDE.md, UI_PARITY.md and MINOR_TODO_AND_IDEAS.txt edits. Benchmark remains backlog-only.
