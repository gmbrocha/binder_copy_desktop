# Current state — BinderCopy macOS

## Objective
Deliver the accepted native 1.1.0 experience while preserving the PWA-derived design. Build 9 is available internally on iPhone and Mac; commercial activation remains gated. Backend docs/MONETIZATION_APPROVED_V1.md is authoritative.

## Verified state

- Both platforms **1.1.0 (9)** are VALID / IN_BETA_TESTING in existing private internal group ba56be7f-b9ef-4031-b191-a677f79a0edd, verified October 8 at 23:46 UTC. One tester is confirmed. Prior builds remain available; no public/external release. Physical build-9 acceptance remains pending.
- iPhone runtime **30db2b4**, archive **37858500047**, parity **37858503701**, Apple **e3f7bfe5-9737-44bc-8f91-b3940714c60e**. Mac runtime **66bac70**, universal archive **37858492571**, signed interactions **37858496318**, Apple **caf3a7ff-7b6b-452e-baa9-c91552e65350**. Exact hashes and verification limits are in the release record.
- The approved 48-point cream Poké Ball is the sole app-rendered loading indicator: no visible Loading text and no old ActivityIndicator wheels (13 removed per client). It rotates every 1.4 seconds after the existing 750ms threshold over a dimmed background. Modal layering and media/render holds remain. Reduce Motion keeps it static; background/unmount stops rotation. Screen-reader Loading/busy semantics remain.
- OVH API runtime **1d31475799b1bc772bcf4af5e944ad2d6cff3925** remains live at https://bindercopy-api.clearpathsystems.tools. This release needed no backend deployment or paid inference.
- Shared contract snapshot **0.2.3** is pinned to b6b1ed5. Catalog has 21,256 cards. Private pages/collections, shared tags, auth/deletion and backup/restore remain verified; frozen PWA is untouched.
- Prior generation hydration/duplicate avoidance, locked/existing card preservation, cream empty-slot marks, free custom colors, medium presets, independent title/logo contrast, and Reapply saved artwork remain included.
- Verified owner gmbrocha@gmail.com has founder API testing under one non-renewing $5 global cap. Historical first Mini test cost $0.013190, leaving $4.986810 then; this is not a new balance read. Sagar's native identity and curator assignments remain unverified. Purchases never grant staff permissions.

## Active work

The loading-animation release is complete, committed and pushed at the runtime sources above; this checkpoint records final availability and evidence.

Owner next requested three coordinated wordmark/B-icon concepts without Poké Balls. Built-in image generation produced Card Stack, Binder Tab and Offset Orbit preview boards. Owner prefers Card Stack and requested perfectly horizontal top/bottom card edges with slanted sides only. That revised preview was generated; final acceptance and app asset integration are pending. Owner then requested the icon stack be duplicated exactly into the wordmark; generated matching draft still needs owner review. All preview boards are preserved in backend .local/brand-concepts. No branding asset in the released app has changed. Do not infer authorization to replace the just-released loading animation from this logo-only request.

Customer purchases/provider spending remain unavailable. Commercial plan: Plus $3.99/month or $29.99/year, 10 backgrounds and 50 uncached themes per anchored month; packs 10/$2.99 and 30/$6.99.

Supported replacement image-model benchmarking remains **backlog only** in backend docs/ROADMAP.md. Do not switch live gpt-image-1-mini or start paid benchmarking for this release.

## Blockers

No internal-release blocker. Commercial activation still requires Apple tax/agreements readiness, actual StoreKit transaction acceptance, reviewed legal/disclosure URLs and explicit customer/Sandbox operational budgets. Owner handles Finance; do not alter tax certification or banking. Email monitoring belongs to another agent. Development budget is separate from recurring operations.

## Next actions

1. Await owner choice/acceptance of revised Card Stack branding and physical build-9 feedback; preserve unrelated local changes.
2. Complete commercial/product metadata and reviewed privacy/support/terms, retention and asset-rights disclosures. Credit packs have USA-only availability.
3. Run actual Apple purchase/renewal/restore/refund/account-switch/cross-platform scenarios from backend docs/STOREKIT_ACCEPTANCE.md when permitted; fixture tests are not transaction acceptance.
4. Confirm Sagar's native identity before founder grant. Keep staff permissions separate from subscriptions.
5. Execute the deferred supported-model benchmark only within its approved scope and finite budget, verifying availability/pricing then and versioning any replacement policy. Implement actual budget notification delivery before commercial activation.

## Verification

Both final clients pass typecheck, credential/contract boundaries and 25 iPhone / 26 Mac tests. Signed archives passed compilation/signatures/entitlements; downloaded packages passed version/production endpoint/decoded credential inspection. Mac is arm64/x86_64.

iPhone 13 Pro simulator parity at exact released source passed. Two native screenshots show one undimmed ball at different rotation angles, no old wheel/text, then disappearance before keeping the result. Replacement, Undo, custom colors, saved pages, catalog/settings and Reapply passed. The intentionally delayed generation fixture took 8536ms through render. Evidence: iPhone .local/spinner-ui-37858503701.

Mac signed interaction suite at exact released source passed three tests, zero failures, 127.604 seconds: workspace/persistence, native photo/custom/export and generated-overlay contrast. Evidence: Mac .local/spinner-ui-37858496318. No Mac-specific animated-frame/Reapply assertion, physical-device acceptance, native Reduce Motion toggle test or real StoreKit transaction acceptance is claimed.

Backend's previously verified 100 tests/typecheck and production generation/privacy/free/paid-boundary checks remain historical unchanged-runtime evidence. No backend test rerun or paid provider call was needed here. Initial build-9 workflows 37857871793, 37857875314 and 37857867968 were canceled before upload after the spinner-only steering; conservative reserves are retained.

## Last checkpoint

2026-10-08 23:46 UTC: both build-9 platforms available privately in TestFlight; release evidence complete. Branding concepts and requested level-edge revision delivered as previews only. Shared ledger **$359.975258 counted/reserved, $140.024742 unreserved**, backend docs/BUDGET.md authoritative; $65 Actions stop limit separate. Preserve unrelated backend NATIVE_USER_GUIDE.md, both UI_PARITY.md files and iPhone MINOR_TODO_AND_IDEAS.txt.
