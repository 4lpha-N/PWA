import { useId, type ReactElement } from "react";

type BacklightProps = {
  children?: ReactElement;
  className?: string;
  blur?: number;
  borderRadius?: number | string;
  disabled?: boolean;
};

export function Backlight({
  blur = 20,
  children,
  className,
  borderRadius,
  disabled = false,
}: BacklightProps) {
  const id = useId();

  const radius =
    typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius;

  return (
    <div className={className}>
      <svg width="0" height="0" aria-hidden="true">
        <filter id={id} y="-50%" x="-50%" width="200%" height="200%">
          {!disabled && (
            <>
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation={blur}
                result="blurred"
              ></feGaussianBlur>
              <feColorMatrix
                type="saturate"
                in="blurred"
                values="4"
              ></feColorMatrix>
            </>
          )}
          <feComposite in="SourceGraphic" operator="over"></feComposite>
        </filter>
      </svg>

      <div
        style={{
          filter: `url(#${id})`,
          borderRadius: radius,
        }}
      >
        {children}
      </div>
    </div>
  );
}
