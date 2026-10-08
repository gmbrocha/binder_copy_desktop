require 'xcodeproj'
abort 'Only BinderCopy main may use release signing' unless ENV['GITHUB_REPOSITORY'] == 'gmbrocha/binder_copy_desktop' && ENV['GITHUB_REF'] == 'refs/heads/main'
project = Xcodeproj::Project.open('macos/binder-copy-desktop.xcodeproj')
app = project.targets.find { |target| target.name == 'binder-copy-desktop-macOS' }
abort 'BinderCopy application target missing' unless app
app.build_configurations.each do |configuration|
  configuration.build_settings.merge!({
    'CODE_SIGN_STYLE' => 'Manual', 'DEVELOPMENT_TEAM' => 'L349AVQ22W',
    'CODE_SIGN_IDENTITY' => 'Apple Distribution: Clearpath Systems LLC (L349AVQ22W)',
    'PROVISIONING_PROFILE_SPECIFIER' => ENV.fetch('MAC_STORE_PROFILE_UUID'),
    'CODE_SIGN_INJECT_BASE_ENTITLEMENTS' => 'NO'
  })
end
project.save
# Local Metro/fixture allowances are for Debug only, never the store archive.
plist = 'macos/binder-copy-desktop-macOS/Info.plist'
system('/usr/libexec/PlistBuddy', '-c', 'Delete NSAppTransportSecurity', plist, exception: true)
system('/usr/libexec/PlistBuddy', '-c', 'Add ITSAppUsesNonExemptEncryption bool false', plist, exception: true)
