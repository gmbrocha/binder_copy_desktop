# Current state - BinderCopy macOS

## Objective
Stabilize the full native iPhone/macOS internal betas and shared VPS backend within the combined $500 budget. Preserve frozen PWA f35163d and its private data.

## Verified state
- October 8, 2026 icon checkpoint: owner-approved smaller B is integrated in assets/brand/icon.png and all ten macOS AppIcon catalog PNGs (16px through 1024px). Master: 900px artwork plus 62px padding per side on a 1024px opaque canvas; the 512px output matches the approved preview byte-for-byte. Verified PNG sizes/opacity, matching iPhone master, and Xcode AppIcon wiring. Source integration only: existing TestFlight binaries and in-flight archives are unchanged. Next signed Mac archive must include this icon checkpoint.
- Three-repository audit source checkpoints are committed/pushed: iPhone f91d407, Mac 9a13fe9, backend 0234fd3. The final documentation checkpoint records these binary/runtime revisions separately from its own Git HEAD.
- iPhone 1.0.0 (2), Apple 92f725fe-4049-420b-bc13-f3342fac002d, and Mac 1.0 (2), Apple 497f2e4e-ac73-4bd8-adae-958819bdf293, are VALID / IN_BETA_TESTING in owner-only group ba56be7f-b9ef-4031-b191-a677f79a0edd. Both build 1 binaries remain available. The owner and portal confirm iPhone build 1 installation on iPhone 13 Pro / iOS 26.6.1; updated/physical Mac installations are not asserted.
- Audit application sources passed signed archives and native fixture checks: iPhone archive 37738717232, interaction 37738720783; Mac universal archive 37738724585, signed interaction retry 37741934886 at ccb5e7e (CI/docs-only follow-up to the same app source). Run 37738728360 passed workspace but timed out while first-start Metro was still compiling; the harness now precompiles before UI deadlines, with every assertion retained. Native Library, photo and output screenshots reviewed. Actual Mac Keychain/cold restart and native file panels pass; fixture output is not claimed as complete real-output acceptance.
- Native API https://bindercopy-api.clearpathsystems.tools runs 0234fd3 on OVH 51.81.223.26, loopback 4182 behind HTTPS Caddy. Isolated staging remains fa603e1 on 4181. Catalog 21,256 cards; paid native dispatch disabled for every role. No legacy private pages, ownership or accounts migrated.
- Deployment backup, 54 Linux tests, typecheck, health and anonymous rejection passed. Fresh public probes pass real JWT/private-account isolation/deletion, PNG/CSV rendering, image-seed generation, locks, named save/reopen and private ownership. Synthetic identities cleaned up; daily api-backup.timer and isolated restore verified.
- Supabase jmxlvjjuiykugraaqrib and Zoho SMTP active; delivered signup/returning email codes, JWT refresh/logout and deletion verified. No founder role grant without verified app identity. API/signing keys remain restricted operator/server secrets; no copied private environment values or signing files are tracked.
- Contracts/domain snapshot 0.1.0 from e844450 uses canonical LF hashes checked in both clients. iPhone Expo 57.0.27/RN 0.86.3; Mac RN macOS 0.83.0/RN 0.83.10 and CLI 20.2.0. Runtime versions were not force-downgraded to silence dependency advisories.

## Active work
PWA-fidelity implementation is complete in both clients. iPhone build 3 is available internally. Mac final candidate 05561aa is in signed UI run 37795937114 and universal archive 37795941341. It includes explicit test waits for async dialog dismissal and the PWA desktop sidebar's full-width Regenerate row. Prior verified packages remain unshipped; final screenshot/release gates are pending.

Sagar's app-scoped Apple team invitation remains pending acceptance. No group enrollment claim.

## Blockers
No audit/release blocker. Broader release acceptance still requires physical gestures/accessibility/larger text, native email recovery/account switching and real output delivery, founder identity linking, Zoho sender review, final shared-catalog reconciliation, privacy/support/asset rights and external distribution review. Native paid features/subscriptions remain off. The owner has now authorized the PWA-fidelity pass; native screenshot and release checks are active.

## Next actions
1. Review the final Mac native screenshots and test result; upload the verified universal package and assign build 3 internally after Apple validation.
2. Record final source/package/build evidence, reconcile release docs and push all documentation checkpoints.
3. Owner physical iPhone/PWA and Mac acceptance remains separate. Preserve account permissions and disabled paid dispatch. Enroll Sagar after he accepts the Apple invitation.

## Verification
This repo: 19 tests pass; cross-repo total 91 (18 iPhone, 19 Mac, 54 backend). All typechecks, complete bundles, private-credential checks, contract hashes, documentation UTF-8/nonempty checks and relative Markdown links pass. Source CI and native workflows against the audited application sources pass. Backend production dependency audit is clean; inherited native build-tool advisories are triaged, not falsely described as zero.

## Last checkpoint
October 8, 2026: iPhone PWA-fidelity source 84fcff8 passed all three actual iPhone 13 Pro simulator flows in 37787120817. Screenshots reviewed; Preview safe area/back navigation, replacement cancel/reroll/Keep/Undo, persistence, photo/share, filters and Library pass. Signed archive 37787125805 verified and package uploaded to Apple as 1.0.0 (3); Apple build 007bb941-a4e9-49ab-8f61-698f75178013 is VALID / IN_BETA_TESTING, assigned to the existing internal group at 14:07 UTC. Package SHA-256 297165e4d3b61e3adf82992d8841e178e551a9772b39f5109731b48c037b3a27. Prior candidate package was not uploaded.

Mac source 0ab358d passed universal archive 37791911701 and actual package checks (SHA256 0d6a724ec3df768ca32181008a974ec4e3ad13d18a8ac6e94eac7979e22f9ca0). UI run 37791906880 passed photo/export and name editing/saving, then clicked Cards before the async save dialog closed. The test now waits for dialog disappearance before navigating, retaining every assertion; application source is unchanged. Screenshot review also found the desktop source text squeezed beside Regenerate. Matching the frozen PWA sidebar CSS now places Regenerate on its own full-width row. Both native verification and archive must rerun for this final visual correction; previous packages remain unshipped. Prior source 3141669 passed its archive/photo export but failed an immediate name-field existence check; final candidate adds the explicit wait and compact desktop dialog/label refinements. Mac TestFlight remains build 2. Backend runtime remains 0234fd3 with paid dispatch off. No PWA edits, production private-data changes or paid AI calls.

Shared counted/reserved $179.833235; $320.166765 unreserved. Backend docs/BUDGET.md is authoritative. Sagar's Apple team invitation is still awaiting acceptance; no tester group enrollment claim.

Final packaging correction: a Windows editing script double-encoded Workbench punctuation in 05561aa. Restored its original UTF-8 characters, including multiplication signs and apostrophes. No behavior or test selector changes. Native UI run 37795937114 remains useful for unchanged behavior; the archive must use the corrected source.
