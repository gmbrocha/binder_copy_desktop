# Current state — BinderCopy macOS

## Objective

Ship the full native macOS client through TestFlight alongside iPhone, using the shared OVH backend within the owner's $500 combined budget. Frozen PWA f35163d remains production; no production cutover yet.

## Verified state

- React Native macOS 0.83.0 / RN 0.83.10. Actual native interaction run 37720140611 at 4c35716 passed accessible builder heading, name entry, card browsing/details, filters, and named saved page in Library.
- Earlier native evidence exposed Fabric Modal host creation failure and inaccessible paragraph text. All Mac dialogs now use a root AppKit-backed RN view host. A pinned, exact-source-guarded install patch sets the macOS Text accessible default and reads paragraph props directly. Explicit accessibility opt-out remains supported; iPhone is unchanged.
- Four generation sources, named preview/Keep, serialized save/Undo, locks/hold-drag, local photo colors, PNG/CSV export, appearance/backdrops, encrypted draft recovery, Library management, card filters/ownership/prices/shared curation and Settings are implemented. Full native parity is not yet proven.
- 15 local tests and typecheck pass, including a release configuration guard. The prior full JS bundle and secret-boundary scans pass. Contract/domain snapshot 0.1.0 is pinned to backend b04e673; no runtime sibling imports.
- Private VPS staging runs fa603e1 after backup, 52 Linux tests/typecheck and paid-disabled health verification. Original production remains untouched. Offline recovery rehearsal preserved deletion tombstones, other-account data and financial records on isolated copies of the 21,256-card catalog.
- iPhone run 37719211595 at 431b60f passed page building/locking/Library, photo selection/local colors and actual PNG share-sheet opening with fixture bytes.
- Apple universal app 6820310010, bundle com.clearpathsystems.bindercopy, team L349AVQ22W exists. No distribution signing, upload or TestFlight availability.

- Screenshot review of the passing Mac interaction run revealed a Keychain deletion error. It is not a full persistence pass. The app now declares its own Keychain group, retains OSStatus diagnostics and the test rejects any error banner. Valid signed runtime verification is still required; no weaker storage fallback is used.

## Active work

Extend Mac native XCTest through NSOpenPanel photo selection, colors-only generation, Keep and NSSavePanel export, checking the actual saved PNG bytes. This checks adapters with a fixture; production render fidelity remains a separate gate. Run 37720140611's evidence is retained under .local/native-smoke-37720140611. Media run 37721275072 at 940dcaa is pending and may be blocked by the same Keychain failure. See docs/SIGNING.md.

## Blockers

- Supabase free organization exists and Oregon project form is prepared with Data API disabled. Required browser confirmation to create credentials is still unanswered; project creation is paused at that boundary.
- Live issuer/public settings, production email delivery, authenticated public API and founder identity linking remain unfinished.
- Apple organization API access is not enabled; its Request Access page is open for owner action. EAS has no distribution credentials. Browser Apple login alone does not configure signing.
- Physical-device/drag/complete visual proof, privacy/support disclosures and final dependency review remain release gates. Native paid API access stays disabled for every role.

## Next actions

1. Run the extended Mac media test and fix observed failures; verify drag/focus and remaining native parity.
2. After pending confirmation, provision Supabase and test live login, refresh, logout and deletion. Configure production email delivery before external testers.
3. Complete backup/one-writer/public API gates, signing and both TestFlight uploads; verify actual beta availability.

## Verification

The passing Mac test uses actual native controls and local disposable fixtures. Ad-hoc signing is not App Store signing. Backend now passes 52 tests on Windows/Linux; clients pass 14 unit tests each. See docs/VERIFICATION.md and docs/PARITY_STATUS.md for scoped evidence.

## Last checkpoint

2026-10-07 local — counted/reserved $134.833235, unreserved $365.166765 across all repos. Public Mac CI is free; private iOS reservations remain conservative pending billing reconciliation. No new paid AI calls.
