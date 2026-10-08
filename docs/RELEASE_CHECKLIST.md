# TestFlight release gates

- [x] Source provenance, dependency pins and API compatibility recorded (frozen PWA f35163d; contract 0.1.0/backend b04e673).
- [ ] Product parity and mobile/desktop visual/accessibility checks pass.
- [x] API account boundaries/roles and save/Undo unit checks pass; actual signed Mac persistence is still pending.
- [ ] Free accounts make no paid calls; paid reservations/idempotency/recovery verified.
- [x] Native VPS API runs independently of the owner's PC; restore rehearsal passes. Legacy PWA migration is separate and pending.
- [x] Actual iPhone and universal macOS distribution archives/export pass.
- [x] Actual signing/team/bundle IDs and App Store Connect records verified.
- [ ] Privacy, deletion, rights, permissions and beta review requirements satisfied.
- [ ] Beta binaries uploaded; processing/review and tester availability confirmed separately.

Repository-specific evidence will be linked as implementation lands. Do not check gates based solely on another repo's README.

## Owner internal beta checkpoint — October 8
Mac archive/export 37732288421 at f6f04d0 passed universal arm64/x86_64, signed sandbox/Keychain entitlements, production endpoints and credential scanning. Local exact-private-credential comparison passed on 58 archive files. Installer is 9,646,198 bytes, SHA-256 33346b11b338636c7a44e7213535c4b8bb940ec94d776706d4225fcc5562a840. Apple upload 0891ef7d-af56-4616-a493-8b36eedef540 is processing; this is not tester availability.

Only the account holder is in the internal engineering beta. This enables actual installation/login testing and does not clear the unchecked broader-distribution gates. iPhone is IN_BETA_TESTING, owner invited. Mac signed runtime remains pending in 37733468982; earlier macOS 26 Intel failure was blocked inside the runner's IconServices service, with evidence retained.
