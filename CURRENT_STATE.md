# Current state — BinderCopy macOS

## Platform checkpoint

React Native macOS 0.83.0 / RN 0.83.10, with native Keychain/photo/save-panel adapters. Actual Xcode compile 37713222138 passed at c4e8848. The first native XCTest attempt 37716056106 compiled the app but failed on an empty generated test-module name; repaired in a7fe2ef. Native UI run 37717058682 compiled and launched the real builder, but failed on a test selector: plain React Native text was absent from the Mac accessibility tree. The recorded tree includes the builder controls. Selectors now target observed buttons and AX tab elements, and screenshots are always attached. No complete native interaction pass is claimed yet.

The existing sandbox/network/user-selected-file entitlement file is now wired into both Mac build configurations. Local ad-hoc test signing does not prove distribution signing or data-protection Keychain access. App Store Connect 6820310010 / com.clearpathsystems.bindercopy / L349AVQ22W. No signed store package or TestFlight upload. Superseded compatibility runs are automatically cancelled.
## Objective

Ship the full native client through TestFlight, sharing the OVH backend and preserving frozen PWA f35163d behavior/design. Production remains the PC-hosted PWA until the one-writer cutover gates pass.

## Verified state

- Build / Cards / Library, compact mobile builder, desktop canvas/sidebar, original branding and shared design roles are implemented.
- Four generation sources, preview/Keep, named page identity, serialized save/Undo, locks/drag, local photo colors, PNG/CSV exports, appearance/backdrops and encrypted draft recovery are implemented.
- Library rename/duplicate/delete/thumbnails, missing-card list, card filters/interpretation/prices, shared tag editing/history/Undo and Settings catalog refresh are implemented.
- Native account deletion is conditional on backend capability, explicitly confirmed, stops autosave/draft writes, clears the local journal and signs out. Live deletion is not configured yet.
- 14 unit tests per client, TypeScript and full JS bundles pass. Copied provider/admin keys are ignored and excluded; source/artifact scans pass. No new paid AI calls.
- Shared contract/domain snapshot 0.1.0 is pinned to backend b04e673. No runtime sibling imports.
- Backend 5fe29e9 is verified private staging: 49 Linux tests, typecheck and paid-disabled health passed. An isolated VPS recovery rehearsal on 21,256 cards preserved deletion tombstones, other-account data and financial safety records. Production remains untouched.

## Active work

Native runtime/visual proof and production auth setup. Supabase is now signed in; free organization Clearpath Systems LLC exists. BinderCopy project form is prepared in Oregon with database API disabled. Required browser confirmation for creating credentials is pending.

## Blockers

- Live Supabase project/issuer/public settings, email delivery and authenticated public API are unfinished.
- Apple distribution signing and TestFlight uploads are pending; simulator/local signing is not store signing.
- Founder identity linking, entitlements/monthly metering, privacy/support disclosures and final dependency review remain release gates. Native accounts remain paid-disabled.
- Real-device photo/share/drag and complete visual parity still require verification.

## Next actions

1. Complete Supabase project setup after the pending confirmation and configure live auth/backend public settings.
2. Inspect native runtime evidence, repair observed failures and extend photo/export/drag checks.
3. Complete release/privacy/account and VPS cutover gates; sign/upload both platforms and verify TestFlight availability.

## Verification

Unit coverage includes save races, stale proposals, locking, local photo payloads, drag geometry, auth rotation/logout, interrupted draft storage and safe background retries. Backend tests independently prove privacy, permissions and spending boundaries. See docs/PARITY_STATUS.md, docs/DEPENDENCY_REVIEW.md and backend docs/ACCOUNT_DELETION.md. Full port completion is not yet claimed.

## Last checkpoint

2026-10-07 local — shared counted/reserved budget $134.833235, unreserved $365.166765. Copied keys remain server-only. No physical device, production login or TestFlight proof yet.

## Expanded native media checkpoint

Reserved one additional private iPhone simulator run (maximum 45 minutes) before dispatch to exercise OS photo selection, local color extraction and PNG share-sheet opening. This uses fixture images and no paid API calls; it does not prove the production PNG renderer or real-device delivery. Mac native UI selector repair is ready to rerun; Supabase creation confirmation remains pending.

## Mac text accessibility repair

Native AX evidence led to an upstream RN macOS 0.83.0 issue: RCTParagraphComponentView always returns NO from isAccessibilityElement, but the iOS accessibilityElements provider is excluded on macOS. A version- and exact-source-guarded postinstall correction now uses the inherited AppKit accessible state on macOS only. Local application/idempotence and typecheck pass; native verification is pending. This preserves native secure storage and does not bypass any access failure.

## Native dialog runtime repair

Runs 37718404669 and 37718688423 progressed through native name entry and catalog browsing, then exposed a real React Native Fabric Modal host render exception when opening details. Screenshots/logs are retained in the corresponding .local/native-smoke directories. Replaced every Mac Modal use with a shared root dialog host using native AppKit-backed RN views, stacked dialogs, background interaction exclusion and Escape handling. Also corrected the RN macOS Text JS default so the paragraph accessibility patch receives accessible=true unless explicitly disabled. Fourteen tests, typecheck, full bundle and boundary scan pass; actual native dialog/heading/filter/Library rerun is pending. iPhone remains independent and unchanged by the Mac fixes. Private backend is 15c4c8f with 51 Linux tests.
