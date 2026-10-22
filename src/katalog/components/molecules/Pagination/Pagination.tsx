import { useState } from "react";
import type { SimpleVariant } from "../../../lib/types";
import { cx } from "../../../lib/cx";
import "./Pagination.scss";

// Erste, letzte und aktuelle Seite samt Nachbarn; Lücken als "…"
function pageItems(page: number, total: number): (number | "…")[] {
  const sorted = Array.from(
    new Set(
      [1, total, page - 1, page, page + 1].filter((n) => n >= 1 && n <= total),
    ),
  ).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((n, i) => {
    const prev = sorted[i - 1];
    if (prev !== undefined) {
      if (n - prev === 2) out.push(prev + 1);
      else if (n - prev > 2) out.push("…");
    }
    out.push(n);
  });
  return out;
}

export function VlPagination({
  variant,
  total,
  defaultPage = 1,
  disabled,
  edges,
  onChange,
}: {
  variant: SimpleVariant;
  total: number;
  defaultPage?: number;
  disabled?: boolean;
  // Buttons "zur ersten" und "zur letzten Seite"
  edges?: boolean;
  onChange?: (page: number) => void;
}) {
  const [page, setPageState] = useState(defaultPage);
  const setPage = (p: number) => {
    setPageState(p);
    onChange?.(p);
  };
  return (
    <nav
      aria-label="Seitennavigation"
      className={cx(
        "vl-pager",
        `vl-pager--${variant}`,
        edges && "vl-pager--edges",
        disabled && "is-disabled",
      )}
    >
      <ul className="vl-pager__list">
        {edges && (
          <li className="vl-pager__nav">
            <button
              type="button"
              className="vl-pager__btn"
              aria-label="Erste Seite"
              disabled={disabled || page === 1}
              onClick={() => setPage(1)}
            >
              <span className="vl-pager__arrows">
                <span className="vl-pager__arrow vl-pager__arrow--prev" />
                <span className="vl-pager__arrow vl-pager__arrow--prev" />
              </span>
            </button>
          </li>
        )}
        <li className="vl-pager__nav">
          <button
            type="button"
            className="vl-pager__btn"
            aria-label="Vorherige Seite"
            disabled={disabled || page === 1}
            onClick={() => setPage(page - 1)}
          >
            <span className="vl-pager__arrow vl-pager__arrow--prev" />
          </button>
        </li>
        {pageItems(page, total).map((p, i) => (
          <li key={`${p}-${i}`} className="vl-pager__num">
            {p === "…" ? (
              <span className="vl-pager__gap" aria-hidden="true">
                …
              </span>
            ) : (
              <button
                type="button"
                className={cx("vl-pager__btn", p === page && "is-active")}
                aria-label={`Seite ${p}`}
                aria-current={p === page ? "page" : undefined}
                disabled={disabled}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            )}
          </li>
        ))}
        <li className="vl-pager__nav">
          <button
            type="button"
            className="vl-pager__btn"
            aria-label="Nächste Seite"
            disabled={disabled || page === total}
            onClick={() => setPage(page + 1)}
          >
            <span className="vl-pager__arrow" />
          </button>
        </li>
        {edges && (
          <li className="vl-pager__nav">
            <button
              type="button"
              className="vl-pager__btn"
              aria-label="Letzte Seite"
              disabled={disabled || page === total}
              onClick={() => setPage(total)}
            >
              <span className="vl-pager__arrows">
                <span className="vl-pager__arrow" />
                <span className="vl-pager__arrow" />
              </span>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
