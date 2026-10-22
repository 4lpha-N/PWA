import {
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type {
  ButtonHTMLAttributes,
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent,
  ReactElement,
  ReactNode,
  RefObject,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PageWrapper } from "./_PageWrapper";
import "./Design.scss";

type Theme = "dark" | "red" | "light";
type Variant = "primary" | "outline" | "alt";

const VARIANTS: Variant[] = ["primary", "outline", "alt"];

// Für Checkbox und Link: nur Primary (Akzent) und Secondary (Schwarz/Weiß je Theme)
type SimpleVariant = "primary" | "secondary";
const SIMPLE_VARIANTS: SimpleVariant[] = ["primary", "secondary"];

const THEMES: { id: Theme; label: string }[] = [
  { id: "dark", label: "Dunkel" },
  { id: "red", label: "Akzent" },
  { id: "light", label: "Hell" },
];

// Muss zur Dauer der Farb-Transition in Design.scss passen
const THEME_TRANSITION_MS = 450;

// Theme-Klassen für Overlays, die per Portal außerhalb der Seite liegen
const ThemeClassContext = createContext("design-wrapper--dark");

const cx = (...parts: (string | false | undefined)[]) =>
  parts.filter(Boolean).join(" ");

function variantLabel(variant: Variant, theme: Theme) {
  if (variant === "primary") return "Primary";
  if (variant === "outline") return "Outline";
  return theme === "red" ? "Outline Dark" : "Outline Red";
}

/* ---------- Hintergrund-Verzierungen (9 Varianten zum Vergleichen) ---------- */

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
    <span className="vl-deco__tag vl-deco__tag--tl">SYS // 042</span>
    <span className="vl-deco__tag vl-deco__tag--br">SEC 7-A</span>
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

const DECOR_OPTIONS = DECORS.map((_, i) => ({
  id: i + 1,
  label: String(i + 1),
}));

function Decor({ variant }: { variant: number }) {
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

/* ---------- Layout-Helfer ---------- */

// Einblenden beim Scrollen in den Viewport; einmalig, ohne Animation bei reduzierter Bewegung
function reveal(reduceMotion: boolean | null, delay = 0) {
  if (reduceMotion) return {};
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "0px 0px -10% 0px" },
    transition: { duration: 0.45, ease: "easeOut" as const, delay },
  };
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.section className="vl-section" {...reveal(reduceMotion)}>
      <h2 className="vl-section__title">{title}</h2>
      {children}
    </motion.section>
  );
}

function VariantGrid({
  theme,
  render,
}: {
  theme: Theme;
  render: (variant: Variant) => ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <div className="vl-grid">
      {VARIANTS.map((variant, i) => (
        <motion.div
          className="vl-col"
          key={variant}
          {...reveal(reduceMotion, 0.1 + i * 0.08)}
        >
          <span className="vl-col__title">{variantLabel(variant, theme)}</span>
          {render(variant)}
        </motion.div>
      ))}
    </div>
  );
}

function SimpleGrid({
  render,
}: {
  render: (variant: SimpleVariant) => ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <div className="vl-grid">
      {SIMPLE_VARIANTS.map((variant, i) => (
        <motion.div
          className="vl-col"
          key={variant}
          {...reveal(reduceMotion, 0.1 + i * 0.08)}
        >
          <span className="vl-col__title">
            {variant === "primary" ? "Primary" : "Secondary"}
          </span>
          {render(variant)}
        </motion.div>
      ))}
    </div>
  );
}

function ColGrid({ cols }: { cols: { title: string; node: ReactNode }[] }) {
  const reduceMotion = useReducedMotion();
  return (
    <div className="vl-grid">
      {cols.map((col, i) => (
        <motion.div
          className="vl-col"
          key={col.title}
          {...reveal(reduceMotion, 0.1 + i * 0.08)}
        >
          <span className="vl-col__title">{col.title}</span>
          {col.node}
        </motion.div>
      ))}
    </div>
  );
}

function SegToggle<T extends string | number>({
  options,
  value,
  onChange,
  label,
  compact,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`vl-toggle${compact ? " vl-toggle--compact" : ""}`}
      role="group"
      aria-label={label}
    >
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          className={`vl-toggle__btn${value === o.id ? " is-active" : ""}`}
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- Buttons ---------- */

interface VlButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: Variant;
  // Navigation statt Aktion: wird als a-Tag ausgegeben
  href?: string;
}

