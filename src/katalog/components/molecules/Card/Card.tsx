import type { ReactNode } from "react";
import type { Variant } from "../../../lib/types";
import { cx } from "../../../lib/cx";
import "./Card.scss";

export function VlCard({
  variant,
  eyebrow,
  title,
  children,
  media,
  footer,
  interactive,
}: {
  variant: Variant;
  eyebrow?: ReactNode;
  title: string;
  children: ReactNode;
  media?: ReactNode;
  footer?: ReactNode;
  // ganze Karte als Link klickbar
  interactive?: boolean;
}) {
  return (
    <article
      className={cx(
        "vl-card",
        `vl-card--${variant}`,
        interactive && "is-interactive",
      )}
    >
      {media && <div className="vl-card__media">{media}</div>}
      <div className="vl-card__body">
        {eyebrow}
        <h3 className="vl-card__title">
          {interactive ? (
            <a
              className="vl-card__link"
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        <p className="vl-card__text">{children}</p>
      </div>
      {footer && <div className="vl-card__foot">{footer}</div>}
    </article>
  );
}
