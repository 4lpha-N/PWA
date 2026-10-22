import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { pad2 } from "../../lib/pad2";
import type { SimpleVariant } from "../../lib/types";
import { cx } from "../../lib/cx";
import { VlButton } from "../../atoms/Button/Button";
import { IconButton } from "../../atoms/IconButton/IconButton";
import "./Hero.scss";

export interface HeroSlide {
  kind?: "image" | "video";
  // Bild oder Video
  src?: string;
  // Standbild des Videos, solange es lädt, pausiert oder nicht abspielbar ist
  poster?: string;
  eyebrow?: string;
  title: string;
  text?: string;
  cta?: string;
}

export function VlHero({
  variant,
  label,
  slides,
  interval = 6000,
}: {
  variant: SimpleVariant;
  label: string;
  slides: HeroSlide[];
  interval?: number;
}) {
  const reduceMotion = useReducedMotion();
  const total = slides.length;
  const [index, setIndex] = useState(0);
  const hasVideo = slides.some((s) => s.kind === "video");
  // Bei reduzierter Bewegung und mit Video startet nichts von selbst
  const [playing, setPlaying] = useState(!reduceMotion && !hasVideo);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const video = useRef<HTMLVideoElement>(null);
  const controls = total > 1 || hasVideo;

  const go = (i: number) => setIndex((i + total) % total);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (playing) el.play().catch(() => {});
    else el.pause();
  }, [playing, index]);

  const onKeyDown = (e: ReactKeyboardEvent<HTMLElement>) => {
    if (total < 2) return;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      go(index + (e.key === "ArrowLeft" ? -1 : 1));
    }
  };

  return (
    <section
      aria-roledescription="Karussell"
      aria-label={label}
      className={cx("vl-hero", `vl-hero--${variant}`, !playing && "is-paused")}
      onKeyDown={onKeyDown}
    >
      <div className="vl-hero__stage">
        {slides.map((s, i) => {
          const active = i === index;
          const isVideo = s.kind === "video";
          const showVideo = active && isVideo && !failed[i];
          const still = isVideo ? s.poster : s.src;
          return (
            <div
              key={i}
              className={cx("vl-hero__slide", active && "is-active")}
              role="group"
              aria-roledescription="Folie"
              aria-label={`${i + 1} von ${total}`}
              aria-hidden={!active}
              {...(active ? {} : { inert: "" })}
            >
              {still && <img className="vl-hero__img" src={still} alt="" />}
              {showVideo && (
                <video
                  ref={video}
                  className="vl-hero__video"
                  src={s.src}
                  poster={s.poster}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                  onError={() => setFailed((f) => ({ ...f, [i]: true }))}
                />
              )}
              <span className="vl-hero__shade" aria-hidden="true" />
              {active && isVideo && failed[i] && (
                <span className="vl-hero__note" role="status">
                  Video nicht verfügbar
                </span>
              )}
              <div className="vl-hero__content">
                {s.eyebrow && (
                  <span className="vl-hero__eyebrow">{s.eyebrow}</span>
                )}
                <h3 className="vl-hero__title">{s.title}</h3>
                {s.text && <p className="vl-hero__text">{s.text}</p>}
                {s.cta && <VlButton variant="primary">{s.cta}</VlButton>}
              </div>
            </div>
          );
        })}
        {controls && (
          <div className="vl-hero__bar">
            <IconButton
              icon={playing ? "pause" : "play"}
              label={playing ? "Wiedergabe pausieren" : "Wiedergabe fortsetzen"}
              onClick={() => setPlaying((p) => !p)}
            />
            {total > 1 && (
              <>
                <IconButton
                  icon="prev"
                  label="Vorherige Folie"
                  onClick={() => go(index - 1)}
                />
                <IconButton
                  icon="next"
                  label="Nächste Folie"
                  onClick={() => go(index + 1)}
                />
                <ul className="vl-hero__dots">
                  {slides.map((_, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        className="vl-hero__dot"
                        aria-label={`Folie ${i + 1}`}
                        aria-current={i === index}
                        onClick={() => go(i)}
                      >
                        {i === index && (
                          <span
                            className="vl-hero__fill"
                            style={
                              {
                                "--ms": `${interval}ms`,
                              } as CSSProperties
                            }
                            onAnimationEnd={() => go(index + 1)}
                          />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
                <span className="vl-hero__count" aria-live="off">
                  {pad2(index + 1)} / {pad2(total)}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
