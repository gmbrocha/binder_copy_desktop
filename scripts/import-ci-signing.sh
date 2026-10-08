#!/bin/bash
set -euo pipefail
# No shell tracing: these environment variables contain encrypted signing material.
[[ "$GITHUB_REPOSITORY" == gmbrocha/binder_copy_desktop && "$GITHUB_REF" == refs/heads/main ]]
: "${MAC_DEVELOPMENT_P12:?Missing development certificate}"
: "${SIGNING_PASSWORD:?Missing signing password}"
: "${MAC_DEVELOPMENT_PROFILE:?Missing development profile}"
actual_udid="$(ioreg -rd1 -c IOPlatformExpertDevice | awk -F '\"' '/IOPlatformUUID/{print $(NF-1)}')"
[[ "$actual_udid" == 4203018E-580F-C1B5-9525-B745CECA79EB ]] || { echo 'Unexpected test Mac identity'; exit 1; }
umask 077
keychain="$RUNNER_TEMP/bindercopy-signing.keychain-db"
p12="$RUNNER_TEMP/bindercopy-development.p12"
profile="$RUNNER_TEMP/bindercopy-profile.provisionprofile"
printf '%s' "$MAC_DEVELOPMENT_P12" | base64 --decode > "$p12"
printf '%s' "$MAC_DEVELOPMENT_PROFILE" | base64 --decode > "$profile"
security create-keychain -p "$SIGNING_PASSWORD" "$keychain"
security set-keychain-settings -lut 21600 "$keychain"
security unlock-keychain -p "$SIGNING_PASSWORD" "$keychain"
printf "Importing application identity\n"
security import "$p12" -P "$SIGNING_PASSWORD" -A -t cert -f pkcs12 -k "$keychain"
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
security cms -D -i "$profile" > "$RUNNER_TEMP/bindercopy-profile.plist"
uuid="$(/usr/libexec/PlistBuddy -c 'Print UUID' "$RUNNER_TEMP/bindercopy-profile.plist")"
team="$(/usr/libexec/PlistBuddy -c 'Print TeamIdentifier:0' "$RUNNER_TEMP/bindercopy-profile.plist")"
[[ "$team" == L349AVQ22W ]]
for directory in "$HOME/Library/MobileDevice/Provisioning Profiles" "$HOME/Library/Developer/Xcode/UserData/Provisioning Profiles"; do
  mkdir -p "$directory"
  cp "$profile" "$directory/$uuid.provisionprofile"
done
printf 'MAC_PROFILE_UUID=%s\n' "$uuid" >> "$GITHUB_ENV"
printf 'MAC_SIGNING_IDENTITY=Apple Development: Created via API (7QPC2737Q6)\n' >> "$GITHUB_ENV"
security find-identity -v -p codesigning "$keychain"
rm -f "$p12"
