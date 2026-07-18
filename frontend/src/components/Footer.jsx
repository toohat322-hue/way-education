import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Phone, Mail, MapPin } from "lucide-react";
import { grad } from "../theme/tokens";
import { useLanguage } from "../context/useLanguage";

const FOOTER_ROUTES = [
  "/universities",
  "/#programs",
  "/universities",
  "/universities?country=N.%20Cyprus",
  "/about",
  "/about",
  "/",
  "/contact",
];

export default function Footer() {
  const { t } = useLanguage();
  const allLinks = [...t.footerLinks1, ...t.footerLinks2];

  return (
    <footer className="pt-14 pb-8 mt-8" style={{ background: "#0B1230" }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Single horizontal row: brand | nav links | contact info */}
        <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-8 mb-10 pb-10" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0" style={{ background: grad.primary }}>
                <GraduationCap size={18} color="#fff" />
              </div>
              <span className="text-lg font-bold text-white" style={{ fontFamily: "Poppins, sans-serif" }}>Way Education</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{t.footerTag}</p>
          </div>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 max-w-xl">
            {allLinks.map((l, i) => (
              <Link key={i} to={FOOTER_ROUTES[i] || "/"} className="text-sm whitespace-nowrap transition-colors" style={{ color: "rgba(255,255,255,0.65)" }}
                 onMouseOver={(e) => (e.currentTarget.style.color = "#fff")}
                 onMouseOut={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}>
                {l}
              </Link>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="flex items-center gap-2 text-sm whitespace-nowrap" style={{ color: "rgba(255,255,255,0.65)" }}><Phone size={14} /> <bdi>+90 (501) 600 00 33</bdi></span>
            <span className="flex items-center gap-2 text-sm whitespace-nowrap" style={{ color: "rgba(255,255,255,0.65)" }}><Mail size={14} /> contact@wayeducations.com</span>
            <span className="flex items-center gap-2 text-sm whitespace-nowrap" style={{ color: "rgba(255,255,255,0.65)" }}><MapPin size={14} /> Istanbul, Türkiye</span>
            <a href="https://www.instagram.com/way.education.tr/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition-colors text-sm whitespace-nowrap" aria-label="Instagram" style={{ color: "rgba(255,255,255,0.65)" }} onMouseOver={(e) => (e.currentTarget.style.color = "#fff")} onMouseOut={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              way.education.tr
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>© 2026 Way Education. {t.rights}</span>
        </div>
      </div>
    </footer>
  );
}
