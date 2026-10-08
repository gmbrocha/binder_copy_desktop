# Native authentication

The official Supabase client uses only an HTTPS project URL and publishable key. Release configuration comes from validated native Info.plist settings. Debug-only loopback may use the isolated fixture service; release has no preview fallback.

BinderCopySystem stores sessions in the Data Protection Keychain with WhenUnlockedThisDeviceOnly and the app's own signed access group. There is no plaintext fallback. Signed run 37733468982 passed storage, saved reopening and cold restart without Keychain errors.

Foreground enables refresh; concurrent requests share rotation. Artwork uses bearer headers. Backend logout revokes the session before provider local logout; account changes remount private workspace state. Account deletion purges private server data and local drafts and queues provider deletion durably.

Supabase/Zoho/public VPS configuration and actual delivered email codes pass. Full native email/recovery/account switching remains an acceptance gate. Founder identities are not yet granted roles. Email codes are the only sign-in method; Apple sign-in is not offered.