function VlButton({
  variant,
  type = "button",
  href,
  children,
  ...rest
}: VlButtonProps) {
  if (href !== undefined) {
    const className = `vl-btn vl-btn--${variant}`;
    // Ein a-Tag kennt kein disabled: ohne href und mit aria-disabled
    if (rest.disabled) {
      return (
        <a className={className} role="link" aria-disabled="true">
          {children}
        </a>
      );
    }
    return (
      <a className={className} href={href} onClick={(e) => e.preventDefault()}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={`vl-btn vl-btn--${variant}`} {...rest}>
      {children}
    </button>
  );
}

/* ---------- Inputs / Select ---------- */

interface FieldProps {
  variant: Variant;
  label: string;
  hint?: string;
  error?: boolean;
  disabled?: boolean;
}

function fieldClass(variant: Variant, error?: boolean, disabled?: boolean) {
  return [
    "vl-field",
    `vl-field--${variant}`,
    error ? "is-error" : "",
    disabled ? "is-disabled" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function VlInput({
  variant,
  label,
  hint,
  error,
  disabled,
  placeholder,
  defaultValue,
}: FieldProps & { placeholder?: string; defaultValue?: string }) {
  const id = useId();
  return (
    <div className={fieldClass(variant, error, disabled)}>
      <label className="vl-field__label" htmlFor={id}>
        {label}
      </label>
      <div className="vl-field__box">
        <input
          id={id}
          type="text"
          className="vl-field__control"
          placeholder={placeholder}
          defaultValue={defaultValue}
          disabled={disabled}
          aria-invalid={error || undefined}
        />
      </div>
      {hint && <span className="vl-field__hint">{hint}</span>}
    </div>
  );
}

function VlSelect({ variant, label, hint, error, disabled }: FieldProps) {
  const id = useId();
  return (
    <div className={fieldClass(variant, error, disabled)}>
      <label className="vl-field__label" htmlFor={id}>
        {label}
      </label>
      <div className="vl-field__box vl-field__box--select">
        <select
          id={id}
          className="vl-field__control vl-field__control--select"
          defaultValue=""
          disabled={disabled}
          aria-invalid={error || undefined}
        >
          <option value="" disabled>
            Bitte wählen
          </option>
          <option value="1">Auswahl 1</option>
          <option value="2">Auswahl 2</option>
          <option value="3">Auswahl 3</option>
        </select>
      </div>
      {hint && <span className="vl-field__hint">{hint}</span>}
    </div>
  );
}

/* ---------- Checkbox ---------- */

function VlCheck({
  variant,
  label,
  defaultChecked,
  disabled,
  radio,
  name,
  value,
}: {
  variant: SimpleVariant;
  label: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  // Radio statt Checkbox: gleiche Komponente, Achteck mit Punkt
  radio?: boolean;
  name?: string;
  value?: string;
}) {
  return (
    <label
      className={cx(
        "vl-check",
        `vl-check--${variant}`,
        radio && "vl-check--radio",
        disabled && "is-disabled",
      )}
    >
      <input
        type={radio ? "radio" : "checkbox"}
        className="vl-check__input"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        disabled={disabled}
      />
      <span className="vl-check__box" aria-hidden="true" />
      <span className="vl-check__label">{label}</span>
    </label>
  );
}

function VlRadioGroup({
  variant,
  label,
  options,
  defaultValue,
  disabled,
}: {
  variant: SimpleVariant;
  label: string;
  options: { value: string; label: string; disabled?: boolean }[];
  defaultValue?: string;
  disabled?: boolean;
}) {
  const name = useId();
  return (
    <div className="vl-radios" role="radiogroup" aria-labelledby={`${name}-l`}>
      <span id={`${name}-l`} className="vl-radios__label">
        {label}
      </span>
      {options.map((o) => (
        <VlCheck
          key={o.value}
          radio
          variant={variant}
          name={name}
          value={o.value}
          label={o.label}
          defaultChecked={o.value === defaultValue}
          disabled={disabled || o.disabled}
        />
      ))}
    </div>
  );
}

/* ---------- Toggle ---------- */

function VlSwitch({
  variant,
  label,
  defaultChecked,
  disabled,
}: {
  variant: SimpleVariant;
  label: string;
  defaultChecked?: boolean;
  disabled?: boolean;
}) {
  return (
    <label
      className={`vl-switch vl-switch--${variant}${disabled ? " is-disabled" : ""}`}
    >
      <input
        type="checkbox"
        role="switch"
        className="vl-switch__input"
        defaultChecked={defaultChecked}
        disabled={disabled}
      />
      <span className="vl-switch__track" aria-hidden="true" />
      <span className="vl-switch__label">{label}</span>
    </label>
  );
}

/* ---------- Slider ---------- */

// Muss zur Schieberbreite in Design.scss passen
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

function VlSlider({
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

/* ---------- Link ---------- */

function VlLink({
  variant,
  children,
  disabled,
}: {
  variant: SimpleVariant;
  children: ReactNode;
  disabled?: boolean;
}) {
  const className = `vl-link vl-link--${variant}${disabled ? " is-disabled" : ""}`;
  if (disabled) {
    return (
      <a className={className} role="link" aria-disabled="true">
        {children}
      </a>
    );
  }
  return (
    <a className={className} href="#" onClick={(e) => e.preventDefault()}>
      {children}
    </a>
  );
}

/* ---------- Badge / Tag / Chip ---------- */

type TagKind = "badge" | "tag" | "chip";

function VlTag({
  variant,
  kind,
  children,
  disabled,
  defaultSelected,
}: {
  variant: Variant;
  kind: TagKind;
  children: ReactNode;
  disabled?: boolean;
  defaultSelected?: boolean;
}) {
  const [selected, setSelected] = useState(!!defaultSelected);
  const className = cx(
    "vl-tag",
    `vl-tag--${kind}`,
    `vl-tag--${variant}`,
    kind === "chip" && selected && "is-selected",
    disabled && "is-disabled",
  );

  if (kind === "chip") {
    return (
      <button
        type="button"
        className={className}
        aria-pressed={selected}
        disabled={disabled}
        onClick={() => setSelected((s) => !s)}
      >
        <span className="vl-tag__dot" aria-hidden="true" />
        {children}
      </button>
    );
  }
  return (
    <span className={className}>
      {kind === "tag" && <span className="vl-tag__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

/* ---------- Tooltip / Popover ---------- */

type Side = "top" | "right" | "bottom" | "left" | "auto";

// Positioniert ein nach document.body verschobenes Element am Anker, mit Wechsel der Seite bei Platzmangel
function useFloat(
  open: boolean,
  anchor: RefObject<HTMLElement | null>,
  side: Side,
) {
  const floatRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const a = anchor.current?.getBoundingClientRect();
      const f = floatRef.current?.getBoundingClientRect();
      if (!a || !f) return;
      const gap = 8;
      const edge = 8;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let s: Exclude<Side, "auto">;
      if (side === "auto") {
        // Erste Seite mit genug Platz, sonst die mit dem meisten
        const order = ["top", "bottom", "right", "left"] as const;
        const room = {
          top: a.top - f.height - gap - edge,
          bottom: vh - a.bottom - f.height - gap - edge,
          left: a.left - f.width - gap - edge,
          right: vw - a.right - f.width - gap - edge,
        };
        s =
          order.find((o) => room[o] >= 0) ??
          order.reduce((best, o) => (room[o] > room[best] ? o : best));
      } else {
        s = side;
        if (s === "top" && a.top - f.height - gap < edge) s = "bottom";
        else if (s === "bottom" && a.bottom + f.height + gap > vh - edge)
          s = "top";
        else if (s === "left" && a.left - f.width - gap < edge) s = "right";
        else if (s === "right" && a.right + f.width + gap > vw - edge)
          s = "left";
      }
      let top: number;
      let left: number;
      if (s === "top" || s === "bottom") {
        top = s === "top" ? a.top - f.height - gap : a.bottom + gap;
        left = a.left + a.width / 2 - f.width / 2;
      } else {
        left = s === "left" ? a.left - f.width - gap : a.right + gap;
        top = a.top + a.height / 2 - f.height / 2;
      }
      setPos({
        top: Math.round(Math.min(Math.max(top, edge), vh - f.height - edge)),
        left: Math.round(Math.min(Math.max(left, edge), vw - f.width - edge)),
      });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
      setPos(null);
    };
  }, [open, anchor, side]);

  const style: CSSProperties = pos
    ? { top: pos.top, left: pos.left }
    : { top: 0, left: 0, visibility: "hidden" };
  return { floatRef, style, ready: pos !== null };
}

function VlTooltip({
  variant,
  text,
  side = "top",
  children,
}: {
  variant: SimpleVariant;
  text: string;
  side?: Side;
  children: ReactElement<{ "aria-describedby"?: string }>;
}) {
  const id = useId();
  const themeClass = useContext(ThemeClassContext);
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLSpanElement>(null);
  const timer = useRef<number>();
  const { floatRef, style } = useFloat(open, anchor, side);

  // Kurze Verzögerung beim Schließen, damit der Zeiger auf den Tooltip wechseln kann
  const show = () => {
    window.clearTimeout(timer.current);
    setOpen(true);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), 120);
  };
  const hideNow = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && hideNow();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <span
        ref={anchor}
        className="vl-tip"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hideNow}
      >
        {cloneElement(children, { "aria-describedby": open ? id : undefined })}
      </span>
      {open &&
        createPortal(
          <div
            ref={floatRef}
            id={id}
            role="tooltip"
            className={cx(
              "design-wrapper",
              themeClass,
              "vl-float",
              "vl-tooltip",
              `vl-tooltip--${variant}`,
            )}
            style={style}
            onMouseEnter={show}
            onMouseLeave={hide}
          >
            {text}
          </div>,
          document.body,
        )}
    </>
  );
}

function VlPopover({
  variant,
  label,
  title,
  side = "bottom",
  children,
}: {
  variant: SimpleVariant;
  label: string;
  title: string;
  side?: Side;
  children: (close: () => void) => ReactNode;
}) {
  const uid = useId();
  const themeClass = useContext(ThemeClassContext);
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLSpanElement>(null);
  const { floatRef, style, ready } = useFloat(open, anchor, side);
  const trigger = () => anchor.current?.querySelector<HTMLElement>("button");
  const [restore, setRestore] = useState(false);
  const close = useCallback(() => {
    setOpen(false);
    setRestore(true);
  }, []);

  // Fokus zurück auf den Auslöser, sonst geht er mit dem entfernten Inhalt verloren
  useEffect(() => {
    if (restore) anchor.current?.querySelector<HTMLElement>("button")?.focus();
  }, [restore]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onDown = (e: globalThis.PointerEvent) => {
      const target = e.target as Node;
      if (
        !anchor.current?.contains(target) &&
        !floatRef.current?.contains(target)
      )
        setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, floatRef, close]);

  // Sichtbar erst nach der Positionierung, erst dann lässt sich fokussieren
  useEffect(() => {
    if (ready) floatRef.current?.focus({ preventScroll: true });
  }, [ready, floatRef]);

  // Der Inhalt liegt am Ende des DOM: Tab führt sonst daran vorbei bzw. aus der Seite heraus
  const items = () =>
    Array.from(
      floatRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
    );
  const onTriggerKey = (e: ReactKeyboardEvent) => {
    if (!open || e.key !== "Tab") return;
    if (e.shiftKey) {
      // Fokus verl\u00e4sst die Gruppe nach hinten
      setOpen(false);
      return;
    }
    e.preventDefault();
    (items()[0] ?? floatRef.current)?.focus();
  };
  const onPanelKey = (e: ReactKeyboardEvent) => {
    if (e.key !== "Tab") return;
    const list = items();
    const active = document.activeElement;
    if (e.shiftKey && (active === floatRef.current || active === list[0])) {
      e.preventDefault();
      trigger()?.focus();
    } else if (
      !e.shiftKey &&
      (!list.length || active === list[list.length - 1])
    ) {
      // Weiter mit dem Element, das im DOM auf den Ausl\u00f6ser folgt
      e.preventDefault();
      const all = Array.from(
        document.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => !floatRef.current?.contains(el));
      const from = trigger();
      setOpen(false);
      all[(from ? all.indexOf(from) : -1) + 1]?.focus();
    }
  };

  return (
    <>
      <span ref={anchor} className="vl-tip" onKeyDown={onTriggerKey}>
        <VlButton
          variant={variant === "primary" ? "primary" : "outline"}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? `${uid}-pop` : undefined}
          onClick={() => {
            setRestore(false);
            setOpen((o) => !o);
          }}
        >
          {label}
        </VlButton>
      </span>
      {open &&
        createPortal(
          <div
            ref={floatRef}
            id={`${uid}-pop`}
            role="dialog"
            aria-labelledby={`${uid}-title`}
            tabIndex={-1}
            onKeyDown={onPanelKey}
            className={cx(
              "design-wrapper",
              themeClass,
              "vl-float",
              "vl-popover",
              `vl-popover--${variant}`,
            )}
            style={style}
          >
            <h3 id={`${uid}-title`} className="vl-popover__title">
              {title}
            </h3>
            {children(close)}
          </div>,
          document.body,
        )}
    </>
  );
}

