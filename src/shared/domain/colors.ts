import type { PaletteId } from "../contracts/index.ts";
export function extractColors(
  pixels: ArrayLike<number>,
  channels = 4,
): string[] {
  const bins = new Map<
    number,
    { n: number; r: number; g: number; b: number }
  >();
  for (let i = 0; i + 2 < pixels.length; i += channels) {
    if (channels === 4 && pixels[i + 3] < 128) continue;
    const r = pixels[i],
      g = pixels[i + 1],
      b = pixels[i + 2],
      key = (r >> 5) * 64 + (g >> 5) * 8 + (b >> 5);
    const bin = bins.get(key) || { n: 0, r: 0, g: 0, b: 0 };
    bin.n++;
    bin.r += r;
    bin.g += g;
    bin.b += b;
    bins.set(key, bin);
  }
  const selected: number[][] = [];
  for (const bin of [...bins.values()].sort((a, b) => b.n - a.n)) {
    const rgb = [bin.r, bin.g, bin.b].map((v) => Math.round(v / bin.n));
    if (
      selected.some(
        (c) => c.reduce((s, v, j) => s + (v - rgb[j]) ** 2, 0) < 1800,
      )
    )
      continue;
    selected.push(rgb);
    if (selected.length === 5) break;
  }
  return selected.map(
    (c) => "#" + c.map((v) => v.toString(16).padStart(2, "0")).join(""),
  );
}
const rgb = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
// Perceptual-ish weighted RGB distance; color matching, not semantic similarity.
const distance = (a: string, b: string) => {
  const x = rgb(a),
    y = rgb(b);
  return (
    2 * (x[0] - y[0]) ** 2 + 4 * (x[1] - y[1]) ** 2 + 3 * (x[2] - y[2]) ** 2
  );
};
export function paletteDistance(a: string[], b: string[]) {
  if (!a.length || !b.length) return Infinity;
  const directed = (x: string[], y: string[]) =>
    x.reduce(
      (s, c, i) => s + Math.min(...y.map((v) => distance(c, v))) / (i + 1),
      0,
    ) / x.reduce((s, _, i) => s + 1 / (i + 1), 0);
  return directed(a, b) * 0.6 + directed(b, a) * 0.4;
}
const colorNames: Record<string, string> = {
  red: "#cf3030",
  orange: "#df852a",
  yellow: "#ded74b",
  green: "#479653",
  teal: "#328c8f",
  blue: "#367dbb",
  navy: "#283b68",
  purple: "#805199",
  pink: "#d777ae",
  brown: "#916243",
  cream: "#ddcc9d",
  white: "#ededed",
  gray: "#8c8c8c",
  black: "#252525",
};
export function paletteQuery(colors: string[]) {
  return (
    [
      ...new Set(
        colors.map(
          (c) =>
            Object.keys(colorNames).sort(
              (a, b) => distance(c, colorNames[a]) - distance(c, colorNames[b]),
            )[0],
        ),
      ),
    ].join(", ") + " colored artwork"
  );
}
export function colorPalette(colors: string[]): PaletteId {
  const choices: Record<PaletteId, string[]> = {
    forge: ["#6f7c56", "#c7e99b"],
    ocean: ["#368bad", "#284e87"],
    ember: ["#db8459", "#b94334"],
    forest: ["#478154", "#849f4f"],
    plum: ["#995cae", "#ad658e"],
  };
  return (Object.keys(choices) as PaletteId[]).sort(
    (a, b) =>
      paletteDistance(colors, choices[a]) - paletteDistance(colors, choices[b]),
  )[0];
}
