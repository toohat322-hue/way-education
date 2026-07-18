import React, { useRef } from "react";
import { grad } from "../theme/tokens";
import { Eyebrow } from "./SectionHeader";
import { useLanguage } from "../context/useLanguage";
import { useCountUp } from "../hooks/useCountUp";
import { useOnScreen } from "../hooks/useOnScreen";

function StatBlock({ value, suffix, label }) {
  return (
    <div className="text-center">
      <div
        className="text-3xl md:text-5xl font-extrabold mb-1"
        style={{ fontFamily: "Poppins, sans-serif", background: "linear-gradient(135deg,#ffffff,#BFD3FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
      >
        {value}{suffix}
      </div>
      <div className="text-xs md:text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>{label}</div>
    </div>
  );
}

export default function StatsSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const visible = useOnScreen(ref);
  const s1 = useCountUp(120, 1400, visible);
  const s2 = useCountUp(5300, 1400, visible);
  const s3 = useCountUp(14, 1400, visible);
  const s4 = useCountUp(95, 1400, visible);

  return (
    <section ref={ref} className="py-16 md:py-24" style={{ background: grad.navy }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <Eyebrow>{t.statsEyebrow}</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-bold" style={{ fontFamily: "Poppins, sans-serif", color: "#fff" }}>{t.statsTitle}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatBlock value={s1} suffix="+" label={t.stat1} />
          <StatBlock value={s2.toLocaleString()} suffix="+" label={t.stat2} />
          <StatBlock value={s3} suffix="" label={t.stat3} />
          <StatBlock value={s4} suffix="%" label={t.stat4} />
        </div>
      </div>
    </section>
  );
}
