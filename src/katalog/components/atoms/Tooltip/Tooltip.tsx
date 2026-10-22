import {
  cloneElement,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import type { ReactElement } from "react";
import { createPortal } from "react-dom";
import type { Side } from "../../lib/useFloat";
import { useFloat } from "../../lib/useFloat";
import type { SimpleVariant } from "../../lib/types";
import { cx } from "../../lib/cx";
import { ThemeClassContext } from "../../lib/ThemeClassContext";
import "./Tooltip.scss";

export function VlTooltip({
  variant,
  text,
  side = "top",
  children,
}: {
  variant: SimpleVariant;
  text: string;
  side?: Side;
  children: ReactElement<{ "aria-describedby"?: string }>;
}) {
  const id = useId();
  const themeClass = useContext(ThemeClassContext);
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLSpanElement>(null);
  const timer = useRef<number>();
  const { floatRef, style } = useFloat(open, anchor, side);

  // Kurze Verzögerung beim Schließen, damit der Zeiger auf den Tooltip wechseln kann
  const show = () => {
    window.clearTimeout(timer.current);
    setOpen(true);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), 120);
  };
  const hideNow = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && hideNow();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <span
        ref={anchor}
        className="vl-tip"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hideNow}
      >
        {cloneElement(children, { "aria-describedby": open ? id : undefined })}
      </span>
      {open &&
        createPortal(
          <div
            ref={floatRef}
            id={id}
            role="tooltip"
            className={cx(
              "design-wrapper",
              themeClass,
              "vl-float",
              "vl-tooltip",
              `vl-tooltip--${variant}`,
            )}
            style={style}
            onMouseEnter={show}
            onMouseLeave={hide}
          >
            {text}
          </div>,
          document.body,
        )}
    </>
  );
}
