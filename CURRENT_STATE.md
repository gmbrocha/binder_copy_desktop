# Current state - BinderCopy macOS

## Objective
Ship/stabilize the full native Mac client through internal TestFlight alongside iPhone under the shared $500 budget. Preserve frozen PWA f35163d.

## Verified state
- RN macOS 0.83.0 / RN 0.83.10. Native UI/media/secure storage implemented; no plaintext fallback. Build / Cards / Library and bounded builder preserved.
- Signed workspace 37733468982 at 517953f passes saved reopen and cold restart without Keychain errors. macos-15-intel/Xcode 26.3 avoids the macOS 26 Intel IconServices runner failure.
- Universal arm64/x86_64 archive/export 37732288421 at f6f04d0 passes actual entitlements/settings/secret checks. Version 1.0 build 1, macOS 14+. Apple 0891ef7d-af56-4616-a493-8b36eedef540 COMPLETE / VALID. Package SHA256 33346b11b338636c7a44e7213535c4b8bb940ec94d776706d4225fcc5562a840.
- iPhone build 1 is internal and owner-installed. Public native API fa603e1 has live JWT/privacy/deletion/render/generation proof; paid calls disabled. No legacy private migration.
- Contract/domain 0.1.0 exported from e844450; LF hashes checked. Signing secrets restricted to main; operator Apple key stays local.

## Active work
Signed media/workspace run 37735539033 at de1753e passed. Actual photo selection/local extraction/generation and native Save completed; exported PNG exactly matched fixture bytes. Screenshots inspected. Mac build 1 assigned to the owner-only group and is IN_BETA_TESTING; portal shows both platforms Testing. iPhone installation is independently confirmed there (13 Pro, iOS 26.6.1).

Three-repo audit fixes stale Library reopening, duplicate action entry, recovery retry, canonical contract hashes and docs encoding/drift. Mac CLI/platform tooling updated together to 20.2.0, removing affected XML parser; framework versions unchanged. These source changes are not in store build 1.

## Blockers
Mac media completion and owner-group availability are verified. Physical native auth/accessibility/drag and real export delivery, founder linking and broader-distribution privacy/support/rights gates remain.

## Next actions
1. Inspect media retry evidence, assign VALID build 1 to the private owner group after it passes.
2. Finish stabilization checks and commit/push; verify the updated native build.
3. Record exact uploaded/available versions separately from source and wait for physical Mac acceptance.

## Verification
17 unit tests, TypeScript and credential boundary pass after fixes. Backend 54 and iPhone 16 tests pass. Signed persistence and archive evidence above is scoped; full parity is not claimed.

## Last checkpoint
October 8, 2026: audit changes awaiting reviewed commits. Shared counted/reserved budget $157.333235; backend docs/BUDGET.md authoritative. Standard public Mac CI is free.

Audit verification: both complete JS bundles and actual copied-secret scans passed. Reviewed source changes are ready for commit; build 2 archives and regression workflows will run on those exact commits. Budget reserves another $9 for private iPhone archive/smoke; standard public Mac CI remains free.
