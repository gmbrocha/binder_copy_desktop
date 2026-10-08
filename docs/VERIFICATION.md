# Verification evidence

Historical checkpoints below preserve failures and their later resolutions. Use CURRENT_STATE.md and the latest dated checkpoint for the current release; an earlier pending/blocked statement is not the present status.
## Scaffold

`npm run verify:docs` passed on Windows/Node; `npm run setup:hooks` enabled the pre-commit state guard. Documentation checks are not native build checks.

## Source baseline

PWA baseline f35163d346de9b5b005ece9033d6675a91350d70: 39 tests passed, TypeScript check passed, isolated Vite build passed on October 7, 2026. No new paid call used for handoff. This is reference evidence, not proof of this repo's implementation.

## Implementation and release

The entries below are chronological historical checkpoints. CURRENT_STATE.md and the latest checkpoint supersede pending/failed statuses in older entries. Never include credentials or signing material.

## 2026-10-07 native parity checkpoint

Actual Mac unsigned Xcode build 37710882761 passed at 44556cd, including native media and font resources; auth checkpoint 37709242736 also passed. Later background/search/Library/draft changes pass 14 tests and TypeScript. No interactive Mac runtime or signed Keychain proof yet.

## Native Mac UI selector correction

37717058682 at a7fe2ef built and launched the native app; its accessibility tree contained the actual builder, page-name field and generation controls. The XCTest failed because plain React Native heading text was not exposed as StaticText on macOS. Test selectors now use observed button labels and AX tab elements. Final screen attachments and extracted screenshot artifacts are retained for the next run. No complete interaction pass is claimed.

## Native modal failure and repair

Runs 37718404669 / 37718688423 launched the app, entered a name and browsed fixture cards, but opening card details threw in Fabric Modal creation. The failure is an app/runtime compatibility issue, not a passed flow. All Mac dialogs now use DesktopDialogHost instead of the unsupported native Modal host, including nested filters/color selections and confirmations. Typecheck, 14 tests, full JS bundle and credential boundary scan pass. Native dialog/AX verification remains pending. Evidence screenshots were exported from the Xcode result bundles.

## macOS interaction proof — 2026-10-07

Run 37720140611 at 4c35716 passed actual native name entry, accessible builder heading, card browsing/details, filters and saved Library entry. This verifies the dialog-host and paragraph-accessibility repairs observed in earlier failing runs. Screenshots/logs: .local/native-smoke-37720140611. No signing, live auth, physical-device, photo/export or drag proof is inferred from that pass.

The next test extends the same workflow through the real NSOpenPanel and NSSavePanel, with a fixed disposable PNG and byte-for-byte output assertion. The fixture rejects raw photo uploads and accepts extracted hex colors only. This extended check is not yet run.

## Secure-storage correction to interaction evidence

Visual review of run 37720140611 shows a Keychain deletion error in Library despite its passing interaction assertions. Treat this as an unresolved persistence/signing gate, not a successful storage test. Native tests now reject visible errors. Added the app-specific Keychain group, retained native OSStatus errors without secret contents, and added actual signed-entitlement evidence collection. No storage protection was removed. Local typecheck and all 15 tests pass, including a build-settings guard rejecting preview origins/secrets/absent build numbers. Actual signed Keychain validation remains blocked on Apple access/credentials.

Expanded Mac run 37721275072 at 940dcaa failed at the first builder assertion after opening the saved Library page. Its final screenshot shows the Keychain deletion error and Library still active; photo import/export did not run. Evidence retained under .local/native-smoke-37721275072. Mac 14065ca's unsigned compatibility compile is queued as run 37722303026. Further storage UI validation needs authorized signing; no success is inferred from source entitlement changes.

## Signed Mac persistence — October 8
Signed run 37733468982 at 517953f on macOS 15 Intel/Xcode 26.3 passes the complete workspace test: name, cards/details, filters, Library entry, reopening, termination/relaunch/reopening, and explicit no-error assertions. Library screenshot reviewed: no Keychain banner. This is actual development-signed persistence evidence.

