# Native release evidence

## 1.1.0 build 5 - October 8, 2026

Much lighter Mist/Ocean/Peach/Sage/Lilac presets and arbitrary custom solid colors are available on Free. Preview, saved thumbnails and PNG export resolve the same page color; light pages use the existing dark wordmark. Custom colors use no provider call or credit. See CUSTOM_COLORS.md.

Both platforms are VALID / IN_BETA_TESTING in existing private internal group ba56be7f-b9ef-4031-b191-a677f79a0edd. Readback confirmed one tester. No new access or public distribution was created. Physical installation/acceptance of build 5 remains unverified.

| Platform | Runtime source | Signed archive run | Apple build | Package SHA-256 |
| --- | --- | --- | --- | --- |
| iPhone 1.1.0 (5) | 8bd8201 | 37830778717 | 14278cbe-4ccc-491e-a52d-e96e7e370ddb | bb99dc84a5795d317b9d700c8dcd40f001493dd5f88295302c472840954b92c2 |
| macOS 1.1.0 (5) | b8c7e13 | 37830531204 | c6b387ca-76f6-4f54-a996-ced13f1cbb14 | 021ba5d49f21ab171ec53a291be2e0680e5863b0d7bddf891fa7f5df7a444adb |

Both signed archives passed tests/typecheck (23 iPhone, 24 Mac), native compilation, credential/contract boundaries and signature/entitlement checks. Mac includes arm64 and x86_64. Downloaded packages were checked for version/build/bundle, public endpoints and decoded bundle credentials. Shared contract 0.2.2 snapshots are pinned to backend 4cdf8e84aed28d4c10d06a20a30394c4065e8ced.

Live backend runtime 8006c767913467b2c660e45602772c3a04e6cc7a passed 92 tests and typecheck on Windows and Linux, isolated staging and backed-up production promotion. Public API probes with disposable free identities verified canonical save/reopen, exact custom-color PNG pixels, real card PNG/CSV export, privacy, paid denial and cleanup. Export appearance was visually reviewed. No new paid AI call was made.

Native UI limits: iPhone run 37830130469 passed baseline and photo/share flows, but the new color script missed scrolling to Apply. Corrected run 37832199099 did not start: GitHub reported failed account payments or spending limit. This is an outstanding UI check, not a passing check. Mac run 37830138184 passed the workspace/persistence flow but the added color test used a phone-only selector; corrected inline-picker run 37832987903 is in progress. Later client commits change tests/documentation only; archived runtime sources above remain exact.

Purchase offers and paid provider dispatch remain off. Internal beta availability does not establish real StoreKit purchase acceptance or public commercial approval. Earlier build 4 remains available.

## 1.1.0 build 4 — October 8, 2026

Both platforms are VALID / IN_BETA_TESTING in the existing private internal group ba56be7f-b9ef-4031-b191-a677f79a0edd. Readback found one tester in this group; no public link, new external group or broader access was created. Sagar's prior team invitation is not proof of acceptance or membership here.

| Platform | Source | Signed archive run | Apple build | Package SHA-256 |
| --- | --- | --- | --- | --- |
| iPhone 1.1.0 (4) | fc6203a | 37821787575 | fcc7eedd-c80d-4ff5-a6f0-d6dfb1e29f59 | 8606395a8528bfde6b20a9cd2840cc7460f1ef114c84766f0695f0a9168a53db |
| macOS 1.1.0 (4) | 08bd960 | 37821792293 | e760f81f-c048-453e-bc43-1f181002781b | 1762dd67f0a6e858b506d9d6cab1f0976f4ed8aecc6276c633e78eb7e5b8d9d9 |

Both signed workflows passed client tests/typecheck, contract and credential boundaries, native compilation, signatures and entitlements. Mac includes arm64 and x86_64. Local downloaded packages matched version/build/bundle/public endpoints and passed decoded-bundle credential inspection. Existing build 3 remains available. This is internal beta availability, not public App Store approval, installation proof or actual StoreKit purchase acceptance.

Release notes explain account/credit foundations and private Settings usage history. New purchase offers and paid generation remain off. The live shared API is 91d35e9382c19b4be208733fbcc3b1f4346871ad; both staging and production passed 90 tests/typecheck with backup, atomic promotion and health checks. Sandbox signed TEST notification delivered successfully; actual purchase lifecycle remains pending.

For actual purchase acceptance and financial gates, use backend docs/STOREKIT_ACCEPTANCE.md and docs/PAID_LAUNCH_READINESS.md.
