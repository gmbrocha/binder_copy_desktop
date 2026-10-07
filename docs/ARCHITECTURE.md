# Architecture

## Repository responsibility

native macOS client using React Native macOS, with a required compatibility spike.

## Shared service contract

Backend repo owns authoritative schemas and compatibility policy. Establish a versioned consumable contract artifact or generated client with pinned version/hash. Do not import sibling checkout files in shipping builds. Keep v1 API compatibility while different native versions coexist.

## Platform boundary

Prove platform modules before broad UI port. Share domain concepts/tokens; use native adapters for gestures, secure storage, auth redirects, photos, exports and purchases. Expo mobile compatibility is not macOS compatibility.

## Dependency decisions

Pending verified implementation. Record actual pinned versions and successful build evidence here; do not assume web React versions work in native.
