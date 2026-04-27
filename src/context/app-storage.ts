import { availablePresets, type ThemeAnimationPreset } from "./app-context";

const STORAGE_KEY = "app-settings";

export interface AppSettings {
  themeAnimationPreset?: ThemeAnimationPreset;
}

function readSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AppSettings) : {};
  } catch {
    return {};
  }
}

function writeSettings(patch: Partial<AppSettings>): void {
  const current = readSettings();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...patch }));
}

export function readThemeAnimationPreset(): ThemeAnimationPreset {
  const stored = readSettings().themeAnimationPreset;
  if (stored && (availablePresets as readonly string[]).includes(stored)) {
    return stored;
  }
  return "slide";
}

export function writeThemeAnimationPreset(preset: ThemeAnimationPreset): void {
  writeSettings({ themeAnimationPreset: preset });
}
