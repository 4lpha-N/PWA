const headlineLevels = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;
const weights = ["fw-400", "fw-700"] as const;
const textSizes = [
  "text-xs",
  "text-sm",
  "text-md",
  "text-lg",
  "text-xl",
  "text-xxl",
] as const;

const fontVariants = [
  // V1–V4 (bestehend)
  {
    label: "V1 Headline",
    fontClass: "font-v1-headline",
    type: "headline",
    fontName: "Orbitron",
  },
  {
    label: "V1 Text",
    fontClass: "font-v1-text",
    type: "text",
    fontName: "Exo 2",
  },
  {
    label: "V2 Headline",
    fontClass: "font-v2-headline",
    type: "headline",
    fontName: "Michroma",
  },
  {
    label: "V2 Text",
    fontClass: "font-v2-text",
    type: "text",
    fontName: "Chakra Petch",
  },
  {
    label: "V3 Headline",
    fontClass: "font-v3-headline",
    type: "headline",
    fontName: "Oxanium",
  },
  {
    label: "V3 Text",
    fontClass: "font-v3-text",
    type: "text",
    fontName: "Inter",
  },
  {
    label: "V4 Headline",
    fontClass: "font-v4-headline",
    type: "headline",
    fontName: "Genos",
  },
  {
    label: "V4 Text",
    fontClass: "font-v4-text",
    type: "text",
    fontName: "Manrope",
  },
  // V5 Sacramento - Aboreto - Gotu
  {
    label: "V5 Accent",
    fontClass: "font-v5-accent",
    type: "accent",
    fontName: "Sacramento",
  },
  {
    label: "V5 Headline",
    fontClass: "font-v5-headline",
    type: "headline",
    fontName: "Aboreto",
  },
  {
    label: "V5 Text",
    fontClass: "font-v5-text",
    type: "text",
    fontName: "Gotu",
  },
  // V6 Quattrocento - Questrial
  {
    label: "V6 Headline",
    fontClass: "font-v6-headline",
    type: "headline",
    fontName: "Quattrocento",
  },
  {
    label: "V6 Text",
    fontClass: "font-v6-text",
    type: "text",
    fontName: "Questrial",
  },
  // V7 PT Sans - Teko - IBM Plex Sans Condensed
  {
    label: "V7 Accent",
    fontClass: "font-v7-accent",
    type: "accent",
    fontName: "PT Sans",
  },
  {
    label: "V7 Headline",
    fontClass: "font-v7-headline",
    type: "headline",
    fontName: "Teko",
  },
  {
    label: "V7 Text",
    fontClass: "font-v7-text",
    type: "text",
    fontName: "IBM Plex Sans Condensed",
  },
  // V8 Yellowtail - Fjalla One - Source Sans Pro
  {
    label: "V8 Accent",
    fontClass: "font-v8-accent",
    type: "accent",
    fontName: "Yellowtail",
  },
  {
    label: "V8 Headline",
    fontClass: "font-v8-headline",
    type: "headline",
    fontName: "Fjalla One",
  },
  {
    label: "V8 Text",
    fontClass: "font-v8-text",
    type: "text",
    fontName: "Source Sans Pro",
  },
  // V9 Fraunces - Poppins
  {
    label: "V9 Headline",
    fontClass: "font-v9-headline",
    type: "headline",
    fontName: "Fraunces",
  },
  {
    label: "V9 Text",
    fontClass: "font-v9-text",
    type: "text",
    fontName: "Poppins",
  },
  // V10 Corben - Montserrat
  {
    label: "V10 Headline",
    fontClass: "font-v10-headline",
    type: "headline",
    fontName: "Corben",
  },
  {
    label: "V10 Text",
    fontClass: "font-v10-text",
    type: "text",
    fontName: "Montserrat",
  },
  // V11 Lexend - Zilla Slab
  {
    label: "V11 Headline",
    fontClass: "font-v11-headline",
    type: "headline",
    fontName: "Lexend",
  },
  {
    label: "V11 Text",
    fontClass: "font-v11-text",
    type: "text",
    fontName: "Zilla Slab",
  },
  // V12 Marcellus - DM Sans
  {
    label: "V12 Headline",
    fontClass: "font-v12-headline",
    type: "headline",
    fontName: "Marcellus",
  },
  {
    label: "V12 Text",
    fontClass: "font-v12-text",
    type: "text",
    fontName: "DM Sans",
  },
  // V13 Sniglet - M Plus Roundec 1c
  {
    label: "V13 Headline",
    fontClass: "font-v13-headline",
    type: "headline",
    fontName: "Sniglet",
  },
  {
    label: "V13 Text",
    fontClass: "font-v13-text",
    type: "text",
    fontName: "M Plus Roundec 1c",
  },
  // V14 Lato - Merriweather
  {
    label: "V14 Headline",
    fontClass: "font-v14-headline",
    type: "headline",
    fontName: "Lato",
  },
  {
    label: "V14 Text",
    fontClass: "font-v14-text",
    type: "text",
    fontName: "Merriweather",
  },
  // V15 Urbanist - Red Hat Display
  {
    label: "V15 Headline",
    fontClass: "font-v15-headline",
    type: "headline",
    fontName: "Urbanist",
  },
  {
    label: "V15 Text",
    fontClass: "font-v15-text",
    type: "text",
    fontName: "Red Hat Display",
  },
] as const;

