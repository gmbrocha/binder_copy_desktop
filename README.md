# BinderCopy macOS

native macOS client using React Native macOS, with a required compatibility spike.

Read [CURRENT_STATE.md](CURRENT_STATE.md), [AGENTS.md](AGENTS.md), then [the roadmap](docs/ROADMAP.md) before work. This repository is being scaffolded; it is not a shipped native application or deployed backend.

## Repository boundaries

- `binder_copy`: iPhone/Expo client.
- `binder_copy_desktop`: native macOS client.
- `binder_copy_backend`: authoritative shared service and versioned contracts.
- Frozen PWA: `F:/Desktop/new_proto/binder_app`, baseline `f35163d346de9b5b005ece9033d6675a91350d70`; never edit it for this port.
- Durable handoff: `F:/Desktop/new_proto/BinderCopy-native-port-handoff-2026-10-07/START_HERE.md`.

Remote: https://github.com/gmbrocha/binder_copy_desktop

## Development

Run `npm run verify:docs`. Run `npm run setup:hooks` after cloning to enable the state-maintenance commit guard. Native/service setup commands will be added with the implementation and verified, not guessed. No provider keys are needed for scaffold checks. Do not commit secrets, runtime data or signing material.
