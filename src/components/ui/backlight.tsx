import { useId, type ReactElement } from "react";

type BacklightProps = {
  children?: ReactElement;
  className?: string;
  blur?: number;
  saturate?: number;
  contrast?: number;
  borderRadius?: number | string;
  disabled?: boolean;
};

export function Backlight({
  blur = 15,
  saturate = 3,
  contrast = 1,
  children,
  className,
  borderRadius,
  disabled = false,
}: BacklightProps) {
  const rawId = useId();
  const id = rawId.replace(/:/g, "");

  const radius =
    typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius;

  // Filterregion wächst proportional zum blur-Wert
  const spread = Math.round(blur * 4);
  const filterRegion = {
    x: `-${spread}%`,
    y: `-${spread}%`,
    width: `${100 + spread * 2}%`,
    height: `${100 + spread * 2}%`,
  };

  return (
    <div className={className}>
      <svg width="0" height="0" aria-hidden="true" style={{ display: "block" }}>
        <defs>
          <filter
            id={id}
            x={filterRegion.x}
            y={filterRegion.y}
            width={filterRegion.width}
            height={filterRegion.height}
            colorInterpolationFilters="sRGB"
          >
            {disabled ? (
              <feComposite in="SourceGraphic" operator="over" />
            ) : (
              <>
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation={blur * 0.25}
                  result="blurTight"
                />
                <feGaussianBlur
                  in="blurTight"
                  stdDeviation={blur * 0.5}
                  result="blurMid"
                />
                <feGaussianBlur
                  in="blurMid"
                  stdDeviation={blur * 1.2}
                  result="blurWide"
                />
                <feColorMatrix
                  type="saturate"
                  in="blurMid"
                  values={String(saturate)}
                  result="saturatedTight"
                />
                <feColorMatrix
                  type="saturate"
                  in="blurWide"
                  values={String(saturate * 0.7)}
                  result="saturatedWide"
                />
                <feComposite
                  in="saturatedTight"
                  in2="saturatedWide"
                  operator="over"
                  result="combined"
                />
                <feComponentTransfer in="combined" result="contrasted">
                  <feFuncR
                    type="linear"
                    slope={contrast}
                    intercept={-(contrast - 1) / 2}
                  />
                  <feFuncG
                    type="linear"
                    slope={contrast}
                    intercept={-(contrast - 1) / 2}
                  />
                  <feFuncB
                    type="linear"
                    slope={contrast}
                    intercept={-(contrast - 1) / 2}
                  />
                </feComponentTransfer>
                <feComposite
                  in="SourceGraphic"
                  in2="contrasted"
                  operator="over"
                />
              </>
            )}
          </filter>
        </defs>
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
