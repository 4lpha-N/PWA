# Katalog – Übernahme in ein neues Projekt

Der Ordner `katalog` ist eigenständig: Er importiert nur `react`, `react-dom` und `framer-motion`, nichts von außerhalb.

## Struktur

Jede Komponente liegt in `components/<Ebene>/<Name>/<Name>.tsx` mit passender `<Name>.scss`. Klassen sind globale `vl-`-BEM-Klassen (keine CSS Modules).

| Ebene                   | Inhalt                                                                                                                                       |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/atoms/`     | Button (`VlButton`), Field (`VlInput`, `VlSelect`), Check, Radio, Switch, Slider, Link, Tag, Tooltip, Image, Progress, IconButton, SegToggle |
| `components/molecules/` | Alert, Breadcrumb (`VlCrumbs`), Pagination, Tabs, Accordion, Popover, Card, Media                                                            |
| `components/organism/`  | Header, Footer, Hero, Carousel, Overlay (Modal/Drawer)                                                                                       |
| `components/layout/`    | `ThemeProvider`, Grid (`GridContainer`, `GridRow`, `GridCol`, `GridCell`), Decor (Hintergrund-Dekor)                                         |
| `lib/`                  | `types` (Theme, Variant), `cx`, `ThemeClassContext`, `useFloat`, `focus`, `pad2`, `tones`                                                    |
| `styles/`               | `_mixins.scss` (Farben, Mixins), `base.scss` (Typografie, Schließen-Knopf, Float, Reduced Motion)                                            |

Nur für die Demo (kann im neuen Projekt weg): `Demo.tsx` (die komplette Demo-Seite, zugleich Vorlage für Beispielaufrufe aller Komponenten), `lib/demo.ts`, `lib/decor.ts`, `styles/demo.scss`. `Demo.tsx` hat keine App-Abhängigkeiten, sie wird mit `<Demo />` gerendert.

## Pakete

```bash
npm i react@^18.3.1 react-dom@^18.3.1 framer-motion@^12
npm i -D sass typescript
```

- `sass` (Dart Sass): alle Styles nutzen `@use`.
- Tailwind oder andere UI-Bibliotheken werden nicht benötigt.
- Das Projekt nutzt `@property` für animierte Theme-Farben (moderne Browser).

## Font

Der Katalog setzt keine `font-family`, sondern erbt sie von der App. Im aktuellen Projekt ist das **Chakra Petch** (400, 700) über `html { font-family }` (siehe `src/index.css`).

```bash
npm i @fontsource/chakra-petch
```

```css
@import "@fontsource/chakra-petch/400.css";
@import "@fontsource/chakra-petch/700.css";

html {
  font-family: "Chakra Petch", sans-serif;
}
```

Kein Katalog-Code nutzt Michroma, Orbitron o. ä. Diese Schriften gehören zur restlichen App.

## Einbindung

1. Die App mit `ThemeProvider` umgeben. Er setzt Theme-Tokens und Klassen (`dark`, `red`, `light`) und importiert `styles/base.scss` selbst.
2. Komponenten direkt importieren, deren `.scss` ist mit eingebunden.

```tsx
import { ThemeProvider } from "./katalog/components/layout/ThemeProvider/ThemeProvider";
import { VlButton } from "./katalog/components/atoms/Button/Button";