// Hilfsfunktion: gruppiert die Varianten nach vX
function groupFontVariants(variants) {
  const groups = [];
  let current = [];
  let lastV = null;
  for (const v of variants) {
    const match = v.fontClass.match(/font-(v\d+)-/);
    if (!match) continue;
    const vNum = match[1];
    if (lastV !== vNum) {
      if (current.length) groups.push(current);
      current = [];
      lastV = vNum;
    }
    current.push(v);
  }
  if (current.length) groups.push(current);
  return groups;
}

export default function FontsDevPage() {
  const grouped = groupFontVariants(fontVariants);
  return (
    <div className="p-4 flex flex-col" style={{ gap: "52px" }}>
      {/* Jede vX-Variante als Gruppe nebeneinander */}
      {grouped.map((group, pairIdx) => {
        // Accent, Headline, Text extrahieren
        const accent = group.find((v) => v.type === "accent");
        const headline = group.find((v) => v.type === "headline");
        const text = group.find((v) => v.type === "text");
        return (
          <div key={pairIdx} className="flex gap-8">
            {/* Linke Spalte: Accent (falls vorhanden) + Headline */}
            <section className="flex flex-col gap-2 flex-1">
              {accent && (
                <>
                  <p className="text-xs fw-700 uppercase tracking-widest pb-1">
                    <span className="opacity-60">
                      {accent.label.split(" ")[0]} - Accent -
                    </span>
                    <span className="opacity-90">{accent.fontName}</span>
                  </p>
                  <div className="flex items-center" style={{ gap: "12px" }}>
                    <span
                      className="opacity-50 shrink-0"
                      style={{ fontSize: "12px", width: "48px" }}
                    >
                      Accent
                    </span>
                    <div className={`${accent.fontClass} h5 fw-700 flex-1`}>
                      Accent Example
                    </div>
                  </div>
                </>
              )}
              {headline && (
                <>
                  <p className="text-xs fw-700 uppercase tracking-widest pb-1">
                    <span className="opacity-60">
                      {headline.label.replace(" ", " - ")} -{" "}
                    </span>
                    <span className="opacity-90">{headline.fontName}</span>
                  </p>
                  {/* Headlines h1–h6: alle Weights nebeneinander */}
                  {headlineLevels.map((hl) => (
                    <div
                      key={hl}
                      className="flex items-center"
                      style={{ gap: "12px" }}
                    >
                      <span
                        className="opacity-50 shrink-0"
                        style={{ fontSize: "12px", width: "48px" }}
                      >
                        {hl}
                      </span>
                      {weights.map((fw) => (
                        <div
                          key={fw}
                          className={`${headline.fontClass} ${hl} ${fw} flex-1`}
                        >
                          4lpha
                        </div>
                      ))}
                    </div>
                  ))}
                </>
              )}
            </section>
            {/* Rechte Spalte: Text */}
            {text && (
              <section className="flex flex-col gap-2 flex-1">
                {/* Platzhalter für Accent, damit Headline/Text immer auf gleicher Höhe */}
                {accent && <div style={{ height: 18 + 24 + 41.6 }} />}
                <p className="text-xs fw-700 uppercase tracking-widest pb-1">
                  <span className="opacity-60">
                    {text.label.replace(" ", " - ")} -{" "}
                  </span>
                  <span className="opacity-90">{text.fontName}</span>
                </p>
                {/* Texte: alle Weights nebeneinander */}
                {textSizes.map((size) => (
                  <div
                    key={size}
                    className="flex items-center"
                    style={{ gap: "12px" }}
                  >
                    <span
                      className="opacity-50 shrink-0"
                      style={{ fontSize: "12px", width: "48px" }}
                    >
                      {size}
                    </span>
                    {weights.map((fw) => (
                      <div
                        key={fw}
                        className={`${text.fontClass} ${size} ${fw} flex-1`}
                      >
                        Lorem ipsum dolor
                      </div>
                    ))}
                  </div>
                ))}
              </section>
            )}
          </div>
        );
      })}
      {/* Neue Zeile: alle vX-Text-Varianten nebeneinander */}
      <div className="flex gap-6 pb-12" style={{ flexDirection: "column" }}>
        <span
          className="opacity-50 shrink-0"
          style={{ fontSize: "12px", width: "48px" }}
        >
          Accent
        </span>
        {fontVariants
          .filter((v) => v.type === "accent")
          .map((v) => (
            <div
              key={v.fontClass}
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className={`${v.fontClass} h5 fw-700`}>Accent Example</div>
              <div>{v.fontName}</div>
            </div>
          ))}
        <span
          className="opacity-50 shrink-0"
          style={{ fontSize: "12px", width: "48px" }}
        >
          Headline
        </span>
        {fontVariants
          .filter((v) => v.type === "headline")
          .map((v) => (
            <div
              key={v.fontClass}
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className={`${v.fontClass} h3 fw-700`}>
                4lpha Überschrift
              </div>
              <div>{v.fontName}</div>
            </div>
          ))}
        <span
          className="opacity-50 shrink-0"
          style={{ fontSize: "12px", width: "48px" }}
        >
          Text
        </span>
        {fontVariants
          .filter((v) => v.type === "text")
          .map((v) => (
            <div
              key={v.fontClass}
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className={`${v.fontClass} text-xxl fw-400`}>
                Lorem ipsum dolor sit amet
              </div>
              <div>{v.fontName}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
