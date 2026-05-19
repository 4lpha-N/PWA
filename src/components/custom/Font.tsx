import React from "react";

// Typen für Props definieren
type FontType = "headline" | "text" | "accent";
type HeadlineSize = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
type FontWeight = 400 | 700 | 900;
type VType = 1 | 2;

interface FontProps {
  type?: FontType;
  weight?: FontWeight;
  style?: React.CSSProperties;
  size?: HeadlineSize | TextSize;
  v?: VType;
  children: React.ReactNode;
}

const sizeMap: Record<FontType, Record<string, string>> = {
  headline: {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
  },
  accent: {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
  },
  text: {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    xxl: "text-xxl",
  },
};

const weightMap: Record<FontWeight, string> = {
  400: "fw-400",
  700: "fw-700",
  900: "fw-900",
};

const Font: React.FC<FontProps> = ({
  type = "text",
  weight = 400,
  style,
  size = "md",
  v = 1,
  children,
}) => {
  const className = [
    sizeMap[type][size],
    weightMap[weight],
    type === "accent" ? "font-accent" : "",
    type === "headline" ? "font-headline" + (v === 2 ? "2" : "") : "",
    type === "text" ? "font-text" + (v === 2 ? "2" : "") : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Headline/Accent: h1-h6, sonst span
  if (
    (type === "headline" || type === "accent") &&
    ["h1", "h2", "h3", "h4", "h5", "h6"].includes(size)
  ) {
    const Tag = size as keyof JSX.IntrinsicElements;
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    );
  }
  // Text: p
  return (
    <p className={className} style={style}>
      {children}
    </p>
  );
};

export default Font;
