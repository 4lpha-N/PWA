import { useId, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { SimpleVariant } from "../../../lib/types";
import { cx } from "../../../lib/cx";
import "./Tabs.scss";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export function VlTabs({
  variant,
  tabs,
}: {
  variant: SimpleVariant;
  tabs: TabItem[];
}) {
  const uid = useId();
  const reduceMotion = useReducedMotion();
  const enabled = tabs.filter((t) => !t.disabled);
  const [active, setActive] = useState(enabled[0]?.id ?? "");
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const i = enabled.findIndex((t) => t.id === active);
    const last = enabled.length - 1;
    let next: number;
    if (e.key === "ArrowRight") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    const id = enabled[next].id;
    setActive(id);
    refs.current[id]?.focus();
  };

  const current = tabs.find((t) => t.id === active);

  return (
    <div className={`vl-tabs vl-tabs--${variant}`}>
      <div
        className="vl-tabs__list"
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[t.id] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-tab-${t.id}`}
            aria-selected={active === t.id}
            aria-controls={`${uid}-panel-${t.id}`}
            tabIndex={active === t.id ? 0 : -1}
            disabled={t.disabled}
            className={cx("vl-tabs__tab", active === t.id && "is-active")}
            onClick={() => setActive(t.id)}
          >
            {t.label}
            {active === t.id && (
              <motion.span
                layoutId={`${uid}-ind`}
                className="vl-tabs__ind"
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 500, damping: 40 }
                }
              />
            )}
          </button>
        ))}
      </div>
      {current && (
        <motion.div
          key={current.id}
          role="tabpanel"
          id={`${uid}-panel-${current.id}`}
          aria-labelledby={`${uid}-tab-${current.id}`}
          className="vl-tabs__panel"
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {current.content}
        </motion.div>
      )}
    </div>
  );
}
