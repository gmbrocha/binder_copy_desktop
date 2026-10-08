# BinderCopy macOS

Native macOS client for the shared BinderCopy service. React Native macOS 0.83.0 / React Native 0.83.10, with an Objective-C++ Keychain/photo/file bridge and AppKit-backed dialogs.

Start with [CURRENT_STATE](CURRENT_STATE.md), [agent instructions](AGENTS.md), [architecture](docs/ARCHITECTURE.md), [verification](docs/VERIFICATION.md) and [release gates](docs/RELEASE_CHECKLIST.md). Build / Cards / Library is the accepted navigation; Settings lives behind the gear.

## Development

Use Node 22.22.2 and `npm ci`, then `npm run setup:hooks`. Run `npm test`, `npm run typecheck`, `npm run verify:boundary` and `npm run verify:docs`. Native compilation/signing requires Xcode; manual GitHub workflows retain evidence. Repository package versions and Apple build numbers are separate.

Public configuration is documented in `.env.example` and `docs/NATIVE_AUTH.md`. Never load copied server keys into the client. Contracts are checked-in backend snapshots; no sibling imports exist at runtime.

## Repositories and baseline

- binder_copy: iPhone / Expo.
- binder_copy_desktop: native macOS.
- binder_copy_backend: API, schemas, authorization, catalog and operations.

Frozen PWA: F:/Desktop/new_proto/binder_app at f35163d346de9b5b005ece9033d6675a91350d70. Preserve it. The native API runs separately on OVH; legacy private PWA content has not been migrated. Native beta paid calls are disabled.
