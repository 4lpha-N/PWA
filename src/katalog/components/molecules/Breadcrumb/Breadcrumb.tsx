import { useState } from "react";
import type { SimpleVariant } from "../../../lib/types";
import "./Breadcrumb.scss";

export function VlCrumbs({
  variant,
  items,
  collapsible,
}: {
  variant: SimpleVariant;
  items: string[];
  // lange Pfade: mittlere Ebenen hinter "…" einklappen
  collapsible?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const collapsed = !!collapsible && !expanded && items.length > 3;
  const shown: (string | null)[] = collapsed
    ? [items[0], null, ...items.slice(-2)]
    : items;

  return (
    <nav aria-label="Breadcrumb" className={`vl-crumbs vl-crumbs--${variant}`}>
      <ol className="vl-crumbs__list">
        {shown.map((it, i) => (
          <li key={it ?? "more"} className="vl-crumbs__item">
            {it === null ? (
              <button
                type="button"
                className="vl-crumbs__more"
                aria-label="Verborgene Ebenen anzeigen"
                onClick={() => setExpanded(true)}
              >
                …
              </button>
            ) : i === shown.length - 1 ? (
              <span className="vl-crumbs__current" aria-current="page">
                {it}
              </span>
            ) : (
              <a
                className="vl-crumbs__link"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                {it}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
