# PWA fidelity audit and native implementation

## Accepted baseline

The ownerâ€™s installed iPhone 13 Pro PWA is the design authority. Frozen PWA application revision f35163d346de9b5b005ece9033d6675a91350d70 (checkout 000b623: handoff documentation only). Do not redesign the PWA or use older chat-era layouts as specifications. The owner authorized implementing the findings on October 8, 2026. Account/security/capability differences remain intentional.

## Evidence and limits

A read-only 60-card catalog sample and in-memory PWA store were used to run the current frozen source through WebKit. All walkthrough checks passed: favorite/shuffle/keep, manual replacement/Undo/move/ownership, Color/Art/review/keep/discard, PNG/CSV, Library/duplicate/reopen, card filters/shared edits, photo/color proposals, theme/mapping, nested dialogs and safe-area simulation. Paid image generation and interpretation were mocked; no paid calls. No production data changes or PWA source changes.

Reference captures, element geometry/typography JSON, walkthrough results, isolated compiled PWA and capture script are in the iPhone repository `.local/pwa-parity-2026-10-08/`; open its `index.html` gallery. Main captures use the iPhone 13 Pro profile (390 x 844, DPR 3) with simulated 47px top and 34px bottom insets. Desktop and 320px supplemental captures are explicitly named. The first instrumentation attempt failed because a transpiler helper leaked into the browser init function; it was fixed and the full walkthrough reran successfully. Only the final captures/results are the reference.

Windows WebKit does not reproduce the iPhoneâ€™s actual SF font rasterization, OS keyboard, status bar, Home Screen PWA lifecycle or gestures. These captures establish source structure/layout; they are not claimed to be screenshots from the ownerâ€™s phone. Existing build-2 native evidence is an actual iPhone 13 Pro simulator run (37738720783), but uses logo fixtures instead of the PWA catalog images. Pixel-perfect parity cannot be inferred from comparing different fixtures. User-supplied real-device captures remain the final authority.

## Implemented corrections

| View / interaction | Frozen PWA behavior | Native correction |
| --- | --- | --- |
| Header/navigation | 52px phone header, 150px logo, 64px bottom tabs with active icon pill | Removed oversized 64px/176px phone header and tab underline; exact PWA icon paths bundled at 1x/2x/3x |
| Page title | Tappable title with pencil; dedicated name/save sheet | Replaced inline editing with explicit name dialog; identity/autosave safeguards retained |
| Empty builder | Start from; four compact icon tiles; Or fill it by hand | Restored hierarchy, icons, 60px phone tiles and compact grid selector |
| Kept builder | Source strip, unlocked count, Regenerate; icon Undo/Zoom | Restored compact strip, disabled all-locked generation and icon toolbar |
| Card sheet | Untouched artwork, dashed empty slots, small lock badge | Removed thick colored card borders and oversized always-on lock controls; locking available in the slot tray |
| Selected slot | Card identity/ownership and compact lock/replace/reroll/move/remove tools | Restored dedicated tray; hides Preview dock while selected |
| Replace / Reroll | Review candidate before Keep this card; Cancel leaves page intact | Added staged replacement and reroll flow, suggestions, stale/locked safeguards and regression tests |
| Manual placement | Place card, highlight next empty slot | Selection advances without opening another picker automatically |
| Generation proposal | Your page, together; source; unchanged-until-kept; fixed Shuffle/Keep footer | Added proposal structure and fixed actions outside scrolling sheet |
| Preview/export | Dedicated Preview header/back; Backdrop; five swatches; Match my cards; fixed export dock | Replaced older Appearance dropdown and generic Done screen; full-screen native preview with safe-area wrapper |
| Paid backdrop review | Art mode, review before Keep, retry same uncertain request | Presentation restored; capability gate and conservative request IDs retained; no paid calls in this pass |
| Cards / picker | Search + horizontal filter chips; phone Cards 2 columns, picker 3 | Restored current frozen layout (supersedes earlier three-column-everywhere assumption), metadata captions and theme/art/ownership controls |
| Library | Pages/Collection segments; two-column page thumbnails; compact more menu | Replaced row list and duplicate heading; restored full thumbnail grid, page lettering and logo |
| Desktop | Bounded builder/sidebar; wide adaptive catalog; small controls | Same component correction with native Mac dialog host retained; 300px sidebar and 120px minimum catalog tracks |
| Theme | Start from a theme, search/filter controls, Generate from this | Replaced disconnected bare text field with the shared search controls |

