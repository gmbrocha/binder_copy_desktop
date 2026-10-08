# Native parity checkpoint

Frozen reference: f35163d. Full ports remain the objective. Implementation is distinct from actual native interaction proof.

| Workflow | Implemented | Remaining proof or work |
| --- | --- | --- |
| Navigation and visual system | Build / Cards / Library, fixed chrome, bounded desktop builder, equal-width catalog grids, shared type/color roles | Compare every view to accepted PWA on actual iPhone/Mac; refine native layout |
| Identity | Email-code UI, secure sessions, token rotation, protected images, local logout | Live Supabase, production API, founder linking, live account deletion and restore handling, Apple sign-in if used |
| Manual pages | Name/identity, sizes, locks, tap/manual move, long-hold swap, save/Undo, resize confirmation | Device touch/keyboard/drag proof and complete source/zoom controls |
| Recovery | Encrypted account-scoped draft journal, interrupted-write protection, restore/discard; retry/save-copy/reload for conflicts | Native crash/background/Keychain tests; offline launch currently needs bootstrap access |
| Generation | Favorite/card colors/photo/theme; preview/shuffle/keep; stale results and locks protected; clear inspiration | Native end-to-end interaction and exact source presentation |
| Photo | Local bounded extraction on both platforms; server receives only colors | Actual Photos/file-panel tests |
| Appearance | Compact palette chooser, artwork suggestions, background preview/keep/reset; same request ID on uncertain retry; original font/logo | Capability-gated live service, image preview/export visual comparison, fallback behavior |
| Export | Backend PNG/CSV with native iOS share sheet and Mac save panel | Native files/share verification and export tooltip polish |
| Cards | Filters, search interpretation, optional shared mappings, ownership, prices, tags/history/Undo, stale edit recovery | Native all-filter checks; real image loading/performance |
| Shared tags | Create/edit/aliases/category/delete; expected snapshot for conflict safety | Native UI verification, backend 59a75a3 or newer required for guard |
| Library | Private pages and collection; rename/duplicate/delete, counts/empty state | Native workflows; thumbnails now implemented |
| Settings | Identity/catalog summary, admin refresh/status, sign out and conditional account deletion | Native refresh/deletion interaction, privacy/support URLs, production auth |
| Branding | Original assets, Audiowide, clear lock icons, cream iPhone splash, full Mac icon set | Actual launch/resize/status-bar checks |
| Release | Actual unsigned Xcode builds on both platforms | Signing, production cutover, privacy disclosures, beta review, TestFlight availability |

iPhone has 14 passing unit tests; Mac has 15. Tests cover save races, stale proposals, locking, local photo payloads, drag hit regions, auth rotation/logout, account-isolated atomic draft storage and safe backdrop retries. iPhone simulator photo/share and page regression flows pass. Mac native details/filter/heading/Library controls pass, but secure-storage failure blocks saved-page reopening and the media extension. Neither substitutes for real backend/auth, correctly signed Keychain or physical-device checks.