/* ---------- Alert / Toast ---------- */

type Tone = "info" | "success" | "warn";

const TONES: { id: Tone; label: string; icon: string; text: string }[] = [
  {
    id: "info",
    label: "Info",
    icon: "i",
    text: "Ein neues Update steht zur Verfügung.",
  },
  {
    id: "success",
    label: "Erfolg",
    icon: "✓",
    text: "Die Änderungen wurden gespeichert.",
  },
  {
    id: "warn",
    label: "Warnung",
    icon: "!",
    text: "Dein Abo läuft in drei Tagen ab.",
  },
];

function VlAlert({
  tone,
  title,
  children,
  onClose,
  live = true,
  extra,
}: {
  tone: Tone;
  title: string;
  children: ReactNode;
  onClose?: () => void;
  // false, wenn ein umgebender Live-Bereich (Toast-Host) die Ansage übernimmt
  live?: boolean;
  extra?: ReactNode;
}) {
  const icon = TONES.find((t) => t.id === tone)?.icon;
  return (
    <div
      className={`vl-alert vl-alert--${tone}`}
      role={live ? (tone === "warn" ? "alert" : "status") : undefined}
    >
      <span className="vl-alert__icon" aria-hidden="true">
        {icon}
      </span>
      <div className="vl-alert__body">
        <strong className="vl-alert__title">{title}</strong>
        <p className="vl-alert__text">{children}</p>
      </div>
      {onClose && (
        <button
          type="button"
          className="vl-x"
          aria-label="Schließen"
          onClick={onClose}
        />
      )}
      {extra}
    </div>
  );
}

