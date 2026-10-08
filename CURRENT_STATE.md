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

Mac foundation c9bbd6d passed actual unsigned Xcode build 37708503052 after the Swift initializer correction. Auth/Keychain checkpoint 7bdac4f has a separate build running. Current additions: four generation sources, proposal guards, local photo extraction through NSOpenPanel/ImageIO, PNG/CSV through NSSavePanel, shared card curation/prices and long-hold swapping. Original title font and app icons bundled. Ten tests/types pass; full native interaction and signed Keychain verification still pending. See docs/PARITY_STATUS.md.

## Blockers

- Release gates: authenticated public API, complete photo/colors/theme/backdrop/export/curation/filter/drag features, native visual/device verification, signing and TestFlight. Current desktop connection is a loopback staging development configuration only.
- npm reports transitive build-tool advisories; triage before release without force-downgrading React Native.
- Apple organization membership verified (Clearpath Systems LLC, team L349AVQ22W); app identifiers and actual Mac build access still need verification before signing.

## Next actions

1. Commit/push native foundation and inspect actual macOS CI result; fix build failures.
2. Complete authenticated vertical slice and accepted visual system; remove development connection from release configuration.
3. Finish all PWA behavior parity and release gates, never call JS bundle verification a native binary.

## Verification

`npm run typecheck`, `npm test` (10/10), complete updated Metro bundle (31 image assets) passed. Xcode foundation build passed; new native media bridge, font resources and Keychain changes require their own Xcode/runtime proof. Docs and key-boundary checks required at commit.

## Last checkpoint

2026-10-07 — generation/media/curation/drag checkpoint; shared UI synchronized with iPhone, native adapters independent. Public helpers pinned to backend b04e673; private staging 0408b1a / 44 tests. Both foundation Xcode builds now passed. Apple universal record 6820310010 exists but no builds uploaded. Public-repo CI adds no spend. Supabase login awaits owner.
