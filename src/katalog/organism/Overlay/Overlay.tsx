import { useContext, useEffect, useId, useRef } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useDragControls,
  useReducedMotion,
} from "framer-motion";
import { FOCUSABLE } from "../../lib/focus";
import { cx } from "../../lib/cx";
import { ThemeClassContext } from "../../lib/ThemeClassContext";
import "./Overlay.scss";

type Placement = "center" | "right" | "bottom";

export function VlOverlay({
  open,
  onClose,
  placement = "center",
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  placement?: Placement;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const themeClass = useContext(ThemeClassContext);
  const reduceMotion = useReducedMotion();
  const uid = useId();
  const panel = useRef<HTMLDivElement>(null);

  // Fokus in den Dialog holen, Scrollen sperren, Fokus beim Schließen zurückgeben
  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus();
    };
  }, [open]);

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab" || !panel.current) return;
    const items = Array.from(
      panel.current.querySelectorAll<HTMLElement>(FOCUSABLE),
    );
    if (!items.length) {
      e.preventDefault();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === panel.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  // Drawer unten lässt sich am Griff nach unten wegziehen
  const dragControls = useDragControls();
  const canDrag = placement === "bottom" && !reduceMotion;
  const startDrag = canDrag
    ? (e: PointerEvent<HTMLElement>) => dragControls.start(e)
    : undefined;

  // Pixel statt Prozent: Framer müsste "100%" erst umrechnen, das lässt das Panel mobil springen
  const hidden = reduceMotion
    ? { opacity: 0 }
    : placement === "right"
      ? { x: Math.min(400, window.innerWidth) + 24 }
      : placement === "bottom"
        ? { y: window.innerHeight }
        : { opacity: 0, y: 24, scale: 0.96 };
  const ease = [0.32, 0.72, 0, 1] as const;
  const enter = {
    duration: reduceMotion ? 0 : placement === "center" ? 0.32 : 0.45,
    ease,
  };
  const leave = { duration: reduceMotion ? 0 : 0.28, ease };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={cx(
            "design-wrapper",
            themeClass,
            "vl-overlay",
            `vl-overlay--${placement}`,
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: leave.duration } }}
          exit={{ opacity: 0, transition: leave }}
          onKeyDown={onKeyDown}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${uid}-title`}
            tabIndex={-1}
            className={`vl-sheet vl-sheet--${placement}`}
            initial={hidden}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              transition: enter,
            }}
            exit={{ ...hidden, transition: leave }}
            drag={canDrag ? "y" : false}
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80 || info.velocity.y > 500) onClose();
            }}
          >
            {canDrag && (
              <div
                className="vl-sheet__grip"
                aria-hidden="true"
                onPointerDown={startDrag}
              />
            )}
            <div className="vl-sheet__head" onPointerDown={startDrag}>
              <h2 id={`${uid}-title`} className="vl-sheet__title">
                {title}
              </h2>
              <button
                type="button"
                className="vl-x"
                aria-label="Schließen"
                onClick={onClose}
              />
            </div>
            <div className="vl-sheet__body">{children}</div>
            {footer && <div className="vl-sheet__foot">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
