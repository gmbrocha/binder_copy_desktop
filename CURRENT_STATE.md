# Current state â€” BinderCopy macOS

## Objective
Ship the finished iPhone/macOS apps free through Apple unlisted distribution. The October 8 free-unlisted decision supersedes the commercial plan. Preserve the accepted design; enable generation for the known group with $5/person/calendar month (UTC), unlimited for verified Sagar only.

## Verified state

- Both platforms **1.1.0 (9)** are VALID / IN_BETA_TESTING in existing private internal group ba56be7f-b9ef-4031-b191-a677f79a0edd, verified October 8 at 23:46 UTC. One tester is confirmed. Prior builds remain available; no public/external release. Physical build-9 acceptance remains pending.
- iPhone runtime **30db2b4**, archive **37858500047**, parity **37858503701**, Apple **e3f7bfe5-9737-44bc-8f91-b3940714c60e**. Mac runtime **66bac70**, universal archive **37858492571**, signed interactions **37858496318**, Apple **caf3a7ff-7b6b-452e-baa9-c91552e65350**. Exact hashes and verification limits are in the release record.
- The approved 48-point cream PokÃ© Ball is the sole app-rendered loading indicator: no visible Loading text and no old ActivityIndicator wheels (13 removed per client). It rotates every 1.4 seconds after the existing 750ms threshold over a dimmed background. Modal layering and media/render holds remain. Reduce Motion keeps it static; background/unmount stops rotation. Screen-reader Loading/busy semantics remain.
- OVH API runtime **1d31475799b1bc772bcf4af5e944ad2d6cff3925** remains live at https://bindercopy-api.clearpathsystems.tools. This release needed no backend deployment or paid inference.
- Shared contract snapshot **0.2.3** is pinned to b6b1ed5. Catalog has 21,256 cards. Private pages/collections, shared tags, auth/deletion and backup/restore remain verified; frozen PWA is untouched.
- Prior generation hydration/duplicate avoidance, locked/existing card preservation, cream empty-slot marks, free custom colors, medium presets, independent title/logo contrast, and Reapply saved artwork remain included.
- Verified owner gmbrocha@gmail.com has founder API testing under one non-renewing $5 global cap. Historical first Mini test cost $0.013190, leaving $4.986810 then; this is not a new balance read. Sagar's native identity and curator assignments remain unverified. Purchases never grant staff permissions.

## Active work

Implementing the approved free-unlisted transition: account-bound monthly API metering, verified Sagar exemption, removal of purchase UI, supported image model, App Review and unlisted request. Purchase UI has been replaced with concise Generation usage, including the unlimited flag. Contract 0.2.4 is pinned to backend 160e698. Typecheck, 26 tests and contract/credential checks pass locally. New native signing/upload is pending reviewer-auth requirements to avoid spending on a knowingly superseded archive. Apple records use 1.1.0 and MANUAL release; neither platform is submitted. No new runtime deployment or store submission is claimed yet. Build 9 and the backend revision listed above are the last verified live versions; their old founder-only budget is historical live behavior pending migration.

## Blockers

Awaiting Sagar first sign-in for verified exemption/admin binding. Apple review still needs contact phone, third-party content-rights confirmation and an accepted reviewer-access method; questions are pending. Other engineering continues. Free Apps Agreement was ACTIVE in App Store Connect; the pending Paid Apps Agreement is not the chosen release path. Do not change tax/bank details.

## Next actions

1. Implement and test invitation admission, monthly atomic reservations across devices, Sagar-only exemption and preservation of historical ledgers.
2. Verify and migrate the image model; remove native purchase offers and show concise usage information.
3. Build/sign/verify both clients, deploy the backed-up backend, then submit finished apps for App Review with manual release and request unlisted distribution.
4. Archive and retire PWA-only resources after native availability is confirmed. Preserve shared native infrastructure.

## Verification

Both final clients pass typecheck, credential/contract boundaries and 25 iPhone / 26 Mac tests. Signed archives passed compilation/signatures/entitlements; downloaded packages passed version/production endpoint/decoded credential inspection. Mac is arm64/x86_64.

iPhone 13 Pro simulator parity at exact released source passed. Two native screenshots show one undimmed ball at different rotation angles, no old wheel/text, then disappearance before keeping the result. Replacement, Undo, custom colors, saved pages, catalog/settings and Reapply passed. The intentionally delayed generation fixture took 8536ms through render. Evidence: iPhone .local/spinner-ui-37858503701.

Mac signed interaction suite at exact released source passed three tests, zero failures, 127.604 seconds: workspace/persistence, native photo/custom/export and generated-overlay contrast. Evidence: Mac .local/spinner-ui-37858496318. No Mac-specific animated-frame/Reapply assertion, physical-device acceptance, native Reduce Motion toggle test or real StoreKit transaction acceptance is claimed.

Backend's previously verified 100 tests/typecheck and production generation/privacy/free/paid-boundary checks remain historical unchanged-runtime evidence. No backend test rerun or paid provider call was needed here. Initial build-9 workflows 37857871793, 37857875314 and 37857867968 were canceled before upload after the spinner-only steering; conservative reserves are retained.

## Last checkpoint

New free-unlisted policy recorded; implementation and store submission are in progress, not yet live. The release evidence below remains historical.


2026-10-08 23:46 UTC: both build-9 platforms available privately in TestFlight; release evidence complete. Branding concepts and requested level-edge revision delivered as previews only. Shared ledger **$359.975258 counted/reserved, $140.024742 unreserved**, backend docs/BUDGET.md authoritative; $65 Actions stop limit separate. Preserve unrelated backend NATIVE_USER_GUIDE.md, both UI_PARITY.md files and iPhone MINOR_TODO_AND_IDEAS.txt.
