import type { Page, PaletteId } from "../contracts/index.ts";
export const palettes: Record<
  PaletteId,
  {
    label: string;
    bg: string;
    surface: string;
    line: string;
    muted: string;
    accent: string;
    text: string;
  }
> = {
  forge: {
    label: "Mist",
    bg: "#EEF0E9",
    surface: "#E2E6DB",
    line: "#C8D0BD",
    muted: "#59634F",
    accent: "#789555",
    text: "#24301F",
  },
  ocean: {
    label: "Ocean",
    bg: "#E5F1F8",
    surface: "#D5E7F1",
    line: "#B4D2E3",
    muted: "#4D6979",
    accent: "#4B8AA9",
    text: "#203642",
  },
  ember: {
    label: "Peach",
    bg: "#FBEDE3",
    surface: "#F2DCCB",
    line: "#E4BEA3",
    muted: "#80614E",
    accent: "#B77D50",
    text: "#442E20",
  },
  forest: {
    label: "Sage",
    bg: "#E8F2E5",
    surface: "#D7E7D0",
    line: "#B9D1AF",
    muted: "#546F49",
    accent: "#739A62",
    text: "#253D20",
  },
  plum: {
    label: "Lilac",
    bg: "#F0EAF8",
    surface: "#E3D9EF",
    line: "#CDB9E1",
    muted: "#705A87",
    accent: "#9A78BA",
    text: "#382747",
  },
};

/** Black or white title chosen by WCAG relative luminance, including saturated colors. */
export function colorText(hex: string): string {
  const rgb = [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16) / 255)
    .map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  const luminance = rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  return luminance > 0.179 ? "#000000" : "#FFFFFF";
}
/** One resolution path for native preview, thumbnails and server exports. */
export function pagePalette(page: Pick<Page, "palette" | "customColor" | "backdropMode" | "backdrop">) {
  const preset = palettes[page.palette ?? "forge"];
  if (page.backdrop && page.backdropMode !== "color") return { ...preset, text: "#FFFFFF" };
  if (page.customColor && /^#[0-9a-fA-F]{6}$/.test(page.customColor)) {
    return { ...preset, bg: page.customColor, surface: page.customColor, text: colorText(page.customColor) };
  }
  return preset;
}
