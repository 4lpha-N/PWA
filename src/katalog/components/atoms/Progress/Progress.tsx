import type { CSSProperties } from "react";
import type { SimpleVariant } from "../../../lib/types";
import { cx } from "../../../lib/cx";
import "./Progress.scss";

export function VlProgress({
  variant,
  label,
  value = 0,
  indeterminate,
  loading,
  segmented,
  error,
  hint,
}: {
  variant: SimpleVariant;
  label: string;
  value?: number;
  indeterminate?: boolean;
  // Fortschritt bekannt, Balken zeigt zusätzlich Aktivität
  loading?: boolean;
  segmented?: boolean;
  error?: boolean;
  hint?: string;
}) {
  return (
    <div
      className={cx(
        "vl-progress",
        `vl-progress--${variant}`,
        segmented && "vl-progress--segmented",
        indeterminate && "is-indeterminate",
        loading && "is-loading",
        error && "is-error",
      )}
    >
      <div className="vl-progress__head">
        <span className="vl-progress__label">{label}</span>
        {!indeterminate && <span className="vl-progress__value">{value}%</span>}
      </div>
      <div
        className="vl-progress__bar"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : value}
        style={{ "--p": value / 100 } as CSSProperties}
      >
        <span className="vl-progress__fill" />
      </div>
      {hint && <span className="vl-progress__hint">{hint}</span>}
    </div>
  );
}
