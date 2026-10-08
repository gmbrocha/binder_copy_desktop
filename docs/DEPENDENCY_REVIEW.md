# Native dependency review — 2026-10-07

The native dependency audits contain build-tool advisories. A passing compile does not clear them. Do not run `npm audit fix --force`: its suggested Expo/React Native downgrades break the selected native stack.

| Dependency / advisory | Observed use and disposition |
| --- | --- |
| braces 3.0.3 / GHSA-vfj7-8cjw-p6xm | Metro build-time glob expansion. Latest registry release is affected and no patched version is published. Inputs are repository build patterns, not customer searches. Keep Metro loopback-only; revisit upstream before public release. |
| node-forge 1.4.0 / GHSA-86w9-cpqp-85rv | Expo CLI signing/certificate tooling; no patched release listed in this review. Backend JWT verification uses jose, not forge. Expo OTA updates are not configured. Review the affected verification path before enabling update signing; do not treat local build success as remediation. |
| uuid 7.0.3 via xcode 3.0.1 / GHSA-w5hq-g745-h8pq | The installed pbxProject uses v4() without a caller-supplied buffer. The advisory describes other versions/operations with supplied buffers. Native application IDs use Expo Crypto or NSUUID. No forced major transitive override applied without a native compatibility check. |

This is a scoped triage, not a zero-vulnerability claim. Repeat the audit against the final lockfiles before signing. Do not expose development servers publicly or process untrusted build configuration. Source and native JavaScript artifacts are separately scanned for the actual copied provider credentials; scans pass.

References: https://github.com/advisories/GHSA-vfj7-8cjw-p6xm, https://github.com/advisories/GHSA-86w9-cpqp-85rv, https://github.com/advisories/GHSA-w5hq-g745-h8pq.

## React Native macOS paragraph accessibility

Pinned react-native-macos 0.83.0 includes an unconditional isAccessibilityElement=NO in RCTParagraphComponentView while excluding the iOS paragraph accessibilityElements provider on macOS. Run 37717058682 showed all plain text absent from the native AX tree. scripts/patch-macos-accessibility.mjs applies a macOS-only superclass check on install, fails on a version/source mismatch and is idempotent. iOS behavior is unchanged. Review/remove this correction when upgrading; native screenshot/AX validation remains required.

The initial paragraph native patch also required the JS Text platform default: RN macOS fell through to undefined accessible. The guarded installer now adds macOS accessible !== false to both Text render paths, preserving explicit opt-out. Native tests explicitly require the Build a page heading in AX. Fabric Modal creation also failed on the actual runner; the app uses its own AppKit-backed RN view dialog host rather than depending on that unsupported path.
