import type { TabItem } from "../components/molecules/Tabs/Tabs";
import type { AccordionItem } from "../components/molecules/Accordion/Accordion";
import type { SlideItem } from "../components/organism/Carousel/Carousel";
import type { HeroSlide } from "../components/organism/Hero/Hero";

// Platzhalterbild; feste Farben, da es ein Bild und kein Theme-Element ist
export const DEMO_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f1923"/><stop offset="1" stop-color="#ff4655"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/><path d="M0 360L260 0H330L70 360Z" fill="#ece8e1" fill-opacity=".08"/><g fill="none" stroke="#ece8e1" stroke-opacity=".3" stroke-width="2"><polygon points="320,60 440,130 440,230 320,300 200,230 200,130"/><polygon points="320,100 405,150 405,210 320,260 235,210 235,150"/></g></svg>`,
  );

// Abwechslungsreiche Platzhalterbilder; feste Farben wie DEMO_IMAGE
const DEMO_TINTS = ["#ff4655", "#3d7a82", "#d9a441", "#6a5acd"];
export const demoImage = (n: number) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="${n % 2}" y1="0" x2="${(n + 1) % 2}" y2="1"><stop offset="0" stop-color="#0f1923"/><stop offset="1" stop-color="${DEMO_TINTS[n % DEMO_TINTS.length]}"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/><text x="36" y="330" font-family="sans-serif" font-size="150" font-weight="700" fill="#ece8e1" fill-opacity=".12">0${n + 1}</text><g transform="translate(${(n % 3) * 70 - 70} 0)" fill="none" stroke="#ece8e1" stroke-opacity=".3" stroke-width="2"><polygon points="320,60 440,130 440,230 320,300 200,230 200,130"/><polygon points="320,100 405,150 405,210 320,260 235,210 235,150"/></g></svg>`,
  );

// Pexels (Free License): "Abstract red light burst in dark space", 1080p, ~10 MB
const DEMO_VIDEO =
  "https://videos.pexels.com/video-files/34967955/14812925_1920_1080_30fps.mp4";

export const DEMO_SLIDES: SlideItem[] = Array.from({ length: 4 }, (_, n) => ({
  src: demoImage(n),
  alt: `Platzhalterbild ${n + 1}`,
  caption: `Bild ${n + 1}`,
}));

export const HERO_IMAGES: HeroSlide[] = [
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

export const HERO_MIXED: HeroSlide[] = [
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

export const HERO_VIDEO: HeroSlide[] = [
  {
    kind: "video",
    src: DEMO_VIDEO,
    poster: demoImage(2),
    title: "Einzelnes Video",
    text: "Ohne Slider, nur mit Pause-Taste.",
  },
];

export const DEMO_TABS: TabItem[] = [
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

export const DEMO_ACCORDION: AccordionItem[] = [
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
