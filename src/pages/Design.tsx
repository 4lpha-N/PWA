import { useEffect, useId, useRef, useState } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
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

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="vl-section">
      <h2 className="vl-section__title">{title}</h2>
      {children}
    </section>
  );
}

function VariantGrid({
  theme,
  render,
}: {
  theme: Theme;
  render: (variant: Variant) => ReactNode;
}) {
  return (
    <div className="vl-grid">
      {VARIANTS.map((variant) => (
        <div className="vl-col" key={variant}>
          <span className="vl-col__title">{variantLabel(variant, theme)}</span>
          {render(variant)}
        </div>
      ))}
    </div>
  );
}

function SimpleGrid({
  render,
}: {
  render: (variant: SimpleVariant) => ReactNode;
}) {
  return (
    <div className="vl-grid">
      {SIMPLE_VARIANTS.map((variant) => (
        <div className="vl-col" key={variant}>
          <span className="vl-col__title">
            {variant === "primary" ? "Primary" : "Secondary"}
          </span>
          {render(variant)}
        </div>
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
}

function VlButton({
  variant,
  type = "button",
  children,
  ...rest
}: VlButtonProps) {
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
}: {
  variant: SimpleVariant;
  label: string;
  defaultChecked?: boolean;
  disabled?: boolean;
}) {
  return (
    <label
      className={`vl-check vl-check--${variant}${disabled ? " is-disabled" : ""}`}
    >
      <input
        type="checkbox"
        className="vl-check__input"
        defaultChecked={defaultChecked}
        disabled={disabled}
      />
      <span className="vl-check__box" aria-hidden="true" />
      <span className="vl-check__label">{label}</span>
    </label>
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
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <div className="vl-type__row">
                <span className="vl-type__tag">Text klein</span>
                <p className="vl-text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            </div>
          </Section>

          <Section title="Buttons">
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

          <Section title="Checkboxen">
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

          <Section title="Links">
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
          </Section>
        </div>
      </div>
    </PageWrapper>
  );
}
