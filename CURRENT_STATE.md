# Current state — BinderCopy macOS

## Objective
Deliver the owner-approved 1.1.0 native experience and paid-launch specification while preserving PWA-derived UI. Internal beta is available; commercial activation remains gated. Backend docs/MONETIZATION_APPROVED_V1.md is authoritative.

## Verified state
- macOS **1.1.0 (4)**, source 08bd960, Apple e760f81f-c048-453e-bc43-1f181002781b: VALID / IN_BETA_TESTING in existing private internal group ba56be7f-b9ef-4031-b191-a677f79a0edd. Signed archive workflow 37821792293 passed. Build-4 installation/physical acceptance remains unverified.
- Both iPhone and Mac build 4 are internally available. Previous build 3 remains available. One tester is in the group; Sagar's prior team invitation does not prove acceptance/group access. No public link or external release was created.
- Live shared API 91d35e9382c19b4be208733fbcc3b1f4346871ad passed 90 tests/typecheck in staging and production with backup and health checks. Supabase/Zoho authentication, private content isolation and PNG/CSV probes passed. Catalog 21,256 cards.
- Shared contract 0.2.1 exported from backend bf5109914fd39d4d44c69ce3853dcff6694ca18b. No runtime sibling imports. Small approved icons, interpretation retry IDs and account-private recent usage are included.
- Owner app admin binding is live for gmbrocha@gmail.com. Sagar identity and curator assignments remain unverified. Commercial purchases do not grant staff powers.

## Active work
Owner requested much lighter preset page backgrounds and arbitrary custom colors on Free. Contract 0.2.2 adds validated customColor; native picker/hex input, preview, thumbnail, Undo/save and PNG export are implemented locally. This supersedes earlier dark preset values. Backend 92 tests, client 24 tests, typecheck and boundary checks pass. Contract 0.2.2 snapshot is pinned to backend 4cdf8e8. Native custom-color UI checks and build 5 follow; installed build 4 is unchanged.

Native StoreKit 2 bridges support subscriptions/consumables, account tokens, localized offers, restore/manage and verify-before-finish. Recovery retains unfinished evidence, handles account switches and never initiates a purchase on launch. Settings history resets by account. Both client release archives passed tests/typecheck, native compilation, signature/entitlement and credential/contract checks.

Apple Sandbox-only receipt verification and server notifications are live; signed TEST delivery succeeded October 8 at 18:26 UTC. New purchase offers are hidden and provider dispatch is off; all operational allowances remain zero. Neither native compile nor a TEST notification proves real purchase acceptance.

Approved policy: Plus $3.99/month or $29.99/year with 10 backgrounds and 50 uncached lookups each anchored month; image packs 10/$2.99 and 30/$6.99. No page/collection count caps, publishing or 100-pack. Runtime remains Mini while measured Flare-medium replacement awaits native acceptance and explicit pricing policy.

## Blockers
Apple commercial/tax readiness and real purchase acceptance remain incomplete. Reviewed public disclosures and an explicit operating budget are required before activation.

## Next actions
1. Owner resolves Apple W-9/Finance and processing bank details. No tax certification by the agent. Email monitoring belongs elsewhere.
2. Complete product review metadata/US pack availability and reviewed public privacy/terms/retention disclosures.
3. Run actual Apple purchase/renewal/restore/refund/account-switch/cross-platform wallet scenarios from backend docs/STOREKIT_ACCEPTANCE.md on both devices. Commercial prerequisites and actual Apple-authenticated purchase session remain required.
4. Obtain explicit finite operating/Sandbox/staff budget and finish free-user cost/alert delivery gates before paid activation. Founder identities remain separately verified.
5. Preserve source-fidelity UI and validate build 4 on physical devices. Do not rerun paid CI merely for documentation updates.

## Verification
23 local client tests, typecheck and boundary/hash checks passed again in the signed archive. StoreKit native regressions passed in iPhone 37811589729 and Mac 37811601080 before small retry/history updates; the final archives compiled those updates. Local package version, bundle/public URLs and decoded credential inspection passed. Exact hashes are in docs/RELEASE_1_1_0.md. Full actual Apple sandbox transaction acceptance remains pending.

## Last checkpoint
October 8, 2026 after 18:30 UTC: build 4 available internally, updated beta notes and release evidence. Shared delivery total $188.975258 counted/reserved, $311.024742 remaining; backend docs/BUDGET.md is authoritative. Preserve unrelated docs/UI_PARITY.md. No live client changes after archive source 08bd960; this checkpoint updates release documentation.
