# BinderCopy macOS — paused handoff

October 10, 2026. **Owner paused development pending collaborator testing and clearer requirements. Resume only when the owner explicitly asks.** Earlier autonomous implementation/release instructions are suspended. A public launch and cancellation of the unlisted request were discussed, not authorized.

- Source checkpoint before this handoff: `4c5646f`. Card surround preview/Keep/Undo and rounded center-card layout are implemented; contract 0.2.5 is pinned to backend `b2042b2`. This feature is not in the installed release and remains server-gated off.
- Last verified Apple state (October 8 local / October 9 UTC): 1.1.0 build 12 available in internal TestFlight, submitted to App Review, WAITING_FOR_REVIEW with manual release. Unlisted request received; approval unconfirmed. No withdrawal or fresh status check occurred for this handoff.
- Last source verification: 30 tests, typecheck, documentation/boundary checks and local macOS JS bundle passed. No new Xcode archive or native interaction verification for surrounds.
- The subsequent six-pass backend API check passed ($0.151994, about 79 seconds), but inset seams remain. This does not establish native visual parity or authorize activation.
- Preserve existing uncommitted `docs/UI_PARITY.md`; it is not part of this handoff commit.

On an explicit restart, read the [shared handoff](../binder_copy_backend/HANDOFF_PAUSED.md), AGENTS.md and CURRENT_STATE.md; collect test results, agree distribution/IP-review scope, and recheck Apple statuses, TestFlight expiry and budget before selecting work. The backend handoff links release, pipeline, budget and archive evidence. Do not automatically rebuild, spend, deploy, withdraw/release submissions or retire the PWA. Hosting and existing app access remain unchanged by this pause.
