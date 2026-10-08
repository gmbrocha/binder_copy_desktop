# Verification evidence

## Scaffold

`npm run verify:docs` passed on Windows/Node; `npm run setup:hooks` enabled the pre-commit state guard. Documentation checks are not native build checks.

## Source baseline

PWA baseline f35163d346de9b5b005ece9033d6675a91350d70: 39 tests passed, TypeScript check passed, isolated Vite build passed on October 7, 2026. No new paid call used for handoff. This is reference evidence, not proof of this repo's implementation.

## Implementation and release

Add actual test/build/device/staging/TestFlight evidence here as completed. Never include credentials, private query text or signing material.

## 2026-10-07 native parity checkpoint

Actual Mac unsigned Xcode build 37710882761 passed at 44556cd, including native media and font resources; auth checkpoint 37709242736 also passed. Later background/search/Library/draft changes pass 14 tests and TypeScript. No interactive Mac runtime or signed Keychain proof yet.

## Native Mac UI selector correction

37717058682 at a7fe2ef built and launched the native app; its accessibility tree contained the actual builder, page-name field and generation controls. The XCTest failed because plain React Native heading text was not exposed as StaticText on macOS. Test selectors now use observed button labels and AX tab elements. Final screen attachments and extracted screenshot artifacts are retained for the next run. No complete interaction pass is claimed.

## Native modal failure and repair

Runs 37718404669 / 37718688423 launched the app, entered a name and browsed fixture cards, but opening card details threw in Fabric Modal creation. The failure is an app/runtime compatibility issue, not a passed flow. All Mac dialogs now use DesktopDialogHost instead of the unsupported native Modal host, including nested filters/color selections and confirmations. Typecheck, 14 tests, full JS bundle and credential boundary scan pass. Native dialog/AX verification remains pending. Evidence screenshots were exported from the Xcode result bundles.
