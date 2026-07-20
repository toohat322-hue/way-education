import React from "react";
import { Building2, MapPin } from "lucide-react";
import { C, grad } from "../theme/tokens";
import GlassCard from "./GlassCard";

const TYPE_COLORS = {
  Public: { bg: "#E9F4FF", fg: "#2952E3" },
  Private: { bg: "#FFF1E8", fg: "#E8501A" },
};

export default function DirectoryCard({ uni, t, onRequestInfo }) {
  const colors = TYPE_COLORS[uni.type] || TYPE_COLORS.Private;
  return (
    <GlassCard
      className="p-4 transition-transform hover:-translate-y-1 duration-300"
      style={{ background: "#fff" }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "#F6F8FF" }}
        >
          <Building2 size={18} color={C.blue} />
        </div>
        <h3
          className="font-semibold text-sm leading-snug"
          style={{ fontFamily: "Poppins, sans-serif", color: C.ink }}
        >
          {uni.name}
        </h3>
      </div>
      <div
        className="flex items-center gap-1 text-xs mb-3"
        style={{ color: C.muted }}
      >
        <MapPin size={12} /> {uni.city}, {uni.country}
      </div>
      <div className="flex items-center gap-2 mb-4">
        <span
          className="text-[11px] font-semibold px-2 py-1 rounded-full"
          style={{ background: colors.bg, color: colors.fg }}
        >
          {uni.type}
        </span>
        {uni.founded && (
          <span className="text-[11px]" style={{ color: C.muted }}>
            {t.founded} {uni.founded}
          </span>
        )}
      </div>
      <button
        onClick={() => onRequestInfo(uni)}
        className="w-full py-2 rounded-xl text-xs font-semibold transition-transform hover:scale-[1.02] active:scale-95"
        style={{ background: grad.primarySoft, color: C.blue }}
      >
        {t.requestInfo}
      </button>
    </GlassCard>
  );
}
