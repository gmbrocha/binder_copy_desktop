# macOS signing and native secure-storage gate

App: BinderCopy, com.clearpathsystems.bindercopy, team L349AVQ22W. App Store Connect record 6820310010. Dedicated credentials/profiles produced a universal archive and accepted upload; build 2 is IN_BETA_TESTING; build 1 remains available.

## Historical blocker (resolved by signed verification)

Native run 37720140611 passed the selected controls but its Library screenshot shows `Stored session could not be removed.` The screenshot is evidence that the run was not a complete persistence pass. Local ad-hoc signing does not establish working Data Protection Keychain access. Keep the Data Protection Keychain and WhenUnlockedThisDeviceOnly semantics; do not fall back to plaintext or suppress this failure.

The app now declares its own `$(AppIdentifierPrefix)$(PRODUCT_BUNDLE_IDENTIFIER)` Keychain access group. The native bridge preserves the OSStatus in the NSError without including stored values. Native workspace tests now fail when an error banner is present. Actual signed application entitlements, not just the source plist, must show the expected application identifier, team and Keychain group. The CI evidence step exports the actual entitlements and signing inspection. The entitlement change is not claimed to resolve runtime storage until tested with valid signing/provisioning.

The usable App Manager key is 7QPC2737Q6, issuer 17312427-fdd0-4294-8c67-90655e47bd58. The owner downloaded it through external Chrome; Apple API authentication passed. Failed-download keys G5BZLPY265/XRGYNN2AZG are revoked and unrelated Expo resources are unchanged. Backend docs/APPLE_RELEASE.md records the new dedicated distribution/development/installer certificates and profiles. Secrets remain in ACL-restricted ignored local storage and the main-only GitHub apple-signing environment.

The manual macos-signed-smoke workflow uses GitHub's fixed Intel UDID and a dedicated development profile, without uploading the Apple API key to CI. It pins official actions, guards repository/main, checks runner identity, imports into a temporary Keychain, and cleans credentials even after failure. Tests now reopen a saved page and repeat after app restart, with error-banner assertions. First signed run 37729719954 stopped on an intermediate-certificate URL returning 404 before compilation; the corrected official Apple PKI download was locally verified against all three issued signing certificates. Signed runtime 37735539033 now passes persistence, cold restart, photo selection and native PNG save. Universal store archive 37732288421 passed and Apple accepted the package. See CURRENT_STATE.md for current release versions.

## Release sequence

1. Enable authorized Apple API access and provision signing credentials in protected storage. App Store distribution needs Apple Distribution application signing plus the appropriate Mac installer certificate and distribution profile. A Developer ID package is a different distribution route and does not satisfy TestFlight.
2. On the trusted Mac runner, run `npm ci`, `npm run typecheck`, `npm test`, `npm run verify:boundary`, then install CocoaPods dependencies. Never copy local provider-key env files into a build.
3. Set only public native settings: BINDERCOPY_API_URL, BINDERCOPY_AUTH_URL, BINDERCOPY_PUBLISHABLE_KEY. Set a fresh positive BINDERCOPY_BUILD_NUMBER after checking App Store Connect. Run `node scripts/check-release-config.mjs` before building.
4. Archive the Release scheme binder-copy-desktop-macOS from macos/binder-copy-desktop.xcworkspace. Pass the public settings as Xcode build settings and CURRENT_PROJECT_VERSION from BINDERCOPY_BUILD_NUMBER. Use the authorized team, real signing identity and profile. Do not use CODE_SIGNING_ALLOWED=NO or ad-hoc signing for distribution. CFBundleVersion now follows CURRENT_PROJECT_VERSION.
5. Inspect the archived app's Info.plist, native architectures, embedded profile and `codesign -d --entitlements :-` output. Confirm sandbox, outbound networking, user-selected read/write and the app's own Keychain group. Check production API/auth settings, no development endpoint and no provider/admin keys. Verify Keychain read/write/delete, cold restart, account switching, logout and draft recovery on a properly signed build.
6. Export with Xcode's App Store Connect distribution method using the matching application and installer identities. Validate and upload the resulting package. Keep credentials out of logs/artifacts and clear temporary signing material from disposable runners.
7. Verify processing, export-compliance answers, beta metadata/review and tester availability in App Store Connect. Upload success alone is not TestFlight availability.

