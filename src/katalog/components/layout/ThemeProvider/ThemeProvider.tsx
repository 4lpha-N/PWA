import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ThemeClassContext } from "../../lib/ThemeClassContext";
import type { Theme } from "../../lib/types";
import "../../styles/base.scss";
import "./ThemeProvider.scss";

// Muss zur Dauer der Farb-Transition in styles/base.scss passen ($theme-ease)
const THEME_TRANSITION_MS = 450;

// Wrapper mit Theme-Tokens; Portal-Komponenten lesen die Klassen über ThemeClassContext
export function ThemeProvider({
  theme,
  children,
}: {
  theme: Theme;
  children: ReactNode;
}) {
  const [prevTheme, setPrevTheme] = useState(theme);
  const [switching, setSwitching] = useState(false);

  // Im selben Render wie der Wechsel setzen, damit kein Frame ohne is-switching entsteht
  if (theme !== prevTheme) {
    setPrevTheme(theme);
    setSwitching(true);
  }

  useEffect(() => {
    if (!switching) return;
    const id = window.setTimeout(
      () => setSwitching(false),
      THEME_TRANSITION_MS + 50,
    );
    return () => window.clearTimeout(id);
  }, [switching, theme]);

  const themeClass = `design-wrapper--${theme}${switching ? " is-switching" : ""}`;

  return (
    <ThemeClassContext.Provider value={themeClass}>
      <div className={`design-wrapper ${themeClass}`}>{children}</div>
    </ThemeClassContext.Provider>
  );
}
