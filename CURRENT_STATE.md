# Current state — BinderCopy macOS

## Objective

Ship the full macOS client through TestFlight, sharing the VPS backend with the other native port. Preserve frozen PWA f35163d behavior and the accepted design.

## Verified state

- Repository scaffold, AGENTS.md, durable documentation and CURRENT_STATE commit guard are active. Original PWA runtime/source remains unchanged.
- React Native macOS 0.83.0 / RN 0.83.10, separate native Keychain, photo and save-panel adapters.
- Actual unsigned Xcode build passed: 44556cd / run 37710882761; prior auth build 37709242736 also succeeded. No signed build, native UI proof or TestFlight availability is implied.
- Shared native implementation includes Build / Cards / Library, four generation sources with preview/keep, named page identity, serialized save/Undo, locks, drag swapping, photo color extraction, PNG/CSV export, card prices/curation/history and protected images.
- This checkpoint adds background preview/keep/reset and retry IDs; artwork palette suggestion; Library rename/duplicate/delete; size-change confirmation; save-conflict recovery; account-scoped encrypted draft recovery; full search filters/interpretation/shared mappings; shared tag management; exact-width card grids and equal action widths.
- 14 unit tests and typechecks pass for both clients. Complete final iOS and Mac JS bundles pass; actual copied provider-key scans run before commit.
- Private VPS backend is now 59a75a3, with 45 Linux tests passed. Native tag writes include expected snapshots and reject stale changes. Production remains the original PC-hosted PWA.
- Contracts/domain helpers 0.1.0 pinned/hash-recorded from backend b04e673. No sibling runtime imports. Copied .env.local remains ignored and provider keys are excluded from native bundles.

## Active work

Finish native runtime and visual checks, including photos, share/file panels, secure storage, keyboard, long-hold drag and background display. First iPhone fixture smoke 37713222655 compiled and launched but failed initial builder visibility before exercising controls. A second diagnostic run is reserved; screenshots and runtime logs will be retained. This is real native UI testing against fixture data, not proof of production auth or artwork parity. See docs/PARITY_STATUS.md for remaining gates.

## Blockers

- Supabase dashboard is still signed out; owner has an outstanding sign-in request. Live auth project/issuer/email and public API origin are not configured.
- Apple universal record 6820310010 and identifier com.clearpathsystems.bindercopy exist, team L349AVQ22W. Signing and TestFlight uploads remain pending.
- Account deletion, entitlements/monthly metering, founder linking and remaining feature/visual parity are unfinished. Native accounts remain paid-disabled.
- Transitive Expo/Metro/CLI dependency advisories require triage; do not force-downgrade the framework.

## Next actions

1. Dispatch improved iPhone simulator diagnostics, inspect the actual screenshot and repair the startup/interaction failure.
2. Complete native visual parity, missing-card list, Library thumbnails and account lifecycle. Exercise real photo, export, drag, Keychain and draft recovery.
3. Configure authenticated public VPS access when owner signs into Supabase; sign and upload both platform betas, then verify TestFlight availability.

## Verification

14/14 tests per client cover save/Undo races, stale generation, locks, photo payload privacy, drag regions, token rotation/logout, interrupted draft writes/account isolation and background retry deduplication. TypeScript passes both versions. Recent Xcode builds passed at the listed commits. No paid AI calls. No physical-device or signed-Keychain proof yet.

## Last checkpoint

2026-10-07 — background, Library, search/curation and recovery checkpoint. Backend 59a75a3 deployed privately after backup, typecheck and 45 tests. iPhone 778687d / Xcode 37710937557 and Mac 44556cd / Xcode 37710882761 passed. Shared counted/reserved delivery budget $121.333235 (includes second simulator diagnostic job), remaining $378.666765. All owner data and old production remain preserved.

## Latest implementation checkpoint

2026-10-07 — aligned the builder with the frozen reference: compact mobile sources above the sheet, appearance in Preview, desktop sidebar, source shortcuts, zoom, selected-slot controls and Settings catalog refresh/status. Root dialogs share a single modal route. Both typechecks, 14 tests per client and full bundles pass. Mac c4e8848 Xcode run 37713222138 passed. Actual UI parity remains unverified; the first iPhone smoke failed before controls were exercised.

