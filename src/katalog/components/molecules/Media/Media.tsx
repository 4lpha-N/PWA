import type { ReactNode } from "react";
import type { Variant } from "../../../lib/types";
import { cx } from "../../../lib/cx";
import "./Media.scss";

export function VlMedia({
  variant,
  side = "left",
  eyebrow,
  title,
  children,
  media,
  actions,
}: {
  variant: Variant;
  side?: "left" | "right";
  eyebrow?: ReactNode;
  title: string;
  children: ReactNode;
  media: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <article
      className={cx("vl-media", `vl-media--${variant}`, `vl-media--${side}`)}
    >
      <div className="vl-media__body">
        {eyebrow}
        <h3 className="vl-media__title">{title}</h3>
        <p className="vl-media__text">{children}</p>
        {actions && <div className="vl-media__actions">{actions}</div>}
      </div>
      <div className="vl-media__media">{media}</div>
    </article>
  );
}
