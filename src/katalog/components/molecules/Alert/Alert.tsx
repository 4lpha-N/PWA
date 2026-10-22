import type { ReactNode } from "react";
import type { Tone } from "../../../lib/tones";
import { TONES } from "../../../lib/tones";
import "./Alert.scss";

export function VlAlert({
  tone,
  title,
  children,
  onClose,
  live = true,
  extra,
}: {
  tone: Tone;
  title: string;
  children: ReactNode;
  onClose?: () => void;
  // false, wenn ein umgebender Live-Bereich (Toast-Host) die Ansage übernimmt
  live?: boolean;
  extra?: ReactNode;
}) {
  const icon = TONES.find((t) => t.id === tone)?.icon;
  return (
    <div
      className={`vl-alert vl-alert--${tone}`}
      role={live ? (tone === "warn" ? "alert" : "status") : undefined}
    >
      <span className="vl-alert__icon" aria-hidden="true">
        {icon}
      </span>
      <div className="vl-alert__body">
        <strong className="vl-alert__title">{title}</strong>
        <p className="vl-alert__text">{children}</p>
      </div>
      {onClose && (
        <button
          type="button"
          className="vl-x"
          aria-label="Schließen"
          onClick={onClose}
        />
      )}
      {extra}
    </div>
  );
}
