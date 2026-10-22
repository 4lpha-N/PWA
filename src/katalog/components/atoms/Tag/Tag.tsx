import { useState } from "react";
import type { ReactNode } from "react";
import type { Variant } from "../../../lib/types";
import { cx } from "../../../lib/cx";
import "./Tag.scss";

type TagKind = "badge" | "tag" | "chip";

export function VlTag({
  variant,
  kind,
  children,
  disabled,
  defaultSelected,
}: {
  variant: Variant;
  kind: TagKind;
  children: ReactNode;
  disabled?: boolean;
  defaultSelected?: boolean;
}) {
  const [selected, setSelected] = useState(!!defaultSelected);
  const className = cx(
    "vl-tag",
    `vl-tag--${kind}`,
    `vl-tag--${variant}`,
    kind === "chip" && selected && "is-selected",
    disabled && "is-disabled",
  );

  if (kind === "chip") {
    return (
      <button
        type="button"
        className={className}
        aria-pressed={selected}
        disabled={disabled}
        onClick={() => setSelected((s) => !s)}
      >
        <span className="vl-tag__dot" aria-hidden="true" />
        {children}
      </button>
    );
  }
  return (
    <span className={className}>
      {kind === "tag" && <span className="vl-tag__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
