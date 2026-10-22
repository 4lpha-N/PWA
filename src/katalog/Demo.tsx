import { useContext, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import "./styles/base.scss";
import { ThemeProvider } from "./components/layout/ThemeProvider/ThemeProvider";
import "./styles/demo.scss";
import {
  DEMO_ACCORDION,
  DEMO_IMAGE,
  DEMO_SLIDES,
  DEMO_TABS,
  HERO_IMAGES,
  HERO_MIXED,
  HERO_VIDEO,
  demoImage,
} from "./lib/demo";
import type { SimpleVariant, Theme, Variant } from "./lib/types";
import { SIMPLE_VARIANTS, VARIANTS } from "./lib/types";
import type { Tone } from "./lib/tones";
import { TONES } from "./lib/tones";
import { cx } from "./lib/cx";
import { ThemeClassContext } from "./lib/ThemeClassContext";
import { Decor } from "./components/layout/Decor/Decor";
import { DECOR_OPTIONS } from "./lib/decor";
import { SegToggle } from "./components/atoms/SegToggle/SegToggle";
import { VlButton } from "./components/atoms/Button/Button";
import { VlInput, VlSelect } from "./components/atoms/Field/Field";
import { VlCheck } from "./components/atoms/Check/Check";
import { VlSwitch } from "./components/atoms/Switch/Switch";
import { VlSlider } from "./components/atoms/Slider/Slider";
import { VlLink } from "./components/atoms/Link/Link";
import { VlRadioGroup } from "./components/atoms/Radio/Radio";
import { VlTag } from "./components/atoms/Tag/Tag";
import { VlAlert } from "./components/molecules/Alert/Alert";
import { VlProgress } from "./components/atoms/Progress/Progress";
import { VlTabs } from "./components/molecules/Tabs/Tabs";
import { VlAccordion } from "./components/molecules/Accordion/Accordion";
import { VlCrumbs } from "./components/molecules/Breadcrumb/Breadcrumb";
import { VlPagination } from "./components/molecules/Pagination/Pagination";
import { VlImage } from "./components/atoms/Image/Image";
import { VlCarousel } from "./components/organism/Carousel/Carousel";
import { VlHero } from "./components/organism/Hero/Hero";
import { VlMedia } from "./components/molecules/Media/Media";
import { VlCard } from "./components/molecules/Card/Card";
import { VlOverlay } from "./components/organism/Overlay/Overlay";
import {
  GridCell,
  GridCol,
  GridContainer,
  GridRow,
} from "./components/layout/Grid/Grid";
import { VlHeader } from "./components/organism/Header/Header";
import { VlFooter } from "./components/organism/Footer/Footer";
import { VlTooltip } from "./components/atoms/Tooltip/Tooltip";
import { VlPopover } from "./components/molecules/Popover/Popover";

const THEMES: { id: Theme; label: string }[] = [
  { id: "dark", label: "Dunkel" },
  { id: "red", label: "Akzent" },
  { id: "light", label: "Hell" },
];

function variantLabel(variant: Variant, theme: Theme) {
  if (variant === "primary") return "Primary";
  if (variant === "outline") return "Outline";
  return theme === "red" ? "Outline Dark" : "Outline Red";
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

/* ---------- Demos ---------- */

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

/* ---------- Seite ---------- */

export default function Demo() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [decor, setDecor] = useState(1);
  return (
    <ThemeProvider theme={theme}>
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
                onChange={setTheme}
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div className="vl-type__row">
              <span className="vl-type__tag">Text klein</span>
              <p className="vl-text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
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
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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
            render={(variant) => <VlTabs variant={variant} tabs={DEMO_TABS} />}
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
                  variant === "secondary" ? ["general", "details"] : ["general"]
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
                <PagerDemo variant={variant} total={12} defaultPage={5} edges />
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
                  <VlImage src={DEMO_IMAGE} alt="Bild wird geladen" loading />
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
              <span className="vl-col__title">Primary · Bilder, Autoplay</span>
              <VlHero
                variant="primary"
                label="Hero mit Bildern"
                slides={HERO_IMAGES}
              />
            </div>
            <div className="vl-col">
              <span className="vl-col__title">Secondary · Video und Bild</span>
              <VlHero
                variant="secondary"
                label="Hero mit Video und Bild"
                slides={HERO_MIXED}
              />
            </div>
            <div className="vl-col">
              <span className="vl-col__title">Primary · Einzelnes Video</span>
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
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation.
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
                Die Spalten tauschen die Seiten, auf schmalen Bildschirmen steht
                das Bild immer oben.
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
                Fehlt die Bildquelle, zeigt die Komponente den Platzhalter und
                behält ihr Layout.
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

        <Section title="Grid">
          <p className="vl-text-sm">
            12 Spalten, mobile-first. Breakpoints: Basis unter 720 px, md ab
            720, lg ab 1024, xl ab 1440. Props je Spalte: span, offset, order,
            align – als Zahl oder je Breakpoint.
          </p>
          <div className="vl-stack">
            <div className="vl-col">
              <span className="vl-col__title">
                12 Spalten (Basis 2, ab md 1)
              </span>
              <GridRow gap="sm">
                {Array.from({ length: 12 }, (_, i) => (
                  <GridCol key={i} span={{ base: 2, md: 1 }}>
                    <GridCell>{i + 1}</GridCell>
                  </GridCol>
                ))}
              </GridRow>
            </div>
            <div className="vl-col">
              <span className="vl-col__title">Spalten (span)</span>
              <GridRow>
                <GridCol span={6}>
                  <GridCell>span 6</GridCell>
                </GridCol>
                <GridCol span={6}>
                  <GridCell accent>span 6</GridCell>
                </GridCol>
                <GridCol span={4}>
                  <GridCell>span 4</GridCell>
                </GridCol>
                <GridCol span={4}>
                  <GridCell accent>span 4</GridCell>
                </GridCol>
                <GridCol span={4}>
                  <GridCell>span 4</GridCell>
                </GridCol>
                <GridCol span={3}>
                  <GridCell accent>span 3</GridCell>
                </GridCol>
                <GridCol span={9}>
                  <GridCell>span 9</GridCell>
                </GridCol>
              </GridRow>
            </div>
            <div className="vl-col">
              <span className="vl-col__title">Versatz (offset)</span>
              <GridRow>
                <GridCol span={6} offset={3}>
                  <GridCell accent>span 6 · offset 3</GridCell>
                </GridCol>
                <GridCol span={3}>
                  <GridCell>span 3</GridCell>
                </GridCol>
                <GridCol span={3} offset={3}>
                  <GridCell accent>span 3 · offset 3</GridCell>
                </GridCol>
                <GridCol span={4} offset={8}>
                  <GridCell>span 4 · offset 8</GridCell>
                </GridCol>
              </GridRow>
            </div>
            <div className="vl-col">
              <span className="vl-col__title">Responsive</span>
              <GridRow>
                {[0, 1, 2, 3].map((i) => (
                  <GridCol key={i} span={{ base: 12, md: 6, lg: 3 }}>
                    <GridCell accent={i % 2 === 1}>
                      base 12 · md 6 · lg 3
                    </GridCell>
                  </GridCol>
                ))}
              </GridRow>
            </div>
            <div className="vl-col">
              <span className="vl-col__title">
                Reihenfolge (order, DOM: A, B, C)
              </span>
              <GridRow>
                <GridCol span={4} order={3}>
                  <GridCell>A · order 3</GridCell>
                </GridCol>
                <GridCol span={4} order={1}>
                  <GridCell accent>B · order 1</GridCell>
                </GridCol>
                <GridCol span={4} order={2}>
                  <GridCell>C · order 2</GridCell>
                </GridCol>
              </GridRow>
            </div>
            <div className="vl-col">
              <span className="vl-col__title">Verschachtelt</span>
              <GridRow>
                <GridCol span={{ base: 12, md: 8 }}>
                  <GridRow gap="sm">
                    <GridCol span={6}>
                      <GridCell accent height={72}>
                        innen 6
                      </GridCell>
                    </GridCol>
                    <GridCol span={6}>
                      <GridCell accent height={72}>
                        innen 6
                      </GridCell>
                    </GridCol>
                  </GridRow>
                </GridCol>
                <GridCol span={{ base: 12, md: 4 }}>
                  <GridCell height={72}>span 4</GridCell>
                </GridCol>
              </GridRow>
            </div>
            <div className="vl-col">
              <span className="vl-col__title">
                Ausrichtung (Zeile: center, Spalte 3: end)
              </span>
              <GridRow align="center">
                <GridCol span={4}>
                  <GridCell height={96}>96 px</GridCell>
                </GridCol>
                <GridCol span={4}>
                  <GridCell accent>auto</GridCell>
                </GridCol>
                <GridCol span={4} align="end">
                  <GridCell>end</GridCell>
                </GridCol>
              </GridRow>
            </div>
            <div className="vl-col">
              <span className="vl-col__title">
                Container: begrenzt (hier max. 480 px) und fluid
              </span>
              <GridContainer max="480px">
                <GridRow>
                  <GridCol span={6}>
                    <GridCell>begrenzt</GridCell>
                  </GridCol>
                  <GridCol span={6}>
                    <GridCell accent>zentriert</GridCell>
                  </GridCol>
                </GridRow>
              </GridContainer>
              <GridContainer fluid>
                <GridRow>
                  <GridCol span={6}>
                    <GridCell>fluid</GridCell>
                  </GridCol>
                  <GridCol span={6}>
                    <GridCell accent>volle Breite</GridCell>
                  </GridCol>
                </GridRow>
              </GridContainer>
            </div>
          </div>
        </Section>
      </div>
    </ThemeProvider>
  );
}
