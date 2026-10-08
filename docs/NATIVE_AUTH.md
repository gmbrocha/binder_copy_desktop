# Native authentication

Email-code UI and the official Supabase session client are synchronized with the iPhone implementation. Configure the Xcode build settings BINDERCOPY_API_URL, BINDERCOPY_AUTH_URL and BINDERCOPY_PUBLISHABLE_KEY. Info.plist exposes only these public configuration values. Provider/admin keys are rejected; copied PWA .env.local remains ignored and is never loaded by Metro.

BinderCopySystem stores sessions using the macOS data-protection Keychain, with WhenUnlockedThisDeviceOnly accessibility and a fixed application service. Tokens are not saved in UserDefaults or files. Storage failures reject the operation. This adapter still requires signed native runtime verification; an unsigned build is not proof of Keychain behavior.

Release builds fail closed without HTTPS API/auth configuration. Only debug loopback builds may use private staging preview identity. All API and artwork requests obtain a current bearer token. Sign out revokes the backend session before provider local-device logout; the workspace remounts on account changes to clear private in-memory state.

Pending live gates: Supabase project access, email OTP template/sender, backend issuer, actual signed Keychain/login/refresh/logout verification, Apple sign-in, account deletion and founder linking. The identical TypeScript suite covers configuration rejection, concurrent token refresh and local logout in both repositories.

References: [Supabase email OTP](https://supabase.com/docs/guides/auth/auth-email-passwordless), [sessions](https://supabase.com/docs/guides/auth/sessions).
