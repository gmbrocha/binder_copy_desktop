# macOS signing and native secure-storage gate

App: BinderCopy, com.clearpathsystems.bindercopy, team L349AVQ22W. App Store Connect record 6820310010. Dedicated distribution credentials/profiles exist; no archive or upload yet.

## Observed blocker

Native run 37720140611 passed the selected controls but its Library screenshot shows `Stored session could not be removed.` The screenshot is evidence that the run was not a complete persistence pass. Local ad-hoc signing does not establish working Data Protection Keychain access. Keep the Data Protection Keychain and WhenUnlockedThisDeviceOnly semantics; do not fall back to plaintext or suppress this failure.

The app now declares its own `$(AppIdentifierPrefix)$(PRODUCT_BUNDLE_IDENTIFIER)` Keychain access group. The native bridge preserves the OSStatus in the NSError without including stored values. Native workspace tests now fail when an error banner is present. Actual signed application entitlements, not just the source plist, must show the expected application identifier, team and Keychain group. The CI evidence step exports the actual entitlements and signing inspection. The entitlement change is not claimed to resolve runtime storage until tested with valid signing/provisioning.

The usable App Manager key is 7QPC2737Q6, issuer 17312427-fdd0-4294-8c67-90655e47bd58. The owner downloaded it through external Chrome; Apple API authentication passed. Failed-download keys G5BZLPY265/XRGYNN2AZG are revoked and unrelated Expo resources are unchanged. Backend docs/APPLE_RELEASE.md records the new dedicated distribution/development/installer certificates and profiles. Secrets remain in ACL-restricted ignored local storage and the main-only GitHub apple-signing environment.

The manual macos-signed-smoke workflow uses GitHub's fixed Intel UDID and a dedicated development profile, without uploading the Apple API key to CI. It pins official actions, guards repository/main, checks runner identity, imports into a temporary Keychain, and cleans credentials even after failure. Tests now reopen a saved page and repeat after app restart, with error-banner assertions. Its first signed run remains pending. Unsigned native compile 37722303026 is still the latest verified compile.

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
