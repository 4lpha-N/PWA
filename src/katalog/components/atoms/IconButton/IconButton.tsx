import type { ButtonHTMLAttributes } from "react";
import { cx } from "../../../lib/cx";
import "./IconButton.scss";

type IconKind = "prev" | "next" | "play" | "pause";

export function IconButton({
  icon,
  label,
  className,
  ...rest
}: {
  icon: IconKind;
  label: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label">) {
  return (
    <button
      type="button"
      className={cx("vl-ibtn", "vl-ibtn--over", className)}
      aria-label={label}
      {...rest}
    >
      {icon === "prev" && (
        <span className="vl-ibtn__arrow vl-ibtn__arrow--prev" />
      )}
      {icon === "next" && <span className="vl-ibtn__arrow" />}
      {(icon === "play" || icon === "pause") && (
        <span
          className={cx("vl-ibtn__icon", `vl-ibtn__icon--${icon}`)}
          aria-hidden="true"
        />
      )}
    </button>
  );
}
