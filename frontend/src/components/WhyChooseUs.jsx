import React from "react";
import { Clock, ShieldCheck, Award, Plane } from "lucide-react";
import { C, grad } from "../theme/tokens";
import SectionHeader from "./SectionHeader";
import GlassCard from "./GlassCard";
import { useLanguage } from "../context/useLanguage";

export default function WhyChooseUs() {
  const { t } = useLanguage();
  const items = [
    { icon: Clock, t: t.why1t, d: t.why1d, g: grad.card1 },
    { icon: ShieldCheck, t: t.why2t, d: t.why2d, g: grad.card2 },
    { icon: Award, t: t.why3t, d: t.why3d, g: grad.card3 },
    { icon: Plane, t: t.why4t, d: t.why4d, g: grad.card4 },
  ];
  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-5 sm:px-8">
      <SectionHeader eyebrow={t.whyEyebrow} title={t.whyTitle} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((it, i) => (
          <GlassCard
            key={i}
            className="p-6 transition-all duration-300 hover:-translate-y-2"
            style={{ background: "#fff" }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 hover:rotate-6"
              style={{ background: it.g }}
            >
              <it.icon size={22} color="#fff" />
            </div>
            <h3
              className="font-semibold text-base mb-2"
              style={{ fontFamily: "Poppins, sans-serif", color: C.ink }}
            >
              {it.t}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
              {it.d}
            </p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
