import React from "react";
import { ShieldCheck, Users, Globe, Award } from "lucide-react";
import { C } from "../theme/tokens";
import GlassCard from "../components/GlassCard";
import { Eyebrow } from "../components/SectionHeader";
import { useLanguage } from "../context/useLanguage";

export default function About() {
  const { t } = useLanguage();
  const stats = [
    [Award, "100+", t.heroStat1],
    [Users, "5,000+", t.heroStat2],
    [Globe, "14", t.stat3],
    [ShieldCheck, "95%", t.heroStat3],
  ];
  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 md:py-24">
      <Eyebrow>Way Education</Eyebrow>
      <h1 className="text-3xl md:text-5xl font-bold mb-6" style={{ fontFamily: "Poppins, sans-serif", color: C.ink }}>
        {t.aboutTitle}
      </h1>
      <p className="text-base md:text-lg leading-relaxed mb-12" style={{ color: C.inkSoft }}>{t.aboutBody}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(([Icon, v, l], i) => (
          <GlassCard key={i} className="p-5 text-center" style={{ background: "#fff" }}>
            <Icon size={20} color={C.blue} className="mx-auto mb-2" />
            <div className="font-bold text-lg" style={{ fontFamily: "Poppins, sans-serif", color: C.ink }}>{v}</div>
            <div className="text-xs" style={{ color: C.muted }}>{l}</div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
