import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, RefObject } from "react";

export type Side = "top" | "right" | "bottom" | "left" | "auto";

// Positioniert ein nach document.body verschobenes Element am Anker, mit Wechsel der Seite bei Platzmangel
export function useFloat(
  open: boolean,
  anchor: RefObject<HTMLElement | null>,
  side: Side,
) {
  const floatRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const a = anchor.current?.getBoundingClientRect();
      const f = floatRef.current?.getBoundingClientRect();
      if (!a || !f) return;
      const gap = 8;
      const edge = 8;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let s: Exclude<Side, "auto">;
      if (side === "auto") {
        // Erste Seite mit genug Platz, sonst die mit dem meisten
        const order = ["top", "bottom", "right", "left"] as const;
        const room = {
          top: a.top - f.height - gap - edge,
          bottom: vh - a.bottom - f.height - gap - edge,
          left: a.left - f.width - gap - edge,
          right: vw - a.right - f.width - gap - edge,
        };
        s =
          order.find((o) => room[o] >= 0) ??
          order.reduce((best, o) => (room[o] > room[best] ? o : best));
      } else {
        s = side;
        if (s === "top" && a.top - f.height - gap < edge) s = "bottom";
        else if (s === "bottom" && a.bottom + f.height + gap > vh - edge)
          s = "top";
        else if (s === "left" && a.left - f.width - gap < edge) s = "right";
        else if (s === "right" && a.right + f.width + gap > vw - edge)
          s = "left";
      }
      let top: number;
      let left: number;
      if (s === "top" || s === "bottom") {
        top = s === "top" ? a.top - f.height - gap : a.bottom + gap;
        left = a.left + a.width / 2 - f.width / 2;
      } else {
        left = s === "left" ? a.left - f.width - gap : a.right + gap;
        top = a.top + a.height / 2 - f.height / 2;
      }
      setPos({
        top: Math.round(Math.min(Math.max(top, edge), vh - f.height - edge)),
        left: Math.round(Math.min(Math.max(left, edge), vw - f.width - edge)),
      });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
      setPos(null);
    };
  }, [open, anchor, side]);

  const style: CSSProperties = pos
    ? { top: pos.top, left: pos.left }
    : { top: 0, left: 0, visibility: "hidden" };
  return { floatRef, style, ready: pos !== null };
}
