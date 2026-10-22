import { useId } from "react";
import type { SimpleVariant } from "../../../lib/types";
import { VlCheck } from "../Check/Check";
import "./Radio.scss";

export function VlRadioGroup({
  variant,
  label,
  options,
  defaultValue,
  disabled,
}: {
  variant: SimpleVariant;
  label: string;
  options: { value: string; label: string; disabled?: boolean }[];
  defaultValue?: string;
  disabled?: boolean;
}) {
  const name = useId();
  return (
    <div className="vl-radios" role="radiogroup" aria-labelledby={`${name}-l`}>
      <span id={`${name}-l`} className="vl-radios__label">
        {label}
      </span>
      {options.map((o) => (
        <VlCheck
          key={o.value}
          radio
          variant={variant}
          name={name}
          value={o.value}
          label={o.label}
          defaultChecked={o.value === defaultValue}
          disabled={disabled || o.disabled}
        />
      ))}
    </div>
  );
}
