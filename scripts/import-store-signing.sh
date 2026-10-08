#!/bin/bash
set -euo pipefail
[[ "$GITHUB_REPOSITORY" == gmbrocha/binder_copy_desktop && "$GITHUB_REF" == refs/heads/main ]]
: "${APPLE_DISTRIBUTION_P12:?Missing app certificate}"
: "${MAC_INSTALLER_P12:?Missing installer certificate}"
: "${SIGNING_PASSWORD:?Missing signing password}"
: "${MAC_STORE_PROFILE:?Missing App Store profile}"
umask 077
keychain="$RUNNER_TEMP/bindercopy-signing.keychain-db"
printf '%s' "$APPLE_DISTRIBUTION_P12" | base64 --decode > "$RUNNER_TEMP/bindercopy-distribution.p12"
printf '%s' "$MAC_INSTALLER_P12" | base64 --decode > "$RUNNER_TEMP/bindercopy-installer.p12"
printf '%s' "$MAC_STORE_PROFILE" | base64 --decode > "$RUNNER_TEMP/bindercopy-store.provisionprofile"
security create-keychain -p "$SIGNING_PASSWORD" "$keychain"
security set-keychain-settings -lut 21600 "$keychain"
security unlock-keychain -p "$SIGNING_PASSWORD" "$keychain"
for p12 in "$RUNNER_TEMP/bindercopy-distribution.p12" "$RUNNER_TEMP/bindercopy-installer.p12"; do
  printf "Importing application identity\n"
security import "$p12" -P "$SIGNING_PASSWORD" -A -t cert -f pkcs12 -k "$keychain"
done
curl --fail --silent --show-error https://www.apple.com/certificateauthority/AppleWWDRCAG3.cer -o "$RUNNER_TEMP/bindercopy-wwdr.cer"
# The image may already contain this public intermediate. Accept an existing
# copy only after comparing its complete DER bytes, not merely its common name.
printf 'Checking Apple intermediate certificate\n'
security find-certificate -a -p "$keychain" > "$RUNNER_TEMP/bindercopy-public-certificates.pem"
if ! python3 - "$RUNNER_TEMP/bindercopy-public-certificates.pem" "$RUNNER_TEMP/bindercopy-wwdr.cer" <<'PY'
import base64, pathlib, re, sys
certificates = re.findall(rb'-----BEGIN CERTIFICATE-----(.*?)-----END CERTIFICATE-----', pathlib.Path(sys.argv[1]).read_bytes(), re.S)
expected = pathlib.Path(sys.argv[2]).read_bytes()
sys.exit(0 if any(base64.b64decode(cert) == expected for cert in certificates) else 1)
PY
then
  security import "$RUNNER_TEMP/bindercopy-wwdr.cer" -k "$keychain"
fi
printf 'Configuring private-key access and provisioning profile\n' 
security list-keychains -d user -s "$keychain" "$HOME/Library/Keychains/login.keychain-db"
security set-key-partition-list -S apple-tool:,apple:,codesign: -s -k "$SIGNING_PASSWORD" "$keychain" >/dev/null
security cms -D -i "$RUNNER_TEMP/bindercopy-store.provisionprofile" > "$RUNNER_TEMP/bindercopy-profile.plist"
uuid="$(/usr/libexec/PlistBuddy -c 'Print UUID' "$RUNNER_TEMP/bindercopy-profile.plist")"
[[ "$(/usr/libexec/PlistBuddy -c 'Print TeamIdentifier:0' "$RUNNER_TEMP/bindercopy-profile.plist")" == L349AVQ22W ]]
[[ "$(/usr/libexec/PlistBuddy -c 'Print Entitlements:com.apple.application-identifier' "$RUNNER_TEMP/bindercopy-profile.plist")" == L349AVQ22W.com.clearpathsystems.bindercopy ]]
for directory in "$HOME/Library/MobileDevice/Provisioning Profiles" "$HOME/Library/Developer/Xcode/UserData/Provisioning Profiles"; do
  mkdir -p "$directory"
  cp "$RUNNER_TEMP/bindercopy-store.provisionprofile" "$directory/$uuid.provisionprofile"
done
printf 'MAC_STORE_PROFILE_UUID=%s\n' "$uuid" >> "$GITHUB_ENV"
security find-identity -v -p codesigning "$keychain"
rm -f "$RUNNER_TEMP/bindercopy-distribution.p12" "$RUNNER_TEMP/bindercopy-installer.p12"
