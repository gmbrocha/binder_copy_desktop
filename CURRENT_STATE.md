# Current state - BinderCopy macOS

## Objective
Ship/stabilize the full native Mac client through internal TestFlight alongside iPhone under the shared $500 budget. Preserve frozen PWA f35163d.

## Verified state
- RN macOS 0.83.0 / RN 0.83.10. Native UI/media/secure storage implemented; no plaintext fallback. Build / Cards / Library and bounded builder preserved.
- Signed workspace 37733468982 at 517953f passes saved reopen and cold restart without Keychain errors. macos-15-intel/Xcode 26.3 avoids the macOS 26 Intel IconServices runner failure.
- Universal arm64/x86_64 archive/export 37732288421 at f6f04d0 passes actual entitlements/settings/secret checks. Version 1.0 build 1, macOS 14+. Apple 0891ef7d-af56-4616-a493-8b36eedef540 COMPLETE / VALID. Package SHA256 33346b11b338636c7a44e7213535c4b8bb940ec94d776706d4225fcc5562a840.
- iPhone build 1 is internal and owner-installed. Public native API 0234fd3 has live JWT/privacy/deletion/render/generation proof; paid calls disabled. No legacy private migration.
- Contract/domain 0.1.0 exported from e844450; LF hashes checked. Signing secrets restricted to main; operator Apple key stays local.

## Active work
Signed media/workspace run 37735539033 at de1753e passed. Actual photo selection/local extraction/generation and native Save completed; exported PNG exactly matched fixture bytes. Screenshots inspected. Mac build 1 assigned to the owner-only group and is IN_BETA_TESTING; portal shows both platforms Testing. iPhone installation is independently confirmed there (13 Pro, iOS 26.6.1).

Three-repo audit fixes stale Library reopening, duplicate action entry, recovery retry, canonical contract hashes and docs encoding/drift. Mac CLI/platform tooling updated together to 20.2.0, removing affected XML parser; framework versions unchanged. These source changes are not in store build 1.

## Blockers
Mac media completion and owner-group availability are verified. Physical native auth/accessibility/drag and real export delivery, founder linking and broader-distribution privacy/support/rights gates remain.

## Next actions
1. Build 1 media and owner-group availability are complete. Finish current build 2 archive/runtime checks.
2. Upload/verify the updated native build, then record the final documentation checkpoint.
3. Record exact uploaded/available versions separately from source and wait for physical Mac acceptance.

## Verification
17 unit tests, TypeScript and credential boundary pass after fixes. Backend 54 and iPhone 16 tests pass. Signed persistence and archive evidence above is scoped; full parity is not claimed.

## Last checkpoint
October 8, 2026: audit source checkpoints are committed and pushed. Shared counted/reserved budget $157.333235; backend docs/BUDGET.md authoritative. Standard public Mac CI is free.

Audit verification: both complete JS bundles and actual copied-secret scans passed. Audit source is committed/pushed at iPhone f91d407, Mac 9a13fe9 and backend 0234fd3. iPhone build 2 is VALID / IN_BETA_TESTING after archive 37738717232 and native regression 37738720783 passed. Mac build 2 archive/runtime checks are still running. Backend worker fix is deployed and public probes pass. Budget reserves another $9 for private iPhone archive/smoke; standard public Mac CI remains free.

Mac build 2 archive 37738724585 is uploaded and Apple VALID (497f2e4e-ac73-4bd8-adae-958819bdf293), but held from the group while media validation retries. Run 37738728360 passed workspace/Keychain/cold restart; its first media test failed before the app became ready with Metro still Bundling 96%. The development fixture now precompiles the real Metro entry before XCTest deadlines. No app/runtime source change or weakened UI assertion; archive build 2 remains the reviewed application binary. Retry pending after this CI-only checkpoint.
