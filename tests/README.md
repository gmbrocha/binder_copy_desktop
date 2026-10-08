# Client verification

Run `npm test`, `npm run typecheck`, `npm run verify:boundary` and `npm run verify:docs`. Tests cover save/Undo/navigation races, stale proposals, lock/drag geometry, backdrop idempotency, account-isolated drafts and auth rotation. Mac also tests release configuration. Native fixtures exercise platform controls, not every physical interaction. See docs/VERIFICATION.md and docs/AUDIT_2026-10-08.md.
