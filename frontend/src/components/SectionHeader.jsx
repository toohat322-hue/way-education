import React from "react";
import { Sparkles } from "lucide-react";
import { C, grad } from "../theme/tokens";

export function Eyebrow({ children }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-semibold tracking-wide"
      style={{ background: grad.primarySoft, color: C.blue }}
    >
      <Sparkles size={13} />
      {children}
    </div>
  );
}

export default function SectionHeader({ eyebrow, title, sub, center = true }) {
  return (
    <div
      className={`mb-10 md:mb-14 ${center ? "text-center max-w-2xl mx-auto" : ""}`}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4"
        style={{ color: C.ink, fontFamily: "Poppins, sans-serif" }}
      >
        {title}
      </h2>
      {sub && (
        <p className="text-base md:text-lg" style={{ color: C.muted }}>
          {sub}
        </p>
      )}
    </div>
  );
}
