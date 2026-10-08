# Current state — BinderCopy macOS

## Objective
Deliver the owner-approved 1.1.0 native experience and paid-launch specification while preserving PWA-derived UI. Internal beta is available; commercial activation remains gated. Backend docs/MONETIZATION_APPROVED_V1.md is authoritative.

## Verified state

- Both iPhone and Mac **1.1.0 (5)** are VALID / IN_BETA_TESTING in existing private internal group ba56be7f-b9ef-4031-b191-a677f79a0edd. One tester is present; Sagar invitation acceptance is unverified. Build 4 remains available; no public link/external distribution. Build-5 physical acceptance is pending.
- iPhone runtime source 8bd8201, archive 37830778717, Apple 14278cbe-4ccc-491e-a52d-e96e7e370ddb. Mac runtime source b8c7e13, universal archive 37830531204, Apple c6b387ca-76f6-4f54-a996-ced13f1cbb14. Both archives passed native compile, signing/entitlements and package inspection.
- OVH API runtime **8006c767913467b2c660e45602772c3a04e6cc7a** is live at https://bindercopy-api.clearpathsystems.tools after staging, backup and promotion. All 92 tests/typecheck passed on Windows and Linux. A production promotion initially used a mistyped release-directory hash; the same reviewed archive was immediately redeployed into the correct full-hash path and health/readlink reverified. No data was replaced.
- Shared contract **0.2.2**, exported from backend 4cdf8e84aed28d4c10d06a20a30394c4065e8ced, is pinned in both clients. Pale presets and arbitrary validated #RRGGBB custom solid colors are available on Free, with no provider calls/credits. Preview, Library thumbnails and PNG export agree; contrast-aware title and existing dark wordmark keep light pages readable.
- Supabase/Zoho auth, private account separation, deletion and backup/restore remain verified. Catalog has 21,256 cards. Public free-account custom save/reopen/exact PNG-pixel probes passed; disposable identities were removed. Frozen PWA remains untouched.
- Owner gmbrocha@gmail.com is a verified admin. Sagar native identity and curator assignments remain unknown. Purchases never grant staff powers.

## Active work

The requested light presets/free custom colors are implemented, deployed and available in build 5 on both platforms. Final release records are being reconciled while Mac native UI verification finishes. The final iPhone UI retry requires GitHub billing to be restored. No new paid AI usage. See docs/CUSTOM_COLORS.md for controls and data behavior.

Native StoreKit 2 bridges support subscriptions/consumables, account tokens, localized offers, restore/manage and verify-before-finish. Recovery retains unfinished evidence, handles account switches and never initiates a purchase on launch. Settings history resets by account. Both client release archives passed tests/typecheck, native compilation, signature/entitlement and credential/contract checks.

Apple Sandbox-only receipt verification and server notifications are live; signed TEST delivery succeeded October 8 at 18:26 UTC. New purchase offers are hidden and provider dispatch is off; all operational allowances remain zero. Neither native compile nor a TEST notification proves real purchase acceptance.

Approved policy: Plus $3.99/month or $29.99/year with 10 backgrounds and 50 uncached lookups each anchored month; image packs 10/$2.99 and 30/$6.99. No page/collection count caps, publishing or 100-pack. Runtime remains Mini while measured Flare-medium replacement awaits native acceptance and explicit pricing policy.

## Blockers

GitHub refused to start private iPhone UI run 37832199099 because of failed account payments or a spending limit. Owner has been notified; do not blindly retry or change recurring billing. The signed build uploaded before this block and is available. Public Mac native verification still runs.

Apple commercial/tax readiness and real purchase acceptance remain incomplete. Reviewed public disclosures and an explicit operating budget are required before activation.

## Next actions
1. Owner resolves Apple W-9/Finance and processing bank details. No tax certification by the agent. Email monitoring belongs elsewhere.
2. Complete product review metadata/US pack availability and reviewed public privacy/terms/retention disclosures.
3. Run actual Apple purchase/renewal/restore/refund/account-switch/cross-platform wallet scenarios from backend docs/STOREKIT_ACCEPTANCE.md on both devices. Commercial prerequisites and actual Apple-authenticated purchase session remain required.
4. Obtain explicit finite operating/Sandbox/staff budget and finish free-user cost/alert delivery gates before paid activation. Founder identities remain separately verified.
5. Preserve source-fidelity UI and validate build 5 on physical devices. Do not rerun paid CI merely for documentation updates.

## Verification

Backend: 92 tests/typecheck, staged and live Linux checks, anonymous denial, live disposable free-account save/reopen/PNG/CSV/privacy/paid-denial/deletion probes passed. Final custom export was visually inspected. Client archives: 23 iPhone / 24 Mac tests, typechecks, contract/hash and credential checks, signed native compilation and artifact inspection passed.

iPhone native run 37830130469 passed baseline and photo/share flows. Added custom-color script stopped because it did not scroll to Apply; corrected run 37832199099 never started due GitHub billing. Full final iPhone custom-color interaction is not yet verified. Mac initial run 37830138184 passed workspace/persistence; its added color test used a phone-only selector. Corrected desktop inline-picker run 37832987903 is in progress.

Build 5 is available internally, but availability/compilation is not physical installation or real Apple purchase acceptance. Exact package hashes are in the release record. Shared delivery budget: $206.975258 counted/reserved, $293.024742 remaining; backend docs/BUDGET.md is authoritative. The never-started UI retry hold was released; canceled archive reservations remain conservative.

## Last checkpoint

October 8, 2026, 19:38 UTC: Apple confirmed both build-5 betas IN_BETA_TESTING. Backend/custom-color production probe passed. Corrected Mac UI run is active; corrected iPhone UI run cannot start until GitHub billing is resolved. Preserve unrelated docs/UI_PARITY.md.
