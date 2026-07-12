import React from "react";
import { MessageCircle } from "lucide-react";
import { grad } from "../theme/tokens";
import { useLanguage } from "../context/useLanguage";

export default function CtaBanner() {
  const { t } = useLanguage();
  return (
    <section className="px-5 sm:px-8 py-4">
      <div className="max-w-6xl mx-auto rounded-3xl p-8 md:p-14 text-center relative overflow-hidden" style={{ background: grad.primary }}>
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full" style={{ background: "rgba(255,255,255,0.10)" }} />
        <h2 className="relative text-2xl md:text-4xl font-bold mb-3" style={{ fontFamily: "Poppins, sans-serif", color: "#fff" }}>{t.ctaTitle}</h2>
        <p className="relative text-sm md:text-base mb-8 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.85)" }}>{t.ctaSub}</p>
        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-semibold transition-transform hover:scale-105 active:scale-95" style={{ background: grad.cta, color: "#fff", boxShadow: "0 10px 24px rgba(0,0,0,0.2)" }}>
            {t.ctaApply}
          </button>
          <a
            href="https://wa.me/905000000000"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95"
            style={{ background: "#25D366", color: "#fff" }}
          >
            <MessageCircle size={17} /> {t.ctaWhatsapp}
          </a>
        </div>
      </div>
    </section>
  );
}
