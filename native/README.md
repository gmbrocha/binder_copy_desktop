# macOS native implementation

macos/ contains the Xcode project, entitlements, icons, font, AppDelegate and BinderCopySystem.mm. The bridge provides Data Protection Keychain storage, UUIDs, local image sampling and native export dialogs. BinderCopyUITests exercises signed persistence/cold restart and file panels. CI signing secrets are main-only; the Apple API key stays on the operator machine.
