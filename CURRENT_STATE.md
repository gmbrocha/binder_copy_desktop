# Current state — BinderCopy macOS

## Objective
Ship the full native macOS client through TestFlight alongside iPhone using the shared OVH API, within the owner's $500 combined budget. Frozen PWA f35163d remains untouched production.

## Verified state
- React Native macOS 0.83.0 / RN 0.83.10; 15 unit tests, typecheck and client-secret boundary checks pass. Contract/domain snapshot 0.1.0 pins backend b04e673; no runtime sibling imports.
- Build / Cards / Library / Settings implement four generation sources, named Keep, serialized saving/Undo, card locking/hold-drag, local photo colors, appearance, backdrops, PNG/CSV export, encrypted draft recovery, filters/ownership/prices/shared curation. Implementation is not full native parity proof.
- Actual unsigned compile 37722303026 at 14065ca passed. Earlier interaction 37720140611 at 4c35716 passed heading/name/cards/details/filter/Library entry, but screenshot review exposed Keychain errors; it is not a persistence pass. Extended 37721275072 failed saved reopening.
- Fabric dialogs use a root AppKit-backed RN host; exact-version patch fixes paragraph accessibility. App declares its own Keychain group and retains OSStatus diagnostics without weaker storage fallbacks.
- Public API https://bindercopy-api.clearpathsystems.tools runs fa603e1 with 21,256 cards. Real Supabase JWT, account isolation, paid denial, deletion and backup recovery pass. Zoho new/returning code delivery passes; actual native email UI remains unverified. All native paid dispatch remains disabled.
- Apple app 6820310010, bundle com.clearpathsystems.bindercopy, team L349AVQ22W. Dedicated development/distribution/installer credentials and profiles are installed in main-only apple-signing environment. Signing preflight 37730781409 passed both development/distribution. Operator API key remains local.
- iPhone store archive/export 37731984784 at 1f51b4c passed. Apple build 57e68772-507d-4023-bef4-6f65ccca9c08 (1.0.0 build 1) is VALID / READY_FOR_BETA_TESTING. No owner beta access confirmed yet.

## Active work
- Signed Intel interaction run 37730901723 at 26488bf failed both first queries before controls could be exercised. Screenshots show a blank window; spindumps locate the main thread in XCTest's Apple-menu accessibility inspection, waiting for com.apple.iconservices. This matches actions/runner-images issue 14751 (macOS 26 Intel IconServices crash loop). Evidence: .local/signed-ui-37730901723. It does not prove an app Keychain regression or successful persistence.
- Move only the signed interaction runner to macos-15-intel with explicit Xcode 26.3. GitHub documents the same fixed Intel UDID; profile import still verifies it. Keep all original persistence, cold-launch and real open/save panel assertions. No product behavior or test assertion is weakened.
- Universal arm64/x86_64 store archive 37732288421 at f6f04d0 is compiling on macos-26 Apple Silicon. Prior run 37730904368 was canceled to apply the complete Hermes-string credential scan and required Lifestyle category before export. No Mac package uploaded yet.
- Complete Hermes string-table scanning accepts SDK prefix constants and rejects full credentials/PEM payloads; compiled positive/negative fixtures pass. Signed archives are retained for recovery if subsequent checks fail.

## Blockers
Signed native persistence/media and real email UI remain unverified. Public beta privacy/support/rights gates remain open.

## Verification
15 unit tests, typecheck and boundary scans pass. Native evidence is scoped above; do not claim full parity.

## Next actions
1. Inspect the corrected signed interaction run and universal archive; fix evidence-backed failures.
2. Verify exported package signature, universal architectures, entitlements, endpoint configuration and actual-secret absence; upload through local Apple REST operator script.
3. Configure owner-only internal beta and verify availability on both platforms. No outside invitations/public links authorized or sent.
4. Verify real native email login, media/render fidelity, gesture/accessibility parity and account deletion UI. Founder identity linking, final catalog reconciliation/one-writer migration, privacy/support and rights review remain explicit gates. Zoho customer review is pending, initial 100/day trial delivery works.

## Last checkpoint
2026-10-08: shared counted/reserved $148.333235; remaining $351.666765. Public Mac CI is free; private iPhone reservations remain conservative pending billing reconciliation. No new AI spend or recurring service.
