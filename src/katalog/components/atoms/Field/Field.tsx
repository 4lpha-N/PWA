import { useId } from "react";
import type { Variant } from "../../../lib/types";
import "./Field.scss";

interface FieldProps {
  variant: Variant;
  label: string;
  hint?: string;
  error?: boolean;
  disabled?: boolean;
}

function fieldClass(variant: Variant, error?: boolean, disabled?: boolean) {
  return [
    "vl-field",
    `vl-field--${variant}`,
    error ? "is-error" : "",
    disabled ? "is-disabled" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function VlInput({
  variant,
  label,
  hint,
  error,
  disabled,
  placeholder,
  defaultValue,
}: FieldProps & { placeholder?: string; defaultValue?: string }) {
  const id = useId();
  return (
    <div className={fieldClass(variant, error, disabled)}>
      <label className="vl-field__label" htmlFor={id}>
        {label}
      </label>
      <div className="vl-field__box">
        <input
          id={id}
          type="text"
          className="vl-field__control"
          placeholder={placeholder}
          defaultValue={defaultValue}
          disabled={disabled}
          aria-invalid={error || undefined}
        />
      </div>
      {hint && <span className="vl-field__hint">{hint}</span>}
    </div>
  );
}

export function VlSelect({
  variant,
  label,
  hint,
  error,
  disabled,
}: FieldProps) {
  const id = useId();
  return (
    <div className={fieldClass(variant, error, disabled)}>
      <label className="vl-field__label" htmlFor={id}>
        {label}
      </label>
      <div className="vl-field__box vl-field__box--select">
        <select
          id={id}
          className="vl-field__control vl-field__control--select"
          defaultValue=""
          disabled={disabled}
          aria-invalid={error || undefined}
        >
          <option value="" disabled>
            Bitte wählen
          </option>
          <option value="1">Auswahl 1</option>
          <option value="2">Auswahl 2</option>
          <option value="3">Auswahl 3</option>
        </select>
      </div>
      {hint && <span className="vl-field__hint">{hint}</span>}
    </div>
  );
}
