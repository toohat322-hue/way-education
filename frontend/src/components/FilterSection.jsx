import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  DollarSign,
  BookOpen,
  Building2,
  TrendingUp,
  Award,
  Globe,
  SlidersHorizontal,
} from "lucide-react";
import { C, grad } from "../theme/tokens";
import SectionHeader from "./SectionHeader";
import GlassCard from "./GlassCard";
import { useLanguage } from "../context/useLanguage";

function FilterSelect({ label, options, icon: Icon, value, onChange }) {
  return (
    <div>
      <label
        className="text-xs font-semibold mb-1.5 flex items-center gap-1.5"
        style={{ color: C.inkSoft }}
      >
        <Icon size={13} /> {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl text-sm bg-white outline-none appearance-none"
        style={{ border: `1px solid ${C.border}`, color: C.ink }}
      >
        {options.map((o, i) => (
          <option key={i} value={i === 0 ? "" : o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function FilterSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [tuition, setTuition] = useState("");
  const [major, setMajor] = useState("");
  const [type, setType] = useState("");
  const [ranking, setRanking] = useState("");
  const [scholarship, setScholarship] = useState("");
  const [language, setLanguage] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (tuition) params.set("tuition", tuition);
    if (major) params.set("major", major);
    if (type) params.set("type", type);
    if (ranking) params.set("ranking", ranking);
    if (scholarship) params.set("scholarship", scholarship);
    if (language) params.set("language", language);
    navigate(`/universities?${params.toString()}`);
  };

  return (
    <section className="py-16 md:py-24" style={{ background: C.bgAlt }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <SectionHeader
          eyebrow={t.filterEyebrow}
          title={t.filterTitle}
          sub={t.filterSub}
        />
        <GlassCard className="p-5 md:p-8" style={{ background: "#fff" }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <FilterSelect
              label={t.filterCity}
              icon={MapPin}
              options={[t.anyCity, "Istanbul", "Ankara", "Nicosia", "Kyrenia"]}
              value={city}
              onChange={setCity}
            />
            <FilterSelect
              label={t.filterTuition}
              icon={DollarSign}
              options={[
                t.anyTuition,
                "$0 - $2,000",
                "$2,000 - $5,000",
                "$5,000+",
              ]}
              value={tuition}
              onChange={setTuition}
            />
            <FilterSelect
              label={t.filterMajor}
              icon={BookOpen}
              options={[
                t.anyMajor,
                "Medicine",
                "Engineering",
                "Business",
                "Computer Science",
                "Dentistry",
              ]}
              value={major}
              onChange={setMajor}
            />
            <FilterSelect
              label={t.filterType}
              icon={Building2}
              options={[t.anyType, "Public", "Private"]}
              value={type}
              onChange={setType}
            />
            <FilterSelect
              label={t.filterRanking}
              icon={TrendingUp}
              options={[t.anyRanking, "Top 10", "Top 25", "Top 50"]}
              value={ranking}
              onChange={setRanking}
            />
            <FilterSelect
              label={t.filterScholarship}
              icon={Award}
              options={[t.anyScholarship, "25%+", "50%+", "100%"]}
              value={scholarship}
              onChange={setScholarship}
            />
            <FilterSelect
              label={t.filterLanguage}
              icon={Globe}
              options={[t.anyLanguage, "English", "Turkish"]}
              value={language}
              onChange={setLanguage}
            />
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full h-[42px] rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95"
                style={{ background: grad.primary }}
              >
                <SlidersHorizontal size={15} /> {t.searchNow}
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