The media test reached the real NSOpenPanel and selected the fixture PNG, but global Open matched both its OKButton and Touch Bar. The test now scopes that control to observed window identifier open-panel/button OKButton, and Save to the native OKButton within windows, excluding the Touch Bar copy and background builder Save button. Actual photo extraction/generation/export completion remains pending until the retry passes. Evidence .local/signed-ui-37733468982.

## October 8 stabilization and beta checkpoint

Signed Mac run 37735539033 at de1753e passed both workspace/cold restart and photo/local-colors/native-save workflows. The PNG byte comparison passed; fixture output is separate from actual server-rendered export. Screenshots were reviewed. Both build 1 binaries are IN_BETA_TESTING in the owner-only group; Apple shows iPhone 13 Pro / iOS 26.6.1 Installed, matching the owner's confirmation.

Audit source checks pass: iPhone 16, Mac 17, backend 54 tests; all typechecks, full native JS bundles, client artifact credential scans and canonical contract hashes. Documentation was reconciled and UTF-8/nonempty validation strengthened. See AUDIT_2026-10-08.md. Build 2 verification follows the source commit; build 1 does not contain these audit fixes.

## Mac build 2 runtime setup correction

Run 37738728360 at 9a13fe9 passed testNativeWorkspace (44.295 seconds), including save/reopen/cold restart. testNativePhotoAndExport timed out on its initial builder assertion while the development window showed Bundling 96%; no photo action had run. Metro log confirms first transformation completed only later, before the passing workspace test. Both smoke workflows now verify local fixture/Metro readiness and precompile the exact macOS entry bundle before starting UI deadlines. Release packages embed their bundle and do not use Metro. All UI assertions remain intact; rerun evidence must pass before build 2 is assigned to the owner group.

## October 8 final stabilization release

- iPhone source f91d4077ee957803d8442116a08781121a5b8481: archive 37738717232 and both native interaction flows 37738720783 passed. Version 1.0.0 (2), Apple 92f725fe-4049-420b-bc13-f3342fac002d, VALID / IN_BETA_TESTING. IPA SHA256 56a3055ca76df6893d9e6e33200eefac9484d45267eb97e878d4cad0cbac6ec5.
- Mac app source 9a13fe9e9d61241ea9508ffedf87617376bb87fd: universal archive 37738724585 passed. Signed workspace/photo/export/cold-restart retry 37741934886 at ccb5e7e passed after precompiling Metro in the test harness; application sources are identical to the archived commit. Version 1.0 (2), Apple 497f2e4e-ac73-4bd8-adae-958819bdf293, VALID / IN_BETA_TESTING. Installer SHA256 8528a8883dd30f7f38d889a8850773eb25e640130c476fcdce94081634ff8212.
- Both builds are in the existing owner-only internal group; build 1 remains available. No external review, public link or additional tester was added. Physical installation is confirmed only for iPhone build 1.
- Native API runtime 0234fd3b4502e3744afa57042d6f387af99186d3 is live after backup, 54 Linux tests/typecheck, health and anonymous rejection checks. Fresh live JWT/privacy/deletion, real PNG/CSV and generation/lock/name/ownership probes pass; all three disposable identities removed. Backup timer and loopback-only service binding verified.
- Local iPhone 16, Mac 17 and backend 54 tests pass (87 total); all typechecks, complete bundles, credential checks and contract hashes pass. Actual release credentials/endpoints/entitlements verified; Mac supports arm64 and x86_64. Native screenshots and real backend PNG visually inspected. Fixture export evidence is distinct from real-output delivery on physical devices.
- Documentation encoding, stale setup/release instructions and controls guide reconciled. Tracked-file checks find no copied private environment values or signing artifacts. Backend production dependencies have no audit advisories; upstream native build-tool findings remain documented in client DEPENDENCY_REVIEW.md.
- Shared counted/reserved budget remains $157.333235, leaving $342.666765; no new paid AI usage. Frozen PWA application baseline f35163d is untouched. Its clean checkout is at handoff commit 000b623, which adds documentation only; SOURCE_BASELINE.json records both.
