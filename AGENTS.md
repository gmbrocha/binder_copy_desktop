# BinderCopy agent instructions

## Mission and scope

Deliver native macOS client using React Native macOS, with a required compatibility spike, as part of the shared iPhone/macOS TestFlight objective. Preserve the accepted BinderCopy product, behavior and visual system. Remain in this project and these three repositories; the historical PWA is a frozen reference. The latest explicit user instruction takes precedence over these guidelines.

## Start every work session

1. Read this file and CURRENT_STATE.md before editing.
2. Inspect Git status and preserve all unrelated changes. Read docs/ROADMAP.md and the current decision record.
3. Follow docs/SOURCE_BASELINE.json to the frozen source/handoff when checking parity. Historical handoff monorepo examples are superseded by the accepted three-repository layout.
4. Select the next unfinished milestone. Do not restart completed work or silently expand scope.

## Maintain CURRENT_STATE.md automatically as part of the work

Update it after each meaningful implementation/verification checkpoint, after a deployment or failed attempt, when a blocker changes, and before every commit or handoff. Keep objective, verified state, active work, blockers, next exact actions, verification commands/results, and last checkpoint current. Record what is actually live and on which host. Include cross-repo contract versions/commits when relevant. Do not merely append chat history; replace stale status and retain durable decisions in docs/DECISIONS.md.

Every commit must stage a truthful CURRENT_STATE.md update. The repository commit hook enforces presence of that update; it does not invent status. Install it with npm run setup:hooks. Do not bypass the guard to avoid documenting progress. If there are no implementation changes, do not create a ceremonial commit solely to touch state.

## Prevent drift

- Current navigation is Build / Cards / Library with Settings behind the gear. Personal pages/collection are private; catalog curation is shared.
- Preserve the compact accepted mobile design and intentional roomy desktop grids/bounded desktop builder. Use shared typography/color/spacing roles, concise labels, and no unsolicited helper-copy clutter.
- Implement accepted functionality; do not restore obsolete Check theme, personal-vocabulary UI, account-name tabs, old logos, or earlier superseded layouts.
- Treat the backend as authoritative for permissions, privacy, revisions, jobs and budgets. Client-hidden controls are not authorization.
- Keep API contracts versioned; do not fork DTOs independently without a documented compatibility change. Client repositories must not depend on sibling source files at runtime.
- Prefer small coherent checkpoints. Preserve behavior tests and verify meaningful failures/concurrency, not tests that merely restate code.

## Spending and security

The owner subsequently authorized full iPhone/macOS ports under a **$500 total budget**, including the purchased VPS conservatively. Consult the backend repo's docs/BUDGET.md before any spending; count paid/reserved amounts across all repositories, taxes and renewals. Continue implementation autonomously within that scope. Required tool confirmations still apply at the actual action. Do not fragment this into separate $500 allowances per repo.

Current operating policy: free unlisted distribution, all admitted users receive generation; USD $5 per person per UTC calendar month and unlimited only for verified Sagar. This supersedes the historical purchased-credit and Mini-only rules. Preserve immutable historical ledgers.

No provider secrets in client code, public environment variables, logs or Git. Development/CI/staging paid dispatch defaults off. Ordinary browsing, page building, solid colors and exports must make zero paid calls. Explicit provider operations require verified membership and an atomic reservation against the shared person allowance (Sagar exemption as above). Preserve historical ledgers and conservative reservations; do not automatically retry uncertain paid outcomes. Production uses the verified supported image-model snapshot and versioned rates recorded in the backend UNLISTED_RELEASE.md; the earlier Mini-only and purchased-credit requirements are historical. Do not buy another VPS: annual OVHcloud purchase is complete. New recurring services or changed purchase terms require user authorization.

## Verification and release truth

Run appropriate checks and record results. Differentiate docs checks, unit/API tests, browser tests, actual device/native builds, staging deployment, production cutover, TestFlight upload, beta review and availability. Never claim a native build from a web preview. iPhone and macOS signing/builds require Apple tooling. Never replace current production until staging, backup/restore and one-writer cutover gates pass.

## Collaboration with the owner

Continue authorized work autonomously and give concise meaningful updates. Ask only for truly missing consequential decisions, credentials, or actual approval boundaries; explain why and continue independent work. Do not create other chats or spawn agents unless separately authorized. Commit and push verified checkpoints to the configured remote. Keep any blocked remote/signing/access item explicit while pursuing useful independent implementation.
