# Decision record

## 2026-10-07 — three repositories

Owner chose to stay in the existing Codex project with separate local repos: binder_copy (iPhone), binder_copy_desktop (macOS), binder_copy_backend (shared service). This supersedes the handoff's illustrative monorepo structure. Keep one backend/API source of truth and compatible contracts. The owner subsequently configured all three remotes; see each README/current Git remote.

## 2026-10-07 — frozen reference and ongoing state

Retain the detailed handoff and freeze the PWA source as reference. Each repo uses AGENTS.md plus continually maintained CURRENT_STATE.md and a commit guard requiring staged state updates. No native/VPS completion is inferred from existing PWA verification.

## Future decisions

2026-10-07: macOS requires React Native 0.83.10 for react-native-macos 0.83.0, while Expo iPhone uses SDK 57 / RN 0.86.3. Keep runtime versions separate. Contracts and initial presentation/session sources are synchronized explicitly; no sibling imports at runtime. The initial presentation is only a vertical slice, with full parity still required.

Use the existing public repository's standard GitHub macos-26 runner for unsigned build proof before renting a Mac. Official cost and available runner labels: https://docs.github.com/en/actions/reference/runners/github-hosted-runners . Build artifacts/logs contain no provider keys or user data. A CI compile does not replace interactive/device QA.

Append dated context, decision, consequences and verification for consequential choices. Do not use this section as an undifferentiated transcript.

## 2026-10-08 - stabilization after first installation

Owner confirmed iPhone installation/use, deferred small UI refinements, and authorized a full code/documentation audit with fixes, commits and pushes in all three repos. Preserve the shipped design; fix correctness, recovery and maintenance defects. Distinguish code checkpoints from installed store builds.
