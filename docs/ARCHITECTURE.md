# Native architecture

React Native macOS 0.83.0 / React Native 0.83.10, with an Objective-C++ Keychain/photo/file bridge and AppKit-backed dialogs.

App validates public configuration and hosts authentication. AuthGate restores secure sessions and remounts the workspace when account identity changes. Workbench composes navigation, search, page state and dialogs. Feature modules separate generation, recovery, shared curation, Library and Settings. The backend owns privacy, roles, revisions and spending.

PageSession serializes saves and carries revisions forward without replacing newer local edits. Library waits for meaningful pending changes before loading; same-page reopening uses the latest acknowledged snapshot. Conflicts preserve local content and offer retry/copy/reload. DraftJournal stores small Keychain chunks with an atomic manifest; interrupted writes preserve the previous bank.

Contract/domain snapshot 0.1.0 is pinned to backend e844450; hashes are in src/shared/manifest.json. Verify them before changing DTOs. This copy is independently buildable, not an independently maintained API fork.

Networking uses HTTPS outside debug loopback. Artwork carries bearer headers. Photos stay local; exports use platform sharing/save adapters. Beta paid generation is disabled for all accounts. No store subscription is implemented.

See docs/PARITY_STATUS.md for remaining physical-device, accessibility, rights and wider-distribution gates. An internal beta is not a public App Store release.
