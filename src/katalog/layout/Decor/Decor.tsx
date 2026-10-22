import type { ReactNode } from "react";
import "./Decor.scss";

const DECORS: ReactNode[] = [
  // 1: Tactical (Raster, Schrägbänder, Fadenkreuz-Ring, Lineal)
  <>
    <span className="vl-deco__grid" />
    <span className="vl-deco__slash vl-deco__slash--a" />
    <span className="vl-deco__slash vl-deco__slash--b" />
    <span className="vl-deco__slash vl-deco__slash--c" />
    <span className="vl-deco__ruler" />
    <span className="vl-deco__stripes" />
    <span className="vl-deco__stripes vl-deco__stripes--br" />
    <span className="vl-deco__corner vl-deco__corner--tl" />
    <span className="vl-deco__corner vl-deco__corner--tr" />
    <span className="vl-deco__corner vl-deco__corner--bl" />
    <span className="vl-deco__corner vl-deco__corner--br" />
  </>,

  // 2: Hex (Sechseck-Feld, große Hexagone)
  <>
    <svg className="vl-deco__hexfield">
      <defs>
        <pattern
          id="vl-hex"
          width="60"
          height="34.641"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M20 0L10 17.32L20 34.64M20 0H40M40 0L50 17.32L40 34.64M0 17.32H10M50 17.32H60"
            fill="none"
            stroke="currentColor"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#vl-hex)" />
    </svg>
    <svg className="vl-deco__hexbig" viewBox="0 0 200 174">
      <polygon points="50,0 150,0 200,87 150,174 50,174 0,87" />
      <polygon points="75,43 125,43 150,87 125,131 75,131 50,87" />
    </svg>
    <svg className="vl-deco__hexbig vl-deco__hexbig--sm" viewBox="0 0 200 174">
      <polygon points="50,0 150,0 200,87 150,174 50,174 0,87" />
      <polygon points="75,43 125,43 150,87 125,131 75,131 50,87" />
    </svg>
    <span className="vl-deco__bar" />
  </>,

  // 3: HUD (Scanlines, Glow, Schiene, Kennungen)
  <>
    <span className="vl-deco__scan" />
    <span className="vl-deco__glow" />
    <span className="vl-deco__rail" />
    <span className="vl-deco__tag vl-deco__tag--tl">TAG 01</span>
    <span className="vl-deco__tag vl-deco__tag--br">TAG 02</span>
  </>,

  // 4: Bänder (breite Diagonalen, Dreiecke)
  <>
    <span className="vl-deco__bands" />
    <span className="vl-deco__tri" />
    <span className="vl-deco__tri vl-deco__tri--tl" />
  </>,

  // 5: Punkte (Dot-Matrix, große Klammern, Plus-Marken)
  <>
    <span className="vl-deco__dots" />
    <span className="vl-deco__bracket vl-deco__bracket--tl" />
    <span className="vl-deco__bracket vl-deco__bracket--tr" />
    <span className="vl-deco__bracket vl-deco__bracket--bl" />
    <span className="vl-deco__bracket vl-deco__bracket--br" />
    <span className="vl-deco__plus vl-deco__plus--a" />
    <span className="vl-deco__plus vl-deco__plus--b" />
    <span className="vl-deco__plus vl-deco__plus--c" />
    <span className="vl-deco__plus vl-deco__plus--d" />
  </>,

  // 6: Splitter (kantige Flächen)
  <>
    <span className="vl-deco__shard vl-deco__shard--a" />
    <span className="vl-deco__shard vl-deco__shard--b" />
    <span className="vl-deco__shard vl-deco__shard--c" />
    <span className="vl-deco__shard vl-deco__shard--d" />
    <span className="vl-deco__shard vl-deco__shard--e" />
  </>,

  // 7: Rahmen (Außenrahmen mit Ecken, Strichcode-Leisten)
  <>
    <span className="vl-deco__frame" />
    <span className="vl-deco__notch" />
    <span className="vl-deco__strip vl-deco__strip--t" />
    <span className="vl-deco__strip vl-deco__strip--b" />
    <span className="vl-deco__ticks vl-deco__ticks--l" />
    <span className="vl-deco__ticks vl-deco__ticks--r" />
  </>,

  // 8: Mix aus 2 (Hex), 5 (Punkte, Plus) und 7 (Rahmen)
  <>
    <span className="vl-deco__frame" />
    <div className="vl-deco__inner">
      <svg className="vl-deco__hexfield">
        <defs>
          <pattern
            id="vl-hex-mix"
            width="60"
            height="34.641"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M20 0L10 17.32L20 34.64M20 0H40M40 0L50 17.32L40 34.64M0 17.32H10M50 17.32H60"
              fill="none"
              stroke="currentColor"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#vl-hex-mix)" />
      </svg>
      <svg className="vl-deco__hexbig" viewBox="0 0 200 174">
        <polygon points="50,0 150,0 200,87 150,174 50,174 0,87" />
        <polygon points="75,43 125,43 150,87 125,131 75,131 50,87" />
      </svg>
      <span className="vl-deco__dots vl-deco__dots--bl" />
      <span className="vl-deco__plus vl-deco__plus--a" />
      <span className="vl-deco__plus vl-deco__plus--b" />
      <span className="vl-deco__plus vl-deco__plus--c" />
      <span className="vl-deco__plus vl-deco__plus--d" />
      <span className="vl-deco__strip vl-deco__strip--t" />
      <span className="vl-deco__strip vl-deco__strip--b" />
      <span className="vl-deco__ticks vl-deco__ticks--l" />
      <span className="vl-deco__ticks vl-deco__ticks--r" />
    </div>
    <span className="vl-deco__notch" />
  </>,

  // 9: Mix aus 7 (Rahmen), 5 (Punkte, Plus) und 1 (Raster, Schrägbänder, Lineal)
  <>
    <span className="vl-deco__frame" />
    <div className="vl-deco__inner">
      <span className="vl-deco__grid" />
      <span className="vl-deco__slash vl-deco__slash--a" />
      <span className="vl-deco__slash vl-deco__slash--b" />
      <span className="vl-deco__slash vl-deco__slash--c" />
      <span className="vl-deco__ruler" />
      <span className="vl-deco__dots vl-deco__dots--br" />
      <span className="vl-deco__plus vl-deco__plus--a" />
      <span className="vl-deco__plus vl-deco__plus--b" />
      <span className="vl-deco__plus vl-deco__plus--c" />
      <span className="vl-deco__plus vl-deco__plus--d" />
      <span className="vl-deco__stripes" />
      <span className="vl-deco__stripes vl-deco__stripes--br" />
      <span className="vl-deco__ticks vl-deco__ticks--r" />
    </div>
    <span className="vl-deco__notch" />
  </>,
];

export function Decor({ variant }: { variant: number }) {
  return (
    <div
      key={variant}
      className={`vl-deco vl-deco--v${variant}`}
      aria-hidden="true"
    >
      {DECORS[variant - 1]}
    </div>
  );
}
