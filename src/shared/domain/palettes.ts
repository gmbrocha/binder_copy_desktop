import type { PaletteId } from "../contracts/index.ts";
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
    label: "Midnight",
    bg: "#151815",
    surface: "#202520",
    line: "#414b41",
    muted: "#b4bfb2",
    accent: "#c7e99b",
    text: "#f2f4ec",
  },
  ocean: {
    label: "Deep ocean",
    bg: "#101e2b",
    surface: "#1c3042",
    line: "#3a586f",
    muted: "#b0c8d9",
    accent: "#91d9ef",
    text: "#eff7fc",
  },
  ember: {
    label: "Warm ember",
    bg: "#291a18",
    surface: "#3e2924",
    line: "#6e4840",
    muted: "#d6bdb1",
    accent: "#ffc18e",
    text: "#fff2e9",
  },
  forest: {
    label: "Forest",
    bg: "#14241d",
    surface: "#233a2d",
    line: "#42634e",
    muted: "#b8ceba",
    accent: "#b9e5a2",
    text: "#eff7e9",
  },
  plum: {
    label: "Twilight",
    bg: "#241a2c",
    surface: "#382940",
    line: "#654a73",
    muted: "#d0bbda",
    accent: "#e5b9f6",
    text: "#f9f0ff",
  },
};
