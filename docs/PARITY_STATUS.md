# Native parity checkpoint

Frozen reference: f35163d. Full ports remain the objective. This inventory distinguishes implementation from native/device proof; an entry here is not a TestFlight release claim.

| Workflow | Implemented | Still required |
| --- | --- | --- |
| Build / Cards / Library | Native navigation, bounded builder, adaptive catalog grid | Visual comparison on actual iPhone and Mac, full responsive polish |
| Identity | Supabase email-code screen, secure sessions, protected images, logout | Live project/email provider, Apple sign-in, account deletion, founder linking |
| Manual pages | Named identity, sizes, slots, locks, save, Undo, reopen | Local draft recovery and conflict recovery UI; size-change confirmation |
| Generation | Favorite/card colors/photo/theme, preview, shuffle, keep, regenerate | Native end-to-end tests; source replacement/clear controls |
| Photo colors | Local thumbnail extraction, server receives only hex colors | Real iOS Photos and macOS file-panel verification |
| Reordering | 350 ms hold, inner-60% swap trigger, return animation; manual Move alternative | Real touch/mouse/keyboard interaction verification |
| Appearance | Deterministic palettes, original title font/geometry | Generated backdrop preview/keep/reset and capability handling |
| Export | Backend PNG and missing CSV; native share/save adapters | Native file/share verification, visual equality of preview/export |
| Card details | Metadata, ownership, prices, shared tag editing, history/Undo, conflict reload | Full catalog filters, search interpretation/mapping, shared tag management |
| Library | Private pages/open and collection | Page rename/duplicate/delete controls and counts/empty states |
| Settings | Identity and catalog summary, sign out | Admin catalog refresh/status; account deletion; support/privacy links |
| Branding | Original icons, Audiowide, cream iPhone launch splash | macOS launch behavior, full icon/splash visual checks |

Unit tests cover save races, stale generation, locks, private-photo payloads, drag hit regions and auth rotation/logout. Native file panels, Keychain and gesture behavior require native runtime checks. Release signing, privacy disclosures, beta review and TestFlight availability are pending.
