import { NativeModules } from 'react-native';
import { extractColors } from '../shared/domain/colors';
export async function pickPhotoColors(): Promise<string[] | null> {
  const pixels: number[] | null = await NativeModules.BinderCopySystem.pickPhotoPixels();
  if (!pixels) return null;
  const colors = extractColors(pixels);
  if (!colors.length) throw new Error('This photo has no visible colors.');
  return colors;
}
