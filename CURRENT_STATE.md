# Current state — BinderCopy macOS

## Objective

Ship the native macOS client using React Native macOS, with a required compatibility spike as part of iPhone and macOS TestFlight delivery.

## Verified state

- Existing folder inspected; empty Git repository with the owner-configured origin.
- Baseline PWA and detailed handoff retained unchanged.
- Three-repository boundary accepted October 7, 2026.
- Documentation, implementation directories, CI documentation check and CURRENT_STATE commit guard scaffolded.
- No native binary, new backend deployment, customer auth or billing implementation is complete yet.

## Active work

Scaffold verified; preparing first commit, Linux provisioning and baseline extraction / native dependency proof.

## Blockers

- VPS key-based SSH and passwordless sudo verified; application provisioning/migration is next.
- Apple organization membership verified (Clearpath Systems LLC, team L349AVQ22W); app identifiers and actual Mac build access still need verification before signing.

## Next actions

1. Validate scaffold and enable commit guard.
2. Validate React Native macOS dependencies and Mac build access; build the resizable native shell and API integration.
3. Record exact verification and commit/push checkpoint here.

## Verification

`npm run verify:docs` passed. `npm run setup:hooks` enabled the state-maintenance guard. Historical PWA: 39 tests, typecheck and isolated web build passed; these do not verify this repository.

## Last checkpoint

2026-10-07 — scaffold checks passed, SSH key access verified, Apple team inspected. Owner authorized full ports with a $500 total cap; shared spend tracked in backend docs/BUDGET.md. Current production remains the PC-hosted PWA; VPS app migration not completed.
