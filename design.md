# Design-Seite (Valorant-Stil) – Stand und Konventionen

Route: `/PWA/design` · Dateien: [src/pages/Design.tsx](src/pages/Design.tsx) und [src/pages/Design.scss](src/pages/Design.scss).

## Harte Regeln

- Alles liegt in genau diesen zwei Dateien: Komponenten inline in `Design.tsx`, Styles in `Design.scss`. Keine weiteren Dateien anlegen.
- Farbwerte stehen nur in der Palette am Anfang von `Design.scss` (`$c-*`). Im restlichen SCSS nur Theme-Tokens (`var(--…)`) verwenden, keine Hex-Werte.
- Sprache der UI-Texte und Kommentare: Deutsch. Kommentare nur, wenn der Code das Warum nicht selbst zeigt.
- Stack: Vite, React 18, TypeScript, Dart Sass, `framer-motion` (nur für Scroll-Reveal und Overlay-/Toast-Ein-/Ausblenden), Schrift Chakra Petch (400/700, lokal in `src/index.css`).
- Prüfen nach Änderungen: `npx sass --no-source-map src/pages/Design.scss > /dev/null` und `npx tsc -p tsconfig.app.json --noEmit`.

## Gestaltungsprinzipien

- Kantig, taktisch, technisch: Ecken sind abgeschnitten (Cut-Corner), keine Rundungen.
- Texte in Überschriften, Labels und Buttons: Großbuchstaben mit weitem Letter-Spacing.
- Wiederkehrendes Element: schräger Balken (`skewX(-20deg)` bis `-24deg`), z. B. vor `.vl-h3`, in Breadcrumb-Trennern.
- Eine Seite mit drei Themes und neun umschaltbaren Hintergrund-Verzierungen, darunter alle Komponenten jeweils in allen Varianten und Zuständen (Standard, aktiv, Fehler, deaktiviert).
- Seite ist reine Demo: Komponenten sind für Wiederverwendung gedacht, aber (noch) nicht aus der Datei exportiert.

## Themes

Gesetzt über Klassen `design-wrapper--dark | --red | --light` auf `.design-wrapper`. Umschalten per `SegToggle` im Seitenkopf. Theme-Wechsel animiert 0,45 s; währenddessen hat der Wrapper `.is-switching` (schaltet alle Kind-Transitions ab, damit die Token-Animation nicht verzögert wird).

| Token                  | Dunkel                  | Akzent (rot)            | Hell                    |
| ---------------------- | ----------------------- | ----------------------- | ----------------------- |
| `--bg`                 | `$c-ink` `#0f1923`      | `$c-red` `#ff4655`      | `$c-white`              |
| `--surface`            | `$c-ink-soft` `#17232f` | `$c-red-deep` `#d02f3f` | `$c-paper` `#f5f6f7`    |
| `--fg`                 | `$c-bone` `#ece8e1`     | weiß                    | `$c-ink`                |
| `--on-fg`              | `$c-ink`                | `$c-red-deep`           | weiß                    |
| `--primary`            | `$c-red`                | weiß                    | `$c-red-text` `#cf2638` |
| `--on-primary`         | `$c-ink`                | `$c-ink`                | weiß                    |
| `--primary-hover`      | `$c-bone`               | `$c-ink`                | `$c-ink`                |
| `--alt`                | `$c-red`                | `$c-ink`                | `$c-red-text`           |
| `--on-alt`             | `$c-ink`                | weiß                    | weiß                    |
| `--error`              | `#ffb547`               | `#fff2a0`               | `#a85600`               |
| `--deco`               | `$c-red`                | `$c-ink`                | `$c-red`                |
| `--link-2` (Secondary) | `$c-bone`               | `$c-ink`                | `$c-ink`                |
| `--muted-pct`          | 68 %                    | 90 %                    | 68 %                    |
| `--edge-pct`           | 45 %                    | 75 %                    | 55 %                    |
| `--section-pct`        | 72 % (Default)          | 72 %                    | 72 % (Default)          |

Abgeleitet (für alle Themes): `--muted` (fg mit `--muted-pct`), `--edge` (fg mit `--edge-pct`, Rand der Outline-Varianten), `--line` (fg 16 %), `--deco-a/b/c` (Deko-Farbe 16/55/8 %).

Technische Details:

- Alle Farb-Tokens sind per `@property` (Syntax `<color>`) registriert, nur so lassen sie sich animieren und alle `color-mix()`-Ableitungen laufen synchron.
- `--thumb-tr` und `--thumb-bl` (`<length>`) animieren die Ecke des Toggle-Schiebers.
- Neue Farb-Tokens immer: Palette-Variable, `@property`, `.design-wrapper`-Transition-Liste und alle drei Theme-Blöcke ergänzen.

### Kontrast (geprüft, WCAG AA)

