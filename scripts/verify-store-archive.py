import os
from check_bundle_credentials import verify_bundle
import plistlib
import subprocess
from pathlib import Path

app = Path('build/BinderCopy.xcarchive/Products/Applications/binder-copy-desktop.app')
with (app / 'Contents/Info.plist').open('rb') as stream:
    info = plistlib.load(stream)
assert info['CFBundleIdentifier'] == 'com.clearpathsystems.bindercopy'
assert info['CFBundleVersion'] == os.environ['BINDERCOPY_BUILD_NUMBER']
assert info['ITSAppUsesNonExemptEncryption'] is False
assert 'NSAppTransportSecurity' not in info
for setting, key in [('BINDERCOPY_API_URL', 'BinderCopyAPIURL'), ('BINDERCOPY_AUTH_URL', 'BinderCopyAuthURL'), ('BINDERCOPY_PUBLISHABLE_KEY', 'BinderCopyPublishableKey')]:
    assert info[key] == os.environ[setting], f'Invalid public setting: {key}'
subprocess.run(['codesign', '--verify', '--deep', '--strict', str(app)], check=True)
signed = subprocess.run(['codesign', '-d', '--entitlements', ':-', str(app)], check=True, capture_output=True)
entitlements = plistlib.loads(signed.stdout)
assert entitlements['com.apple.application-identifier'] == 'L349AVQ22W.com.clearpathsystems.bindercopy'
assert entitlements['com.apple.developer.team-identifier'] == 'L349AVQ22W'
assert entitlements['com.apple.security.app-sandbox'] is True
assert entitlements['com.apple.security.network.client'] is True
assert entitlements['com.apple.security.files.user-selected.read-write'] is True
assert 'L349AVQ22W.com.clearpathsystems.bindercopy' in entitlements['keychain-access-groups']
assert entitlements.get('com.apple.security.get-task-allow') is not True
architectures = subprocess.check_output(['lipo', '-archs', str(app / 'Contents/MacOS' / info['CFBundleExecutable'])], text=True).split()
assert {'arm64', 'x86_64'}.issubset(architectures), 'Store app must support Apple Silicon and Intel'
bundle = (app / 'Contents/Resources/main.jsbundle').read_bytes()
verify_bundle(app / 'Contents/Resources/main.jsbundle')
Path('evidence').mkdir(exist_ok=True)
with Path('evidence/entitlements.plist').open('wb') as stream:
    plistlib.dump(entitlements, stream)
print('Verified universal signed BinderCopy archive, release settings and sandbox/Keychain entitlements.')
