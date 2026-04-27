import { createContext, useContext, type Dispatch, type SetStateAction } from "react";

export type AppTheme = "light" | "dark";

export const availablePresets = [
  "slide",
  "roomToLeft",
  "roomToRight",
  "roomToTop",
  "roomToBottom",
  "cubeToLeft",
  "cubeToRight",
  "cubeToTop",
  "cubeToBottom",
  "carouselToLeft",
  "carouselToRight",
  "carouselToTop",
  "carouselToBottom",
  "moveToLeftFromRight",
  "moveToRightFromLeft",
  "moveToTopFromBottom",
  "moveToBottomFromTop",
  "fadeFromRight",
  "fadeFromLeft",
  "fadeFromBottom",
  "fadeFromTop",
  "scaleDownFromRight",
  "scaleDownFromLeft",
  "scaleDownFromBottom",
  "scaleDownFromTop",
  "scaleDownScaleUp",
  "moveToRightUnfoldLeft",
  "moveToLeftUnfoldRight",
  "moveToBottomUnfoldTop",
  "moveToTopUnfoldBottom",
  "fall",
] as const;

export type ThemeAnimationPreset = (typeof availablePresets)[number];

export interface AppContextValue {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  availablePresets: readonly ThemeAnimationPreset[];
  themeAnimationPreset: ThemeAnimationPreset;
  setThemeAnimationPreset: Dispatch<SetStateAction<ThemeAnimationPreset>>;
  labels: { [key: string]: string };
}

export const AppContext = createContext<AppContextValue | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context;
}
