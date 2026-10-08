# PWA fidelity audit and native implementation

## Accepted baseline

The owner’s installed iPhone 13 Pro PWA is the design authority. Frozen PWA application revision f35163d346de9b5b005ece9033d6675a91350d70 (checkout 000b623: handoff documentation only). Do not redesign the PWA or use older chat-era layouts as specifications. The owner authorized implementing the findings on October 8, 2026. Account/security/capability differences remain intentional.

## Evidence and limits

A read-only 60-card catalog sample and in-memory PWA store were used to run the current frozen source through WebKit. All walkthrough checks passed: favorite/shuffle/keep, manual replacement/Undo/move/ownership, Color/Art/review/keep/discard, PNG/CSV, Library/duplicate/reopen, card filters/shared edits, photo/color proposals, theme/mapping, nested dialogs and safe-area simulation. Paid image generation and interpretation were mocked; no paid calls. No production data changes or PWA source changes.

Reference captures, element geometry/typography JSON, walkthrough results, isolated compiled PWA and capture script are in the iPhone repository `.local/pwa-parity-2026-10-08/`; open its `index.html` gallery. Main captures use the iPhone 13 Pro profile (390 x 844, DPR 3) with simulated 47px top and 34px bottom insets. Desktop and 320px supplemental captures are explicitly named. The first instrumentation attempt failed because a transpiler helper leaked into the browser init function; it was fixed and the full walkthrough reran successfully. Only the final captures/results are the reference.

Windows WebKit does not reproduce the iPhone’s actual SF font rasterization, OS keyboard, status bar, Home Screen PWA lifecycle or gestures. These captures establish source structure/layout; they are not claimed to be screenshots from the owner’s phone. Existing build-2 native evidence is an actual iPhone 13 Pro simulator run (37738720783), but uses logo fixtures instead of the PWA catalog images. Pixel-perfect parity cannot be inferred from comparing different fixtures. User-supplied real-device captures remain the final authority.

## Findings and implemented corrections (native verification pending)

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

## Current checkpoint

Local iPhone 18 tests and Mac 19 tests/typechecks pass, including new stale-replacement tests. Client boundaries and iPhone bundle pass. Expanded simulator and signed Mac screenshot checks are next. TestFlight still serves build 2; no new availability claim until a verified build is uploaded and assigned. Backend runtime and paid capabilities are unchanged.

October 8 follow-up: first iPhone run 37782494271 stopped on Maestro keyboard dismissal, not a save failure. Native tests now tap Save directly, explicitly wait for splash animation, and exercise cancel/review/keep/reroll/Undo. Card details now use compact artwork, stacked icon actions, ownership chip and Place in page, with existing capability guards; picker information buttons and proposal Change restored. Actual native screenshots still pending.

Screenshot finding: iPhone 37784513314 exposed zero safe-area padding inside the full-screen Preview modal. Corrected explicit root top/bottom insets, sheet footer clearance, output lock visibility, empty-slot dashed borders and picker density. Persistence/photo/share/replacement/Undo already passed; the final navigation flow must rerun after this fix. Matched PWA/logo-fixture captures are now available in `.local/pwa-parity-2026-10-08/matched/` in the iPhone repo, separate from the real-artwork reference.
