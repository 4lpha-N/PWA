import type { CSSProperties, ReactNode } from "react";
import { cx } from "../../../lib/cx";
import "./Grid.scss";

type GridBp = "base" | "md" | "lg" | "xl";
export type Responsive<T> = T | Partial<Record<GridBp, T>>;
type GridAlign = "start" | "center" | "end" | "stretch";

// Je Breakpoint eine CSS-Variable (--c-span, --c-span-md, …); fehlende Stufen füllt das SCSS von unten auf
function gridVars(
  name: string,
  value: Responsive<number> | undefined,
): Record<string, number> {
  if (value === undefined) return {};
  if (typeof value === "number") return { [`--c-${name}`]: value };
  const out: Record<string, number> = {};
  (Object.keys(value) as GridBp[]).forEach((bp) => {
    const v = value[bp];
    if (v !== undefined) {
      out[bp === "base" ? `--c-${name}` : `--c-${name}-${bp}`] = v;
    }
  });
  return out;
}

export function GridContainer({
  fluid,
  max,
  children,
}: {
  fluid?: boolean;
  max?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cx("vl-g-container", fluid && "vl-g-container--fluid")}
      style={max ? ({ "--container-max": max } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}

export function GridRow({
  gap,
  align,
  children,
}: {
  gap?: "sm" | "lg";
  align?: GridAlign;
  children: ReactNode;
}) {
  return (
    <div
      className={cx(
        "vl-g-row",
        gap && `vl-g-row--${gap}`,
        align && `vl-g-row--${align}`,
      )}
    >
      {children}
    </div>
  );
}

// span/offset/order: Zahl für alle Breiten oder je Breakpoint { base, md, lg, xl }
export function GridCol({
  span,
  offset,
  order,
  align,
  children,
}: {
  span?: Responsive<number>;
  offset?: Responsive<number>;
  order?: Responsive<number>;
  align?: GridAlign;
  children: ReactNode;
}) {
  const style = {
    ...gridVars("span", span),
    ...gridVars("offset", offset),
    ...gridVars("order", order),
  } as CSSProperties;
  return (
    <div
      className={cx("vl-g-col", align && `vl-g-col--${align}`)}
      style={style}
    >
      {children}
    </div>
  );
}

export function GridCell({
  accent,
  height,
  children,
}: {
  accent?: boolean;
  height?: number;
  children: ReactNode;
}) {
  return (
    <div
      className={cx("vl-g-cell", accent && "vl-g-cell--accent")}
      style={height ? { minHeight: height } : undefined}
    >
      {children}
    </div>
  );
}
