import { useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent } from "react";
import { pad2 } from "../../../lib/pad2";
import type { SimpleVariant } from "../../../lib/types";
import { cx } from "../../../lib/cx";
import { VlImage } from "../../atoms/Image/Image";
import { IconButton } from "../../atoms/IconButton/IconButton";
import "./Carousel.scss";

export interface SlideItem {
  src?: string;
  alt: string;
  caption?: string;
}

export function VlCarousel({
  variant,
  label,
  slides,
  loop,
  thumbs,
  loading,
  disabled,
}: {
  variant: SimpleVariant;
  label: string;
  slides: SlideItem[];
  // Von der letzten Folie wieder zur ersten
  loop?: boolean;
  // Vorschaubilder statt Punkte
  thumbs?: boolean;
  // erzwingt den Ladezustand der Bilder
  loading?: boolean;
  disabled?: boolean;
}) {
  const total = slides.length;
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);

  const go = (i: number) =>
    setIndex(loop ? (i + total) % total : Math.min(Math.max(i, 0), total - 1));
  const atStart = !loop && index === 0;
  const atEnd = !loop && index === total - 1;

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const target: Record<string, number> = {
      ArrowLeft: index - 1,
      ArrowRight: index + 1,
      Home: 0,
      End: total - 1,
    };
    if (e.key in target) {
      e.preventDefault();
      go(target[e.key]);
    }
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (startX.current === null || disabled) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 48) go(index + (dx < 0 ? 1 : -1));
  };

  return (
    <div
      role="region"
      aria-roledescription="Karussell"
      aria-label={label}
      className={cx("vl-car", `vl-car--${variant}`, disabled && "is-disabled")}
      onKeyDown={onKeyDown}
    >
      <div
        className="vl-car__stage"
        onPointerDown={(e) => (startX.current = e.clientX)}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (startX.current = null)}
      >
        <div
          className="vl-car__track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((s, i) => (
            <div
              key={i}
              className="vl-car__slide"
              role="group"
              aria-roledescription="Folie"
              aria-label={`${i + 1} von ${total}`}
              aria-hidden={i !== index}
            >
              <VlImage
                src={s.src}
                alt={s.alt}
                caption={s.caption}
                loading={loading}
              />
            </div>
          ))}
        </div>
        <IconButton
          icon="prev"
          label="Vorherige Folie"
          className="vl-car__nav vl-car__nav--prev"
          disabled={disabled || atStart}
          onClick={() => go(index - 1)}
        />
        <IconButton
          icon="next"
          label="Nächste Folie"
          className="vl-car__nav vl-car__nav--next"
          disabled={disabled || atEnd}
          onClick={() => go(index + 1)}
        />
      </div>
      <div className="vl-car__foot">
        <span className="vl-car__count" aria-live="polite">
          {pad2(index + 1)} / {pad2(total)}
        </span>
        {thumbs ? (
          <div className="vl-car__thumbs">
            {slides.map((s, i) => (
              <button
                key={i}
                type="button"
                className="vl-car__thumb"
                aria-label={`Folie ${i + 1}`}
                aria-current={i === index}
                disabled={disabled}
                onClick={() => go(i)}
              >
                {s.src ? (
                  <img src={s.src} alt="" draggable={false} />
                ) : (
                  <span />
                )}
              </button>
            ))}
          </div>
        ) : (
          <ul className="vl-car__dots">
            {slides.map((_, i) => (
              <li key={i}>
                <button
                  type="button"
                  className="vl-car__dot"
                  aria-label={`Folie ${i + 1}`}
                  aria-current={i === index}
                  disabled={disabled}
                  onClick={() => go(i)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
