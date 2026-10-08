import type { Page } from '../contracts/index.ts';
import { pagePalette } from './palettes.ts';

export const overlayInk = { dark: '#151815', cream: '#F7F3E8' } as const;
export type OverlayTone = keyof typeof overlayInk;
export type PageOverlays = { title: OverlayTone; logo: OverlayTone };
export type OverlayPage = Pick<Page, 'size' | 'name' | 'palette' | 'customColor' | 'backdrop' | 'backdropMode'>;
export function luminance(hex: string) {
  const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return c[0] * .2126 + c[1] * .7152 + c[2] * .0722;
}
export function contrast(a: number, b: number) {
  return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
}
/** Prefer the variant with better lower-quartile contrast, not average image color. */
export function chooseOverlay(samples: readonly number[]): OverlayTone {
  const score = (tone: OverlayTone) => {
    const ink = luminance(overlayInk[tone]);
    const ratios = samples.map(bg => contrast(ink, bg)).sort((a, b) => a - b);
    return ratios[Math.floor((ratios.length - 1) * .25)] ?? 0;
  };
  return score('dark') >= score('cream') ? 'dark' : 'cream';
}
export function solidOverlays(page: OverlayPage): PageOverlays {
  const tone = chooseOverlay([luminance(pagePalette(page).bg)]);
  return { title: tone, logo: tone };
}
export function hasImageBackground(page: OverlayPage) {
  return page.backdropMode !== 'color' && (!!page.backdrop || (page.backdropMode === undefined && !page.customColor));
}
