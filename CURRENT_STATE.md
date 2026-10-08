# Current state — BinderCopy macOS

## Objective
Deliver the owner-approved 1.1.0 native experience and paid-launch specification while preserving PWA-derived UI. Internal beta is available; commercial activation remains gated. Backend docs/MONETIZATION_APPROVED_V1.md is authoritative.

## Verified state

- Both iPhone and Mac **1.1.0 (7)** are VALID / IN_BETA_TESTING in the existing private internal group ba56be7f-b9ef-4031-b191-a677f79a0edd. Prior builds remain available. No public/external distribution. Physical build-7 acceptance remains pending.
- iPhone source 0fa871e, archive 37842805874, Apple 0faaad54-bb0e-4974-a25a-1e285bc8a1ea. Mac source 811052e, universal archive 37842827853, Apple 86e150f6-656e-47fc-a61e-44c52a7acddf. Final packages passed native build/signature/entitlement/credential inspection.
- OVH API runtime **b6b1ed588459a7b5e6fc67525bd4535e49d6ef8f** is live at https://bindercopy-api.clearpathsystems.tools. 95 tests/typecheck passed on Windows/staging/production; backup, promotion and live auth/privacy/color/export checks passed.
- Shared snapshot **0.2.3** is pinned from that backend revision. Medium preset colors and free custom #RRGGBB colors are implemented. Dark/cream title and logo independently use measured background contrast, including saved generated artwork. Preview, Library and PNG composition agree; cache does not outlive the mounted account page tree.
- Catalog 21,256 cards; Supabase/Zoho auth, private pages/collections, deletion and backup/restore remain verified. Owner gmbrocha@gmail.com is a verified admin; Sagar native identity and curator assignments remain unknown. Purchases never grant staff powers. Frozen PWA remains untouched.

## Active work

Medium presets and adaptive overlays are complete, deployed and available in build 7. Remaining work is the commercial launch gates below; no unrequested paid dispatch or public release. See docs/CUSTOM_COLORS.md.

Native StoreKit 2 bridges support subscriptions/consumables, account tokens, localized offers, restore/manage and verify-before-finish. Recovery retains unfinished evidence, handles account switches and never initiates a purchase on launch. Settings history resets by account. Both client release archives passed tests/typecheck, native compilation, signature/entitlement and credential/contract checks.

Apple Sandbox-only receipt verification and server notifications are live; signed TEST delivery succeeded October 8 at 18:26 UTC. New purchase offers are hidden and provider dispatch is off; all operational allowances remain zero. Neither native compile nor a TEST notification proves real purchase acceptance.

Approved policy: Plus $3.99/month or $29.99/year with 10 backgrounds and 50 uncached lookups each anchored month; image packs 10/$2.99 and 30/$6.99. No page/collection count caps, publishing or 100-pack. Runtime remains Mini while measured Flare-medium replacement awaits native acceptance and explicit pricing policy.

## Blockers

No remaining automated color/overlay release blocker. Physical build-7 acceptance remains with the owner. GitHub billing is restored; owner confirmed the $65 Actions stop limit.

Apple commercial/tax readiness, real StoreKit purchase acceptance, reviewed public legal/disclosure URLs and finite operational budgets remain unresolved. Owner is contacting Apple Finance; do not change tax certification/bank details. Email monitoring belongs to another agent.

## Next actions
1. Owner resolves Apple W-9/Finance and processing bank details. No tax certification by the agent. Email monitoring belongs elsewhere.
2. Complete product review metadata and reviewed public privacy/terms/retention disclosures. Both credit packs now have verified USA-only availability.
3. Run actual Apple purchase/renewal/restore/refund/account-switch/cross-platform wallet scenarios from backend docs/STOREKIT_ACCEPTANCE.md on both devices. Commercial prerequisites and actual Apple-authenticated purchase session remain required.
4. Obtain explicit finite operating/Sandbox/staff budget and finish free-user cost/alert delivery gates before paid activation. Founder identities remain separately verified.
5. Preserve source-fidelity UI and validate build 7 on physical devices. Do not rerun paid CI merely for documentation updates.

## Verification

Backend 95 tests/typecheck passed on Windows, staging and production Linux. Backup, atomic deployment and health/auth checks passed. Public disposable free-account contrast/light-dark selection, custom-color save/reopen, exact PNG pixels, CSV, private ownership, paid denial and deletion passed; both identities removed. Added direct ownership test proves existing artwork remains measurable on Free while another account cannot sample it.

iPhone native parity/custom-color/generated-contrast run 37840871818 passed on iPhone 13 Pro simulator at c7107b6. Signed Mac UI run 37841100347 passed workspace/persistence, photo/custom/export and generated contrast at 4815a77. Screenshots verified cream title on black and dark logo on white within the same page. Final source adds only per-mounted-page cache lifetime isolation after these native interaction runs; final archives independently passed 23 iPhone / 24 Mac tests, typechecks, boundaries, native compilation, signing/entitlements and decoded-bundle/package inspection. No claim of new physical-device or real purchase acceptance.

Reviewed medium preset/custom exports and three existing generated scenes with cached card images, without provider calls. Evidence: backend .local/midtone-review.png, .local/generated-overlay-review.png, .local/public-api-midtone.json; iPhone .local/overlay-ui-37840871818; Mac .local/overlay-ui-37841100347. Native build-6 iPhone was processed but withheld from beta assignment; Mac build-6 archive was canceled. Build 7 is the released correction.

Final package hashes/Apple IDs are in the release record. Budget $314.475258 counted/reserved, $185.524742 remaining; backend docs/BUDGET.md is authoritative.

## Last checkpoint

2026-10-08 21:18 UTC: both build-7 betas available internally after native/package checks. Backend live and live free-account probe passed. Changes committed/pushed; preserve unrelated user-guide/UI_PARITY/ideas edits. Purchases/provider dispatch remain disabled; no new image calls.
