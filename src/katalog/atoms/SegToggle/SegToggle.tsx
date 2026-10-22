import "./SegToggle.scss";

export function SegToggle<T extends string | number>({
  options,
  value,
  onChange,
  label,
  compact,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`vl-toggle${compact ? " vl-toggle--compact" : ""}`}
      role="group"
      aria-label={label}
    >
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          className={`vl-toggle__btn${value === o.id ? " is-active" : ""}`}
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
