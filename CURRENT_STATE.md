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

Extend Mac native XCTest through NSOpenPanel photo selection, colors-only generation, Keep and NSSavePanel export, checking the actual saved PNG bytes. This checks adapters with a fixture; production render fidelity remains a separate gate. Run 37720140611's evidence is retained under .local/native-smoke-37720140611. Media run 37721275072 at 940dcaa failed reopening the saved page: the Keychain deletion failure kept Library active, so no photo/export steps ran. Screenshot/log evidence is retained under .local/native-smoke-37721275072. Native compatibility run 37722303026 at 14065ca passed; do not claim the entitlement change fixes runtime storage yet. See docs/SIGNING.md.

## Blockers

- Supabase project jmxlvjjuiykugraaqrib is active, with ES256 JWTs, anonymous sign-in disabled, email confirmation required and a 900-second token lifetime. Live backend code verification/refresh/privacy/logout/deletion probe passed using two disposable identities, both removed. Actual email/native login remains pending.
- Transactional email setup (Zoho CPaaS terms confirmation), authenticated public API and founder identity linking remain unfinished.
- Apple API access is enabled and owner approved BinderCopy releases App Manager key G5BZLPY265. Browser one-time download timed out without a file path; owner asked to recover .p8. No usable local signing credential yet; existing Expo key untouched.
- Physical-device/drag/complete visual proof, privacy/support disclosures and final dependency review remain release gates. Native paid API access stays disabled for every role.

## Next actions

1. Recover the authorized signing credential and verify secure storage; rerun separate workspace/media tests and finish drag/focus/parity proof.
2. Finish transactional email delivery and actual native login before external testers. Backend live provider checks passed; see backend CURRENT_STATE.md.
3. Complete backup/one-writer/public API gates, signing and both TestFlight uploads; verify actual beta availability.

## Verification

The passing Mac test uses actual native controls and local disposable fixtures. Ad-hoc signing is not App Store signing. Backend now passes 52 tests on Windows/Linux; iPhone passes 14 unit tests and Mac passes 15. See docs/VERIFICATION.md and docs/PARITY_STATUS.md for scoped evidence.

## Last checkpoint

2026-10-07 local — counted/reserved $134.833235, unreserved $365.166765 across all repos. Public Mac CI is free; private iOS reservations remain conservative pending billing reconciliation. No new paid AI calls.
