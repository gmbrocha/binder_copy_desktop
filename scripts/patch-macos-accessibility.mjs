import fs from 'node:fs';
import path from 'node:path';

// RN macOS 0.83.0 inherits an iOS-only paragraph accessibility strategy:
// isAccessibilityElement always returns NO, but accessibilityElements is
// compiled out on macOS. This removes plain text (including errors) from AX.
const root = path.resolve('node_modules/react-native-macos');
const version = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version;
if (version !== '0.83.0') throw new Error('Review the macOS paragraph accessibility patch for the new runtime version.');
const file = path.join(root, 'React/Fabric/Mounting/ComponentViews/Text/RCTParagraphComponentView.mm');
const original = `- (BOOL)isAccessibilityElement
{
  // All accessibility functionality of the component is implemented in \`accessibilityElements\` method below.
  // Hence to avoid calling all other methods from \`UIAccessibilityContainer\` protocol (most of them have default
  // implementations), we return here \`NO\`.
  return NO;
}`;
const replacement = `- (BOOL)isAccessibilityElement
{
#if TARGET_OS_OSX
  // BinderCopy: AppKit has no iOS paragraph accessibilityElements provider.
  // Honor the inherited accessible/hidden state instead of hiding all text.
  return [super isAccessibilityElement];
#else
  // iOS exposes paragraph children through accessibilityElements below.
  return NO;
#endif
}`;
const source = fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n');
if (source.includes(replacement)) console.log('macOS paragraph accessibility patch already applied.');
else {
  if (source.split(original).length !== 2) throw new Error('macOS paragraph source changed; review instead of applying an unverified patch.');
  fs.writeFileSync(file, source.replace(original, replacement));
  console.log('Applied the macOS-only paragraph accessibility correction.');
}

// The JS Text default also omits macOS, leaving `accessible` undefined. Match
// iOS's opt-out default while preserving explicit accessible={false}.
const textFile = path.join(root, 'Libraries/Text/Text.js');
const textSource = fs.readFileSync(textFile, 'utf8');
const textOriginal = 'ios: accessible !== false,\n      android:';
const textReplacement = 'ios: accessible !== false,\n      macos: accessible !== false,\n      android:';
if (textSource.includes(textReplacement)) console.log('macOS Text accessibility default already applied.');
else {
  if (textSource.split(textOriginal).length !== 3) throw new Error('macOS Text default source changed; review the patch.');
  fs.writeFileSync(textFile, textSource.replaceAll(textOriginal, textReplacement));
  console.log('Applied the macOS Text accessibility default.');
}
