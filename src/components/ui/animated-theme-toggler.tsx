import { useCallback, useRef } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import { Button } from "@mui/material";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/context/app-context";

interface AnimatedThemeTogglerProps {
  className?: string;
  duration?: number;
}

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
}: AnimatedThemeTogglerProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { labels, theme, setTheme } = useAppContext();
  const isDark = theme === "dark";

  const toggleTheme = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    const { top, left, width, height } = button.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const maxRadius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y),
    );

    const applyTheme = () => {
      const newTheme = !isDark;
      setTheme(newTheme ? "dark" : "light");
    };

    if (typeof document.startViewTransition !== "function") {
      applyTheme();
      return;
    }

    const transition = document.startViewTransition(() => {
      flushSync(applyTheme);
    });

    const ready = transition?.ready;
    if (ready && typeof ready.then === "function") {
      ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      });
    }
  }, [isDark, duration, setTheme]);

  return (
    <Button
      variant="text"
      color="secondary"
      type="button"
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(className)}
      aria-label={labels.ariaTheme.replace("{}", isDark ? "Light" : "Dark")}
    >
      {isDark ? <Sun /> : <Moon />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
