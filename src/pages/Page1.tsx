import { PageWrapper } from "./_PageWrapper";
import { useFabricTexture } from "@/hooks/useFabricTexture";

// purple
const tiles = [
  { name: "dark", hex: "#1e202c" },
  { name: "mid", hex: "#31323e" },
  { name: "light", hex: "#bfc0d1" },
  { name: "accent", hex: "#60519b" },
];

// pink
const tiles2 = [
  { name: "dark", hex: "#192731" },
  { name: "mid", hex: "#2a3843" },
  { name: "light", hex: "#4f6172" },
  { name: "accent", hex: "#ff096c" },
];

// red
const tiles3 = [
  { name: "dark", hex: "#1e1e27" },
  { name: "mid", hex: "#28242a" },
  { name: "light", hex: "#e2e2e2" },
  { name: "accent", hex: "#df0139" },
];

function PaletteTile({ name, hex }: (typeof tiles)[number]) {
  const fabric = useFabricTexture({ color: hex });
  return (
    <div className={`fabric palette-tile palette-tile--${name}`} style={fabric}>
      <span className="palette-tile-label">{hex}</span>
    </div>
  );
}

export default function Page1() {
  return (
    <PageWrapper>
      <div className="palette-preview-grid">
        {tiles.map((tile) => (
          <PaletteTile key={tile.name} {...tile} />
        ))}
      </div>
      <div className="palette-preview-grid">
        {tiles2.map((tile) => (
          <PaletteTile key={tile.name} {...tile} />
        ))}
      </div>
      <div className="palette-preview-grid">
        {tiles3.map((tile) => (
          <PaletteTile key={tile.name} {...tile} />
        ))}
      </div>
    </PageWrapper>
  );
}
