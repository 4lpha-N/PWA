import { useId, useState } from "react";
import type { ReactNode } from "react";
import type { SimpleVariant } from "../../../lib/types";
import { cx } from "../../../lib/cx";
import "./Accordion.scss";

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
}

export function VlAccordion({
  variant,
  items,
  multiple,
  defaultOpen = [],
}: {
  variant: SimpleVariant;
  items: AccordionItem[];
  // mehrere Einträge gleichzeitig offen
  multiple?: boolean;
  defaultOpen?: string[];
}) {
  const uid = useId();
  const [open, setOpen] = useState(defaultOpen);

  const toggle = (id: string) =>
    setOpen((list) => {
      if (list.includes(id)) return list.filter((x) => x !== id);
      return multiple ? [...list, id] : [id];
    });

  return (
    <div className={`vl-acc vl-acc--${variant}`}>
      {items.map((it) => {
        const isOpen = open.includes(it.id);
        return (
          <div key={it.id} className={cx("vl-acc__item", isOpen && "is-open")}>
            <h3 className="vl-acc__head">
              <button
                type="button"
                id={`${uid}-h-${it.id}`}
                className="vl-acc__btn"
                aria-expanded={isOpen}
                aria-controls={`${uid}-p-${it.id}`}
                disabled={it.disabled}
                onClick={() => toggle(it.id)}
              >
                {it.title}
                <span className="vl-acc__chev" aria-hidden="true" />
              </button>
            </h3>
            <div
              id={`${uid}-p-${it.id}`}
              role="region"
              aria-labelledby={`${uid}-h-${it.id}`}
              className="vl-acc__panel"
            >
              <div className="vl-acc__inner">
                <div className="vl-acc__content">{it.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
