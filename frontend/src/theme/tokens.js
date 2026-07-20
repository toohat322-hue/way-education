// Central design tokens — single source of truth for colors & gradients.
// Change a value here and it updates everywhere in the app.

export const C = {
  bg: "#F6F8FF",
  bgAlt: "#F0F5FF",
  ink: "#0B1230",
  inkSoft: "#3A4166",
  muted: "#6B7280",
  border: "rgba(15,23,60,0.08)",
  glass: "rgba(255,255,255,0.66)",
  glassBorder: "rgba(255,255,255,0.55)",
  blue: "#2952E3",
  blueDark: "#152B7A",
  cyan: "#17C3E0",
  orange: "#FF6A2B",
  orangeDark: "#E8501A",
};

export const grad = {
  primary: "linear-gradient(135deg,#2952E3 0%,#17C3E0 100%)",
  primarySoft:
    "linear-gradient(135deg,rgba(41,82,227,0.10) 0%,rgba(23,195,224,0.10) 100%)",
  cta: "linear-gradient(135deg,#FF8A3D 0%,#E8501A 100%)",
  hero: "radial-gradient(120% 100% at 15% 0%, #EAF1FF 0%, #F6F8FF 45%, #EAFBFF 100%)",
  navy: "linear-gradient(180deg,#0B1230 0%,#152B7A 100%)",
  card1: "linear-gradient(135deg,#2952E3 0%,#5B7CF0 100%)",
  card2: "linear-gradient(135deg,#17C3E0 0%,#7FE3F0 100%)",
  card3: "linear-gradient(135deg,#FF8A3D 0%,#FFB27A 100%)",
  card4: "linear-gradient(135deg,#7C5CFF 0%,#B49BFF 100%)",
};
