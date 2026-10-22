import type { ButtonHTMLAttributes } from "react";
import type { Variant } from "../../../lib/types";
import "./Button.scss";

interface VlButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: Variant;
  // Navigation statt Aktion: wird als a-Tag ausgegeben
  href?: string;
}

export function VlButton({
  variant,
  type = "button",
  href,
  children,
  ...rest
}: VlButtonProps) {
  if (href !== undefined) {
    const className = `vl-btn vl-btn--${variant}`;
    // Ein a-Tag kennt kein disabled: ohne href und mit aria-disabled
    if (rest.disabled) {
      return (
        <a className={className} role="link" aria-disabled="true">
          {children}
        </a>
      );
    }
    return (
      <a className={className} href={href} onClick={(e) => e.preventDefault()}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={`vl-btn vl-btn--${variant}`} {...rest}>
      {children}
    </button>
  );
}
