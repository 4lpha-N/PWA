import { useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import type { SimpleVariant } from "../../../lib/types";
import "./Slider.scss";

// Muss zur Schieberbreite in Slider.scss passen
const THUMB_W = 16;
const SLIDER_TICKS = Array.from({ length: 11 }, (_, i) => i);

interface SliderProps {
  variant: SimpleVariant;
  label: string;
  // Zahl = ein Knopf, Tupel = Bereich mit zwei Knöpfen
  defaultValue: number | [number, number];
  min?: number;
  max?: number;
  step?: number;
  // Kleinster erlaubter Abstand zwischen den beiden Knöpfen
  minGap?: number;
  hint?: string;
  error?: boolean;
  disabled?: boolean;
}

export function VlSlider({
  variant,
  label,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  minGap = 0,
  hint,
  error,
  disabled,
}: SliderProps) {
  const range = Array.isArray(defaultValue);
  const init: [number, number] = Array.isArray(defaultValue)
    ? defaultValue
    : [min, defaultValue];
  const [lo, setLo] = useState(init[0]);
  const [hi, setHi] = useState(init[1]);

  const frac = (v: number) => (v - min) / (max - min);
  // Unterschreitet der Abstand minGap, wird der andere Knopf mitgeschoben (bis zum Rand)
  const changeLo = (v: number) => {
    const next = Math.min(v, max - minGap);
    setLo(next);
    if (hi - next < minGap) setHi(next + minGap);
  };
  const changeHi = (v: number) => {
    if (!range) return setHi(v);
    const next = Math.max(v, min + minGap);
    setHi(next);
    if (next - lo < minGap) setLo(next - minGap);
  };

  // Klick auf die Schiene (nicht auf einen Knopf) setzt den nächstliegenden Knopf
  const onTrackDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!range || disabled || e.target instanceof HTMLInputElement) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const f = (e.clientX - rect.left - THUMB_W / 2) / (rect.width - THUMB_W);
    const v =
      min +
      Math.round((Math.min(1, Math.max(0, f)) * (max - min)) / step) * step;
    if (v - lo <= hi - v) changeLo(v);
    else changeHi(v);
  };

  const classes = [
    "vl-range",
    `vl-range--${variant}`,
    range ? "vl-range--dual" : "",
    error ? "is-error" : "",
    disabled ? "is-disabled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <div className="vl-range__head">
        <span className="vl-range__label">{label}</span>
        <output className="vl-range__value">
          {range ? `${lo} – ${hi}` : hi}
        </output>
      </div>
      <div
        className="vl-range__body"
        style={{ "--lo": frac(lo), "--hi": frac(hi) } as CSSProperties}
        onPointerDown={onTrackDown}
      >
        <span className="vl-range__track" aria-hidden="true" />
        <span className="vl-range__fill" aria-hidden="true" />
        <span className="vl-range__ticks" aria-hidden="true">
          {SLIDER_TICKS.map((i) => (
            <span
              key={i}
              className={i % 5 === 0 ? "is-major" : undefined}
              data-v={Math.round(min + ((max - min) * i) / 10)}
            />
          ))}
        </span>
        {range && (
          <input
            type="range"
            className={`vl-range__input${frac(lo) > 0.5 ? " is-top" : ""}`}
            min={min}
            max={max}
            step={step}
            value={lo}
            disabled={disabled}
            aria-label={`${label} Minimum`}
            aria-invalid={error || undefined}
            onChange={(e) => changeLo(Number(e.target.value))}
          />
        )}
        <input
          type="range"
          className="vl-range__input"
          min={min}
          max={max}
          step={step}
          value={hi}
          disabled={disabled}
          aria-label={range ? `${label} Maximum` : label}
          aria-invalid={error || undefined}
          onChange={(e) => changeHi(Number(e.target.value))}
        />
      </div>
      {hint && <span className="vl-range__hint">{hint}</span>}
    </div>
  );
}
