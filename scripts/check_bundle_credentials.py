import re
import subprocess
import sys
from pathlib import Path


def verify_bundle(path):
    data = Path(path).read_bytes()
    if data[:8] == bytes.fromhex('c61fbc03c103191f'):
        executable = 'win64-bin/hermesc.exe' if sys.platform == 'win32' else 'osx-bin/hermesc'
        candidates = [Path('ios/Pods/hermes-engine/destroot/bin/hermesc'), Path('macos/Pods/hermes-engine/destroot/bin/hermesc'), Path('node_modules/hermes-compiler/hermesc') / executable]
        compiler = next(candidate for candidate in candidates if candidate.is_file())
        result = subprocess.run([str(compiler.resolve()), '-b', '-dump-bytecode', str(path)], capture_output=True, check=True)
        # Hermes packs adjacent strings without terminators. Scan its decoded
        # string table, otherwise the SDK's bare sb_secret_ prefix joins the next
        # unrelated identifier and looks like a credential.
        strings = re.findall(rb'^[si][0-9]+\[[^\]]+\]: (.*)$', result.stdout, re.M)
        if not strings:
            raise ValueError('Could not inspect the compiled string table')
    else:
        strings = [data]
    for value in strings:
        if re.search(rb'sb_secret_[A-Za-z0-9_-]{20,}', value):
            raise ValueError('Server credential found in application bundle')
        if re.search(rb'-----BEGIN (?:RSA |EC )?PRIVATE KEY-----[A-Za-z0-9+/=\\\srn]{40,}', value):
            raise ValueError('Private key found in application bundle')
    return len(strings)


if __name__ == '__main__':
    count = verify_bundle(sys.argv[1])
    print(f'Inspected {count} complete bundle strings; no server credential or private-key value found.')
