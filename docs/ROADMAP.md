# Roadmap

1. Establish documentation, state maintenance, source provenance and contract boundaries.
2. Resume existing VPS access; prepare Linux backend and isolated paid-disabled staging.
3. Verify baseline backend parity, restore and CPU search performance; migrate hosting with one writer.
4. Add stable accounts, permissions and customer auth; zero-spend free tier and durable metering.
5. Prove iPhone and macOS native dependencies/build access; implement login/search/fill/save/reopen slice.
6. Complete builder, drag/Undo, colors/photo/theme proposals, preview/art/export, private Library and shared curation parity.
7. Implement sandbox purchases when commercial decisions are ready; prepare privacy/deletion/signing requirements.
8. Build and upload iPhone/macOS betas to TestFlight; verify availability and record exact versions.

Immediate repository task: finish 1.1.0 native subscription/consumable acceptance and private usage presentation under the approved monetization plan. Both 1.1.0 (5) builds are available internally; backend 8006c76 is live with Sandbox verification but purchase offers and paid dispatch off. See CURRENT_STATE.md for exact gates.

Use CURRENT_STATE.md for the live work queue. Changes in order may be justified by access/dependencies; record reasons without dropping required gates.

Deferred October 8: a local supported-image-model cost/quality benchmark is tracked in the shared backend's docs/ROADMAP.md. It is independent of this native build; do not switch models or make paid benchmark calls as part of release 8.
