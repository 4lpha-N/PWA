import type { ReactNode } from "react";
import type { SimpleVariant } from "../../../lib/types";
import "./Link.scss";

export function VlLink({
  variant,
  children,
  disabled,
}: {
  variant: SimpleVariant;
  children: ReactNode;
  disabled?: boolean;
}) {
  const className = `vl-link vl-link--${variant}${disabled ? " is-disabled" : ""}`;
  if (disabled) {
    return (
      <a className={className} role="link" aria-disabled="true">
        {children}
      </a>
    );
  }
  return (
    <a className={className} href="#" onClick={(e) => e.preventDefault()}>
      {children}
    </a>
  );
}
