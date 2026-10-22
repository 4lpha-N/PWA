// Anzahl muss zu den Varianten in layout/Decor/Decor.tsx passen
export const DECOR_OPTIONS = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  label: String(i + 1),
}));