Native media tests use disposable local fixtures and save only to /tmp/bindercopy-media-results. They verify platform adapters separately from live auth and production render fidelity. The full beta gate is in the backend's docs/BETA_TEST_PLAN.md.

Sources: [Apple Keychain entitlement troubleshooting](https://developer.apple.com/forums/thread/114456), [Mac distribution signing](https://developer.apple.com/documentation/xcode/creating-distribution-signed-code-for-the-mac/), [manual distribution identities](https://help.apple.com/xcode/mac/current/en.lproj/devcac6ab5b3.html), [uploading builds](https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds). Checked October 7, 2026.

## October 8 signed runner diagnosis
Signed interaction run 37730901723 failed before the first control query. The saved spindump identifies AppKit Apple-menu inspection blocked in IconServices, matching https://github.com/actions/runner-images/issues/14751. Signed smoke now uses macos-15-intel with Xcode 26.3 (official installed image inventory), retaining the fixed provisioned UDID and every persistence/media assertion. Store archives remain on macOS 26 Apple Silicon. This is a CI platform workaround, not a verified app-runtime fix.

## Actual release evidence

Version 1.0 build 1: archive 37732288421 at f6f04d0, Apple 0891ef7d-af56-4616-a493-8b36eedef540 VALID / IN_BETA_TESTING. Actual application sandbox/Keychain/network/user-selected-file entitlements, both architectures, package signature and public release settings were verified. Operator key never entered CI.

## October 8 final stabilization release

- iPhone source f91d4077ee957803d8442116a08781121a5b8481: archive 37738717232 and both native interaction flows 37738720783 passed. Version 1.0.0 (2), Apple 92f725fe-4049-420b-bc13-f3342fac002d, VALID / IN_BETA_TESTING. IPA SHA256 56a3055ca76df6893d9e6e33200eefac9484d45267eb97e878d4cad0cbac6ec5.
- Mac app source 9a13fe9e9d61241ea9508ffedf87617376bb87fd: universal archive 37738724585 passed. Signed workspace/photo/export/cold-restart retry 37741934886 at ccb5e7e passed after precompiling Metro in the test harness; application sources are identical to the archived commit. Version 1.0 (2), Apple 497f2e4e-ac73-4bd8-adae-958819bdf293, VALID / IN_BETA_TESTING. Installer SHA256 8528a8883dd30f7f38d889a8850773eb25e640130c476fcdce94081634ff8212.
- Both builds are in the existing owner-only internal group; build 1 remains available. No external review, public link or additional tester was added. Physical installation is confirmed only for iPhone build 1.
- Native API runtime 0234fd3b4502e3744afa57042d6f387af99186d3 is live after backup, 54 Linux tests/typecheck, health and anonymous rejection checks. Fresh live JWT/privacy/deletion, real PNG/CSV and generation/lock/name/ownership probes pass; all three disposable identities removed. Backup timer and loopback-only service binding verified.
- Local iPhone 16, Mac 17 and backend 54 tests pass (87 total); all typechecks, complete bundles, credential checks and contract hashes pass. Actual release credentials/endpoints/entitlements verified; Mac supports arm64 and x86_64. Native screenshots and real backend PNG visually inspected. Fixture export evidence is distinct from real-output delivery on physical devices.
- Documentation encoding, stale setup/release instructions and controls guide reconciled. Tracked-file checks find no copied private environment values or signing artifacts. Backend production dependencies have no audit advisories; upstream native build-tool findings remain documented in client DEPENDENCY_REVIEW.md.
- Shared counted/reserved budget remains $157.333235, leaving $342.666765; no new paid AI usage. Frozen PWA application baseline f35163d is untouched. Its clean checkout is at handoff commit 000b623, which adds documentation only; SOURCE_BASELINE.json records both.
