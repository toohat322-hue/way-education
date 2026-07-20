import React from "react";
import { useNavigate } from "react-router-dom";
import {
  PlayCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Plane,
} from "lucide-react";
import { C, grad } from "../theme/tokens";
import { Eyebrow } from "./SectionHeader";
import GlassCard from "./GlassCard";
import StarRow from "./StarRow";
import { useLanguage } from "../context/useLanguage";
import { useData } from "../admin/useData";

function FlipArrow({ isRtl, size = 16 }) {
  return isRtl ? <ArrowLeft size={size} /> : <ArrowRight size={size} />;
}

const FALLBACK_UNI = {
  id: "",
  name: "Way Education",
  rating: 4.8,
  initial: "W",
  logo: null,
};

export default function Hero() {
  const { t, lang, isRtl } = useLanguage();
  const navigate = useNavigate();
  const { publicUniversities: universities } = useData();
  const heroLeftUni = universities[0] || FALLBACK_UNI;
  const heroRightUni =
    universities[3] || universities[universities.length - 1] || FALLBACK_UNI;

  return (
    <section
      className="relative overflow-hidden pt-10 md:pt-16 pb-16 md:pb-24"
      style={{ background: grad.hero }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="fade-up">
            <Eyebrow>{t.heroEyebrow}</Eyebrow>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.08] mb-6"
              style={{ fontFamily: "Poppins, sans-serif", color: C.ink }}
            >
              {t.heroTitle1}{" "}
              <span
                style={{
                  background: grad.primary,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {t.heroTitle2}
              </span>
            </h1>
            <p
              className="text-base md:text-lg mb-8 max-w-lg"
              style={{ color: C.muted }}
            >
              {t.heroSub}
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-10">
              <button
                onClick={() =>
                  navigate(
                    universities[0]
                      ? `/university/${universities[0].id}`
                      : "/universities",
                  )
                }
                className="sm:hidden px-6 py-3 rounded-full text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95"
                style={{ background: grad.primary }}
              >
                {t.exploreBtn}
              </button>
              <button
                onClick={() => navigate("/contact?source=hero-apply")}
                className="px-6 py-3 rounded-full text-sm font-semibold text-white flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
                style={{
                  background: grad.cta,
                  boxShadow: "0 10px 24px rgba(255,106,43,0.35)",
                }}
              >
                {t.applyBtn} <FlipArrow isRtl={isRtl} />
              </button>
              <button
                className="px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2"
                style={{
                  color: C.ink,
                  border: `1px solid ${C.border}`,
                  background: "#fff",
                }}
              >
                <PlayCircle size={18} color={C.blue} /> {t.watchStory}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-lg">
              {[
                ["100+", t.heroStat1],
                ["5,000+", t.heroStat2],
                ["95%", t.heroStat3],
              ].map(([n, l], i) => (
                <div key={i}>
                  <div
                    className="text-2xl md:text-3xl font-extrabold"
                    style={{ fontFamily: "Poppins, sans-serif", color: C.ink }}
                  >
                    {n}
                  </div>
                  <div
                    className="text-xs md:text-sm"
                    style={{ color: C.muted }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[420px] md:h-[520px] hidden sm:block">
            <div
              className="absolute inset-6 rounded-[32px]"
              style={{
                backgroundImage: "url('/brand/background2.jpeg')",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-56 h-56 md:w-72 md:h-72 rounded-full flex items-center justify-center"
                style={{ background: grad.primary, opacity: 0.15 }}
              >
                <div
                  className="w-40 h-40 md:w-52 md:h-52 rounded-full flex items-center justify-center"
                  style={{
                    background: "#fff",
                    boxShadow: "0 20px 60px rgba(41,82,227,0.25)",
                  }}
                >
                  <Plane
                    size={64}
                    color={C.blue}
                    style={{
                      transform: `rotate(${isRtl ? "-45deg" : "45deg"})`,
                    }}
                  />
                </div>
              </div>
            </div>

            <GlassCard
              className="absolute top-4 -left-2 md:left-0 p-4 w-52 float-card"
              style={{ "--r": "-4deg" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold overflow-hidden"
                  style={{ background: grad.card1 }}
                >
                  {heroLeftUni.logo ? (
                    <img
                      src={heroLeftUni.logo}
                      alt={`${heroLeftUni.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    heroLeftUni.initial
                  )}
                </div>
                <div>
                  <div
                    className="text-xs font-semibold"
                    style={{ color: C.ink }}
                  >
                    {heroLeftUni.name}
                  </div>
                  <div
                    className="flex items-center gap-1 text-xs"
                    style={{ color: C.muted }}
                  >
                    <StarRow rating={heroLeftUni.rating} size={11} />{" "}
                    {heroLeftUni.rating}
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard
              className="absolute bottom-16 -right-2 md:right-0 p-4 w-52 float-card"
              style={{ "--r": "3deg", animationDelay: "1.2s" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold overflow-hidden"
                  style={{ background: grad.card4 }}
                >
                  {heroRightUni.logo ? (
                    <img
                      src={heroRightUni.logo}
                      alt={`${heroRightUni.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    heroRightUni.initial
                  )}
                </div>
                <div>
                  <div
                    className="text-xs font-semibold"
                    style={{ color: C.ink }}
                  >
                    {heroRightUni.name}
                  </div>
                  <div
                    className="flex items-center gap-1 text-xs"
                    style={{ color: C.muted }}
                  >
                    <StarRow rating={heroRightUni.rating} size={11} />{" "}
                    {heroRightUni.rating}
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard
              className="absolute bottom-0 left-6 md:left-10 p-4 w-44 float-card"
              style={{ "--r": "-2deg", animationDelay: "2.1s" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={16} color={C.cyan} />
                <span
                  className="text-xs font-semibold"
                  style={{ color: C.ink }}
                >
                  {t.visaApproved}
                </span>
              </div>
              <div className="text-[11px]" style={{ color: C.muted }}>
                {lang === "en" ? "Karim · Lebanon" : "كريم · لبنان"}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