## Verification gates

1. Keep baseline data, account role, page name/size/colors/slots/locks, viewport, safe area, font scale and scroll position explicit. Fix the clock and disable animations where feasible for repeatable images. Never approve parity against mismatched content.
2. PWA: capture empty/filled/selected/zoomed builder; favorite/color/photo/theme entry and proposal; replacement; preview/color/art; Cards/picker/filter/details; Library/pages/collection; Settings and relevant curator views. Capture loading/error/disabled states separately.
3. Native iPhone: run Maestro on the actual iPhone 13 Pro simulator, exercise the same actions, capture screenshots at each named checkpoint. Existing workflow now includes `native-parity.yaml` in addition to persistence and native photo/share tests. Retain behavior assertions when updating labels.
4. Native Mac: run AppKit/XCTest on macOS with the desktop PWA at the same content/window size as its reference. Verify native open/save panels, keyboard and persistence in addition to visual review. A phone simulator is not a Mac UI test.
5. Inspect screenshot pairs for geometry, type hierarchy, icon/selection treatment, density, scrolling, modal chrome and fixed actions. Use region/geometry checks and visual review before attempting pixel diffs across different renderers. Establish native golden images after owner approval, then use same-renderer image diffs for regressions.
6. Check free/user/curator/admin capability variants. Free accounts make no paid calls; curation stays server-authorized; catalog administration remains admin-only. Account sign-in/recovery/deletion and system pickers/share sheets may intentionally differ from the PWA.
7. Ask the owner to verify on the physical iPhone: installed PWA versus TestFlight, same font/display zoom settings, keyboard/gestures/safe areas and background/foreground. Do not call this physical acceptance complete from simulator results.

Android emulation on Windows is useful for broad shared-layout checks only. It is not an iOS fidelity gate. Use macOS iOS Simulator/CI for authoritative native iOS layout and native macOS for the Mac app. No Android port or hosted Mac rental was added.

## Current checkpoint — October 8, 2026

- iPhone application source **84fcff80d0644f9bceb246f5f926467de1177e20** passed all three native iPhone 13 Pro / iOS 26.4 simulator flows in **37787120817**. Naming, favorite generation, lock/save/reopen/ownership, Photos/colors/share, replacement cancel/reroll/Keep/Undo, Preview/back, filters, Library and Settings passed. Screenshots reviewed against the frozen PWA. Signed archive **37787125805** passed; **1.0.0 (3)** is VALID / IN_BETA_TESTING, Apple **007bb941-a4e9-49ab-8f61-698f75178013**.
- Mac source **0ab358d** is under signed native verification **37791906880** and universal archive **37791911701**. It adds a compact name dialog, readable palette labels and right-aligned zoom. Mac TestFlight still serves build 2 until this candidate passes and is uploaded.
- Local checks: 18 iPhone and 19 Mac tests, both typechecks and client/contract boundaries pass. Existing backend 54-test evidence remains applicable; no backend runtime change.
- Real-artwork reference: `index.html`; matching fixture captures: `matched/`; embedded side-by-side report: `comparison.html`, all under the iPhone ignored `.local/pwa-parity-2026-10-08/` evidence directory. Matching reference capture now passes at 390x844 and desktop 1280x720/1440x1000.
- No paid AI calls, PWA edits or production private-data changes. Existing account capabilities and disabled paid dispatch are unchanged. Physical owner acceptance remains pending; these results do not establish pixel-perfect parity or physical gesture acceptance.

## Failures found and resolved during verification

The first iPhone run (37782494271) stopped at an unsupported Maestro keyboard-dismiss action. The test now uses the real Save/Done controls and waits for the splash. The next run (37784513314) passed persistence and photo/share but exposed Preview controls under the status bar. Explicit root safe-area insets fixed that real UI defect; final run 37787120817 passes. Empty-slot borders, preview-only lock visibility and picker density were corrected during screenshot review. Superseded packages were not uploaded.

Mac run 37787134816 passed native photo generation and exact saved PNG verification, but the workspace test checked the name field immediately after portal opening. The captured screen showed the dialog/field present. The retry explicitly waits for the field, retains value/persistence assertions, and captures name/details/filter/proposal screens. Its result must be recorded separately when complete.
