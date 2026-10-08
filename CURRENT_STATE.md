# Current state — BinderCopy macOS

## Objective
Deliver the owner-approved 1.1.0 native experience and paid-launch specification while preserving PWA-derived UI. Internal beta is available; commercial activation remains gated. Backend docs/MONETIZATION_APPROVED_V1.md is authoritative.

## Verified state

- Both iPhone and Mac **1.1.0 (5)** are VALID / IN_BETA_TESTING in existing private internal group ba56be7f-b9ef-4031-b191-a677f79a0edd. One tester is present; Sagar invitation acceptance is unverified. Build 4 remains available; no public link/external distribution. Build-5 physical acceptance is pending.
- iPhone runtime source 8bd8201, archive 37830778717, Apple 14278cbe-4ccc-491e-a52d-e96e7e370ddb. Mac runtime source b8c7e13, universal archive 37830531204, Apple c6b387ca-76f6-4f54-a996-ced13f1cbb14. Both archives passed native compile, signing/entitlements and package inspection.
- OVH API runtime **b6b1ed588459a7b5e6fc67525bd4535e49d6ef8f** is live at https://bindercopy-api.clearpathsystems.tools after staging, backup and promotion. All 95 tests/typecheck passed on Windows, staging and production Linux. Backup, atomic promotion, health/auth and live free-account contrast/save/export probes passed. No data was replaced.
- Shared contract **0.2.3**, exported from backend b6b1ed588459a7b5e6fc67525bd4535e49d6ef8f, is pinned in both client sources. Medium presets and arbitrary validated #RRGGBB custom solid colors are available on Free, with no provider calls/credits. Preview, Library thumbnails and PNG export agree; contrast-aware title and existing dark wordmark keep light pages readable.
- Supabase/Zoho auth, private account separation, deletion and backup/restore remain verified. Catalog has 21,256 cards. Public free-account custom save/reopen/exact PNG-pixel probes passed; disposable identities were removed. Frozen PWA remains untouched.
- Owner gmbrocha@gmail.com is a verified admin. Sagar native identity and curator assignments remain unknown. Purchases never grant staff powers.

## Active work

Medium presets and independent dark/cream title/logo selection are implemented. Backend runtime b6b1ed5 is live. Title and footer sampling use actual generated/scenery pixels; solid/custom colors use the same deterministic contrast function locally. Preview, Library and exports share composition and ink choices. Build-6 native source: iPhone c7107b6, Mac 4815a77. Archives 37840867495 (iPhone) and 37840878929 (Mac), UI runs 37840871818 (iPhone) and 37841100347 (signed Mac) are in progress. The accidentally dispatched unsigned Mac smoke 37840882449 was canceled before interaction; signed Mac smoke is authoritative. No new image calls.

Native StoreKit 2 bridges support subscriptions/consumables, account tokens, localized offers, restore/manage and verify-before-finish. Recovery retains unfinished evidence, handles account switches and never initiates a purchase on launch. Settings history resets by account. Both client release archives passed tests/typecheck, native compilation, signature/entitlement and credential/contract checks.

Apple Sandbox-only receipt verification and server notifications are live; signed TEST delivery succeeded October 8 at 18:26 UTC. New purchase offers are hidden and provider dispatch is off; all operational allowances remain zero. Neither native compile nor a TEST notification proves real purchase acceptance.

Approved policy: Plus $3.99/month or $29.99/year with 10 backgrounds and 50 uncached lookups each anchored month; image packs 10/$2.99 and 30/$6.99. No page/collection count caps, publishing or 100-pack. Runtime remains Mini while measured Flare-medium replacement awaits native acceptance and explicit pricing policy.

## Blockers

No remaining automated color-release blocker. Physical build-5 acceptance remains with the owner. GitHub billing is restored; owner confirmed a $65 Actions stop limit.

Apple commercial/tax readiness and real purchase acceptance remain incomplete. Reviewed public disclosures and an explicit operating budget are required before activation.

## Next actions
1. Owner resolves Apple W-9/Finance and processing bank details. No tax certification by the agent. Email monitoring belongs elsewhere.
2. Complete product review metadata and reviewed public privacy/terms/retention disclosures. Both credit packs now have verified USA-only availability.
3. Run actual Apple purchase/renewal/restore/refund/account-switch/cross-platform wallet scenarios from backend docs/STOREKIT_ACCEPTANCE.md on both devices. Commercial prerequisites and actual Apple-authenticated purchase session remain required.
4. Obtain explicit finite operating/Sandbox/staff budget and finish free-user cost/alert delivery gates before paid activation. Founder identities remain separately verified.
5. Preserve source-fidelity UI and validate build 5 on physical devices. Do not rerun paid CI merely for documentation updates.

## Verification

All 92 backend tests/typecheck passed on Windows and Linux; staging and production promotion, backup/health and public disposable free-account save/reopen/custom PNG pixels, real card PNG/CSV, privacy, paid denial and cleanup passed. Signed archives passed 23 iPhone / 24 Mac tests, typechecks, contract/credential boundaries and native signature/entitlement/package checks.

Native interaction: iPhone baseline and photo/share flows passed in 37832199099 attempt 2; focused custom-color/parity flow passed in 37838150971 at 60208bc. Mac workspace/persistence and photo/custom-color/export flows passed in 37832987903 at 362176d. These later client commits change tests/documentation only; runtime matches archived build-5 sources. Earlier iPhone script errors involved footer occlusion and a grouped accessibility label; centered controls and reopening the hex field verify the applied values. Fixture tests do not prove real Apple purchases or final delivery on a physical device.

Pale/custom page previews, readable title/wordmark contrast and Mac Library thumbnails were visually reviewed. Evidence: iPhone .local/custom-ui-37832199099-attempt2 and .local/custom-ui-37838150971; Mac .local/custom-ui-37832987903; backend .local/public-api-color-logo.json and -export.png. Build-5 package hashes and Apple IDs are in the release record. Shared budget $314.475258 counted/reserved, $185.524742 remaining; backend docs/BUDGET.md includes the owner-reported $85 gross runner usage pending reconciliation. No new paid AI calls.

## Last checkpoint

October 8: iPhone contrast/custom-color parity run 37840871818 passed. Build 6 iPhone package passed inspection and Apple processing but is withheld from the internal group after final review found the contrast cache was scoped to the long-lived API client, not account lifetime. Cache now belongs to each mounted page tree; AuthGate remounts on identity change. This changes cache lifetime only. Mac archive 37840878929 canceled before upload; signed UI run 37841100347 continues. Packaging corrected build 7 on both platforms; one additional iPhone archive reserved. Total $314.475258, remainder $185.524742. Live backend remains b6b1ed5. Preserve unrelated docs and ideas edits.
