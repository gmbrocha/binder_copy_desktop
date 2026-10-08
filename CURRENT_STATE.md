# Current state - BinderCopy macOS

## Objective
Deliver 1.1.0 TestFlight with verified Apple subscriptions/consumables, founder-only admins, curator permissions and bounded paid features. Preserve the accepted PWA-derived UI. Commercial specification v1.0 approved October 8: https://docs.google.com/document/d/1Srtu90yHf4hpiJ4vmcQ6RVa2xApUq8eDy5uB-NvMBak . Backend docs/MONETIZATION_APPROVED_V1.md is the versioned snapshot.

## Verified state
- iPhone 1.0.0 (3) at 84fcff8 is VALID / IN_BETA_TESTING; actual iPhone 13 Pro native run 37787120817 and archive 37787125805 passed. Owner approves its UI.
- Mac 1.0 (3) at cbabc2b is VALID / IN_BETA_TESTING as of October 8 16:41 UTC, Apple 9548f2e3-3f76-4027-bb8a-ea53dbf7c1d8. Native run 37800698083 and universal archive 37799816041 passed. Prior builds remain available.
- Approved smaller B icons are committed after build-3 sources and are included in this next source checkpoint. Preserve their exact files.
- Live backend remains 0234fd3 with native paid dispatch off. Supabase/Zoho authentication, private account boundaries and previous export/build workflows were verified in the baseline release.
- Shared contract 0.2.0 exported from backend 158401b; additive billing balances and legal links. No runtime sibling imports.

## Active work
Native StoreKit 2 bridge now supports subscriptions and consumables with app-account tokens. The server verifies current Apple evidence before transactions finish. Settings includes native localized offers, restore/manage, included/purchased balances and privacy/terms. Foreground recovery retains unfinished evidence, rejects account switches and never prompts for purchases on launch. Version source set to 1.1.0; no 1.1.0 archive/upload yet.

The backend foundation passes 78 tests, including interrupted delivery recovery and exclusion of revoked subscription grants. Plus is approved at $3.99/month or $29.99/year with 10 backgrounds and 50 uncached lookups monthly; packs 10/$2.99 and 30/$6.99. No design/collection count caps, publishing or 100-pack at launch. Apple configuration and paid enablement remain off. Mini is an experimental path; validate a supported replacement and measured economics before paid launch.

Interpretation retries now retain a per-query/account request ID while the view remains mounted, enabling backend result recovery without duplicate charging after a lost response. Native StoreKit runs 37811589729 (iPhone 37eca91) and 37811601080 (Mac 19fc41e) are in progress; they predate this small retry change.

## Blockers
Actual Apple sandbox purchases need configured products, IAP credentials and applicable commercial prerequisites. Apple browser login was expired at last inspection; owner re-login requested. Commercial policy is approved; finite operational budget and paid activation gates remain. No new curator grant. Exact founder grants remain a backed-up backend rollout task.

## Next actions
1. Run native StoreKit compilation and UI regressions; fix actual failures.
2. Complete usage/history and purchase recovery. Preserve cloud saves and collections without count quotas; local-only persistence expansion is excluded from launch.
3. Stage/deploy paid-disabled backend and validate purchase settings; run actual sandbox lifecycle checks once Apple setup is available.
4. Archive/upload 1.1.0 after gates pass; document exact TestFlight availability and physical-device limits.

## Verification
Local client 23 tests, typecheck and private-credential/contract-hash boundary checks pass for this checkpoint. Existing build-3 native proof does not validate the new StoreKit module. Billing coordinator tests cover pending/cancelled, verify-before-finish, restore, unfinished evidence, account changes and duplicate operations.

## Last checkpoint
October 8, 2026: approved commercial plan recorded and stable interpretation retry IDs verified by typecheck, existing client tests and boundary checks. Backend recovery checkpoint 0cadfd8 has 78 passing tests. No 1.1.0 payment acceptance or paid provider calls claimed. Shared delivery budget $184.333235 counted/reserved and $315.666765 remaining; backend docs/BUDGET.md authoritative. iPhone native run 37811589729 reserved at $4.50; Mac standard public CI incurs no added reservation.