export function App() {
  return (
    <ThemeProvider theme="dark">
      <VlButton variant="primary">Start</VlButton>
    </ThemeProvider>
  );
}
```

Hinweise:

- `theme` ist gesteuert (`"dark" | "red" | "light"`). Der Wechsel animiert die Farben; die Dauer (`THEME_TRANSITION_MS` in `ThemeProvider.tsx`) muss zu `$theme-ease` in `ThemeProvider.scss` passen.
- Tooltip, Popover und Overlay rendern per Portal in `document.body` und lesen die Theme-Klassen über `ThemeClassContext`. Sie müssen daher innerhalb des `ThemeProvider` stehen.
- CSS-Reihenfolge: `ThemeProvider` (bzw. `base.scss`) vor den Komponenten importieren, wie in `Demo.tsx`.

## Framer Motion

Genutzt werden nur `motion`, `useReducedMotion`, `AnimatePresence` und `useDragControls`. Es gibt keine globale Einrichtung (`MotionConfig`, `LazyMotion`, `LayoutGroup`) und keine Plugins.

**Im Katalog (kommt mit):**

- `Tabs`: animierter Indikator mit `layoutId`.
- `Hero`: `useReducedMotion`.
- `Overlay`: `AnimatePresence`, `motion`, `useDragControls`, `useReducedMotion`.

**Nur in `Demo.tsx` (Demo-Muster, nicht im Katalog):**

- `reveal()`, `Section`, `VariantGrid`, `SimpleGrid`, `ColGrid`: Einblenden beim Scrollen (`whileInView`).
- `AlertDemo`: Exit-Animation beim Schließen. `VlAlert` selbst animiert den Austritt nicht, dafür muss `VlAlert` in `AnimatePresence` + `motion.div` stehen.
- `ToastDemo`: Toast-Stapel (Portal, `AnimatePresence`, `layout`, Timer über `.vl-alert__timer`). Es gibt keine Toast-Komponente.
- `PagerDemo`, `OverlayDemo`: Zustand und Verdrahtung für Pagination und Overlay.

Der Code dieser Muster steht unten zum Nachbauen.

## Demo-Muster zum Nachbauen

Alle Snippets stammen aus `Demo.tsx`. Gemeinsame Imports:

```tsx
import { useContext, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
```

### Einblenden beim Scrollen

`reveal()` liefert die `motion`-Props. Bei `prefers-reduced-motion` ist das Ergebnis leer, das Element erscheint sofort. Jedes Element nutzt `useReducedMotion()` und spreizt das Ergebnis auf ein `motion.*`.

```tsx
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
```

Spalten in Rastern werden gestaffelt eingeblendet (`delay = 0.1 + i * 0.08`). Die drei Grid-Helfer unterscheiden sich nur in der Datenquelle:

```tsx
// Beschriftung der Button-Varianten (hängt vom Theme ab)
function variantLabel(variant: Variant, theme: Theme) {
  if (variant === "primary") return "Primary";
  if (variant === "outline") return "Outline";
  return theme === "red" ? "Outline Dark" : "Outline Red";
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
```

Die zugehörigen Klassen (`.vl-section`, `.vl-grid`, `.vl-col`) stehen in `styles/demo.scss` und müssen mit übernommen werden. `VARIANTS`, `SIMPLE_VARIANTS` und die Typen kommen aus `lib/types.ts`.

### Alert

`VlAlert` (`components/molecules/Alert/Alert.tsx`) hat die Props `tone` (`"info" | "success" | "warn"`), `title`, `children`, `onClose?`, `live?` und `extra?`.

- `onClose`: zeigt den Schließen-Knopf (`.vl-x`). Der Alert blendet sich nicht selbst aus, der Zustand liegt beim Aufrufer.
- `live`: Standard `true`, setzt `role="alert"` (bei `warn`) bzw. `role="status"`. Im Toast-Host `false`, weil dort der Container (`aria-live="polite"`) ansagt.
- `extra`: freier Slot am Ende, im Toast der Timer-Balken.
- Icon und Beispieltexte pro Ton kommen aus `lib/tones.ts` (`TONES`).

Schließen mit Exit-Animation (Höhe und Abstand auf 0, damit der Rest nachrückt). `.vl-alertlist` und `__item { overflow: hidden }` stehen in `styles/demo.scss`:

```tsx
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
```

### Toast

Es gibt keine Toast-Komponente, ein Toast ist ein `VlAlert` in einem Portal-Host. Das CSS dafür liegt bereits im Katalog in `components/molecules/Alert/Alert.scss`:

- `@keyframes vl-timer`: Balken von `scaleX(1)` auf `scaleX(0)`.
- `.vl-alert__timer`: der Balken, Dauer wird inline per `animationDuration` gesetzt.
- `.vl-toast-wrap`: Schatten, `pointer-events: auto`. Hover/Fokus pausiert den Timer.
- `.design-wrapper.vl-toasts`: Host, `position: fixed` unten rechts, `z-index: 1400`, `pointer-events: none`.

Ablauf: Der Host ist ein eigener `design-wrapper` im `document.body`, damit er die Theme-Tokens bekommt. Die Klassen liefert `ThemeClassContext`, deshalb muss die Komponente innerhalb des `ThemeProvider` stehen. Ein Toast verschwindet, wenn die Timer-Animation endet (`onAnimationEnd`) oder per Schließen-Knopf. Maximal 4 gleichzeitig (`slice(-3)` plus der neue).

```tsx
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
```

`cx` kommt aus `lib/cx.ts`, `ThemeClassContext` aus `lib/ThemeClassContext.ts`, `Tone` und `TONES` aus `lib/tones.ts`.

### Pagination-Demo

Zeigt zur aktuellen Seite den passenden Inhalt. `VlPagination` meldet die Seite über `onChange`. Die Klassen `.vl-pager-demo` und `__page` stehen in `styles/demo.scss`.

```tsx
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
```

### Overlay-Demo

`VlOverlay` ist gesteuert (`open`, `onClose`) und hat die Platzierungen Modal (Standard), `placement="right"` und `placement="bottom"`. Pro Variante gibt es `title` und `footer`. Ein Zustand hält, welche Variante offen ist:

```tsx
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
```

### Theme-Umschalter der Demo-Seite

In `Demo.tsx` steuert ein `SegToggle` das Theme, der State liegt in der Seite. `ThemeProvider` bekommt es als Prop:

```tsx
const THEMES: { id: Theme; label: string }[] = [
  { id: "dark", label: "Dunkel" },
  { id: "red", label: "Akzent" },
  { id: "light", label: "Hell" },
];

const [theme, setTheme] = useState<Theme>("dark");
// ...
<ThemeProvider theme={theme}>
  {/* Inhalt, Umschalter: onChange={setTheme} */}
</ThemeProvider>;
```

Weitere Demo-Klassen (`.vl-content`, `.vl-header` der Seite, `.vl-eyebrow`, `.vl-controls`, `.vl-row`, `.vl-group`, `.vl-sub`, `.vl-stack`, `.vl-shell`, `.vl-type`) stehen in `styles/demo.scss`. Sie werden nur für die Demo-Seite gebraucht.
