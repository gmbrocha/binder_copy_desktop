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
Requested full code/documentation stabilization is complete for the reviewed scope. Fixed autosave/stale Library reopen, duplicate action entry, failed Library retry, vision-worker lifecycle/queue handling, contract checksum drift and documentation encoding/status drift. See docs/AUDIT_2026-10-08.md and the latest docs/VERIFICATION.md checkpoint. No new design changes were introduced while the owner rested.

## Blockers
No audit/release blocker. Broader release acceptance still requires physical gestures/accessibility/larger text, native email recovery/account switching and real output delivery, founder identity linking, Zoho sender review, final shared-catalog reconciliation, privacy/support/asset rights and external distribution review. Native paid features/subscriptions remain off. Minor UI feedback is deferred until the owner returns.

## Next actions
1. Owner updates to build 2 and reports the small UI issues; physically install/accept the available Mac beta.
2. Link verified founder app identities and finish wider-distribution acceptance gates before inviting additional testers or enabling paid calls.
3. Keep CURRENT_STATE and release evidence synchronized with any later source/runtime/store change. Do not conflate the frozen PWA with the native beta database.

## Verification
This repo: 17 tests pass; cross-repo total 87 (16 iPhone, 17 Mac, 54 backend). All typechecks, complete bundles, private-credential checks, contract hashes, documentation UTF-8/nonempty checks and relative Markdown links pass. Source CI and native workflows against the audited application sources pass. Backend production dependency audit is clean; inherited native build-tool advisories are triaged, not falsely described as zero.

## Last checkpoint
October 8, 2026: audit fixes are shipped as both platform build 2s and backend runtime 0234fd3. This checkpoint includes the final documentation and release evidence across all three repos. Shared counted/reserved $157.333235; $342.666765 unreserved. Backend docs/BUDGET.md is authoritative. No new paid AI usage.
