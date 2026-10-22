import type { SimpleVariant } from "../../../lib/types";
import { cx } from "../../../lib/cx";
import "./Check.scss";

export function VlCheck({
  variant,
  label,
  defaultChecked,
  disabled,
  radio,
  name,
  value,
}: {
  variant: SimpleVariant;
  label: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  // Radio statt Checkbox: gleiche Komponente, Achteck mit Punkt
  radio?: boolean;
  name?: string;
  value?: string;
}) {
  return (
    <label
      className={cx(
        "vl-check",
        `vl-check--${variant}`,
        radio && "vl-check--radio",
        disabled && "is-disabled",
      )}
    >
      <input
        type={radio ? "radio" : "checkbox"}
        className="vl-check__input"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        disabled={disabled}
      />
      <span className="vl-check__box" aria-hidden="true" />
      <span className="vl-check__label">{label}</span>
    </label>
  );
}
