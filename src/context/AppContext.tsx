import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useTheme } from "next-themes";
import {
  AppContext,
  availablePresets,
  type AppTheme,
  type ThemeAnimationPreset,
} from "./app-context";
import {
  readThemeAnimationPreset,
  writeThemeAnimationPreset,
} from "./app-storage";
import labels from "../lib/labels";

export function AppProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [themeAnimationPreset, setThemeAnimationPresetState] =
    useState<ThemeAnimationPreset>(readThemeAnimationPreset);

  const setThemeAnimationPreset = useCallback(
    (
      preset:
        | ThemeAnimationPreset
        | ((prev: ThemeAnimationPreset) => ThemeAnimationPreset),
    ) => {
      setThemeAnimationPresetState((prev) => {
        const next = typeof preset === "function" ? preset(prev) : preset;
        writeThemeAnimationPreset(next);
        return next;
      });
    },
    [],
  );

  const theme: AppTheme = resolvedTheme === "dark" ? "dark" : "light";

  const value = useMemo(
    () => ({
      labels,
      theme,
      setTheme: (nextTheme: AppTheme) => setTheme(nextTheme),
      availablePresets,
      themeAnimationPreset,
      setThemeAnimationPreset,
    }),
    [theme, setTheme, themeAnimationPreset, setThemeAnimationPreset],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
