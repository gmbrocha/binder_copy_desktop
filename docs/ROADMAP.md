# Roadmap

**Current distribution decision (October 11): TestFlight only.** App Store submissions are rejected; owner does not want resubmission or withdrawal work. Historical public/unlisted and PWA retirement tasks below remain inactive. Await Sagar's renewed Apple team-invitation acceptance before completing internal tester enrollment.

**Latest delivery:** approved card-agnostic analysis and seven-pass seam repair are live on backend 88fea1b and both TestFlight 1.1.0 (14) builds. Native creation, Keep and no-charge reopening checks passed. See CURRENT_STATE.md and backend docs/SURROUND_BUILD_14.md. Further duplicated-element refinement is deferred to local follow-up; older release instructions below are historical.

**October 11 delivered:** art-surround start flow, original artwork cache restoration, and iPhone/Mac TestFlight 1.1.0 (13). See CURRENT_STATE.md for release evidence. The historical tasks below are not an instruction to resume public/unlisted submission changes or PWA retirement.

**Current priority:** free unlisted iPhone/macOS release; see the latest DECISIONS.md and CURRENT_STATE.md. Earlier commercial activation and Mini-only backlog instructions below are superseded.

1. Establish documentation, state maintenance, source provenance and contract boundaries.
2. Resume existing VPS access; prepare Linux backend and isolated paid-disabled staging.
3. Verify baseline backend parity, restore and CPU search performance; migrate hosting with one writer.
4. Add stable accounts, permissions and customer auth; zero-spend free tier and durable metering.
5. Prove iPhone and macOS native dependencies/build access; implement login/search/fill/save/reopen slice.
6. Complete builder, drag/Undo, colors/photo/theme proposals, preview/art/export, private Library and shared curation parity.
7. Implement sandbox purchases when commercial decisions are ready; prepare privacy/deletion/signing requirements.
8. Build and upload iPhone/macOS betas to TestFlight; verify availability and record exact versions.

Immediate repository task: finish the free unlisted release under UNLISTED_RELEASE.md in the backend repository. Monthly person-based metering and the supported image model are live; finish native verification, truthful App Review metadata and reviewer access, then submit for review and request unlisted distribution. Preserve the historical commercial implementation without exposing purchase offers. See CURRENT_STATE.md for exact evidence and blockers.

Use CURRENT_STATE.md for the live work queue. Changes in order may be justified by access/dependencies; record reasons without dropping required gates.

Deferred October 8: a local supported-image-model cost/quality benchmark is tracked in the shared backend's docs/ROADMAP.md. It is independent of this native build; do not switch models or make paid benchmark calls as part of release 8.


## Card surround - October 10 source checkpoint

Runner, authenticated jobs and iPhone/macOS source option implemented. See backend docs/CARD_SURROUND.md. Next: bounded production-provider pilot, stage/restore checks and native interaction verification before enabling the feature and scheduling a release. Existing Apple submission remains unchanged.

## October 11 completed beta delivery

Card-art surround replaces card-color generation; the original persistent artwork cache is restored and warmed. Both TestFlight 1.1.0 (13) builds are available. Await owner testing and a new instruction; do not automatically resume the historical queue above. See backend docs/ART_SURROUND_BETA.md.
