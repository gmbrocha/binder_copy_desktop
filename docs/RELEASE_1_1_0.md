# Native release evidence

## 1.1.0 build 4 — October 8, 2026

Both platforms are VALID / IN_BETA_TESTING in the existing private internal group ba56be7f-b9ef-4031-b191-a677f79a0edd. Readback found one tester in this group; no public link, new external group or broader access was created. Sagar's prior team invitation is not proof of acceptance or membership here.

| Platform | Source | Signed archive run | Apple build | Package SHA-256 |
| --- | --- | --- | --- | --- |
| iPhone 1.1.0 (4) | fc6203a | 37821787575 | fcc7eedd-c80d-4ff5-a6f0-d6dfb1e29f59 | 8606395a8528bfde6b20a9cd2840cc7460f1ef114c84766f0695f0a9168a53db |
| macOS 1.1.0 (4) | 08bd960 | 37821792293 | e760f81f-c048-453e-bc43-1f181002781b | 1762dd67f0a6e858b506d9d6cab1f0976f4ed8aecc6276c633e78eb7e5b8d9d9 |

Both signed workflows passed client tests/typecheck, contract and credential boundaries, native compilation, signatures and entitlements. Mac includes arm64 and x86_64. Local downloaded packages matched version/build/bundle/public endpoints and passed decoded-bundle credential inspection. Existing build 3 remains available. This is internal beta availability, not public App Store approval, installation proof or actual StoreKit purchase acceptance.

Release notes explain account/credit foundations and private Settings usage history. New purchase offers and paid generation remain off. The live shared API is 91d35e9382c19b4be208733fbcc3b1f4346871ad; both staging and production passed 90 tests/typecheck with backup, atomic promotion and health checks. Sandbox signed TEST notification delivered successfully; actual purchase lifecycle remains pending.

For actual purchase acceptance and financial gates, use backend docs/STOREKIT_ACCEPTANCE.md and docs/PAID_LAUNCH_READINESS.md.
