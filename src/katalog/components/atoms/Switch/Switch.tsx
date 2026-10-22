import type { SimpleVariant } from "../../../lib/types";
import "./Switch.scss";

export function VlSwitch({
  variant,
  label,
  defaultChecked,
  disabled,
}: {
  variant: SimpleVariant;
  label: string;
  defaultChecked?: boolean;
  disabled?: boolean;
}) {
  return (
    <label
      className={`vl-switch vl-switch--${variant}${disabled ? " is-disabled" : ""}`}
    >
      <input
        type="checkbox"
        role="switch"
        className="vl-switch__input"
        defaultChecked={defaultChecked}
        disabled={disabled}
      />
      <span className="vl-switch__track" aria-hidden="true" />
      <span className="vl-switch__label">{label}</span>
    </label>
  );
}
