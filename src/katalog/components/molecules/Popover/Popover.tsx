import {
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import type { Side } from "../../../lib/useFloat";
import { useFloat } from "../../../lib/useFloat";
import { FOCUSABLE } from "../../../lib/focus";
import type { SimpleVariant } from "../../../lib/types";
import { cx } from "../../../lib/cx";
import { ThemeClassContext } from "../../../lib/ThemeClassContext";
import { VlButton } from "../../atoms/Button/Button";
import "./Popover.scss";

export function VlPopover({
  variant,
  label,
  title,
  side = "bottom",
  children,
}: {
  variant: SimpleVariant;
  label: string;
  title: string;
  side?: Side;
  children: (close: () => void) => ReactNode;
}) {
  const uid = useId();
  const themeClass = useContext(ThemeClassContext);
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLSpanElement>(null);
  const { floatRef, style, ready } = useFloat(open, anchor, side);
  const trigger = () => anchor.current?.querySelector<HTMLElement>("button");
  const [restore, setRestore] = useState(false);
  const close = useCallback(() => {
    setOpen(false);
    setRestore(true);
  }, []);

  // Fokus zurück auf den Auslöser, sonst geht er mit dem entfernten Inhalt verloren
  useEffect(() => {
    if (restore) anchor.current?.querySelector<HTMLElement>("button")?.focus();
  }, [restore]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onDown = (e: globalThis.PointerEvent) => {
      const target = e.target as Node;
      if (
        !anchor.current?.contains(target) &&
        !floatRef.current?.contains(target)
      )
        setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, floatRef, close]);

  // Sichtbar erst nach der Positionierung, erst dann lässt sich fokussieren
  useEffect(() => {
    if (ready) floatRef.current?.focus({ preventScroll: true });
  }, [ready, floatRef]);

  // Der Inhalt liegt am Ende des DOM: Tab führt sonst daran vorbei bzw. aus der Seite heraus
  const items = () =>
    Array.from(
      floatRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
    );
  const onTriggerKey = (e: ReactKeyboardEvent) => {
    if (!open || e.key !== "Tab") return;
    if (e.shiftKey) {
      // Fokus verl\u00e4sst die Gruppe nach hinten
      setOpen(false);
      return;
    }
    e.preventDefault();
    (items()[0] ?? floatRef.current)?.focus();
  };
  const onPanelKey = (e: ReactKeyboardEvent) => {
    if (e.key !== "Tab") return;
    const list = items();
    const active = document.activeElement;
    if (e.shiftKey && (active === floatRef.current || active === list[0])) {
      e.preventDefault();
      trigger()?.focus();
    } else if (
      !e.shiftKey &&
      (!list.length || active === list[list.length - 1])
    ) {
      // Weiter mit dem Element, das im DOM auf den Ausl\u00f6ser folgt
      e.preventDefault();
      const all = Array.from(
        document.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => !floatRef.current?.contains(el));
      const from = trigger();
      setOpen(false);
      all[(from ? all.indexOf(from) : -1) + 1]?.focus();
    }
  };

  return (
    <>
      <span ref={anchor} className="vl-tip" onKeyDown={onTriggerKey}>
        <VlButton
          variant={variant === "primary" ? "primary" : "outline"}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? `${uid}-pop` : undefined}
          onClick={() => {
            setRestore(false);
            setOpen((o) => !o);
          }}
        >
          {label}
        </VlButton>
      </span>
      {open &&
        createPortal(
          <div
            ref={floatRef}
            id={`${uid}-pop`}
            role="dialog"
            aria-labelledby={`${uid}-title`}
            tabIndex={-1}
            onKeyDown={onPanelKey}
            className={cx(
              "design-wrapper",
              themeClass,
              "vl-float",
              "vl-popover",
              `vl-popover--${variant}`,
            )}
            style={style}
          >
            <h3 id={`${uid}-title`} className="vl-popover__title">
              {title}
            </h3>
            {children(close)}
          </div>,
          document.body,
        )}
    </>
  );
}