function AlertDemo() {
  const reduceMotion = useReducedMotion();
  const [closed, setClosed] = useState<Tone[]>([]);
  return (
    <div className="vl-alertlist">
      <AnimatePresence initial={false}>
        {TONES.filter((t) => !closed.includes(t.id)).map((t) => (
          <motion.div
            key={t.id}
            className="vl-alertlist__item"
            style={{ marginBottom: 12 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
          >
            <VlAlert
              tone={t.id}
              title={t.label}
              onClose={() => setClosed((c) => [...c, t.id])}
            >
              {t.text}
            </VlAlert>
          </motion.div>
        ))}
      </AnimatePresence>
      <VlButton
        variant="outline"
        disabled={closed.length === 0}
        onClick={() => setClosed([])}
      >
        Alle einblenden
      </VlButton>
    </div>
  );
}

/* ---------- Progress ---------- */

function VlProgress({
  variant,
  label,
  value = 0,
  indeterminate,
  loading,
  segmented,
  error,
  hint,
}: {
  variant: SimpleVariant;
  label: string;
  value?: number;
  indeterminate?: boolean;
  // Fortschritt bekannt, Balken zeigt zusätzlich Aktivität
  loading?: boolean;
  segmented?: boolean;
  error?: boolean;
  hint?: string;
}) {
  return (
    <div
      className={cx(
        "vl-progress",
        `vl-progress--${variant}`,
        segmented && "vl-progress--segmented",
        indeterminate && "is-indeterminate",
        loading && "is-loading",
        error && "is-error",
      )}
    >
      <div className="vl-progress__head">
        <span className="vl-progress__label">{label}</span>
        {!indeterminate && <span className="vl-progress__value">{value}%</span>}
      </div>
      <div
        className="vl-progress__bar"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : value}
        style={{ "--p": value / 100 } as CSSProperties}
      >
        <span className="vl-progress__fill" />
      </div>
      {hint && <span className="vl-progress__hint">{hint}</span>}
    </div>
  );
}

/* ---------- Tabs ---------- */

interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

function VlTabs({
  variant,
  tabs,
}: {
  variant: SimpleVariant;
  tabs: TabItem[];
}) {
  const uid = useId();
  const reduceMotion = useReducedMotion();
  const enabled = tabs.filter((t) => !t.disabled);
  const [active, setActive] = useState(enabled[0]?.id ?? "");
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const i = enabled.findIndex((t) => t.id === active);
    const last = enabled.length - 1;
    let next: number;
    if (e.key === "ArrowRight") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    const id = enabled[next].id;
    setActive(id);
    refs.current[id]?.focus();
  };

  const current = tabs.find((t) => t.id === active);

  return (
    <div className={`vl-tabs vl-tabs--${variant}`}>
      <div
        className="vl-tabs__list"
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[t.id] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-tab-${t.id}`}
            aria-selected={active === t.id}
            aria-controls={`${uid}-panel-${t.id}`}
            tabIndex={active === t.id ? 0 : -1}
            disabled={t.disabled}
            className={cx("vl-tabs__tab", active === t.id && "is-active")}
            onClick={() => setActive(t.id)}
          >
            {t.label}
            {active === t.id && (
              <motion.span
                layoutId={`${uid}-ind`}
                className="vl-tabs__ind"
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 500, damping: 40 }
                }
              />
            )}
          </button>
        ))}
      </div>
      {current && (
        <motion.div
          key={current.id}
          role="tabpanel"
          id={`${uid}-panel-${current.id}`}
          aria-labelledby={`${uid}-tab-${current.id}`}
          className="vl-tabs__panel"
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {current.content}
        </motion.div>
      )}
    </div>
  );
}

/* ---------- Accordion ---------- */

interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
}

function VlAccordion({
  variant,
  items,
  multiple,
  defaultOpen = [],
}: {
  variant: SimpleVariant;
  items: AccordionItem[];
  // mehrere Einträge gleichzeitig offen
  multiple?: boolean;
  defaultOpen?: string[];
}) {
  const uid = useId();
  const [open, setOpen] = useState(defaultOpen);

  const toggle = (id: string) =>
    setOpen((list) => {
      if (list.includes(id)) return list.filter((x) => x !== id);
      return multiple ? [...list, id] : [id];
    });

  return (
    <div className={`vl-acc vl-acc--${variant}`}>
      {items.map((it) => {
        const isOpen = open.includes(it.id);
        return (
          <div key={it.id} className={cx("vl-acc__item", isOpen && "is-open")}>
            <h3 className="vl-acc__head">
              <button
                type="button"
                id={`${uid}-h-${it.id}`}
                className="vl-acc__btn"
                aria-expanded={isOpen}
                aria-controls={`${uid}-p-${it.id}`}
                disabled={it.disabled}
                onClick={() => toggle(it.id)}
              >
                {it.title}
                <span className="vl-acc__chev" aria-hidden="true" />
              </button>
            </h3>
            <div
              id={`${uid}-p-${it.id}`}
              role="region"
              aria-labelledby={`${uid}-h-${it.id}`}
              className="vl-acc__panel"
            >
              <div className="vl-acc__inner">
                <div className="vl-acc__content">{it.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Breadcrumb ---------- */

function VlCrumbs({
  variant,
  items,
  collapsible,
}: {
  variant: SimpleVariant;
  items: string[];
  // lange Pfade: mittlere Ebenen hinter "…" einklappen
  collapsible?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const collapsed = !!collapsible && !expanded && items.length > 3;
  const shown: (string | null)[] = collapsed
    ? [items[0], null, ...items.slice(-2)]
    : items;

  return (
    <nav aria-label="Breadcrumb" className={`vl-crumbs vl-crumbs--${variant}`}>
      <ol className="vl-crumbs__list">
        {shown.map((it, i) => (
          <li key={it ?? "more"} className="vl-crumbs__item">
            {it === null ? (
              <button
                type="button"
                className="vl-crumbs__more"
                aria-label="Verborgene Ebenen anzeigen"
                onClick={() => setExpanded(true)}
              >
                …
              </button>
            ) : i === shown.length - 1 ? (
              <span className="vl-crumbs__current" aria-current="page">
                {it}
              </span>
            ) : (
              <a
                className="vl-crumbs__link"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                {it}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------- Pagination ---------- */

// Erste, letzte und aktuelle Seite samt Nachbarn; Lücken als "…"
function pageItems(page: number, total: number): (number | "…")[] {
  const sorted = Array.from(
    new Set(
      [1, total, page - 1, page, page + 1].filter((n) => n >= 1 && n <= total),
    ),
  ).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((n, i) => {
    const prev = sorted[i - 1];
    if (prev !== undefined) {
      if (n - prev === 2) out.push(prev + 1);
      else if (n - prev > 2) out.push("…");
    }
    out.push(n);
  });
  return out;
}

function VlPagination({
  variant,
  total,
  defaultPage = 1,
  disabled,
  edges,
  onChange,
}: {
  variant: SimpleVariant;
  total: number;
  defaultPage?: number;
  disabled?: boolean;
  // Buttons "zur ersten" und "zur letzten Seite"
  edges?: boolean;
  onChange?: (page: number) => void;
}) {
  const [page, setPageState] = useState(defaultPage);
  const setPage = (p: number) => {
    setPageState(p);
    onChange?.(p);
  };
  return (
    <nav
      aria-label="Seitennavigation"
      className={cx(
        "vl-pager",
        `vl-pager--${variant}`,
        disabled && "is-disabled",
      )}
    >
      <ul className="vl-pager__list">
        {edges && (
          <li>
            <button
              type="button"
              className="vl-pager__btn"
              aria-label="Erste Seite"
              disabled={disabled || page === 1}
              onClick={() => setPage(1)}
            >
              <span className="vl-pager__arrows">
                <span className="vl-pager__arrow vl-pager__arrow--prev" />
                <span className="vl-pager__arrow vl-pager__arrow--prev" />
              </span>
            </button>
          </li>
        )}
        <li>
          <button
            type="button"
            className="vl-pager__btn"
            aria-label="Vorherige Seite"
            disabled={disabled || page === 1}
            onClick={() => setPage(page - 1)}
          >
            <span className="vl-pager__arrow vl-pager__arrow--prev" />
          </button>
        </li>
        {pageItems(page, total).map((p, i) => (
          <li key={`${p}-${i}`}>
            {p === "…" ? (
              <span className="vl-pager__gap" aria-hidden="true">
                …
              </span>
            ) : (
              <button
                type="button"
                className={cx("vl-pager__btn", p === page && "is-active")}
                aria-label={`Seite ${p}`}
                aria-current={p === page ? "page" : undefined}
                disabled={disabled}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            )}
          </li>
        ))}
        <li>
          <button
            type="button"
            className="vl-pager__btn"
            aria-label="Nächste Seite"
            disabled={disabled || page === total}
            onClick={() => setPage(page + 1)}
          >
            <span className="vl-pager__arrow" />
          </button>
        </li>
        {edges && (
          <li>
            <button
              type="button"
              className="vl-pager__btn"
              aria-label="Letzte Seite"
              disabled={disabled || page === total}
              onClick={() => setPage(total)}
            >
              <span className="vl-pager__arrows">
                <span className="vl-pager__arrow" />
                <span className="vl-pager__arrow" />
              </span>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

// Zeigt zur aktuellen Seite den passenden Inhalt
function PagerDemo({
  variant,
  total,
  defaultPage = 1,
  edges,
}: {
  variant: SimpleVariant;
  total: number;
  defaultPage?: number;
  edges?: boolean;
}) {
  const [page, setPage] = useState(defaultPage);
  return (
    <div className="vl-pager-demo">
      <div className="vl-pager-demo__page" aria-live="polite">
        {page}
      </div>
      <VlPagination
        variant={variant}
        total={total}
        defaultPage={defaultPage}
        edges={edges}
        onChange={setPage}
      />
    </div>
  );
}

/* ---------- Image ---------- */

// Platzhalterbild; feste Farben, da es ein Bild und kein Theme-Element ist
const DEMO_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f1923"/><stop offset="1" stop-color="#ff4655"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/><path d="M0 360L260 0H330L70 360Z" fill="#ece8e1" fill-opacity=".08"/><g fill="none" stroke="#ece8e1" stroke-opacity=".3" stroke-width="2"><polygon points="320,60 440,130 440,230 320,300 200,230 200,130"/><polygon points="320,100 405,150 405,210 320,260 235,210 235,150"/></g></svg>`,
  );

function VlImage({
  src,
  alt,
  ratio = "16 / 9",
  caption,
  loading,
}: {
  src?: string;
  alt: string;
  ratio?: string;
  caption?: string;
  // erzwingt den Ladezustand (Skeleton)
  loading?: boolean;
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    src ? "loading" : "error",
  );
  const state = loading ? "loading" : status;
  return (
    <figure className={`vl-img is-${state}`} style={{ aspectRatio: ratio }}>
      {src && (
        <img
          className="vl-img__el"
          src={src}
          alt={alt}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
        />
      )}
      {state === "loading" && (
        <span className="vl-img__skeleton" aria-hidden="true" />
      )}
      {state === "error" && (
        <span className="vl-img__fallback" role="img" aria-label={alt}>
          Kein Bild
        </span>
      )}
      <span className="vl-img__mark vl-img__mark--tl" aria-hidden="true" />
      <span className="vl-img__mark vl-img__mark--br" aria-hidden="true" />
      {caption && state === "loaded" && (
        <figcaption className="vl-img__cap">{caption}</figcaption>
      )}
    </figure>
  );
}

/* ---------- Image Slider, Hero, Text & Bild ---------- */

// Abwechslungsreiche Platzhalterbilder; feste Farben wie DEMO_IMAGE
const DEMO_TINTS = ["#ff4655", "#3d7a82", "#d9a441", "#6a5acd"];
const demoImage = (n: number) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="${n % 2}" y1="0" x2="${(n + 1) % 2}" y2="1"><stop offset="0" stop-color="#0f1923"/><stop offset="1" stop-color="${DEMO_TINTS[n % DEMO_TINTS.length]}"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/><text x="36" y="330" font-family="sans-serif" font-size="150" font-weight="700" fill="#ece8e1" fill-opacity=".12">0${n + 1}</text><g transform="translate(${(n % 3) * 70 - 70} 0)" fill="none" stroke="#ece8e1" stroke-opacity=".3" stroke-width="2"><polygon points="320,60 440,130 440,230 320,300 200,230 200,130"/><polygon points="320,100 405,150 405,210 320,260 235,210 235,150"/></g></svg>`,
  );

// Pexels (Free License): "Abstract red light burst in dark space", 1080p, ~10 MB
const DEMO_VIDEO =
  "https://videos.pexels.com/video-files/34967955/14812925_1920_1080_30fps.mp4";

const pad2 = (n: number) => String(n).padStart(2, "0");

interface SlideItem {
  src?: string;
  alt: string;
  caption?: string;
}

const DEMO_SLIDES: SlideItem[] = ["Taktik", "Karte", "Agenten", "Waffen"].map(
  (caption, n) => ({
    src: demoImage(n),
    alt: `Platzhalterbild ${n + 1}`,
    caption,
  }),
);

function VlCarousel({
  variant,
  label,
  slides,
  loop,
  thumbs,
  loading,
  disabled,
}: {
  variant: SimpleVariant;
  label: string;
  slides: SlideItem[];
  // Von der letzten Folie wieder zur ersten
  loop?: boolean;
  // Vorschaubilder statt Punkte
  thumbs?: boolean;
  // erzwingt den Ladezustand der Bilder
  loading?: boolean;
  disabled?: boolean;
}) {
  const total = slides.length;
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);

  const go = (i: number) =>
    setIndex(loop ? (i + total) % total : Math.min(Math.max(i, 0), total - 1));
  const atStart = !loop && index === 0;
  const atEnd = !loop && index === total - 1;

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const target: Record<string, number> = {
      ArrowLeft: index - 1,
      ArrowRight: index + 1,
      Home: 0,
      End: total - 1,
    };
    if (e.key in target) {
      e.preventDefault();
      go(target[e.key]);
    }
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (startX.current === null || disabled) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 48) go(index + (dx < 0 ? 1 : -1));
  };

  return (
    <div
      role="region"
      aria-roledescription="Karussell"
      aria-label={label}
      className={cx("vl-car", `vl-car--${variant}`, disabled && "is-disabled")}
      onKeyDown={onKeyDown}
    >
      <div
        className="vl-car__stage"
        onPointerDown={(e) => (startX.current = e.clientX)}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (startX.current = null)}
      >
        <div
          className="vl-car__track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((s, i) => (
            <div
              key={i}
              className="vl-car__slide"
              role="group"
              aria-roledescription="Folie"
              aria-label={`${i + 1} von ${total}`}
              aria-hidden={i !== index}
            >
              <VlImage
                src={s.src}
                alt={s.alt}
                caption={s.caption}
                loading={loading}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          className="vl-ibtn vl-ibtn--over vl-car__nav vl-car__nav--prev"
          aria-label="Vorherige Folie"
          disabled={disabled || atStart}
          onClick={() => go(index - 1)}
        >
          <span className="vl-ibtn__arrow vl-ibtn__arrow--prev" />
        </button>
        <button
          type="button"
          className="vl-ibtn vl-ibtn--over vl-car__nav vl-car__nav--next"
          aria-label="Nächste Folie"
          disabled={disabled || atEnd}
          onClick={() => go(index + 1)}
        >
          <span className="vl-ibtn__arrow" />
        </button>
      </div>
      <div className="vl-car__foot">
        <span className="vl-car__count" aria-live="polite">
          {pad2(index + 1)} / {pad2(total)}
        </span>
        {thumbs ? (
          <div className="vl-car__thumbs">
            {slides.map((s, i) => (
              <button
                key={i}
                type="button"
                className="vl-car__thumb"
                aria-label={`Folie ${i + 1}`}
                aria-current={i === index}
                disabled={disabled}
                onClick={() => go(i)}
              >
                {s.src ? (
                  <img src={s.src} alt="" draggable={false} />
                ) : (
                  <span />
                )}
              </button>
            ))}
          </div>
        ) : (
          <ul className="vl-car__dots">
            {slides.map((_, i) => (
              <li key={i}>
                <button
                  type="button"
                  className="vl-car__dot"
                  aria-label={`Folie ${i + 1}`}
                  aria-current={i === index}
                  disabled={disabled}
                  onClick={() => go(i)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

interface HeroSlide {
  kind?: "image" | "video";
  // Bild oder Video
  src?: string;
  // Standbild des Videos, solange es lädt, pausiert oder nicht abspielbar ist
  poster?: string;
  eyebrow?: string;
  title: string;
  text?: string;
  cta?: string;
}

function VlHero({
  variant,
  label,
  slides,
  interval = 6000,
}: {
  variant: SimpleVariant;
  label: string;
  slides: HeroSlide[];
  interval?: number;
}) {
  const reduceMotion = useReducedMotion();
  const total = slides.length;
  const [index, setIndex] = useState(0);
  const hasVideo = slides.some((s) => s.kind === "video");
  // Bei reduzierter Bewegung und mit Video startet nichts von selbst
  const [playing, setPlaying] = useState(!reduceMotion && !hasVideo);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const video = useRef<HTMLVideoElement>(null);
  const controls = total > 1 || hasVideo;

  const go = (i: number) => setIndex((i + total) % total);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (playing) el.play().catch(() => {});
    else el.pause();
  }, [playing, index]);

  const onKeyDown = (e: ReactKeyboardEvent<HTMLElement>) => {
    if (total < 2) return;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      go(index + (e.key === "ArrowLeft" ? -1 : 1));
    }
  };

  return (
    <section
      aria-roledescription="Karussell"
      aria-label={label}
      className={cx("vl-hero", `vl-hero--${variant}`, !playing && "is-paused")}
      onKeyDown={onKeyDown}
    >
      <div className="vl-hero__stage">
        {slides.map((s, i) => {
          const active = i === index;
          const isVideo = s.kind === "video";
          const showVideo = active && isVideo && !failed[i];
          const still = isVideo ? s.poster : s.src;
          return (
            <div
              key={i}
              className={cx("vl-hero__slide", active && "is-active")}
              role="group"
              aria-roledescription="Folie"
              aria-label={`${i + 1} von ${total}`}
              aria-hidden={!active}
              {...(active ? {} : { inert: "" })}
            >
              {still && <img className="vl-hero__img" src={still} alt="" />}
              {showVideo && (
                <video
                  ref={video}
                  className="vl-hero__video"
                  src={s.src}
                  poster={s.poster}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                  onError={() => setFailed((f) => ({ ...f, [i]: true }))}
                />
              )}
              <span className="vl-hero__shade" aria-hidden="true" />
              {active && isVideo && failed[i] && (
                <span className="vl-hero__note" role="status">
                  Video nicht verfügbar
                </span>
              )}
              <div className="vl-hero__content">
                {s.eyebrow && (
                  <span className="vl-hero__eyebrow">{s.eyebrow}</span>
                )}
                <h3 className="vl-hero__title">{s.title}</h3>
                {s.text && <p className="vl-hero__text">{s.text}</p>}
                {s.cta && <VlButton variant="primary">{s.cta}</VlButton>}
              </div>
            </div>
          );
        })}
        {controls && (
          <div className="vl-hero__bar">
            <button
              type="button"
              className="vl-ibtn vl-ibtn--over"
              aria-label={
                playing ? "Wiedergabe pausieren" : "Wiedergabe fortsetzen"
              }
              onClick={() => setPlaying((p) => !p)}
            >
              <span
                className={cx(
                  "vl-ibtn__icon",
                  playing ? "vl-ibtn__icon--pause" : "vl-ibtn__icon--play",
                )}
                aria-hidden="true"
              />
            </button>
            {total > 1 && (
              <>
                <button
                  type="button"
                  className="vl-ibtn vl-ibtn--over"
                  aria-label="Vorherige Folie"
                  onClick={() => go(index - 1)}
                >
                  <span className="vl-ibtn__arrow vl-ibtn__arrow--prev" />
                </button>
                <button
                  type="button"
                  className="vl-ibtn vl-ibtn--over"
                  aria-label="Nächste Folie"
                  onClick={() => go(index + 1)}
                >
                  <span className="vl-ibtn__arrow" />
                </button>
                <ul className="vl-hero__dots">
                  {slides.map((_, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        className="vl-hero__dot"
                        aria-label={`Folie ${i + 1}`}
                        aria-current={i === index}
                        onClick={() => go(i)}
                      >
                        {i === index && (
                          <span
                            className="vl-hero__fill"
                            style={
                              {
                                "--ms": `${interval}ms`,
                              } as CSSProperties
                            }
                            onAnimationEnd={() => go(index + 1)}
                          />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
                <span className="vl-hero__count" aria-live="off">
                  {pad2(index + 1)} / {pad2(total)}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

const HERO_IMAGES: HeroSlide[] = [
  {
    src: demoImage(0),
    eyebrow: "Neu",
    title: "Lorem ipsum dolor",
    text: "Sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
    cta: "Mehr erfahren",
  },
  {
    src: demoImage(1),
    eyebrow: "Update",
    title: "Ut enim ad minim",
    text: "Quis nostrud exercitation ullamco laboris nisi ut aliquip.",
    cta: "Details",
  },
  {
    src: demoImage(2),
    title: "Ohne Eyebrow und Aktion",
    text: "Eine Folie darf auch nur aus Überschrift und Text bestehen.",
  },
];

const HERO_MIXED: HeroSlide[] = [
  {
    kind: "video",
    src: DEMO_VIDEO,
    poster: demoImage(1),
    eyebrow: "Video",
    title: "Bewegtbild im Hintergrund",
    text: "Das Video läuft stumm und in Schleife, die Pause-Taste hält es an.",
    cta: "Ansehen",
  },
  {
    src: demoImage(3),
    eyebrow: "Bild",
    title: "Zurück zum Standbild",
    text: "Bild- und Videofolien lassen sich frei mischen.",
  },
];

const HERO_VIDEO: HeroSlide[] = [
  {
    kind: "video",
    src: DEMO_VIDEO,
    poster: demoImage(2),
    title: "Einzelnes Video",
    text: "Ohne Slider, nur mit Pause-Taste.",
  },
];

function VlMedia({
  variant,
  side = "left",
  eyebrow,
  title,
  children,
  media,
  actions,
}: {
  variant: Variant;
  side?: "left" | "right";
  eyebrow?: ReactNode;
  title: string;
  children: ReactNode;
  media: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <article
      className={cx("vl-media", `vl-media--${variant}`, `vl-media--${side}`)}
    >
      <div className="vl-media__body">
        {eyebrow}
        <h3 className="vl-media__title">{title}</h3>
        <p className="vl-media__text">{children}</p>
        {actions && <div className="vl-media__actions">{actions}</div>}
      </div>
      <div className="vl-media__media">{media}</div>
    </article>
  );
}

/* ---------- Card ---------- */

function VlCard({
  variant,
  eyebrow,
  title,
  children,
  media,
  footer,
  interactive,
}: {
  variant: Variant;
  eyebrow?: ReactNode;
  title: string;
  children: ReactNode;
  media?: ReactNode;
  footer?: ReactNode;
  // ganze Karte als Link klickbar
  interactive?: boolean;
}) {
  return (
    <article
      className={cx(
        "vl-card",
        `vl-card--${variant}`,
        interactive && "is-interactive",
      )}
    >
      {media && <div className="vl-card__media">{media}</div>}
      <div className="vl-card__body">
        {eyebrow}
        <h3 className="vl-card__title">
          {interactive ? (
            <a
              className="vl-card__link"
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        <p className="vl-card__text">{children}</p>
      </div>
      {footer && <div className="vl-card__foot">{footer}</div>}
    </article>
  );
}

/* ---------- Modal / Drawer ---------- */

type Placement = "center" | "right" | "bottom";

const FOCUSABLE =
  'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

function VlOverlay({
  open,
  onClose,
  placement = "center",
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  placement?: Placement;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const themeClass = useContext(ThemeClassContext);
  const reduceMotion = useReducedMotion();
  const uid = useId();
  const panel = useRef<HTMLDivElement>(null);

  // Fokus in den Dialog holen, Scrollen sperren, Fokus beim Schließen zurückgeben
  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus();
    };
  }, [open]);

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab" || !panel.current) return;
    const items = Array.from(
      panel.current.querySelectorAll<HTMLElement>(FOCUSABLE),
    );
    if (!items.length) {
      e.preventDefault();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === panel.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const hidden = reduceMotion
    ? { opacity: 0 }
    : placement === "right"
      ? { opacity: 0, x: "100%" }
      : placement === "bottom"
        ? { opacity: 0, y: "100%" }
        : { opacity: 0, y: 24, scale: 0.96 };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={cx(
            "design-wrapper",
            themeClass,
            "vl-overlay",
            `vl-overlay--${placement}`,
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          onKeyDown={onKeyDown}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${uid}-title`}
            tabIndex={-1}
            className={`vl-sheet vl-sheet--${placement}`}
            initial={hidden}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={hidden}
            transition={{
              duration: reduceMotion ? 0 : 0.3,
              ease: [0.2, 0.8, 0.2, 1],
            }}
          >
            <div className="vl-sheet__head">
              <h2 id={`${uid}-title`} className="vl-sheet__title">
                {title}
              </h2>
              <button
                type="button"
                className="vl-x"
                aria-label="Schließen"
                onClick={onClose}
              />
            </div>
            <div className="vl-sheet__body">{children}</div>
            {footer && <div className="vl-sheet__foot">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

type OverlayKind = "modal" | "right" | "bottom";

function OverlayDemo() {
  const [open, setOpen] = useState<OverlayKind | null>(null);
  const close = () => setOpen(null);
  return (
    <>
      <div className="vl-row">
        <VlButton variant="primary" onClick={() => setOpen("modal")}>
          Modal öffnen
        </VlButton>
        <VlButton variant="outline" onClick={() => setOpen("right")}>
          Drawer rechts
        </VlButton>
        <VlButton variant="alt" onClick={() => setOpen("bottom")}>
          Drawer unten
        </VlButton>
      </div>

      <VlOverlay
        open={open === "modal"}
        onClose={close}
        title="Aktion bestätigen"
        footer={
          <>
            <VlButton variant="outline" onClick={close}>
              Abbrechen
            </VlButton>
            <VlButton variant="primary" onClick={close}>
              Bestätigen
            </VlButton>
          </>
        }
      >
        <p style={{ margin: 0 }}>
          Möchtest du die Änderungen übernehmen? Der Dialog fängt den Fokus ein,
          schließt mit Escape und per Klick auf den Hintergrund.
        </p>
      </VlOverlay>

      <VlOverlay
        open={open === "right"}
        onClose={close}
        placement="right"
        title="Einstellungen"
        footer={
          <VlButton variant="primary" onClick={close}>
            Speichern
          </VlButton>
        }
      >
        <VlInput variant="outline" label="Name" defaultValue="4lpha" />
        <VlSwitch variant="primary" label="Benachrichtigungen" defaultChecked />
        <VlCheck variant="secondary" label="Newsletter" />
      </VlOverlay>

      <VlOverlay
        open={open === "bottom"}
        onClose={close}
        placement="bottom"
        title="Filter"
        footer={
          <>
            <VlButton variant="outline" onClick={close}>
              Zurücksetzen
            </VlButton>
            <VlButton variant="primary" onClick={close}>
              Anwenden
            </VlButton>
          </>
        }
      >
        <VlSlider
          variant="primary"
          label="Bereich"
          defaultValue={[20, 60]}
          minGap={10}
        />
        <div className="vl-row">
          <VlTag variant="outline" kind="chip" defaultSelected>
            Option 1
          </VlTag>
          <VlTag variant="outline" kind="chip">
            Option 2
          </VlTag>
          <VlTag variant="outline" kind="chip">
            Option 3
          </VlTag>
        </div>
      </VlOverlay>
    </>
  );
}

/* ---------- Toast ---------- */

const TOAST_MS = 5000;

function ToastDemo() {
  const themeClass = useContext(ThemeClassContext);
  const reduceMotion = useReducedMotion();
  const [toasts, setToasts] = useState<{ id: number; tone: Tone }[]>([]);
  const counter = useRef(0);

  const push = (tone: Tone) => {
    const id = ++counter.current;
    setToasts((list) => [...list.slice(-3), { id, tone }]);
  };
  const remove = (id: number) =>
    setToasts((list) => list.filter((t) => t.id !== id));

  return (
    <>
      <div className="vl-row">
        <VlButton variant="primary" onClick={() => push("success")}>
          Erfolg
        </VlButton>
        <VlButton variant="outline" onClick={() => push("info")}>
          Info
        </VlButton>
        <VlButton variant="alt" onClick={() => push("warn")}>
          Warnung
        </VlButton>
      </div>

      {createPortal(
        <div
          className={cx("design-wrapper", themeClass, "vl-toasts")}
          aria-live="polite"
        >
          <AnimatePresence initial={false}>
            {toasts.map((t) => {
              const info = TONES.find((x) => x.id === t.tone);
              return (
                <motion.div
                  key={t.id}
                  layout={!reduceMotion}
                  className="vl-toast-wrap"
                  initial={reduceMotion ? false : { opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 40 }}
                  transition={{ duration: reduceMotion ? 0 : 0.25 }}
                >
                  <VlAlert
                    tone={t.tone}
                    title={info?.label ?? ""}
                    live={false}
                    onClose={() => remove(t.id)}
                    extra={
                      <span
                        className="vl-alert__timer"
                        style={{ animationDuration: `${TOAST_MS}ms` }}
                        onAnimationEnd={() => remove(t.id)}
                      />
                    }
                  >
                    {info?.text}
                  </VlAlert>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </>
  );
}

/* ---------- Header / Footer ---------- */

const NAV_ITEMS = ["Seite 1", "Seite 2", "Seite 3"];

function VlHeader() {
  const [active, setActive] = useState(0);
  return (
    <header className="vl-header">
      <span className="vl-header__brand">Logo</span>
      <nav aria-label="Hauptnavigation">
        <ul className="vl-header__nav">
          {NAV_ITEMS.map((item, i) => (
            <li key={item}>
              <a
                className={cx("vl-header__link", i === active && "is-active")}
                href="#"
                aria-current={i === active ? "page" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(i);
                }}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

function VlFooter() {
  return (
    <footer className="vl-footer">
      <span>© 2026 Lorem Ipsum</span>
      <nav aria-label="Fußnavigation">
        <ul className="vl-footer__nav">
          {["Impressum", "Datenschutz", "Kontakt"].map((item) => (
            <li key={item}>
              <a
                className="vl-footer__link"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}

/* ---------- Demo-Daten ---------- */

const DEMO_TABS: TabItem[] = [
  {
    id: "overview",
    label: "Übersicht",
    content:
      "Zusammenfassung der wichtigsten Kennzahlen und letzten Aktivitäten.",
  },
  {
    id: "details",
    label: "Details",
    content: "Ausführliche Angaben mit allen Einzelwerten und Hintergründen.",
  },
  {
    id: "history",
    label: "Verlauf",
    content: "Chronologische Liste aller Änderungen und Ereignisse.",
  },
  { id: "locked", label: "Gesperrt", content: "", disabled: true },
];

const DEMO_ACCORDION: AccordionItem[] = [
  {
    id: "general",
    title: "Allgemein",
    content: "Grundlegende Einstellungen und Informationen zum Konto.",
  },
  {
    id: "details",
    title: "Details",
    content: "Weitere Angaben, die nur bei Bedarf eingeblendet werden.",
  },
  { id: "locked", title: "Gesperrt", content: "", disabled: true },
];

/* ---------- Seite ---------- */

export default function Design() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [decor, setDecor] = useState(1);
  const [switching, setSwitching] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const changeTheme = (next: Theme) => {
    if (next === theme) return;
    window.clearTimeout(timer.current);
    setSwitching(true);
    setTheme(next);
    timer.current = window.setTimeout(
      () => setSwitching(false),
      THEME_TRANSITION_MS + 50,
    );
  };

  return (
    <ThemeClassContext.Provider
      value={`design-wrapper--${theme}${switching ? " is-switching" : ""}`}
    >
      <PageWrapper>
        <div
          className={`design-wrapper design-wrapper--${theme}${switching ? " is-switching" : ""}`}
        >
          <Decor variant={decor} />

          <div className="vl-content">
            <header className="vl-header">
              <div>
                <p className="vl-eyebrow">4lpha</p>
                <h1 className="vl-h1">Design</h1>
              </div>
              <div className="vl-controls">
                <div className="vl-controls__row">
                  <span className="vl-controls__label">Theme</span>
                  <SegToggle
                    options={THEMES}
                    value={theme}
                    onChange={changeTheme}
                    label="Theme wählen"
                  />
                </div>
                <div className="vl-controls__row">
                  <span className="vl-controls__label">Decor</span>
                  <SegToggle
                    options={DECOR_OPTIONS}
                    value={decor}
                    onChange={setDecor}
                    label="Decor wählen"
                    compact
                  />
                </div>
              </div>
            </header>

            <Section title="Typografie">
              <div className="vl-type">
                <div className="vl-type__row">
                  <span className="vl-type__tag">Überschrift 1</span>
                  <div className="vl-h1">Lorem Ipsum Dolor</div>
                </div>
                <div className="vl-type__row">
                  <span className="vl-type__tag">Überschrift 2</span>
                  <div className="vl-h2">Lorem Ipsum Dolor</div>
                </div>
                <div className="vl-type__row">
                  <span className="vl-type__tag">Überschrift 3</span>
                  <div className="vl-h3">Lorem Ipsum Dolor</div>
                </div>
                <div className="vl-type__row">
                  <span className="vl-type__tag">Text groß</span>
                  <p className="vl-text-lg">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </div>
                <div className="vl-type__row">
                  <span className="vl-type__tag">Text klein</span>
                  <p className="vl-text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </div>
              </div>
            </Section>

            <Section title="Buttons & Links">
              <VariantGrid
                theme={theme}
                render={(variant) => (
                  <>
                    <VlButton variant={variant}>
                      {variantLabel(variant, theme)}
                    </VlButton>
                    <VlButton variant={variant} disabled>
                      Deaktiviert
                    </VlButton>
                  </>
                )}
              />
              <SimpleGrid
                render={(variant) => (
                  <>
                    <VlLink variant={variant}>Standard</VlLink>
                    <VlLink variant={variant} disabled>
                      Deaktiviert
                    </VlLink>
                  </>
                )}
              />
              <VariantGrid
                theme={theme}
                render={(variant) => (
                  <>
                    <VlButton variant={variant} href="#">
                      {variantLabel(variant, theme)}
                    </VlButton>
                    <VlButton variant={variant} href="#" disabled>
                      Deaktiviert
                    </VlButton>
                  </>
                )}
              />
            </Section>

            <Section title="Inputs">
              <VariantGrid
                theme={theme}
                render={(variant) => (
                  <>
                    <VlInput
                      variant={variant}
                      label="Leer"
                      placeholder="Eingabe..."
                    />
                    <VlInput
                      variant={variant}
                      label="Mit Wert"
                      defaultValue="Wert"
                    />
                    <VlInput
                      variant={variant}
                      label="Fehler"
                      defaultValue="Ungültig"
                      hint="Dieses Feld ist fehlerhaft"
                      error
                    />
                    <VlInput
                      variant={variant}
                      label="Deaktiviert"
                      placeholder="Gesperrt"
                      disabled
                    />
                  </>
                )}
              />
            </Section>

            <Section title="Select">
              <VariantGrid
                theme={theme}
                render={(variant) => (
                  <>
                    <VlSelect variant={variant} label="Standard" />
                    <VlSelect
                      variant={variant}
                      label="Fehler"
                      hint="Bitte eine Option wählen"
                      error
                    />
                    <VlSelect variant={variant} label="Deaktiviert" disabled />
                  </>
                )}
              />
            </Section>

            <Section title="Checkboxen & Radio">
              <SimpleGrid
                render={(variant) => (
                  <>
                    <VlCheck variant={variant} label="Standard" />
                    <VlCheck variant={variant} label="Aktiv" defaultChecked />
                    <VlCheck variant={variant} label="Deaktiviert" disabled />
                    <VlCheck
                      variant={variant}
                      label="Deaktiviert aktiv"
                      defaultChecked
                      disabled
                    />
                    <VlRadioGroup
                      variant={variant}
                      label="Radio"
                      defaultValue="alpha"
                      options={[
                        { value: "alpha", label: "Alpha" },
                        { value: "beta", label: "Beta" },
                        { value: "gamma", label: "Gamma", disabled: true },
                      ]}
                    />
                    <VlRadioGroup
                      variant={variant}
                      label="Radio deaktiviert"
                      defaultValue="beta"
                      disabled
                      options={[
                        { value: "alpha", label: "Alpha" },
                        { value: "beta", label: "Beta" },
                      ]}
                    />
                  </>
                )}
              />
            </Section>

            <Section title="Toggle">
              <SimpleGrid
                render={(variant) => (
                  <>
                    <VlSwitch variant={variant} label="Aus" />
                    <VlSwitch variant={variant} label="An" defaultChecked />
                    <VlSwitch variant={variant} label="Deaktiviert" disabled />
                    <VlSwitch
                      variant={variant}
                      label="Deaktiviert an"
                      defaultChecked
                      disabled
                    />
                  </>
                )}
              />
            </Section>

            <Section title="Slider">
              <SimpleGrid
                render={(variant) => (
                  <>
                    <VlSlider
                      variant={variant}
                      label="Ein Knopf"
                      defaultValue={125}
                      min={50}
                      max={200}
                    />
                    <VlSlider
                      variant={variant}
                      label="Ein Knopf Fehler"
                      defaultValue={15}
                      hint="Wert zu niedrig"
                      error
                    />
                    <VlSlider
                      variant={variant}
                      label="Ein Knopf deaktiviert"
                      defaultValue={65}
                      disabled
                    />
                    <VlSlider
                      variant={variant}
                      label="Bereich"
                      defaultValue={[20, 60]}
                      minGap={10}
                      hint="Mind. Abstand 10"
                    />
                    <VlSlider
                      variant={variant}
                      label="Bereich Fehler"
                      defaultValue={[40, 50]}
                      minGap={10}
                      hint="Bereich ungültig"
                      error
                    />
                    <VlSlider
                      variant={variant}
                      label="Bereich deaktiviert"
                      defaultValue={[30, 80]}
                      minGap={10}
                      disabled
                    />
                  </>
                )}
              />
            </Section>

            <Section title="Badge, Tag, Chip">
              <VariantGrid
                theme={theme}
                render={(variant) => (
                  <>
                    <div className="vl-group">
                      <span className="vl-sub">Badge</span>
                      <div className="vl-row">
                        <VlTag variant={variant} kind="badge">
                          Neu
                        </VlTag>
                        <VlTag variant={variant} kind="badge">
                          Live
                        </VlTag>
                      </div>
                    </div>
                    <div className="vl-group">
                      <span className="vl-sub">Tag</span>
                      <div className="vl-row">
                        <VlTag variant={variant} kind="tag">
                          Tag 1
                        </VlTag>
                        <VlTag variant={variant} kind="tag">
                          Tag 2
                        </VlTag>
                      </div>
                    </div>
                    <div className="vl-group">
                      <span className="vl-sub">Chip</span>
                      <div className="vl-row">
                        <VlTag variant={variant} kind="chip">
                          Filter
                        </VlTag>
                        <VlTag variant={variant} kind="chip" defaultSelected>
                          Aktiv
                        </VlTag>
                        <VlTag variant={variant} kind="chip" disabled>
                          Deaktiviert
                        </VlTag>
                      </div>
                    </div>
                  </>
                )}
              />
            </Section>

            <Section title="Tooltip">
              <SimpleGrid
                render={(variant) => (
                  <div className="vl-row vl-row--compact">
                    {(
                      [
                        ["Oben", "top"],
                        ["Rechts", "right"],
                        ["Unten", "bottom"],
                        ["Links", "left"],
                        ["Auto", "auto"],
                      ] as const
                    ).map(([label, side]) => (
                      <VlTooltip
                        key={side}
                        variant={variant}
                        side={side}
                        text="Kurzer Hinweistext"
                      >
                        <VlButton variant="outline">{label}</VlButton>
                      </VlTooltip>
                    ))}
                  </div>
                )}
              />
            </Section>

            <Section title="Popover">
              <SimpleGrid
                render={(variant) => (
                  <VlPopover variant={variant} label="Popover" title="Titel">
                    {(close) => (
                      <>
                        <p className="vl-popover__text">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit.
                        </p>
                        <div className="vl-popover__foot">
                          <VlButton variant="outline" onClick={close}>
                            Abbrechen
                          </VlButton>
                          <VlButton variant="primary" onClick={close}>
                            OK
                          </VlButton>
                        </div>
                      </>
                    )}
                  </VlPopover>
                )}
              />
            </Section>

            <Section title="Alert">
              <AlertDemo />
            </Section>

            <Section title="Progress">
              <SimpleGrid
                render={(variant) => (
                  <>
                    <VlProgress variant={variant} label="Standard" value={65} />
                    <VlProgress
                      variant={variant}
                      label="Segmentiert"
                      value={60}
                      segmented
                    />
                    <VlProgress
                      variant={variant}
                      label="Unbestimmt"
                      indeterminate
                    />
                    <VlProgress
                      variant={variant}
                      label="Laden"
                      value={45}
                      loading
                    />
                    <VlProgress
                      variant={variant}
                      label="Fehler"
                      value={30}
                      error
                      hint="Upload fehlgeschlagen"
                    />
                  </>
                )}
              />
            </Section>

            <Section title="Tabs">
              <SimpleGrid
                render={(variant) => (
                  <VlTabs variant={variant} tabs={DEMO_TABS} />
                )}
              />
            </Section>

            <Section title="Accordion">
              <SimpleGrid
                render={(variant) => (
                  <VlAccordion
                    variant={variant}
                    items={DEMO_ACCORDION}
                    multiple={variant === "secondary"}
                    defaultOpen={
                      variant === "secondary"
                        ? ["general", "details"]
                        : ["general"]
                    }
                  />
                )}
              />
            </Section>

            <Section title="Breadcrumb">
              <SimpleGrid
                render={(variant) => (
                  <>
                    <VlCrumbs
                      variant={variant}
                      items={["Home", "Seite 1", "Seite 2"]}
                    />
                    <VlCrumbs
                      variant={variant}
                      collapsible
                      items={[
                        "Home",
                        "Seite 1",
                        "Seite 2",
                        "Seite 3",
                        "Seite 4",
                        "Seite 5",
                      ]}
                    />
                  </>
                )}
              />
            </Section>

            <Section title="Pagination">
              <SimpleGrid
                render={(variant) => (
                  <>
                    <PagerDemo
                      variant={variant}
                      total={12}
                      defaultPage={5}
                      edges
                    />
                    <PagerDemo variant={variant} total={3} />
                    <VlPagination variant={variant} total={8} disabled />
                  </>
                )}
              />
            </Section>

            <Section title="Card">
              <VariantGrid
                theme={theme}
                render={(variant) =>
                  variant === "primary" ? (
                    <VlCard
                      variant={variant}
                      eyebrow={
                        <VlTag variant={variant} kind="badge">
                          Neu
                        </VlTag>
                      }
                      title="Lorem ipsum"
                      media={<VlImage src={DEMO_IMAGE} alt="Platzhalterbild" />}
                      footer={<VlButton variant={variant}>Mehr</VlButton>}
                    >
                      Karte mit Bild, Badge und Aktion im Fußbereich.
                    </VlCard>
                  ) : variant === "outline" ? (
                    <VlCard
                      variant={variant}
                      interactive
                      eyebrow={
                        <VlTag variant={variant} kind="tag">
                          Klickbar
                        </VlTag>
                      }
                      title="Interaktive Karte"
                      media={
                        <VlImage
                          src={DEMO_IMAGE}
                          alt="Platzhalterbild"
                          caption="Bildunterschrift"
                        />
                      }
                    >
                      Die ganze Karte ist ein Link mit Hover- und Fokuszustand.
                    </VlCard>
                  ) : (
                    <VlCard
                      variant={variant}
                      eyebrow={
                        <VlTag variant={variant} kind="tag">
                          Text
                        </VlTag>
                      }
                      title="Ohne Bild"
                      footer={<VlLink variant="primary">Details</VlLink>}
                    >
                      Schlichte Karte nur mit Text und einem Link.
                    </VlCard>
                  )
                }
              />
            </Section>

            <Section title="Image">
              <ColGrid
                cols={[
                  {
                    title: "Geladen",
                    node: (
                      <VlImage
                        src={DEMO_IMAGE}
                        alt="Platzhalterbild"
                        caption="Bildunterschrift"
                      />
                    ),
                  },
                  {
                    title: "Ohne Quelle",
                    node: <VlImage alt="Kein Bild verfügbar" />,
                  },
                  {
                    title: "Lädt",
                    node: (
                      <VlImage
                        src={DEMO_IMAGE}
                        alt="Bild wird geladen"
                        loading
                      />
                    ),
                  },
                ]}
              />
            </Section>

            <Section title="Image Slider">
              <SimpleGrid
                render={(variant) =>
                  variant === "primary" ? (
                    <VlCarousel
                      variant={variant}
                      label="Bilder mit Punkten"
                      slides={DEMO_SLIDES}
                    />
                  ) : (
                    <VlCarousel
                      variant={variant}
                      label="Bilder mit Vorschau, Endlosschleife"
                      slides={DEMO_SLIDES}
                      thumbs
                      loop
                    />
                  )
                }
              />
              <ColGrid
                cols={[
                  {
                    title: "Lädt",
                    node: (
                      <VlCarousel
                        variant="primary"
                        label="Bilder werden geladen"
                        slides={DEMO_SLIDES}
                        loading
                      />
                    ),
                  },
                  {
                    title: "Ohne Bilder",
                    node: (
                      <VlCarousel
                        variant="primary"
                        label="Keine Bilder verfügbar"
                        slides={[
                          { alt: "Kein Bild verfügbar" },
                          { alt: "Kein Bild verfügbar" },
                        ]}
                      />
                    ),
                  },
                  {
                    title: "Deaktiviert",
                    node: (
                      <VlCarousel
                        variant="primary"
                        label="Deaktivierte Bilder"
                        slides={DEMO_SLIDES}
                        disabled
                      />
                    ),
                  },
                ]}
              />
            </Section>

            <Section title="Hero">
              <div className="vl-stack">
                <div className="vl-col">
                  <span className="vl-col__title">
                    Primary · Bilder, Autoplay
                  </span>
                  <VlHero
                    variant="primary"
                    label="Hero mit Bildern"
                    slides={HERO_IMAGES}
                  />
                </div>
                <div className="vl-col">
                  <span className="vl-col__title">
                    Secondary · Video und Bild
                  </span>
                  <VlHero
                    variant="secondary"
                    label="Hero mit Video und Bild"
                    slides={HERO_MIXED}
                  />
                </div>
                <div className="vl-col">
                  <span className="vl-col__title">
                    Primary · Einzelnes Video
                  </span>
                  <VlHero
                    variant="primary"
                    label="Hero mit Video"
                    slides={HERO_VIDEO}
                  />
                </div>
              </div>
            </Section>

            <Section title="Text & Bild">
              <div className="vl-stack">
                <div className="vl-col">
                  <span className="vl-col__title">Primary · Bild links</span>
                  <VlMedia
                    variant="primary"
                    side="left"
                    eyebrow={
                      <VlTag variant="primary" kind="badge">
                        Neu
                      </VlTag>
                    }
                    title="Lorem ipsum dolor"
                    media={
                      <VlImage
                        src={demoImage(0)}
                        alt="Platzhalterbild"
                        ratio="4 / 3"
                      />
                    }
                    actions={<VlButton variant="primary">Mehr</VlButton>}
                  >
                    Sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad
                    minim veniam, quis nostrud exercitation.
                  </VlMedia>
                </div>
                <div className="vl-col">
                  <span className="vl-col__title">Outline · Bild rechts</span>
                  <VlMedia
                    variant="outline"
                    side="right"
                    title="Bild auf der rechten Seite"
                    media={
                      <VlImage
                        src={demoImage(1)}
                        alt="Platzhalterbild"
                        ratio="4 / 3"
                        caption="Bildunterschrift"
                      />
                    }
                    actions={<VlLink variant="primary">Details</VlLink>}
                  >
                    Die Spalten tauschen die Seiten, auf schmalen Bildschirmen
                    steht das Bild immer oben.
                  </VlMedia>
                </div>
                <div className="vl-col">
                  <span className="vl-col__title">Alt · Ohne Bild</span>
                  <VlMedia
                    variant="alt"
                    side="left"
                    title="Bild nicht verfügbar"
                    media={<VlImage alt="Kein Bild verfügbar" ratio="4 / 3" />}
                  >
                    Fehlt die Bildquelle, zeigt die Komponente den Platzhalter
                    und behält ihr Layout.
                  </VlMedia>
                </div>
              </div>
            </Section>

            <Section title="Modal & Drawer">
              <OverlayDemo />
            </Section>

            <Section title="Toast">
              <ToastDemo />
            </Section>

            <Section title="Header & Footer">
              <div className="vl-shell">
                <VlHeader />
                <div className="vl-shell__main">Inhalt</div>
                <VlFooter />
              </div>
            </Section>
          </div>
        </div>
      </PageWrapper>
    </ThemeClassContext.Provider>
  );
}
