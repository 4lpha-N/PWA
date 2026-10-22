import { useState } from "react";
import "./Image.scss";

export function VlImage({
  src,
  alt,
  ratio = "16 / 9",
  caption,
  loading,
}: {
  src?: string;
  alt: string;
  ratio?: string;
  caption?: string;
  // erzwingt den Ladezustand (Skeleton)
  loading?: boolean;
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    src ? "loading" : "error",
  );
  const state = loading ? "loading" : status;
  return (
    <figure className={`vl-img is-${state}`} style={{ aspectRatio: ratio }}>
      {src && (
        <img
          className="vl-img__el"
          src={src}
          alt={alt}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
        />
      )}
      {state === "loading" && (
        <span className="vl-img__skeleton" aria-hidden="true" />
      )}
      {state === "error" && (
        <span className="vl-img__fallback" role="img" aria-label={alt}>
          Kein Bild
        </span>
      )}
      <span className="vl-img__mark vl-img__mark--tl" aria-hidden="true" />
      <span className="vl-img__mark vl-img__mark--br" aria-hidden="true" />
      {caption && state === "loaded" && (
        <figcaption className="vl-img__cap">{caption}</figcaption>
      )}
    </figure>
  );
}