- Dunkel: unauffällig. Hell: Primär/Alt-Rot `#cf2638` mit weißem Text ≥ 4,5:1; Fehlerfarbe `#a85600` ≥ 4,5:1.
- Akzent: weißer Text auf Fläche knapp 4,5:1. Bekannte Ausnahme: dunkler Text (`--link-2`) auf der roten Fläche nur etwa 3,3–4,2:1. Weißer und dunkler Text lassen sich dort nicht gleichzeitig erfüllen.
- Outline-Ränder: mindestens 3:1 über `--edge-pct`.
- Kleinster Text: 12 px (Ausnahme: dekorativer `.vl-deco__tag`).

## Varianten

- `Variant`: `primary | outline | alt` (Buttons, Inputs, Selects, Tags, Cards usw.). Label der dritten Variante: „Outline Red“ bzw. im Akzent-Theme „Outline Dark“ (`variantLabel`).
- `SimpleVariant`: `primary | secondary` (Checkbox, Radio, Toggle, Slider, Link, Tooltip, Popover, Progress, Tabs, Accordion, Breadcrumb, Pagination). Secondary = Schwarz/Weiß je Theme (`--link-2`).
- `Tone`: `info | success | warn` (Alert, Toast).

## Gemeinsames Aufbauprinzip

1. **Cut-Corner-Mixins** (`@mixin cut`, `cut-inner`, `cut-oct`): `clip-path` mit Polygon. Standardecke `--cut: 12px`; `cut-inner` verkleinert die Ecke passend zum Rahmen (`0.586 × --bw`).
2. **Rahmen per Schichtung**: Element-Hintergrund = Rahmenfarbe `--b`, `::before` mit `inset: var(--bw)` = Füllung `--f`. Wegen `clip-path` funktionieren `border` und `outline` nicht.
3. **Fokus**: dickerer Rahmen oder Ring in Kontrastfarbe (`--ring`), nie `outline` (wird abgeschnitten).
4. **Hover** bei Buttons: Fläche fährt per `transform: scaleX` von links herein (`::after`), kein `clip-path`-Wechsel.
5. **Rahmenstärken** typisch: 2 px (Standard), 3–4 px (Fokus/aktiv), 1 px (Outline-Chips).
6. Alle Zustandsfarben laufen über lokale Custom Properties (`--b`, `--f`, `--fh`, `--ff`, `--t`, `--ht`, `--ring`, …), die in `&--primary / --outline / --alt` gesetzt werden.

## Komponenten (alle inline in `Design.tsx`)

Layout und Hilfen: `Section`, `VariantGrid`, `SimpleGrid`, `ColGrid`, `SegToggle` (Theme/Decor-Umschalter), `Decor` (9 Hintergrund-Varianten, `aria-hidden`), `reveal()` (Scroll-Reveal, bei reduzierter Bewegung aus), `cx()`.

