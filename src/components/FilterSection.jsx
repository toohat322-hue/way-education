import React from "react";
import { MapPin, DollarSign, BookOpen, Building2, TrendingUp, Award, Globe, SlidersHorizontal } from "lucide-react";
import { C, grad } from "../theme/tokens";
import SectionHeader from "./SectionHeader";
import GlassCard from "./GlassCard";
import { useLanguage } from "../context/useLanguage";

function FilterSelect({ label, options, icon: Icon }) {
  return (
    <div>
      <label className="text-xs font-semibold mb-1.5 flex items-center gap-1.5" style={{ color: C.inkSoft }}>
        <Icon size={13} /> {label}
      </label>
      <select className="w-full px-3 py-2.5 rounded-xl text-sm bg-white outline-none appearance-none" style={{ border: `1px solid ${C.border}`, color: C.ink }}>
        {options.map((o, i) => <option key={i}>{o}</option>)}
      </select>
    </div>
  );
}

export default function FilterSection() {
  const { t } = useLanguage();
  return (
    <section className="py-16 md:py-24" style={{ background: C.bgAlt }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <SectionHeader eyebrow={t.filterEyebrow} title={t.filterTitle} sub={t.filterSub} />
        <GlassCard className="p-5 md:p-8" style={{ background: "#fff" }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <FilterSelect label={t.filterCity} icon={MapPin} options={[t.anyCity, "Istanbul", "Ankara", "Nicosia", "Kyrenia"]} />
            <FilterSelect label={t.filterTuition} icon={DollarSign} options={[t.anyTuition, "$0 – $2,000", "$2,000 – $5,000", "$5,000+"]} />
            <FilterSelect label={t.filterMajor} icon={BookOpen} options={[t.anyMajor, "Medicine", "Engineering", "Business", "Computer Science"]} />
            <FilterSelect label={t.filterType} icon={Building2} options={[t.anyType, "Public", "Private"]} />
            <FilterSelect label={t.filterRanking} icon={TrendingUp} options={[t.anyRanking, "Top 10", "Top 25", "Top 50"]} />
            <FilterSelect label={t.filterScholarship} icon={Award} options={[t.anyScholarship, "25%+", "50%+", "100%"]} />
            <FilterSelect label={t.filterLanguage} icon={Globe} options={[t.anyLanguage, "English", "Turkish"]} />
            <div className="flex items-end">
              <button className="w-full h-[42px] rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95" style={{ background: grad.primary }}>
                <SlidersHorizontal size={15} /> {t.searchNow}
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
