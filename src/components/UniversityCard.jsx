import React from "react";
import { useNavigate } from "react-router-dom";
import { Building2, MapPin, Star, ChevronRight } from "lucide-react";
import { C, grad } from "../theme/tokens";
import GlassCard from "./GlassCard";
import { useLanguage } from "../context/useLanguage";

function UniversityPhoto({ u, badgeLabel }) {
  return (
    <div className="relative h-36 md:h-40 rounded-2xl overflow-hidden shrink-0" style={{ background: u.grad }}>
      {u.image ? (
        <img src={u.image} alt={u.name} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <>
          <div
            className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #fff 1px, transparent 1px)", backgroundSize: "16px 16px" }}
          />
          <Building2 size={56} color="rgba(255,255,255,0.5)" className="absolute -bottom-3 -right-3" />
        </>
      )}
      <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-white/90 flex items-center justify-center font-bold text-sm overflow-hidden" style={{ color: C.blue }}>
        {u.logo ? (
          <img src={u.logo} alt={`${u.name} logo`} className="w-full h-full object-cover" />
        ) : (
          u.initial
        )}
      </div>
      <div
        className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
        style={{ background: u.featured ? grad.cta : "rgba(11,18,48,0.55)" }}
      >
        {u.featured ? badgeLabel.featured : badgeLabel.partner}
      </div>
    </div>
  );
}

export default function UniversityCard({ u }) {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const goDetail = () => navigate(`/university/${u.id}`);
  const goApply = () => {
    const params = new URLSearchParams({
      source: "university-card",
      university: u.name,
      country: u.country.en,
      language: u.language.en,
    });
    navigate(`/contact?${params.toString()}`);
  };

  return (
    <GlassCard className="p-4 min-w-[280px] sm:min-w-0 transition-transform hover:-translate-y-1.5 duration-300" style={{ background: "#fff" }}>
      <UniversityPhoto u={u} badgeLabel={{ partner: t.partnerBadge, featured: t.featuredBadge }} />
      <div className="pt-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-base leading-snug" style={{ fontFamily: "Poppins, sans-serif", color: C.ink }}>
            {u.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: "#FFF1E8", color: C.orangeDark }}>
            <Star size={12} fill={C.orange} color={C.orange} /> {u.rating}
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm mb-3" style={{ color: C.muted }}>
          <MapPin size={13} /> {u.city[lang]}, {u.country[lang]} · {u.type[lang]}
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs" style={{ color: C.muted }}>{t.filterTuition}</div>
            <div className="font-bold text-sm" style={{ color: C.ink }}>
              ${u.tuition.toLocaleString()}
              <span className="font-normal text-xs" style={{ color: C.muted }}>{t.perYear}</span>
            </div>
          </div>
          <button onClick={goDetail} className="text-xs font-semibold flex items-center gap-1" style={{ color: C.blue }}>
            {t.viewDetails} <ChevronRight size={14} style={{ transform: lang === "ar" ? "scaleX(-1)" : "none" }} />
          </button>
        </div>
        <button
          onClick={goApply}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95"
          style={{ background: grad.cta }}
        >
          {t.quickApply}
        </button>
      </div>
    </GlassCard>
  );
}
