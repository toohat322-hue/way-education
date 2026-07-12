import React from "react";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { C, grad } from "../theme/tokens";
import GlassCard from "../components/GlassCard";
import LeadForm from "../components/LeadForm";
import { useLanguage } from "../context/useLanguage";

export default function Contact() {
  const { t } = useLanguage();
  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 md:py-24">
      <h1 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "Poppins, sans-serif", color: C.ink }}>
        {t.contactTitle}
      </h1>
      <p className="text-base mb-10" style={{ color: C.muted }}>{t.contactSub}</p>
      <div className="grid md:grid-cols-2 gap-8">
        <GlassCard className="p-6" style={{ background: "#fff" }}>
          <h3 className="font-semibold text-base mb-5" style={{ fontFamily: "Poppins, sans-serif", color: C.ink }}>
            {t.sidebarApplyTitle}
          </h3>
          <LeadForm t={t} />
        </GlassCard>
        <div className="space-y-4">
          {[
            [Phone, "+90 500 000 00 00"],
            [Mail, "hello@wayeducation.com"],
            [MapPin, "Istanbul, Türkiye"],
          ].map(([Icon, label], i) => (
            <GlassCard key={i} className="p-5 flex items-center gap-3" style={{ background: "#fff" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: grad.primarySoft }}>
                <Icon size={17} color={C.blue} />
              </div>
              <span className="text-sm font-medium" style={{ color: C.ink }}>{label}</span>
            </GlassCard>
          ))}
          <a
            href="https://wa.me/905000000000"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 p-5 rounded-3xl text-sm font-semibold"
            style={{ background: "#25D366", color: "#fff" }}
          >
            <MessageCircle size={17} /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
