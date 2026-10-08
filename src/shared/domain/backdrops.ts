import type { PaletteId } from "../contracts/index.ts";
import { palettes } from "./palettes.ts";

/** One composition in the browser and downloaded PNG; cards stay untouched. */
export function getPageLayout(rows: number, cols = rows) {
  const cardWidth = 360, cardHeight = 504, gap = 22, pad = 50, top = 150, bottom = 100;
  return { cardWidth, cardHeight, gap, pad, top, bottom,
    width: pad * 2 + cols * cardWidth + (cols - 1) * gap,
    height: top + rows * cardHeight + (rows - 1) * gap + bottom };
}

/** Original vector scenery, deliberately deterministic and not labeled as AI art. */
export function renderBackdropSvg({width, height, palette}: {width:number; height:number; palette:PaletteId}) {
  const c = palettes[palette];
  const stars = Array.from({length:38},(_,i)=> {
    const x=(i*173+31)%1000, y=(i*257+59)%1450;
    return `<circle cx="${x}" cy="${y}" r="${i%4===0?3:1.5}" fill="${c.accent}" opacity="${i%3===0?.6:.24}"/>`;
  }).join("");
  const waves = Array.from({length:8},(_,i)=> `<path d="M-140 ${i*207-80} C150 ${i*207-190} 390 ${i*207+170} 670 ${i*207+35} S1080 ${i*207-20} 1170 ${i*207+170}" fill="none" stroke="${i%2?c.accent:c.line}" stroke-width="${i%2?2:35}" opacity="${i%2?.3:.55}"/>`).join("");
  const leaves = Array.from({length:15},(_,i)=> {
    const x=i%2?970:20, y=90+i*94, angle=i%2?-35:35;
    return `<g transform="translate(${x} ${y}) rotate(${angle})"><path d="M0 0 Q-120 -110 -30 -220 Q60 -110 0 0Z" fill="${i%3===0?c.line:c.surface}"/><path d="M0 0 L-30 -190" stroke="${c.accent}" opacity=".26" fill="none" stroke-width="2"/></g>`;
  }).join("");
  let scenery = "";
  if(palette === "ocean") scenery = `<circle cx="850" cy="55" r="130" fill="${c.line}"/>${waves}<path d="M0 1360 Q240 1270 510 1390 T1000 1340 V1500H0Z" fill="${c.line}"/><path d="M0 1405 Q280 1350 560 1440 T1000 1380" fill="none" stroke="${c.accent}" stroke-width="4" opacity=".6"/>${stars}`;
  else if(palette === "forest" || palette === "forge") scenery = `<circle cx="860" cy="50" r="105" fill="${c.line}"/><path d="M0 90 Q260 -35 450 100 T1000 30V260Q730 120 540 210T0 220Z" fill="${c.surface}"/>${leaves}<path d="M0 1385 Q160 1290 410 1380 T1000 1350V1500H0Z" fill="${c.line}"/><path d="M0 1460Q280 1340 550 1440T1000 1410V1500H0Z" fill="${c.surface}"/>${stars}`;
  else if(palette === "ember") scenery = `<circle cx="875" cy="50" r="145" fill="${c.line}"/><path d="M0 500L90 360L28 250L125 65L0 0ZM1000 900L910 750L970 450L880 230L1000 150Z" fill="${c.surface}"/><path d="M0 1400L150 1320L280 1410L420 1300L610 1400L810 1280L1000 1370V1500H0Z" fill="${c.line}"/><path d="M0 1470L200 1400L340 1460L580 1380L820 1470L1000 1420V1500H0Z" fill="${c.surface}"/>${stars}${waves}`;
  else scenery = `<circle cx="865" cy="40" r="120" fill="${c.line}"/><circle cx="908" cy="8" r="105" fill="${c.bg}"/>${stars}<path d="M0 220Q160 40 330 160T680 120T1000 200" stroke="${c.line}" stroke-width="44" fill="none" opacity=".55"/><path d="M0 1390Q210 1300 420 1400T1000 1350V1500H0Z" fill="${c.surface}"/><path d="M40 400L12 650L65 870L28 1100M955 450L983 700L940 925L980 1150" stroke="${c.accent}" stroke-width="2" opacity=".4" fill="none"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 1000 1500" preserveAspectRatio="none"><rect width="1000" height="1500" fill="${c.bg}"/>${scenery}</svg>`;
}
