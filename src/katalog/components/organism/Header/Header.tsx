import { useState } from "react";
import { cx } from "../../../lib/cx";
import "./Header.scss";

const NAV_ITEMS = ["Seite 1", "Seite 2", "Seite 3"];

export function VlHeader() {
  const [active, setActive] = useState(0);
  return (
    <header className="vl-header">
      <span className="vl-header__brand">Logo</span>
      <nav aria-label="Hauptnavigation">
        <ul className="vl-header__nav">
          {NAV_ITEMS.map((item, i) => (
            <li key={item}>
              <a
                className={cx("vl-header__link", i === active && "is-active")}
                href="#"
                aria-current={i === active ? "page" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(i);
                }}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