| Komponente                   | Hinweise                                                                                                                                                 |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VlButton`                   | 14rem breit, 48 px hoch, Hover-Slide, Fokus = 4 px Ring                                                                                                  |
| `VlInput` / `VlSelect`       | Label, Hint, Fehler, deaktiviert; Variante `Variant`                                                                                                     |
| `VlCheck` / `VlRadioGroup`   | Checkbox (Cut-Corner) und Radio (`cut-oct`, Achteck), `SimpleVariant`                                                                                    |
| `VlSwitch`                   | Toggle mit animierter Schieber-Ecke (`--thumb-*`)                                                                                                        |
| `VlSlider`                   | Ein Knopf oder Bereich (`minGap`), Ticks, Tastatur, Fehler/deaktiviert                                                                                   |
| `VlLink`                     | Primary/Secondary, deaktiviert                                                                                                                           |
| `VlTag`                      | `kind`: `badge` (Höhe 20 px, 12 px Schrift), `tag`, `chip` (auswählbar, `defaultSelected`)                                                               |
| `useFloat` + `VlTooltip`     | Positionierung mit Flip, `side="top/right/bottom/left/auto"`; Tooltip per Portal, bleibt beim Überfahren offen (120 ms Schließverzögerung), Esc schließt |
| `VlPopover`                  | Portal, Fokus-Falle light (Tab/Shift+Tab verlassen das Popover und schließen es), Fokus zurück zum Auslöser, Esc und Klick außerhalb schließen           |
| `VlAlert` / `AlertDemo`      | `Tone`, optional schließbar, Timer-Balken (`vl-timer`)                                                                                                   |
| `ToastDemo`                  | Toasts mit Timer (`TOAST_MS = 5000`), Entfernen hängt an `onAnimationEnd` des Timer-Balkens – Animation nicht abschalten oder verkürzen                  |
| `VlProgress`                 | Standard, segmentiert, unbestimmt, „Laden“ (Glanzstreifen), Fehler                                                                                       |
| `VlTabs`                     | Pfeiltasten/Home/End, deaktivierte Tabs                                                                                                                  |
| `VlAccordion`                | `multiple`, `defaultOpen`, deaktiviert                                                                                                                   |
| `VlCrumbs`                   | Schräger Trenner, `collapsible` mit „…“-Button                                                                                                           |
| `VlPagination` / `PagerDemo` | `edges` (Erste/Letzte), „…“-Lücken (`pageItems`), `onChange`, deaktiviert                                                                                |
| `VlCard`                     | Eyebrow, Titel, Media, Footer, `interactive` (ganze Karte ist Link)                                                                                      |
| `VlImage`                    | Geladen, ohne Quelle (Fallback), lädt (Skeleton-Shimmer), Caption                                                                                        |
| `VlOverlay` / `OverlayDemo`  | Modal (zentriert), Drawer rechts, Drawer unten (volle Breite, Inhalt 720 px zentriert); Fokus-Falle, Esc, Scroll-Lock, Portal                            |
| `VlHeader` / `VlFooter`      | Demo-Shell mit Navigation (`NAV_ITEMS`), aktiver Link unterstrichen                                                                                      |

Seite selbst (`export default function Design`): Kopf mit Eyebrow „4lpha“, `h1` „Design“, Theme- und Decor-Umschalter, danach `Section`s in dieser Reihenfolge: Typografie, Buttons, Inputs, Select, Checkboxen & Radio, Toggle, Slider, Links, Badge/Tag/Chip, Tooltip, Popover, Alert, Progress, Tabs, Accordion, Breadcrumb, Pagination, Card, Image, Modal & Drawer, Toast, Header & Footer.

## Typografie

- `.vl-h1`: 48/50 px, Letter-Spacing 0.04em · `.vl-h2`: 32/34 px, 0.08em · `.vl-h3`: 22/24 px, 0.12em, mit schrägem Primär-Balken davor. Alle weight 800, Großbuchstaben.
- `.vl-text-lg`: 18/28 px · `.vl-text-sm`: 14 px / 1.5, Farbe `--muted`.
- Labels/Untertitel: 12 px, Großbuchstaben, 0.2–0.25em, `--muted`.
- `.vl-eyebrow`: kleine Zeile über dem Titel.

## Portals und Overlays (Stolpersteine)

- `.vl-section` hat ein `clip-path`: schneidet alles ab, was außerhalb liegt. Deshalb werden Tooltip, Popover, Modal, Drawer und Toast mit `createPortal` in `document.body` gerendert.
- Portal-Elemente tragen `design-wrapper ${themeClass}` (aus `ThemeClassContext`), damit die Theme-Tokens dort greifen. Schwebende Elemente zusätzlich `vl-float` (`position: fixed`, `z-index: 1400`).
- Selektoren für Portal-Elemente brauchen zwei Klassen Spezifität: `.design-wrapper.vl-tooltip` usw.
- Sass-Falle: `&__x` innerhalb von `.design-wrapper.vl-popover` erzeugt falsche Selektoren, daher explizite Selektoren schreiben.

## Barrierefreiheit

- Fokus ist bei allen interaktiven Komponenten sichtbar (Ring/Rahmen); Tastaturbedienung für Tabs, Accordion, Slider, Pagination, Popover, Overlays.
- Zielgrößen mindestens 24 px (Breadcrumb-Links und „…“, Footer-Links).
- Tooltip: hoverbar, per Esc schließbar, `role="tooltip"` und `aria-describedby`.
- `prefers-reduced-motion: reduce`: Transitions aus, Deko-Einblendung, Skeleton, unbestimmte und „Laden“-Progress-Animationen aus. Ausnahme: `vl-timer` des Alerts/Toasts (steuert das Entfernen).
- axe: keine Verstöße in den Design-Komponenten; offene Befunde nur in der App-Shell (BottomNavigation Kontrast ~2,96:1, doppeltes Banner).
- Responsive: unter 600 px kleinere Section-Abstände, `.vl-h1` 36/38 px, Typografie-Tabelle einspaltig.

## Typische Anpassungen

- Neues Theme: Palette-Variablen anlegen, Theme-Block mit allen Tokens samt `--muted-pct`, `--edge-pct` ergänzen, `Theme`-Typ und `THEMES` in `Design.tsx` erweitern.
- Neue Komponente: inline in `Design.tsx` ablegen, Styles im Themenblock von `Design.scss`, Varianten über `&--primary/--outline/--alt` (bzw. `--secondary`), Cut-Corner-Schichtung wiederverwenden, Demo als `Section` am Ende der Seite.
- Schrift ändern: `--font-sans`/`--font-text` in `src/index.css` (und `@font-face`); Abstände (Letter-Spacing) danach prüfen, weil die Layouts auf breite Großbuchstaben abgestimmt sind.
