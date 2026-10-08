# Current state — BinderCopy macOS

## Objective

Ship the native macOS client using React Native macOS, with a required compatibility spike as part of iPhone and macOS TestFlight delivery.

## Verified state

- Scaffold 2d65f4a committed/pushed to owner-configured public remote. Credentials remain ignored.
- Baseline PWA and detailed handoff retained unchanged.
- Three-repository boundary accepted October 7, 2026.
- Documentation, implementation directories, CI documentation check and CURRENT_STATE commit guard scaffolded.
- React Native macOS 0.83.0 with required React Native 0.83.10 initialized, native Xcode project and NSUUID helper added. TypeScript and two delayed-save/conflict tests pass.
- Metro macOS bundle succeeds with Babel export-namespace transform; this is not an Xcode build.
- Early Build/Cards/Library vertical slice uses real API search, manual slots, locks, favorite proposals, save/Undo and personal Library. Shared UI copied from the initial iPhone implementation; contract 0.1.0 pinned to backend 384684f with hashes.
- VPS staging backend 384684f passed 41 Linux tests, backup/restore and CPU visual search. Public production remains the original PWA.
- New macOS compatibility workflow uses standard macos-26 GitHub runner, which is free for this public repository. No signing credentials supplied. No native binary or TestFlight upload yet.

## Active work

The first Xcode run (37706764519) failed in the template Swift initializer; stored properties now initialize before super.init(), with rerun 37708503052 underway. Native email-code UI and Supabase session refresh now match iPhone, with a macOS Keychain adapter and authenticated artwork. Release no longer connects to unauthenticated loopback; missing production config blocks entry. Live auth and signed Keychain behavior remain unverified. This foundation is not feature-complete or ready for release.

## Blockers

- Release gates: authenticated public API, complete photo/colors/theme/backdrop/export/curation/filter/drag features, native visual/device verification, signing and TestFlight. Current desktop connection is a loopback staging development configuration only.
- npm reports transitive build-tool advisories; triage before release without force-downgrading React Native.
- Apple organization membership verified (Clearpath Systems LLC, team L349AVQ22W); app identifiers and actual Mac build access still need verification before signing.

## Next actions

1. Commit/push native foundation and inspect actual macOS CI result; fix build failures.
2. Complete authenticated vertical slice and accepted visual system; remove development connection from release configuration.
3. Finish all PWA behavior parity and release gates, never call JS bundle verification a native binary.

## Verification

`npm run typecheck`, `npm test` (5/5), updated Metro macOS bundle passed. New tests cover secret config rejection, concurrent refresh and device-local logout. Xcode compile/device execution and actual Keychain access remain pending. Docs and key-boundary checks required at commit.

## Last checkpoint

2026-10-07 — native auth, Keychain adapter, protected artwork and release configuration gates implemented. Shared auth/UI sources synchronized with iPhone in this checkpoint. Backend 0408b1a privately staged; 44 Linux tests. Apple universal record 6820310010 / com.clearpathsystems.bindercopy exists. iPhone simulator foundation build passed; Mac compile rerunning. Public-repo CI adds no spend. No App Store availability claimed.
