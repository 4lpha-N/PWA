export type Theme = "dark" | "red" | "light";
export type Variant = "primary" | "outline" | "alt";

export const VARIANTS: Variant[] = ["primary", "outline", "alt"];

// Für Checkbox und Link: nur Primary (Akzent) und Secondary (Schwarz/Weiß je Theme)
export type SimpleVariant = "primary" | "secondary";
export const SIMPLE_VARIANTS: SimpleVariant[] = ["primary", "secondary"];
