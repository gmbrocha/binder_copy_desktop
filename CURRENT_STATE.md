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

## Signing checkpoint

Apple key 7QPC2737Q6 now authenticates successfully; dedicated development/distribution/installer certificates and BinderCopy profiles exist. Only development material is installed as encrypted GitHub secrets in the main-only apple-signing environment. A manual workflow uses pinned official actions and GitHub's fixed Intel Mac identity, imports into a temporary Keychain, verifies saved-page reopen/cold restart plus photo/export, and deletes signing material afterwards. The workflow is prepared; no signed runtime result yet. The App Store API key remains local to the protected backend operator directory.

Public API https://bindercopy-api.clearpathsystems.tools now passes real Supabase JWT, two-account privacy, paid denial and deletion checks. Supabase project jmxlvjjuiykugraaqrib is active; Zoho email delivery and both new/returning delivered codes pass with 900-second sessions. Native UI login remains unverified. Native runtime on VPS remains fa603e1.

## Blockers

- Signed Mac persistence/media runtime proof and real native email-login checks remain release gates, not credential-download blockers.
- Founder linking/catalog one-writer migration, complete visual/gesture evidence, privacy/support and rights/dependency review remain unfinished. Native paid dispatch stays disabled for every role.
- Zoho customer review is pending; initial email delivery works within its 100/day trial limit.

## Next actions

1. Dispatch and inspect the signed Intel Mac native workspace/media tests; repair verified failures.
2. Build distribution archives using public production settings, verify native auth and scoped parity.
3. Finish beta gates, upload both platforms and verify actual TestFlight availability.

## Verification

The passing Mac test uses actual native controls and local disposable fixtures. Ad-hoc signing is not App Store signing. Backend now passes 52 tests on Windows/Linux; iPhone passes 14 unit tests and Mac passes 15. See docs/VERIFICATION.md and docs/PARITY_STATUS.md for scoped evidence.

## Last checkpoint

2026-10-07 local — counted/reserved $134.833235, unreserved $365.166765 across all repos. Public Mac CI is free; private iOS reservations remain conservative pending billing reconciliation. No new paid AI calls or paid CI reservation for this public-repository Mac workflow.
