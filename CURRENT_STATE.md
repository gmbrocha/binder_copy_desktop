# Current state - BinderCopy macOS

## Objective
Stabilize the full native iPhone/macOS internal betas and shared VPS backend within the combined $500 budget. Preserve frozen PWA f35163d and its private data.

## Verified state
- Three-repository audit source checkpoints are committed/pushed: iPhone f91d407, Mac 9a13fe9, backend 0234fd3. The final documentation checkpoint records these binary/runtime revisions separately from its own Git HEAD.
- iPhone 1.0.0 (2), Apple 92f725fe-4049-420b-bc13-f3342fac002d, and Mac 1.0 (2), Apple 497f2e4e-ac73-4bd8-adae-958819bdf293, are VALID / IN_BETA_TESTING in owner-only group ba56be7f-b9ef-4031-b191-a677f79a0edd. Both build 1 binaries remain available. The owner and portal confirm iPhone build 1 installation on iPhone 13 Pro / iOS 26.6.1; updated/physical Mac installations are not asserted.
- Audit application sources passed signed archives and native fixture checks: iPhone archive 37738717232, interaction 37738720783; Mac universal archive 37738724585, signed interaction retry 37741934886 at ccb5e7e (CI/docs-only follow-up to the same app source). Run 37738728360 passed workspace but timed out while first-start Metro was still compiling; the harness now precompiles before UI deadlines, with every assertion retained. Native Library, photo and output screenshots reviewed. Actual Mac Keychain/cold restart and native file panels pass; fixture output is not claimed as complete real-output acceptance.
- Native API https://bindercopy-api.clearpathsystems.tools runs 0234fd3 on OVH 51.81.223.26, loopback 4182 behind HTTPS Caddy. Isolated staging remains fa603e1 on 4181. Catalog 21,256 cards; paid native dispatch disabled for every role. No legacy private pages, ownership or accounts migrated.
- Deployment backup, 54 Linux tests, typecheck, health and anonymous rejection passed. Fresh public probes pass real JWT/private-account isolation/deletion, PNG/CSV rendering, image-seed generation, locks, named save/reopen and private ownership. Synthetic identities cleaned up; daily api-backup.timer and isolated restore verified.
- Supabase jmxlvjjuiykugraaqrib and Zoho SMTP active; delivered signup/returning email codes, JWT refresh/logout and deletion verified. No founder role grant without verified app identity. API/signing keys remain restricted operator/server secrets; no copied private environment values or signing files are tracked.
- Contracts/domain snapshot 0.1.0 from e844450 uses canonical LF hashes checked in both clients. iPhone Expo 57.0.27/RN 0.86.3; Mac RN macOS 0.83.0/RN 0.83.10 and CLI 20.2.0. Runtime versions were not force-downgraded to silence dependency advisories.

## Active work
PWA fidelity pass authorized October 8. Frozen source audited in isolated WebKit at iPhone 13 Pro dimensions; walkthrough passes with zero paid calls. Native presentation changes restore the current PWA header/navigation, generation tiles/source/tray, proposals/replacement review, preview/swatches, Cards/picker and Library grid. See docs/UI_PARITY.md. Local typechecks and replacement/session tests pass; expanded native screenshots and release verification pending. Build 2 remains live.

## Blockers
No audit/release blocker. Broader release acceptance still requires physical gestures/accessibility/larger text, native email recovery/account switching and real output delivery, founder identity linking, Zoho sender review, final shared-catalog reconciliation, privacy/support/asset rights and external distribution review. Native paid features/subscriptions remain off. The owner has now authorized the PWA-fidelity pass; native screenshot and release checks are active.

## Next actions
1. Finish actual iPhone/Mac UI runs, inspect screenshots against frozen PWA, and correct regressions before release.
2. Archive verified source, upload/assign the next internal beta builds, and record exact versions and evidence.
3. Physical iPhone/PWA and Mac acceptance remains separate. Preserve existing account permissions and disabled paid dispatch.

## Verification
This repo: 17 tests pass; cross-repo total 87 (16 iPhone, 17 Mac, 54 backend). All typechecks, complete bundles, private-credential checks, contract hashes, documentation UTF-8/nonempty checks and relative Markdown links pass. Source CI and native workflows against the audited application sources pass. Backend production dependency audit is clean; inherited native build-tool advisories are triaged, not falsely described as zero.

## Last checkpoint
October 8, 2026: iPhone run 37782494271 built successfully but stopped on the test's unsupported hideKeyboard command in the name dialog. Replaced that step with direct Save, added Done/Search keyboard actions and launch-splash accessibility gating. PWA review also restored compact naming sheet (iPhone), card details/actions, picker information buttons, proposal Change and short tray labels. Replacement cancel/reroll/Undo now has an expanded isolated native test. Local tests (18 iPhone / 19 Mac), typechecks and boundary scans pass; native rerun pending. Mac run 37782506707 is still compiling the previous checkpoint. Build 2 remains live; no new archive or upload.

Shared counted/reserved $166.333235; $333.666765 unreserved. Backend docs/BUDGET.md is authoritative. No new paid AI usage.
