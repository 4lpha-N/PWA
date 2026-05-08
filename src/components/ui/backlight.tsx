import { useEffect, useId, useState, type ReactElement } from "react";

type BacklightProps = {
  children?: ReactElement;
  className?: string;
  blur?: number;
  saturate?: number;
  contrast?: number;
  borderRadius?: number | string;
  disabled?: boolean;
  startAnimation?: {
    enabled?: boolean;
    duration?: number; // ms
  };
};

export function Backlight({
  blur = 15,
  saturate = 3,
  contrast = 1,
  children,
  className,
  borderRadius,
  disabled = false,
  startAnimation,
}: BacklightProps) {
  const rawId = useId();
  const id = rawId.replace(/:/g, "");

  const animationEnabled = startAnimation?.enabled ?? false;
  const animationDuration = Math.max(0, startAnimation?.duration ?? 700);

  const [glowOpacity, setGlowOpacity] = useState(0);

  useEffect(() => {
    if (disabled || !animationEnabled) {
      return;
    }

    if (animationDuration === 0) {
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / animationDuration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out
      setGlowOpacity(eased);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame((now) => {
      setGlowOpacity(0);
      tick(now);
    });
    return () => cancelAnimationFrame(frame);
  }, [animationEnabled, animationDuration, disabled]);

  const effectiveGlowOpacity = disabled
    ? 0
    : !animationEnabled || animationDuration === 0
      ? 1
      : glowOpacity;

  const radius =
    typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius;

  // Filterregion wächst proportional zum blur-Wert
  const spread = Math.round(blur * 2);
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
                  stdDeviation={blur * 0.5}
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
                {animationEnabled ? (
                  <>
                    <feComponentTransfer
                      in="contrasted"
                      result="contrastedAnimated"
                    >
                      <feFuncA type="linear" slope={effectiveGlowOpacity} />
                    </feComponentTransfer>
                    <feComposite
                      in="SourceGraphic"
                      in2="contrastedAnimated"
                      operator="over"
                    />
                  </>
                ) : (
                  <feComposite
                    in="SourceGraphic"
                    in2="contrasted"
                    operator="over"
                  />
                )}
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
