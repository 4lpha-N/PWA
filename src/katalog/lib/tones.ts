export type Tone = "info" | "success" | "warn";

export const TONES: { id: Tone; label: string; icon: string; text: string }[] =
  [
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
