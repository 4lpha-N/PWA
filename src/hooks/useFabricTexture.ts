import { useMemo, useState, type CSSProperties } from "react";

export interface FabricTextureOptions {
  /** Grundfarbe der Fläche, die Maserung ist eine dunklere Variante davon */
  color: string;
  /** Deckkraft der Marmorierung, Standard kommt aus dem CSS (0.5) */
  cloudOpacity?: number;
  /** Deckkraft der Faserkörnung, Standard kommt aus dem CSS (0.3) */
  grainOpacity?: number;
}

// Seeds oberhalb ~16 Mio. sind im Browser (Float32) kaum unterscheidbar
const randomSeed = () => Math.floor(Math.random() * 1_000_000) + 1;

interface Warp {
  /** Maximale Verschiebung in px (+-scale/2) */
  scale: number;
  frequency: string;
}

// Rauschen als Alpha-Maske: wird im CSS mit der abgedunkelten Kachelfarbe gefüllt.
// Mit `warp` wird das Muster durch ein zweites Rauschen verzerrt (organischere Ränder).
const noiseSvg = (
  size: number,
  frequency: string,
  octaves: number,
  seed: number,
  gain: number,
  bias: number,
  warp?: Warp,
) => {
  const matrix = `0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${gain} 0 0 0 ${bias}`;
  const turbulence = (freq: string, oct: number, s: number, extra = "") =>
    `<feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='${oct}' seed='${s}' stitchTiles='stitch' ${extra}/>`;

  let body: string;
  if (!warp) {
    body =
      `<filter id='n' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'>` +
      turbulence(frequency, octaves, seed) +
      `<feColorMatrix type='matrix' values='${matrix}'/></filter>` +
      `<rect width='100%' height='100%' filter='url(#n)'/>`;
  } else {
    // Rand erweitern und die Kachel per feTile fortsetzen, damit die Verschiebung keine Nähte erzeugt
    const m = Math.ceil(warp.scale / 2) + 2;
    const full = size + 2 * m;
    const tile = `x='0' y='0' width='${size}' height='${size}'`;
    const region = `x='${-m}' y='${-m}' width='${full}' height='${full}'`;
    body =
      `<filter id='n' filterUnits='userSpaceOnUse' ${region} color-interpolation-filters='sRGB'>` +
      turbulence(frequency, octaves, seed, `${tile} result='a'`) +
      `<feColorMatrix in='a' type='matrix' values='${matrix}' ${tile} result='b'/>` +
      `<feTile in='b' ${region} result='c'/>` +
      turbulence(warp.frequency, 2, seed + 7919, `${tile} result='w'`) +
      `<feTile in='w' ${region} result='w2'/>` +
      `<feDisplacementMap in='c' in2='w2' scale='${warp.scale}' xChannelSelector='R' yChannelSelector='G'/></filter>` +
      `<rect ${region} filter='url(#n)'/>`;
  }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>${body}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

// Alpha-Maske aus Rauschen: stark kontrastiert, damit Bereiche komplett aussetzen
const patchMaskSvg = (size: number, frequency: string, seed: number) => {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>` +
    `<filter id='m' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'>` +
    `<feTurbulence type='fractalNoise' baseFrequency='${frequency}' numOctaves='3' seed='${seed}' stitchTiles='stitch'/>` +
    `<feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  4 0 0 0 -1.2'/></filter>` +
    `<rect width='100%' height='100%' filter='url(#m)'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

/**
 * Liefert den Inline-Style für die `.fabric`-Klasse. Die Seeds werden einmal
 * pro Komponenten-Instanz gewürfelt, jedes Element bekommt also eine eigene Maserung.
 *
 * const fabric = useFabricTexture({ color: "#60519b" });
 * <div className="fabric" style={fabric} />
 */
export function useFabricTexture({
  color,
  cloudOpacity,
  grainOpacity,
}: FabricTextureOptions): CSSProperties {
  const [images] = useState(() => ({
    cloud: noiseSvg(600, "0.014 0.01", 3, randomSeed(), 4.25, -1.35, {
      scale: 60,
      frequency: "0.008",
    }),
    grain: noiseSvg(300, "0.85 0.5", 3, randomSeed(), 3, -1.2, {
      scale: 5,
      frequency: "0.05",
    }),
    // Sehr großflächige, sanfte Schattierung (schwarz, max. ~15 % Alpha)
    depth: noiseSvg(800, "0.003 0.002", 2, randomSeed(), 0.5, -0.2),
    cloudMask: patchMaskSvg(800, "0.007 0.005", randomSeed()),
    grainMask: patchMaskSvg(800, "0.012 0.009", randomSeed()),
  }));

  return useMemo(
    () =>
      ({
        "--fabric-base": color,
        "--fabric-cloud-img": images.cloud,
        "--fabric-grain-img": images.grain,
        "--fabric-depth-img": images.depth,
        "--fabric-cloud-mask": images.cloudMask,
        "--fabric-grain-mask": images.grainMask,
        "--fabric-cloud-opacity": cloudOpacity,
        "--fabric-grain-opacity": grainOpacity,
      }) as CSSProperties,
    [color, images, cloudOpacity, grainOpacity],
  );
}
