# Decision record

## 2026-10-07 — three repositories

Owner chose to stay in the existing Codex project with separate local repos: binder_copy (iPhone), binder_copy_desktop (macOS), binder_copy_backend (shared service). This supersedes the handoff's illustrative monorepo structure. Keep one backend/API source of truth and compatible contracts. The owner subsequently configured all three remotes; see each README/current Git remote.

## 2026-10-07 — frozen reference and ongoing state

Retain the detailed handoff and freeze the PWA source as reference. Each repo uses AGENTS.md plus continually maintained CURRENT_STATE.md and a commit guard requiring staged state updates. No native/VPS completion is inferred from existing PWA verification.

## Future decisions

## 2026-10-08 - commercial specification accepted

Owner accepted Monetization & Paid Launch Specification v1.0 in Drive: https://docs.google.com/document/d/1Srtu90yHf4hpiJ4vmcQ6RVa2xApUq8eDy5uB-NvMBak . Backend docs/MONETIZATION_APPROVED_V1.md preserves the source revision. Plus is $3.99 monthly/$29.99 annual, with 10 backgrounds and 50 uncached theme lookups per entitlement month. Packs are 10/$2.99 and 30/$6.99, non-expiring. No launch count quotas, publishing, 100-pack or extra local-only persistence. Native prices remain localized StoreKit values. Validate replacement image model, costs, Apple lifecycle and finite operating budget before paid activation. This supersedes earlier provisional prices/quantities, not the application's 1.1.0 release version.

2026-10-07: macOS requires React Native 0.83.10 for react-native-macos 0.83.0, while Expo iPhone uses SDK 57 / RN 0.86.3. Keep runtime versions separate. Contracts and initial presentation/session sources are synchronized explicitly; no sibling imports at runtime. The initial presentation is only a vertical slice, with full parity still required.

Use the existing public repository's standard GitHub macos-26 runner for unsigned build proof before renting a Mac. Official cost and available runner labels: https://docs.github.com/en/actions/reference/runners/github-hosted-runners . Build artifacts/logs contain no provider keys or user data. A CI compile does not replace interactive/device QA.

Append dated context, decision, consequences and verification for consequential choices. Do not use this section as an undifferentiated transcript.

## 2026-10-08 - stabilization after first installation

Owner confirmed iPhone installation/use, deferred small UI refinements, and authorized a full code/documentation audit with fixes, commits and pushes in all three repos. Preserve the shipped design; fix correctness, recovery and maintenance defects. Distinguish code checkpoints from installed store builds.


## 2026-10-08 - frozen PWA visual authority

Owner explicitly asked to audit and faithfully mimic the frozen PWA on iPhone 13 Pro and macOS before further UI iteration. Use the current PWA code/screens, not obsolete chat decisions: phone Cards are two columns and picker three; locking lives in the contextual tray with a small locked badge; preview uses palette swatches. Preserve native account/permission boundaries. Automated workflow success alone is not visual parity; retain screenshot evidence and physical acceptance separately. See UI_PARITY.md.


## 2026-10-08 - 1.1.0 privileges and subscriptions

Owner authorized full account privileges and Apple subscriptions for the next 1.1.0 beta. Admins are only the owner and Sagar, bound to verified app identities; curator assignments are TBD. Account role and commercial entitlement are separate. New users are free by default. A paid subscription must never grant curation or administration. Apple verifies purchases; the backend owns account binding, expiration/revocation and usage reservations. TestFlight transactions are sandbox transactions, not revenue. Price and allowance await the owner's discussion; continue independent implementation without choosing them. Preserve the global image ledger and zero paid calls for free users. Commercial activation needs Apple's applicable agreements and review; no claim of real charging from TestFlight.


## 2026-10-08 - image model selection

Owner explicitly selected gpt-image-1-mini for generated backgrounds in 1.1.0. Preserve medium portrait quality, low input fidelity, one image and conservative reservations; do not silently substitute another model. Official rates were checked: text input $2/M, image input $2.50/M, image output $8/M. Round fractional micro-USD upward when settling. The new price policy expires November 8 for review; Apple's subscription work and the existing immutable global image ledger are unaffected. OpenAI currently schedules this model's shutdown for December 1, 2026. No paid call or live model deployment is implied by this source change.
